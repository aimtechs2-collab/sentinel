"use client";

import { useMemo } from "react";
import Grid from "@mui/material/Grid";
import { CrmStatCard } from "@/components/materio/crm/CrmStatCard";
import { MeetingScheduleList } from "@/components/materio/crm/MeetingScheduleList";
import { TransactionsTable } from "@/components/materio/crm/TransactionsTable";
import type { InboxItem, InboxSection } from "@/lib/inbox-shared";
import { formatDate } from "@/lib/utils";
import { AlertTriangle, GitBranch, Inbox, Ticket } from "lucide-react";

type InboxCrmWidgetsProps = {
  loading: boolean;
  totalCount: number;
  attentionCount: number;
  p1Count: number;
  mappingCount: number;
  items: InboxItem[];
};

export function InboxCrmWidgets({
  loading,
  totalCount,
  attentionCount,
  p1Count,
  mappingCount,
  items,
}: InboxCrmWidgetsProps) {
  const stats = [
    { title: "Total items", value: loading ? "…" : totalCount, icon: Inbox, color: "primary" as const },
    { title: "Blocked & at risk", value: loading ? "…" : attentionCount, icon: AlertTriangle, color: "error" as const },
    { title: "Open P1s", value: loading ? "…" : p1Count, icon: Ticket, color: "warning" as const },
    { title: "Mapping conflicts", value: loading ? "…" : mappingCount, icon: GitBranch, color: "info" as const },
  ];

  const scheduleItems = useMemo(
    () =>
      items
        .filter((i) => i.section === "approaching" || i.section === "approvals")
        .slice(0, 5)
        .map((i) => ({
          id: i.id,
          title: i.title,
          subtitle: i.reason,
          time: i.date ? formatDate(i.date) : "Soon",
          status: i.section,
          href: i.href,
          avatarLabel: i.title.slice(0, 2).toUpperCase(),
        })),
    [items]
  );

  const transactionRows = useMemo(
    () =>
      items.slice(0, 8).map((i) => ({
        id: i.id,
        primary: i.title,
        secondary: i.subtitle,
        meta: i.responsible,
        amount: i.date ? formatDate(i.date) : "—",
        status: sectionLabel(i.section),
        href: i.href,
      })),
    [items]
  );

  return (
    <div className="space-y-6">
      <Grid container spacing={3}>
        {stats.map((s) => (
          <Grid key={s.title} size={{ xs: 12, sm: 6, lg: 3 }}>
            <CrmStatCard title={s.title} value={s.value} icon={s.icon} color={s.color} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 5 }}>
          <MeetingScheduleList
            items={scheduleItems}
            title="Action Schedule"
            subheader="Undecided releases and overdue approvals"
            emptyMessage="No scheduled checkpoints — inbox clear for this section."
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 7 }}>
          <TransactionsTable
            rows={transactionRows}
            title="Inbox Queue"
            subheader="Items requiring release manager action"
            columns={{
              primary: "Item",
              secondary: "Context",
              meta: "Owner",
              amount: "Due",
              status: "Section",
            }}
            emptyMessage="No inbox items in scope."
          />
        </Grid>
      </Grid>
    </div>
  );
}

function sectionLabel(section: InboxSection): string {
  const map: Record<InboxSection, string> = {
    attention: "At risk",
    p1: "P1",
    approaching: "Undecided",
    mapping: "Mapping",
    approvals: "Approval",
    mine: "Mine",
  };
  return map[section];
}
