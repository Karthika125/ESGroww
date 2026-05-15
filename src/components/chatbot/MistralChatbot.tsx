"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, ChevronDown, ChevronUp, Loader2, RefreshCw, SendHorizonal, Sparkles, UserRound } from "lucide-react";

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

const REGULATORY_SUGGESTIONS = [
  "What are our BRSR compliance requirements?",
  "Explain GRI standards and their application.",
  "What are the regulatory deadlines we need to meet?",
];

const GENERAL_SUGGESTIONS = [
  "What are our major ESG gaps?",
  "How does renewable energy impact our score?",
  "What sustainability actions should we prioritize?",
];

const SECTOR_OPTIONS = [
  {
    sectorName: "Hospital / Healthcare",
    certifications: ["NABH", "IGBC Healthcare", "LEED Healthcare", "WELL", "ISO 14001", "BRSR"],
  },
  {
    sectorName: "Commercial Building / Real Estate",
    certifications: ["IGBC", "LEED", "GRIHA", "EDGE", "WELL", "ISO 14001", "BRSR"],
  },
  {
    sectorName: "Manufacturing / Industrial",
    certifications: ["ISO 14001", "ISO 50001", "ISO 45001", "EcoVadis", "BRSR", "GRI"],
  },
  {
    sectorName: "Textile Industry",
    certifications: ["GOTS", "OEKO-TEX", "ZDHC", "Bluesign", "Higg Index", "SA8000", "Sedex"],
  },
  {
    sectorName: "Electronics Industry",
    certifications: ["CE", "RoHS", "WEEE", "ISO 14001", "ISO 27001", "RBA"],
  },
  {
    sectorName: "Food & Beverage",
    certifications: ["FSSAI", "HACCP", "ISO 22000", "ISO 14001"],
  },
  {
    sectorName: "Logistics & Supply Chain",
    certifications: ["EcoVadis", "GLEC", "ISO 14001", "GRI"],
  },
  {
    sectorName: "Educational Institution",
    certifications: ["IGBC", "WELL", "ISO 14001", "NAAC Sustainability"],
  },
  {
    sectorName: "NGO / Social Impact",
    certifications: ["GRI (NGO)", "UN SDG", "SROI"],
  },
  {
    sectorName: "General (All Other Organizations)",
    certifications: ["ISO 14001", "BRSR", "GRI", "CDP"],
  },
];

