"use client";

import { useMemo, useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { AIPanel } from "@/components/ui/ai-panel";
import { EnvironmentDeskMetrics } from "@/components/environments/EnvironmentDeskMetrics";
import { ReleaseTimeline } from "@/components/environments/ReleaseTimeline";
import { SystemMappingView } from "@/components/environments/SystemMappingView";
import { EnvBookingTable } from "@/components/environments/EnvBookingTable";
import { VersionMatrix } from "@/components/environments/VersionMatrix";
import { AppEnvConfigTable } from "@/components/environments/AppEnvConfigTable";
import { AppConfigTable } from "@/components/environments/AppConfigTable";
import { EnterpriseReleaseImpactPanel } from "@/components/environments/EnterpriseReleaseImpactPanel";
import { buildEnvironmentDesk } from "@/lib/enterprise-env-data";
import { releases, services } from "@/lib/dummy-data";
import type { ReleaseTimelineEntry } from "@/lib/types";

function buildBriefing(stats: ReturnType<typeof buildEnvironmentDesk>["stats"], driftApps: string[]) {
  const parts = [
    `${stats.timelineCount} release windows on the portfolio timeline.`,
    `${stats.bookedEnvs} environment months are booked across SAP, FIN, Oracle, and CRM.`,
  ];
  if (driftApps.length > 0) {
    parts.push(`Version drift detected in ${driftApps.join(", ")} — PROD lags DEV/TEST.`);
  }
  if (stats.activeImpacts > 0) {
    parts.push(`${stats.activeImpacts} enterprise impact window${stats.activeImpacts === 1 ? " is" : "s are"} active now.`);
  } else {
    parts.push("No enterprise impact windows are active in the next 48 hours.");
  }
  return parts.join(" ");
}

export default function EnvironmentsPage() {
  const desk = useMemo(() => buildEnvironmentDesk(releases, services), []);
  const driftApps = useMemo(() => desk.versions.filter((v) => v.drift).map((v) => v.application), [desk.versions]);
  const briefing = useMemo(() => buildBriefing(desk.stats, driftApps), [desk.stats, driftApps]);

  const [selectedTimelineId, setSelectedTimelineId] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const handleTimelineSelect = (entry: ReleaseTimelineEntry | null) => {
    setSelectedTimelineId(entry?.id ?? null);
    if (entry?.department === "FIN") setSelectedApp("FIN");
    else if (entry?.department === "CRM") setSelectedApp("CRM");
    else if (entry?.department === "Platform") setSelectedApp("SAP");
  };

  const handleAppSelect = (app: string | null) => {
    setSelectedApp(app);
    if (app === "FIN") setSelectedNodeId("app-fin");
    else if (app === "CRM") setSelectedNodeId("app-crm");
    else if (app === "SAP") setSelectedNodeId("env-test-sap");
    else if (app === "Oracle") setSelectedNodeId("env-dev-oracle");
  };

  return (
    <div className="space-y-6">
      <TopBar
        title="Environment Desk"
        subtitle="Enterprise release calendar, booking, topology, and config — wired to synthetic release train"
        highlight
      />

      <EnvironmentDeskMetrics stats={desk.stats} />

      <AIPanel title="Environment Desk Briefing" agent="Summary Agent">
        <p>{briefing}</p>
      </AIPanel>

      <ReleaseTimeline
        entries={desk.timeline}
        selectedId={selectedTimelineId}
        onSelect={handleTimelineSelect}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <SystemMappingView
          nodes={desk.systemNodes}
          selectedNodeId={selectedNodeId}
          onSelectNode={(node) => {
            setSelectedNodeId(node?.id ?? null);
            if (node?.label.includes("FIN")) setSelectedApp("FIN");
            else if (node?.label.includes("CRM") || node?.label.includes("Mobile")) setSelectedApp("CRM");
            else if (node?.label.includes("Oracle")) setSelectedApp("Oracle");
            else if (node?.label.includes("SAP")) setSelectedApp("SAP");
          }}
        />
        <EnvBookingTable bookings={desk.bookings} highlightSystem={selectedApp ?? undefined} />
      </div>

      <VersionMatrix rows={desk.versions} selectedApp={selectedApp} onSelectApp={handleAppSelect} />

      <div className="grid gap-6 xl:grid-cols-2">
        <AppEnvConfigTable configs={desk.envConfigs} selectedApp={selectedApp} onSelectApp={handleAppSelect} />
        <AppConfigTable configs={desk.appConfigs} selectedApp={selectedApp} onSelectApp={handleAppSelect} />
      </div>

      <EnterpriseReleaseImpactPanel impacts={desk.impacts} />
    </div>
  );
}
