"use client";

import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { AgentBadge } from "@/components/badges/AgentBadge";
import { MaterioCard } from "@/components/materio/crm/MaterioCard";
import type { AgentRole } from "@/lib/types";

interface AIPanelProps {
  title: string;
  agent: AgentRole;
  children?: React.ReactNode;
  loading?: boolean;
  error?: string | null;
}

function PanelSkeleton() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      {[100, 92, 78, 65].map((w) => (
        <Skeleton key={w} variant="rounded" height={14} width={`${w}%`} sx={{ bgcolor: "action.hover" }} />
      ))}
    </Box>
  );
}

export function AIPanel({ title, agent, children, loading, error }: AIPanelProps) {
  return (
    <MaterioCard
      title={title}
      action={<AgentBadge agent={agent} />}
      sx={{
        borderLeft: 4,
        borderLeftColor: "primary.main",
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "background.paper" : "rgba(145, 85, 253, 0.04)",
      }}
    >
      {loading && <PanelSkeleton />}
      {error && !loading && (
        <Typography variant="body2" color="error.main">
          {error}
        </Typography>
      )}
      {children && !loading && (
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
          {children}
        </Typography>
      )}
    </MaterioCard>
  );
}
