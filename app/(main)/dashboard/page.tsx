"use client";

import { useEffect, useState } from "react";
import { ProgressLink } from "@/components/layout/NavigationProgress";
import { TopBar } from "@/components/layout/TopBar";
import { AgentBadge } from "@/components/badges/AgentBadge";
import { StatusBadge } from "@/components/badges/StatusBadge";
import { AIPanel } from "@/components/ui/ai-panel";
import { DataTable, tableCell, tableHeadRow, tableRow } from "@/components/ui/data-table";
import { MetricCard } from "@/components/ui/metric-card";
import { AdvancedCard } from "@/components/ui/advanced-card";
import { callAgent } from "@/lib/agent-client";
import { releases, activityFeed, getOrgContext } from "@/lib/dummy-data";
import { RiskHoverCell } from "@/components/dashboard/RiskHoverCell";
import { ReleaseDecisionBadge } from "@/components/releases/ReleaseDecisionBadge";
import { calcReadiness, formatDate, getOrgStats, medianFilesChanged } from "@/lib/utils";
import { Flag, TrendingUp, AlertTriangle, Clock, Package, Sparkles } from "lucide-react";
import { PRODUCT_TAGLINE } from "@/lib/brand";
import { QUICK_START_TEMPLATES } from "@/lib/quick-start-templates";

export default function DashboardPage() {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [riskCache, setRiskCache] = useState<Record<string, { text?: string; error?: string }>>({});
  const stats = getOrgStats(releases);
  const median = medianFilesChanged(releases);

  useEffect(() => {
    callAgent({ agentRole: "Summary Agent", context: getOrgContext() }).then((res) => {
      if (res.text) setSummary(res.text);
      else setError(res.error ?? "AI unavailable");
      setLoading(false);
    });
  }, []);

  const activeReleases = releases.filter((r) => r.status !== "Shipped").slice(0, 8);

  const metrics = [
    { label: "Releases this week", value: stats.thisWeek, icon: TrendingUp },
    { label: "Org avg readiness", value: `${stats.avgReadiness}%`, icon: Clock },
    { label: "Open blockers", value: stats.openBlockers, icon: AlertTriangle },
    { label: "Approvals pending", value: stats.pendingApprovals, icon: Flag },
  ];

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <TopBar
          title="Dashboard"
          subtitle="Executive release overview"
          positioning={PRODUCT_TAGLINE}
          highlight
        />
      </div>

      <div className="col-span-12">
        <AdvancedCard
          variant="ai"
          beam
          icon={Sparkles}
          title="Quick Start Templates"
          subtitle={`${QUICK_START_TEMPLATES.length} guided demo scenarios`}
          action={
            <ProgressLink href="/templates" className="text-sm font-medium text-brand-600 hover:text-brand-700">
              Browse all →
            </ProgressLink>
          }
        >
          <p className="text-sm text-gray-600 mb-3">
            Jump into at-risk triage, auto-rollback, CAB review, compare views, and more — each template
            opens the right screen with pre-seeded demo state.
          </p>
          <div className="flex flex-wrap gap-2">
            <ProgressLink
              href="/templates"
              className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700 hover:bg-brand-100 transition-colors"
            >
              <Sparkles className="w-3 h-3" /> All templates
            </ProgressLink>
            <ProgressLink
              href="/releases/rel-v2140"
              className="inline-flex items-center rounded-full border border-gray-200 bg-white/80 px-3 py-1.5 text-xs text-gray-600 hover:bg-brand-50 hover:border-brand-200 transition-colors"
            >
              At-risk release
            </ProgressLink>
            <ProgressLink
              href="/compare?left=rel-v2140&right=rel-v2141"
              className="inline-flex items-center rounded-full border border-gray-200 bg-white/80 px-3 py-1.5 text-xs text-gray-600 hover:bg-brand-50 hover:border-brand-200 transition-colors"
            >
              Compare releases
            </ProgressLink>
          </div>
        </AdvancedCard>
      </div>

      {metrics.map(({ label, value, icon: Icon }, i) => (
        <div key={label} className="col-span-12 sm:col-span-6 xl:col-span-3">
          <MetricCard label={label} value={value} icon={Icon} delay={i * 0.08} />
        </div>
      ))}

      <div className="col-span-12">
        <AIPanel title="AI Daily Summary" agent="Summary Agent" loading={loading} error={error}>
          {summary && <p>{summary}</p>}
        </AIPanel>
      </div>

      <div className="col-span-12 xl:col-span-8">
        <DataTable title="Active Releases" icon={Package}>
          <table className="w-full text-theme-sm">
            <thead className={tableHeadRow}>
              <tr>
                <th className={`${tableCell} text-left font-medium`}>Version</th>
                <th className={`${tableCell} text-left font-medium`}>Team</th>
                <th className={`${tableCell} text-left font-medium`}>Readiness</th>
                <th className={`${tableCell} text-left font-medium`}>Status</th>
                <th className={`${tableCell} text-left font-medium`}>Decision</th>
                <th className={`${tableCell} text-left font-medium`}>Target</th>
                <th className={`${tableCell} text-left font-medium`}>Risk</th>
              </tr>
            </thead>
            <tbody>
              {activeReleases.map((r) => (
                <tr key={r.id} className={tableRow}>
                  <td className={tableCell}>
                    <ProgressLink href={`/releases/${r.id}`} className="font-medium text-brand-500 hover:text-brand-600">
                      {r.version}
                    </ProgressLink>
                  </td>
                  <td className={`${tableCell} text-gray-600`}>{r.team}</td>
                  <td className={`${tableCell} text-gray-800`}>{calcReadiness(r)}%</td>
                  <td className={tableCell}><StatusBadge status={r.status} /></td>
                  <td className={tableCell}><ReleaseDecisionBadge releaseId={r.id} fallback={r.decision} /></td>
                  <td className={`${tableCell} text-gray-500`}>{formatDate(r.targetDate)}</td>
                  <td className={tableCell}>
                    <RiskHoverCell
                      release={r}
                      median={median}
                      cache={riskCache}
                      onCacheUpdate={(id, entry) => setRiskCache((c) => ({ ...c, [id]: entry }))}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </DataTable>
      </div>

      <div className="col-span-12 xl:col-span-4">
        <AdvancedCard title="Recent Activity" variant="glass" className="h-full">
          <div className="space-y-3">
            {activityFeed.slice(0, 6).map((a) => (
              <div key={a.id} className="border-b border-gray-100 pb-3 text-sm last:border-0">
                {a.type === "agent" && a.agent && <AgentBadge agent={a.agent} className="mb-1" />}
                <p className="text-gray-700">{a.message}</p>
                <p className="mt-1 text-theme-xs text-gray-400">{a.actor} · {formatDate(a.timestamp)}</p>
              </div>
            ))}
          </div>
        </AdvancedCard>
      </div>
    </div>
  );
}
