"use client";

import { useEffect, useMemo, useState } from "react";
import { EnvironmentDeskDashboardCard } from "@/components/environments/EnvironmentDeskDashboardCard";
import { NeedsAttentionPanel } from "@/components/dashboard/NeedsAttentionPanel";
import { CrmPortfolioDashboard } from "@/components/dashboard/CrmPortfolioDashboard";
import { UnifiedPortfolioPanel } from "@/components/dashboard/UnifiedPortfolioPanel";
import { TopBar } from "@/components/layout/TopBar";
import { ReleaseFiltersBar } from "@/components/releases/ReleaseFiltersBar";
import { AIPanel } from "@/components/ui/ai-panel";
import { callAgent } from "@/lib/agent-client";
import { buildDashboardSummaryContext } from "@/lib/summary-context";
import { filterLabel } from "@/lib/release-filters";
import type { NeedsAttentionItem } from "@/lib/needs-attention";
import { useReleaseFilters } from "@/context/ReleaseFiltersContext";
import { formatDateTime, cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import { PRODUCT_TAGLINE } from "@/lib/brand";

type Period = "month" | "quarter" | "year";

type DashboardData = {
  counts: { planned: number; inProgress: number; blocked: number; atRisk: number };
  connectors: { name: string; lastSynced: string }[];
  p1Issues: { externalId: string; title: string; application: string | null; releaseCode: string | null; status: string }[];
};

type OverviewData = Parameters<typeof UnifiedPortfolioPanel>[0]["data"];

function isDashboardData(v: unknown): v is DashboardData {
  return !!v && typeof v === "object" && "counts" in v && "p1Issues" in v;
}

function buildFallbackSummary(
  dashboard: DashboardData,
  scopeLabel: string | null
): string {
  const { counts, p1Issues } = dashboard;
  const scope = scopeLabel ?? "all departments, applications, and environments";
  const parts = [
    `${counts.planned} planned`,
    `${counts.inProgress} in progress`,
    counts.blocked ? `${counts.blocked} blocked` : null,
    counts.atRisk ? `${counts.atRisk} at risk` : null,
  ].filter(Boolean);
  const p1Line =
    p1Issues.length > 0
      ? ` ${p1Issues.length} open P1 issue${p1Issues.length === 1 ? "" : "s"} require release manager attention.`
      : " No open P1 issues in scope.";
  return `Portfolio summary for ${scope}: ${parts.join(", ")}.${p1Line}`;
}

export default function DashboardPage() {
  const [period, setPeriod] = useState<Period>("month");
  const [data, setData] = useState<DashboardData | null>(null);
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [attention, setAttention] = useState<NeedsAttentionItem[]>([]);

  const {
    filters,
    filterQuery,
    hasRefinement,
    departments,
    applications,
    environments,
  } = useReleaseFilters();

  const scopeLabel = useMemo(
    () => filterLabel(filters, departments, applications, environments),
    [filters, departments, applications, environments]
  );

  useEffect(() => {
    setFetchError(null);
    setData(null);
    setOverview(null);
    setSummary(null);
    setSummaryError(null);
    setSummaryLoading(false);
    setAttention([]);

    const dashUrl = `/api/dashboard?period=${period}${filterQuery}`;
    const overviewUrl = `/api/unified/overview?period=${period}${filterQuery}`;
    const attentionUrl = `/api/needs-attention?period=${period}${filterQuery}`;

    let cancelled = false;

    Promise.all([
      fetch(dashUrl).then(async (r) => (r.ok ? r.json() : Promise.reject(new Error("Dashboard load failed")))),
      fetch(overviewUrl).then(async (r) => (r.ok ? r.json() : Promise.reject(new Error("Overview load failed")))),
      fetch(attentionUrl).then(async (r) => (r.ok ? r.json() : { items: [] })),
    ])
      .then(([dash, ov, att]) => {
        if (cancelled) return;
        if (!isDashboardData(dash)) {
          setFetchError("Dashboard data was invalid");
          return;
        }
        setData(dash);
        setOverview(ov);
        setAttention(Array.isArray(att.items) ? att.items : []);
      })
      .catch((e) => {
        if (!cancelled) {
          setFetchError(e instanceof Error ? e.message : "Failed to load dashboard data");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [period, filterQuery]);

  useEffect(() => {
    if (!data || !overview) return;

    let cancelled = false;
    setSummaryLoading(true);
    setSummary(null);
    setSummaryError(null);

    const fallback = buildFallbackSummary(data, scopeLabel);

    callAgent({
      agentRole: "Summary Agent",
      context: buildDashboardSummaryContext({
        period,
        dashboard: data,
        overview,
        filterScope: scopeLabel,
      }),
    })
      .then((res) => {
        if (cancelled) return;
        const text = res.text?.trim();
        if (text) {
          setSummary(text);
          return;
        }
        const err = res.error ?? "";
        if (/api key|llm|unavailable|timed out/i.test(err)) {
          setSummary(fallback);
          setSummaryError(null);
        } else {
          setSummaryError(err || "AI summary unavailable");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSummary(fallback);
          setSummaryError(null);
        }
      })
      .finally(() => {
        if (!cancelled) setSummaryLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [data, overview, period, scopeLabel]);

  return (
    <div className="space-y-6">
      <TopBar
        title="Dashboard"
        subtitle={hasRefinement ? `Portfolio summary · ${scopeLabel}` : "Portfolio summary"}
        positioning={PRODUCT_TAGLINE}
        highlight
      />

      <ReleaseFiltersBar />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-xl border border-gray-200 bg-white/80 p-1">
          {(["month", "quarter", "year"] as Period[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                period === p ? "bg-brand-500 text-white" : "text-gray-600 hover:bg-gray-50"
              )}
            >
              {p}
            </button>
          ))}
        </div>
        {data?.connectors && (
          <div className="flex flex-wrap gap-3 text-[10px] text-gray-500">
            {data.connectors.map((c) => (
              <span key={c.name} className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {c.name}: {formatDateTime(c.lastSynced)}
              </span>
            ))}
          </div>
        )}
      </div>

      <AIPanel
        title="AI Daily Summary"
        agent="Summary Agent"
        loading={summaryLoading && !fetchError}
        error={fetchError ?? summaryError}
      >
        {summary && <p>{summary}</p>}
      </AIPanel>

      {data && (
        <CrmPortfolioDashboard
          counts={data.counts}
          overviewReleases={overview?.releases ?? []}
          attention={attention}
          p1Issues={data.p1Issues}
          connectors={data.connectors}
        />
      )}

      <NeedsAttentionPanel
        items={attention.slice(0, 8)}
        viewAllHref={`/inbox${filterQuery.replace(/^&/, "?")}`}
      />

      {overview && <UnifiedPortfolioPanel data={overview} />}

      <EnvironmentDeskDashboardCard />
    </div>
  );
}
