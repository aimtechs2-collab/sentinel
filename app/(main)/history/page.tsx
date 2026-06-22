"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ProgressLink } from "@/components/layout/NavigationProgress";
import { TopBar } from "@/components/layout/TopBar";
import { AgentBadge } from "@/components/badges/AgentBadge";
import { DataTable, tableCell, tableHeadRow, tableRow } from "@/components/ui/data-table";
import { useReleaseStore } from "@/context/ReleaseStoreContext";
import { formatDateTime } from "@/lib/utils";
import { ScrollText } from "lucide-react";

export default function HistoryPage() {
  const searchParams = useSearchParams();
  const releaseFilter = searchParams.get("release");
  const { getGlobalHistory } = useReleaseStore();

  const history = useMemo(() => {
    const all = getGlobalHistory();
    if (releaseFilter) return all.filter((h) => h.releaseId === releaseFilter);
    return all;
  }, [getGlobalHistory, releaseFilter]);

  return (
    <div>
      <TopBar
        title="History Log"
        subtitle={
          releaseFilter
            ? `Audit trail for release ${releaseFilter.replace("rel-", "")}`
            : "Global audit trail across all releases — includes your live decisions and deployments"
        }
        highlight
      />
      <DataTable title="Audit Trail" subtitle={`${history.length} events`} icon={ScrollText}>
        <table className="w-full text-sm">
          <thead className={tableHeadRow}>
            <tr>
              <th className={`${tableCell} text-left font-medium`}>Timestamp</th>
              <th className={`${tableCell} text-left font-medium`}>Release</th>
              <th className={`${tableCell} text-left font-medium`}>Actor</th>
              <th className={`${tableCell} text-left font-medium`}>Action</th>
            </tr>
          </thead>
          <tbody>
            {history.slice(0, 50).map((h) => (
              <tr key={h.id} className={tableRow}>
                <td className={`${tableCell} text-gray-500`}>{formatDateTime(h.timestamp)}</td>
                <td className={tableCell}>
                  <ProgressLink href={`/releases/${h.releaseId}`} className="text-brand-500 hover:underline">
                    {h.releaseName}
                  </ProgressLink>
                </td>
                <td className={tableCell}>
                  {h.type === "agent" && h.agent ? <AgentBadge agent={h.agent} /> : <span className="text-gray-700">{h.actor}</span>}
                </td>
                <td className={`${tableCell} text-gray-600`}>{h.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>
    </div>
  );
}
