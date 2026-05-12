"use server";

type ChatRole = "user" | "assistant" | "system";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface SendMistralChatInput {
  message: string;
  systemPrompt?: string;
  conversationId?: string;
  agentId?: string;
  agentVersion?: number | string;
}

const DEFAULT_AGENT_ID =
  process.env.MISTRAL_AGENT_ID ||
  "ag_019e1aa4de167760878869e19e626073";

const DEFAULT_MODEL = process.env.MISTRAL_MODEL || "mistral-small-latest";

const CHAT_REQUEST_TIMEOUT_MS = 20000;

function createAbortError(message: string) {
  return new Error(message);
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number) {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => {
        reject(createAbortError("Mistral request timed out."));
      }, timeoutMs);
    }),
  ]);
}

function normalizeContent(content: unknown) {
  if (typeof content === "string") {
    return content.trim();
  }

  if (Array.isArray(content)) {
    const text = content
      .map((chunk) => {
        if (!chunk || typeof chunk !== "object") {
          return "";
        }

        if ("text" in chunk && typeof (chunk as { text?: unknown }).text === "string") {
          return (chunk as { text: string }).text;
        }

        if (
          "thinking" in chunk &&
          typeof (chunk as { thinking?: unknown }).thinking === "string"
        ) {
          return (chunk as { thinking: string }).thinking;
        }

        return "";
      })
      .join("")
      .trim();

    return text;
  }

  return "";
}

function extractReply(outputs: Array<{ content?: unknown }>) {
  for (let index = outputs.length - 1; index >= 0; index -= 1) {
    const content = outputs[index]?.content;

    const normalized = normalizeContent(content);

    if (normalized) {
      return normalized;
    }
  }

  return "";
}

function extractChatCompletionReply(choices: Array<{ message?: { content?: unknown } }>) {
  for (let index = choices.length - 1; index >= 0; index -= 1) {
    const content = choices[index]?.message?.content;

    const normalized = normalizeContent(content);

    if (normalized) {
      return normalized;
    }
  }

  return "";
}

function extractErrorMessage(
  response: Response,
  payload: {
    error?: { message?: string };
    detail?: string;
    message?: string;
  } | null
) {
  if (response.status === 401 || response.status === 403) {
    return "Mistral authentication failed. Check the API key and agent access.";
  }

  return (
    payload?.error?.message ||
    payload?.detail ||
    payload?.message ||
    "Mistral request failed."
  );
}

function logChatbotEvent(
  label: string,
  details: Record<string, unknown>
) {
  console.log(`[Mistral Chatbot] ${label}`, details);
}

export async function sendMistralChatMessage(
  input: SendMistralChatInput
) {
  const apiKey = process.env.MISTRAL_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error:
        "MISTRAL_API_KEY is not configured.",
    };
  }

  const message = input.message.trim();

  logChatbotEvent("Sending request", {
    model: DEFAULT_MODEL,
    conversationId: input.conversationId ?? null,
    message,
  });

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CHAT_REQUEST_TIMEOUT_MS);

    const requestBody = {
      model: DEFAULT_MODEL,
      messages: [
        {
          role: "system",
          content: input.systemPrompt || "You are a helpful assistant.",
        },
        {
          role: "user",
          content: message,
        },
      ],
      response_format: {
        type: "text",
      },
    };

    const url = "https://api.mistral.ai/v1/chat/completions";

    const response = await withTimeout(
      fetch(url, {
        method: "POST",
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      }),
      CHAT_REQUEST_TIMEOUT_MS + 2000
    );

    logChatbotEvent("Received response", {
      conversationId: input.conversationId ?? null,
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
    });

    clearTimeout(timeoutId);

    const rawText = await response.text();

    let payload: {
      choices?: Array<{ message?: { content?: unknown } }>;
      error?: { message?: string };
      detail?: string;
      message?: string;
    } | null = null;

    if (rawText) {
      try {
        payload = JSON.parse(rawText) as {
          choices?: Array<{ message?: { content?: unknown } }>;
          error?: { message?: string };
          detail?: string;
          message?: string;
        };
      } catch {
        payload = null;
      }
    }

    if (!response.ok) {
      const errorMessage = extractErrorMessage(response, payload);

      logChatbotEvent("Request failed", {
        conversationId: input.conversationId ?? null,
        status: response.status,
        error: errorMessage,
        rawResponse: rawText,
      });

      return {
        success: false,
        error: errorMessage,
      };
    }

    const choices = payload?.choices || [];

    const reply = extractChatCompletionReply(
      choices as Array<{ message?: { content?: unknown } }>
    );

    if (!reply) {
      logChatbotEvent("Empty reply", {
        conversationId: input.conversationId || null,
        rawResponse: rawText,
      });

      return {
        success: false,
        error: "Mistral returned an empty response.",
      };
    }

    logChatbotEvent("Reply received", {
      conversationId: input.conversationId || null,
      reply,
    });

    return {
      success: true,
      reply,
      conversationId: input.conversationId,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error:
        error instanceof Error &&
        error.message === "Mistral request timed out."
          ? "Mistral is taking too long to respond. Try again or check the agent configuration."
          : "Unable to reach the Mistral API.",
    };
  }
}