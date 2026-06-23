"use client";

import { motion } from "framer-motion";
import { AlertTriangle, CalendarCheck, GitBranch, Layers, Server } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import type { EnvironmentDeskStats } from "@/lib/types";

export function EnvironmentDeskMetrics({ stats }: { stats: EnvironmentDeskStats }) {
  const metrics = [
    { label: "Timeline windows", value: stats.timelineCount, icon: CalendarCheck, trend: "neutral" as const },
    { label: "Env slots booked", value: stats.bookedEnvs, icon: Server, trend: stats.bookedEnvs > 4 ? ("up" as const) : ("neutral" as const) },
    { label: "Version drift", value: stats.versionDrift, icon: Layers, trend: stats.versionDrift > 0 ? ("down" as const) : ("up" as const) },
    { label: "Promotion gaps", value: stats.promotionGap, icon: GitBranch, trend: stats.promotionGap > 0 ? ("down" as const) : ("up" as const) },
    { label: "Active impacts", value: stats.activeImpacts, icon: AlertTriangle, trend: stats.activeImpacts > 0 ? ("down" as const) : ("up" as const) },
    { label: "Mapped services", value: stats.mappedServices, icon: GitBranch, trend: "neutral" as const },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4"
    >
      {metrics.map(({ label, value, icon, trend }, i) => (
        <MetricCard key={label} label={label} value={value} icon={icon} trend={trend} delay={i * 0.05} />
      ))}
    </motion.div>
  );
}
