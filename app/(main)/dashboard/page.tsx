"use client";

import { useEffect, useMemo, useState } from "react";
import { ProgressLink } from "@/components/layout/NavigationProgress";
import { TopBar } from "@/components/layout/TopBar";
import { AgentBadge } from "@/components/badges/AgentBadge";
import { StatusBadge } from "@/components/badges/StatusBadge";
import { AIPanel } from "@/components/ui/ai-panel";
import { DataTable, tableCell, tableHeadRow, tableRow } from "@/components/ui/data-table";
import { MetricCard } from "@/components/ui/metric-card";
import { AdvancedCard } from "@/components/ui/advanced-card";
import { useReleaseStore } from "@/context/ReleaseStoreContext";
import { callAgent } from "@/lib/agent-client";
import { releases } from "@/lib/dummy-data";
import { getLiveDashboardStats } from "@/lib/dashboard-stats";
import { useOrgContext } from "@/lib/use-org-context";
import { useQuickStartLauncher } from "@/lib/use-quick-start-launcher";
import { RiskHoverCell } from "@/components/dashboard/RiskHoverCell";
import { ReleaseDecisionBadge } from "@/components/releases/ReleaseDecisionBadge";
import { calcReadiness, formatDate, formatDateTime, medianFilesChanged } from "@/lib/utils";
import { Flag, TrendingUp, AlertTriangle, Bell, Package, Sparkles, Rocket } from "lucide-react";
import { PRODUCT_TAGLINE } from "@/lib/brand";
import { QUICK_START_TEMPLATES } from "@/lib/quick-start-templates";

export default function DashboardPage() {
  const orgContext = useOrgContext();
  const { state, getGlobalHistory } = useReleaseStore();
  const launchTemplate = useQuickStartLauncher();
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [riskCache, setRiskCache] = useState<Record<string, { text?: string; error?: string }>>({});

  const stats = useMemo(() => getLiveDashboardStats(releases, state), [state]);
  const median = medianFilesChanged(releases);
  const recentActivity = useMemo(() => getGlobalHistory().slice(0, 8), [getGlobalHistory]);

  useEffect(() => {
    callAgent({ agentRole: "Summary Agent", context: orgContext }).then((res) => {
      if (res.text) setSummary(res.text);
      else setError(res.error ?? "AI unavailable");
      setLoading(false);
    });
  }, [orgContext]);

  const activeReleases = releases.filter((r) => r.status !== "Shipped").slice(0, 8);

  const metrics = [
    { label: "Releases this week", value: stats.thisWeek, icon: TrendingUp },
    { label: "Org avg readiness", value: `${stats.avgReadiness}%`, icon: Flag },
    { label: "Recorded decisions", value: stats.recordedDecisions, icon: AlertTriangle },
    {
      label: stats.activeDeploys > 0 ? "Active deploys" : "Unread alerts",
      value: stats.activeDeploys > 0 ? stats.activeDeploys : stats.unreadAlerts,
      icon: stats.activeDeploys > 0 ? Rocket : Bell,
    },
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
            <button
              type="button"
              onClick={() => launchTemplate("/releases/rel-v2140", "reset")}
              className="inline-flex items-center rounded-full border border-gray-200 bg-white/80 px-3 py-1.5 text-xs text-gray-600 hover:bg-brand-50 hover:border-brand-200 transition-colors"
            >
              At-risk release
            </button>
            <button
              type="button"
              onClick={() => launchTemplate("/compare?left=rel-v2140&right=rel-v2141", "reset")}
              className="inline-flex items-center rounded-full border border-gray-200 bg-white/80 px-3 py-1.5 text-xs text-gray-600 hover:bg-brand-50 hover:border-brand-200 transition-colors"
            >
              Compare releases
            </button>
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
        <AdvancedCard
          title="Recent Activity"
          subtitle={
            stats.activeDeploys > 0
              ? `${stats.activeDeploys} deploy(s) in progress · live audit events`
              : "Live audit events from your session"
          }
          variant="glass"
          className="h-full"
          action={
            <ProgressLink href="/history" className="text-xs text-brand-500 hover:underline">
              Full trail →
            </ProgressLink>
          }
        >
          <div className="space-y-3">
            {recentActivity.map((h) => (
              <div key={h.id} className="border-b border-gray-100 pb-3 text-sm last:border-0">
                <ProgressLink
                  href={`/history?release=${h.releaseId}`}
                  className="block hover:bg-brand-50/50 -mx-2 px-2 py-1 rounded-lg transition-colors"
                >
                  {h.type === "agent" && h.agent && <AgentBadge agent={h.agent} className="mb-1" />}
                  <p className="text-gray-700">{h.action}</p>
                  <p className="mt-1 text-theme-xs text-gray-400">
                    {h.actor} · {h.releaseName} · {formatDateTime(h.timestamp)}
                  </p>
                </ProgressLink>
              </div>
            ))}
          </div>
        </AdvancedCard>
      </div>
    </div>
  );
}
