"use client";

import { useCallback, useEffect, useState } from "react";
import { AgentBadge } from "@/components/badges/AgentBadge";
import { AIPanel } from "@/components/ui/ai-panel";
import { callAgent } from "@/lib/agent-client";
import {
  buildFallbackInboxBriefing,
  type InboxBriefingContext,
} from "@/lib/db-ai-context";
import { parseCitations } from "@/lib/utils";
import { RefreshCw, Sparkles } from "lucide-react";
import { taBtnSecondary } from "@/lib/styles";

export function InboxBriefingPanel({
  briefingContext,
}: {
  briefingContext: InboxBriefingContext | null;
}) {
  const [briefing, setBriefing] = useState<string | null>(null);
  const [citations, setCitations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setBriefing(null);
    setCitations([]);
    setError(null);
  }, [briefingContext]);

  const generate = useCallback(async () => {
    if (!briefingContext) return;
    setLoading(true);
    setError(null);
    setBriefing(null);
    setCitations([]);

    const fallback = buildFallbackInboxBriefing(briefingContext);

    const res = await callAgent({
      agentRole: "Conversation Agent",
      context: briefingContext,
      userMessage:
        "Explain my top 3 priorities for today. Use bullet points. Say who should act and why. End with a Citations: line listing specific counts and release codes from context.",
    });

    setLoading(false);

    if (res.text?.trim()) {
      const { content, citations: cites } = parseCitations(res.text.trim());
      setBriefing(content);
      setCitations(cites);
    } else if (res.error && /api key|llm|unavailable|timed out/i.test(res.error)) {
      const { content, citations: cites } = parseCitations(fallback);
      setBriefing(content);
      setCitations(cites);
    } else {
      setError(res.error ?? "Briefing unavailable");
      const { content, citations: cites } = parseCitations(fallback);
      setBriefing(content);
      setCitations(cites);
    }
  }, [briefingContext]);

  useEffect(() => {
    if (briefingContext?.topActions.length) {
      generate();
    }
  }, [briefingContext, generate]);

  if (!briefingContext?.topActions.length) return null;

  return (
    <AIPanel
      title="AI morning briefing"
      agent="Conversation Agent"
      loading={loading}
      error={error}
    >
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-violet-500" />
        <span className="text-xs text-gray-500 flex-1">
          Interprets your top actions with live inbox counts — grounded in DB data only.
        </span>
        <button
          type="button"
          className={taBtnSecondary + " text-xs !py-1.5"}
          onClick={generate}
          disabled={loading}
        >
          {loading ? (
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
          ) : (
            "Refresh briefing"
          )}
        </button>
        <AgentBadge agent="Conversation Agent" />
      </div>
      {briefing && <p className="whitespace-pre-wrap text-sm text-gray-700">{briefing}</p>}
      {citations.length > 0 && (
        <p className="text-xs text-gray-400 mt-3 border-t border-violet-100 pt-2">
          Based on: {citations.join(", ")}
        </p>
      )}
    </AIPanel>
  );
}
