"use client";

import { ProgressLink } from "@/components/layout/NavigationProgress";
import { SourceBadgeInline } from "@/components/dashboard/UnifiedPortfolioPanel";
import { StatusBadge } from "@/components/badges/StatusBadge";
import { DataTable, tableCell, tableHeadRow, tableRow } from "@/components/ui/data-table";
import { formatDate, cn } from "@/lib/utils";
import type { NeedsAttentionItem } from "@/lib/needs-attention";
import { AlertTriangle } from "lucide-react";

export function NeedsAttentionPanel({
  items,
  viewAllHref = "/releases?attention=1",
  showViewAll = true,
}: {
  items: NeedsAttentionItem[];
  viewAllHref?: string;
  showViewAll?: boolean;
}) {
  return (
    <DataTable
      title="Needs attention"
      subtitle={
        items.length
          ? "Blocked and at-risk releases — owner, stage, and who should act next"
          : "No blocked or at-risk releases in this period and filter scope"
      }
      icon={AlertTriangle}
      action={
        showViewAll && items.length > 0 ? (
          <ProgressLink
            href={viewAllHref}
            className="text-xs font-medium text-brand-600 hover:text-brand-700"
          >
            View all →
          </ProgressLink>
        ) : undefined
      }
    >
      {items.length === 0 ? (
        <p className="text-sm text-gray-500 px-1 py-2">
          All clear for the selected period. Check{" "}
          <ProgressLink href="/releases" className="text-brand-600 hover:underline">
            Releases
          </ProgressLink>{" "}
          for the full portfolio.
        </p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className={tableHeadRow}>
              <th className={cn(tableCell, "text-left")}>Release</th>
              <th className={cn(tableCell, "text-left")}>Status</th>
              <th className={cn(tableCell, "text-left")}>Owner</th>
              <th className={cn(tableCell, "text-left")}>Stage</th>
              <th className={cn(tableCell, "text-left")}>Why stuck</th>
              <th className={cn(tableCell, "text-left")}>Responsible</th>
              <th className={cn(tableCell, "text-left")}>Last activity</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={`${item.source}-${item.id}`} className={tableRow}>
                <td className={tableCell}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <SourceBadgeInline source={item.source} />
                    <ProgressLink
                      href={item.href}
                      className="font-mono text-xs text-brand-600 hover:underline"
                    >
                      {item.code}
                    </ProgressLink>
                  </div>
                  <ProgressLink href={item.href} className="text-gray-800 hover:text-brand-600 block mt-0.5">
                    {item.name}
                  </ProgressLink>
                  <span className="text-[10px] text-gray-400">
                    {item.group} · {formatDate(item.date)}
                  </span>
                </td>
                <td className={tableCell}>
                  <StatusBadge status={item.status as "Blocked"} />
                </td>
                <td className={cn(tableCell, "text-gray-700")}>{item.owner}</td>
                <td className={cn(tableCell, "text-xs text-gray-600 max-w-[140px]")}>{item.stage}</td>
                <td className={cn(tableCell, "text-xs text-gray-600 max-w-[180px]")}>{item.reason}</td>
                <td className={cn(tableCell, "font-medium text-gray-800")}>{item.responsible}</td>
                <td className={cn(tableCell, "text-xs text-gray-500 max-w-[160px]")}>
                  {item.lastActor ? (
                    <>
                      <span className="text-gray-700">{item.lastActor}</span>
                      {item.lastActivity && (
                        <span className="block text-gray-400 mt-0.5">{item.lastActivity}</span>
                      )}
                    </>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </DataTable>
  );
}
