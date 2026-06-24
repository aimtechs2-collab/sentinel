"use client";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";
import { Bot, GitCommit, Shield, Sparkles } from "lucide-react";
import { MaterioCard } from "./MaterioCard";

export type ActivityItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  type?: "agent" | "release" | "security" | "demo";
};

const typeIcon = {
  agent: Bot,
  release: GitCommit,
  security: Shield,
  demo: Sparkles,
};

type ActivityFeedCardProps = {
  items: ActivityItem[];
  title?: string;
  subheader?: string;
};

export function ActivityFeedCard({
  items,
  title = "Activity Timeline",
  subheader = "Recent agent and release desk events",
}: ActivityFeedCardProps) {
  const theme = useTheme();

  return (
    <MaterioCard title={title} subheader={subheader}>
      <Box sx={{ position: "relative", pl: 2 }}>
        <Box
          sx={{
            position: "absolute",
            left: 19,
            top: 8,
            bottom: 8,
            width: 2,
            bgcolor: "divider",
            borderRadius: 1,
          }}
        />
        {items.map((item) => {
          const Icon = typeIcon[item.type ?? "release"];
          const color =
            item.type === "agent"
              ? theme.palette.primary.main
              : item.type === "security"
                ? theme.palette.error.main
                : item.type === "demo"
                  ? theme.palette.info.main
                  : theme.palette.success.main;

          return (
            <Box key={item.id} sx={{ display: "flex", gap: 2, mb: 2.5, position: "relative" }}>
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  zIndex: 1,
                  bgcolor: alpha(color, 0.12),
                  color,
                }}
              >
                <Icon size={16} />
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {item.title}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.25, display: "block" }}>
                  {item.description}
                </Typography>
                <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: "block" }}>
                  {item.time}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </MaterioCard>
  );
}