const INITIAL_ASSISTANT_MESSAGE =
  "Hi, I am Evio. I can help explain ESG scores, data coverage, and recommended actions. Ask me anything.";

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
  title = "Evio",
  description = "Evio — Ask about ESG readiness, scores, and practical next steps.",
  systemPrompt =
    "You are Evio, an ESG assistant for a sustainability readiness platform. Answer clearly, concisely, and in plain text only. Do not use markdown tables, bullets, numbering, emojis, code fences, or decorative symbols unless absolutely necessary.",
  suggestions = DEFAULT_SUGGESTIONS,
  className,
}: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isTranscriptVisible, setIsTranscriptVisible] = useState(false);
  const [activeMode, setActiveMode] = useState<
    "certificate" | "regulatory" | "general"
  >("general");
  const [messagesByMode, setMessagesByMode] = useState<
    Record<"certificate" | "regulatory" | "general", ChatMessage[]>
  >({
    certificate: [
      { role: "assistant", content: "Hi — I'm Evio. I can check certificate relevance and required evidence." },
    ],
    regulatory: [
      { role: "assistant", content: "Hi — I'm Evio. Ask me about regulatory compliance, standards (BRSR, GRI, ISO), and what your organization needs to do." },
    ],
    general: [
      { role: "assistant", content: "Hi — I'm Evio. I can help explain ESG scores, readiness gaps, recommendations, and practical next steps. Ask me anything." },
    ],
  });
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const [conversationIdsByMode, setConversationIdsByMode] = useState<
    Record<"certificate" | "regulatory" | "general", string | null>
  >({ certificate: null, regulatory: null, general: null });
  const [draftsByMode, setDraftsByMode] = useState<
    Record<"certificate" | "regulatory" | "general", string>
  >({ certificate: "", regulatory: "", general: "" });
  const [isSending, setIsSending] = useState(false);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [certificateSelection, setCertificateSelection] = useState<{
    sectorName: string;
    certification: string;
  }>({ sectorName: "", certification: "" });

  const conversation = useMemo(() => {
    const current = messagesByMode[activeMode] || [];
    return current.filter((message) => normalizeMessageContent(message.content).trim().length > 0);
  }, [messagesByMode, activeMode]);

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

    const current = messagesByMode[activeMode] || [];
    const nextMessages: ChatMessage[] = [...current, { role: "user", content: message }];

    setMessagesByMode((prev) => ({ ...prev, [activeMode]: nextMessages }));
    setDraftsByMode((prev) => ({ ...prev, [activeMode]: "" }));
    setIsTranscriptVisible(true);
    setIsSending(true);

    const MODE_PROMPTS: Record<
      "certificate" | "regulatory" | "general",
      string
    > = {
      certificate:
        "You are Evio, an assistant that performs Certificate Relevance Checks. Provide very brief responses (2-3 sentences max). For any certificate, state: (1) ESG relevance, (2) one key requirement, (3) one actionable next step. Keep it simple and direct.",
      regulatory:
        "You are Evio, an assistant for Regulatory FAQs. Answer regulatory and compliance questions in 2-3 sentences max. Always reference relevant standards (e.g., BRSR, GRI, ISO, local regulations) and explain what the organization needs to do. Focus on compliance requirements and deadlines.",
      general:
        "You are Evio, an ESG assistant for general sustainability queries. Answer in 2-3 sentences max about ESG readiness, scores, gaps, recommendations, or sustainability strategies. Be motivational, practical, and action-focused. Explain how it impacts the organization.",
    };

    const systemPromptForMode = MODE_PROMPTS[activeMode] || systemPrompt;

    const result = await sendMistralChatMessage({
      message,
      systemPrompt: systemPromptForMode,
      conversationId: conversationIdsByMode[activeMode] ?? undefined,
    });

    if (result.success) {
      if (result.conversationId) {
        setConversationIdsByMode((prev) => ({ ...prev, [activeMode]: result.conversationId }));
      }

      const reply = result.reply || "I could not generate a response right now.";

      setMessagesByMode((prev) => ({ ...prev, [activeMode]: [...(prev[activeMode] || []), { role: "assistant", content: reply }] }));
    } else {
      setMessagesByMode((prev) => ({ ...prev, [activeMode]: [...(prev[activeMode] || []), { role: "assistant", content: result.error || "I could not generate a response right now." }] }));
    }

    setIsSending(false);
  }

  function handleReset() {
    const resetMessage =
      activeMode === "certificate"
        ? "Hi — I'm Evio. I can check certificate relevance and required evidence."
        : activeMode === "regulatory"
        ? "Hi — I'm Evio. Ask me about regulatory compliance, standards (BRSR, GRI, ISO), and what your organization needs to do."
        : "Hi — I'm Evio. I can help explain ESG scores, readiness gaps, recommendations, and practical next steps. Ask me anything.";

    setMessagesByMode((prev) => ({ ...prev, [activeMode]: [{ role: "assistant", content: resetMessage }] }));
    setConversationIdsByMode((prev) => ({ ...prev, [activeMode]: null }));
    setDraftsByMode((prev) => ({ ...prev, [activeMode]: "" }));
  }

  function toggleOpen() {
    setIsOpen((current) => !current);
  }

  function handleClose() {
    setIsOpen(false);
  }

  function toggleTranscript() {
    setIsTranscriptVisible((current) => !current);
  }

  function selectMode(mode: "certificate" | "regulatory" | "general") {
    setActiveMode(mode);
    setDraftsByMode((prev) => ({ ...prev, [mode]: prev[mode] ?? "" }));
    if (viewportRef.current) {
      viewportRef.current.scrollTop = 0;
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
    if (mode === "certificate") {
      setCertificateSelection({ sectorName: "", certification: "" });
    }
  }

  const currentDraft = draftsByMode[activeMode] ?? "";

  if (!isOpen) {
    return (
      <div className={cn("fixed bottom-4 right-4 z-[60]", className)}>
        <Button
          type="button"
          onClick={toggleOpen}
          aria-label="Open Evio"
          title="Open Evio"
          className="rounded-full bg-emerald-600 p-3 text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700"
        >
          <Bot className="size-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("fixed bottom-4 right-4 z-[60] w-[min(24rem,calc(100vw-2rem))]", className)}>
      <Card className="border-slate-200 bg-gradient-to-br from-white via-slate-50 to-emerald-50/60 shadow-xl max-h-[90vh] overflow-y-auto flex flex-col">
      <CardHeader className="border-b border-slate-200/80 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-600 text-white">
                <Bot className="size-3.5" />
              </div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base text-slate-900">{title}</CardTitle>
                <span className="text-xs rounded-full px-2 py-0.5 bg-slate-100 text-slate-700">
                  {activeMode === "certificate" ? "Certificate" : activeMode === "regulatory" ? "Regulatory" : "General"}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-1">{description}</p>
          </div>

          <div className="flex items-center gap-2">
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
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-slate-500 hover:text-slate-900"
              onClick={handleClose}
            >
              <ChevronDown className="mr-2 size-4" />
              Minimize Evio
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 p-3 md:p-4">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/80 px-2.5 py-1.5">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => selectMode("certificate")}
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs",
                  activeMode === "certificate"
                    ? "bg-emerald-600 text-white"
                    : "bg-white text-slate-600 border border-slate-200"
                )}
              >
                Certificate Relevance Check
              </button>
              <button
                type="button"
                onClick={() => selectMode("regulatory")}
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs",
                  activeMode === "regulatory"
                    ? "bg-emerald-600 text-white"
                    : "bg-white text-slate-600 border border-slate-200"
                )}
              >
                Regulatory FAQ
              </button>
              <button
                type="button"
                onClick={() => selectMode("general")}
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs",
                  activeMode === "general"
                    ? "bg-emerald-600 text-white"
                    : "bg-white text-slate-600 border border-slate-200"
                )}
              >
                General Sustainability Query
              </button>
            </div>
          </div>

          <div className="text-xs text-slate-600">
            {activeMode === "certificate" && (
              <span>Check certificate relevance for your sector and understand key requirements and next steps.</span>
            )}
            {activeMode === "regulatory" && (
              <span>Understand regulatory compliance requirements, standards (BRSR, GRI, ISO), and compliance deadlines.</span>
            )}
            {activeMode === "general" && (
              <span>Get ESG insights: scores, readiness gaps, recommendations, and practical sustainability actions.</span>
            )}
          </div>
        </div>

        {isTranscriptVisible && (
          <div
            ref={viewportRef}
            className="max-h-[32rem] space-y-2.5 overflow-y-auto rounded-2xl border border-slate-200 bg-white/80 p-2.5 shadow-inner"
            aria-live="polite"
          >
            {conversation.filter((message) => 
              activeMode === "certificate" ? message.role === "assistant" : true
            ).map((message, index) => (
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
                    Evio is thinking...
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-1.5">
          {activeMode === "regulatory" && REGULATORY_SUGGESTIONS.map((prompt) => (
            <Button
              key={prompt}
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full border-slate-200 bg-white text-slate-600 hover:bg-slate-100 text-xs"
              onClick={() => handleSend(prompt)}
              disabled={isSending}
            >
              {prompt}
            </Button>
          ))}
          {activeMode === "general" && GENERAL_SUGGESTIONS.map((prompt) => (
            <Button
              key={prompt}
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full border-slate-200 bg-white text-slate-600 hover:bg-slate-100 text-xs"
              onClick={() => handleSend(prompt)}
              disabled={isSending}
            >
              {prompt}
            </Button>
          ))}
        </div>

          <form
            className="space-y-2.5"
            onSubmit={(event) => {
              event.preventDefault();
              if (activeMode === "certificate") {
                const msg = `Let's explore how the "${certificateSelection.certification}" certification can strengthen our ESG commitment in the "${certificateSelection.sectorName}" sector. What makes it relevant for ESG, what are the key requirements, and how can we leverage it to drive meaningful sustainability outcomes?`;
                void handleSend(msg);
              } else {
                void handleSend(currentDraft);
              }
            }}
          >
            {activeMode === "certificate" ? (
              <div className="space-y-1.5">
                <label className="text-xs text-slate-600 block">Select sector</label>
                <select
                  value={certificateSelection.sectorName}
                  onChange={(e) => {
                    const sector = SECTOR_OPTIONS.find((s) => s.sectorName === e.target.value)!;
                    setCertificateSelection({ sectorName: sector.sectorName, certification: sector.certifications[0] });
                  }}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                  <option value="" disabled>Select Sector</option>
                  {SECTOR_OPTIONS.map((s) => (
                    <option key={s.sectorName} value={s.sectorName}>
                      {s.sectorName}
                    </option>
                  ))}
                </select>

                <label className="text-xs text-slate-600 block">Select certification</label>
                <select
                  value={certificateSelection.certification}
                  onChange={(e) => setCertificateSelection((prev) => ({ ...prev, certification: e.target.value }))}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                  <option value="" disabled>Select Certificate</option>
                  {SECTOR_OPTIONS.find((s) => s.sectorName === certificateSelection.sectorName)?.certifications.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <textarea
                ref={inputRef}
                value={currentDraft}
                onChange={(event) => setDraftsByMode((prev) => ({ ...prev, [activeMode]: event.target.value }))}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void handleSend(currentDraft);
                  }
                }}
                placeholder={
                  activeMode === "regulatory"
                    ? "Ask about regulatory compliance, standards, or deadlines..."
                    : "Ask about ESG gaps, recommendations, or sustainability strategies..."
                }
                className="min-h-20 w-full resize-none rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                aria-label="Chat message"
                rows={4}
              />
            )}

          <div className="flex items-center justify-between gap-2">
            {activeMode !== "certificate" && (
              <p className="text-xs text-slate-500">
                ⏎ send, Shift+⏎ new line
              </p>
            )}

            <Button
              type="submit"
              className="bg-emerald-600 text-white hover:bg-emerald-700"
              disabled={isSending || (activeMode === "certificate" ? !certificateSelection.sectorName || !certificateSelection.certification : !currentDraft.trim())}
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
      <Button
        type="button"
        onClick={toggleOpen}
        className="mt-2 w-full rounded-full bg-slate-900 px-4 py-2 text-white shadow-lg hover:bg-slate-800"
      >
        <ChevronUp className="mr-2 size-4" />
        Hide Evio
      </Button>
    </div>
  );
}