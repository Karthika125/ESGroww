"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, Loader2, RefreshCw, SendHorizonal, Sparkles, UserRound } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { sendMistralChatMessage, type ChatMessage } from "@/actions/chatbot.actions";

type ChatbotProps = {
  title?: string;
  description?: string;
  systemPrompt?: string;
  suggestions?: string[];
  className?: string;
};

const DEFAULT_SUGGESTIONS = [
  "Summarize the latest ESG readiness gaps.",
  "What actions should we prioritize this quarter?",
  "Explain the renewable energy score.",
];

const INITIAL_ASSISTANT_MESSAGE =
  "I can help explain ESG scores, data coverage, and recommended actions. Ask me anything.";

function normalizeMessageContent(content: unknown) {
  if (typeof content === "string") {
    return content;
  }

  if (
    typeof content === "number" ||
    typeof content === "boolean" ||
    typeof content === "bigint"
  ) {
    return String(content);
  }

  if (content && typeof content === "object") {
    const record = content as {
      content?: unknown;
      detail?: unknown;
      message?: unknown;
    };

    if (typeof record.content === "string") {
      return record.content;
    }

    if (typeof record.detail === "string") {
      return record.detail;
    }

    if (typeof record.message === "string") {
      return record.message;
    }
  }

  return "";
}

function stripMarkdownFormatting(text: string) {
  return text
    .replace(/```[\s\S]*?```/g, (match) => match.replace(/```/g, ""))
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/\|/g, " ")
    .replace(/\s{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function MistralChatbot({
  title = "ESG Assistant",
  description = "Ask questions about uploads, readiness scores, and next steps.",
  systemPrompt =
    "You are an ESG assistant for a sustainability readiness platform. Answer clearly, concisely, and in plain text only. Do not use markdown tables, bullets, numbering, emojis, code fences, or decorative symbols unless absolutely necessary.",
  suggestions = DEFAULT_SUGGESTIONS,
  className,
}: ChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: INITIAL_ASSISTANT_MESSAGE,
    },
  ]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const conversation = useMemo(
    () =>
      messages.filter(
        (message) => normalizeMessageContent(message.content).trim().length > 0
      ),
    [messages]
  );

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [conversation]);

  async function handleSend(text: string) {
    const message = text.trim();

    if (!message || isSending) {
      return;
    }

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: message }];

    setMessages(nextMessages);
    setDraft("");
    setIsSending(true);

    const result = await sendMistralChatMessage({
      message,
      systemPrompt,
      conversationId: conversationId ?? undefined,
    });

    if (result.success) {
      if (result.conversationId) {
        setConversationId(result.conversationId);
      }

      const reply =
        result.reply ||
        "I could not generate a response right now.";

      setMessages((current) => [
        ...current,
        { role: "assistant", content: reply },
      ]);
    } else {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            result.error ||
            "I could not generate a response right now.",
        },
      ]);
    }

    setIsSending(false);
  }

  function handleReset() {
    setMessages([
      {
        role: "assistant",
        content: INITIAL_ASSISTANT_MESSAGE,
      },
    ]);
    setConversationId(null);
    setDraft("");
  }

  return (
    <Card className={cn("border-slate-200 bg-gradient-to-br from-white via-slate-50 to-emerald-50/60 shadow-sm", className)}>
      <CardHeader className="border-b border-slate-200/80 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
                <Bot className="size-4" />
              </div>
              <CardTitle className="text-slate-900">{title}</CardTitle>
            </div>
            <p className="text-sm text-slate-500">{description}</p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-slate-500 hover:text-slate-900"
            onClick={handleReset}
          >
            <RefreshCw className="mr-2 size-4" />
            Reset
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-4 md:p-5">
        <div
          ref={viewportRef}
          className="max-h-[28rem] space-y-3 overflow-y-auto rounded-2xl border border-slate-200 bg-white/80 p-3 shadow-inner"
          aria-live="polite"
        >
          {conversation.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={cn(
                "flex gap-3",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" && (
                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <Sparkles className="size-4" />
                </div>
              )}

              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6",
                  message.role === "user"
                    ? "rounded-br-md bg-emerald-600 text-white"
                    : "rounded-bl-md border border-slate-200 bg-slate-50 text-slate-700"
                )}
              >
                  {stripMarkdownFormatting(normalizeMessageContent(message.content))}
              </div>

              {message.role === "user" && (
                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white">
                  <UserRound className="size-4" />
                </div>
              )}
            </div>
          ))}

          {isSending && (
            <div className="flex gap-3">
              <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <Loader2 className="size-4 animate-spin" />
              </div>
              <div className="rounded-2xl rounded-bl-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                Mistral is thinking...
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {suggestions.map((prompt) => (
            <Button
              key={prompt}
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
              onClick={() => handleSend(prompt)}
              disabled={isSending}
            >
              {prompt}
            </Button>
          ))}
        </div>

        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            void handleSend(draft);
          }}
        >
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void handleSend(draft);
              }
            }}
            placeholder="Ask a question about ESG data, scores, or recommendations..."
            className="min-h-24 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/20"
            aria-label="Chat message"
            rows={4}
          />

          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              Enter sends, Shift + Enter adds a new line.
            </p>

            <Button
              type="submit"
              className="bg-emerald-600 text-white hover:bg-emerald-700"
              disabled={isSending || !draft.trim()}
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Sending
                </>
              ) : (
                <>
                  <SendHorizonal className="mr-2 size-4" />
                  Send
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}