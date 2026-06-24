"use client";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { alpha, useTheme, type Theme } from "@mui/material/styles";
import { CalendarClock } from "lucide-react";
import Link from "next/link";
import { MaterioCard } from "./MaterioCard";

export type ScheduleItem = {
  id: string;
  title: string;
  subtitle?: string;
  time: string;
  status?: string;
  href?: string;
  avatarLabel?: string;
};

type MeetingScheduleListProps = {
  items: ScheduleItem[];
  title?: string;
  subheader?: string;
  emptyMessage?: string;
};

function statusColor(status: string | undefined, theme: Theme) {
  if (!status) return theme.palette.primary.main;
  const s = status.toLowerCase();
  if (s.includes("go") || s.includes("ready") || s.includes("approved")) return theme.palette.success.main;
  if (s.includes("risk") || s.includes("pending") || s.includes("undecided")) return theme.palette.warning.main;
  if (s.includes("block") || s.includes("no-go") || s.includes("fail")) return theme.palette.error.main;
  return theme.palette.info.main;
}

export function MeetingScheduleList({
  items,
  title = "Meeting Schedule",
  subheader = "Go/No-Go and upcoming release checkpoints",
  emptyMessage = "No upcoming checkpoints in scope.",
}: MeetingScheduleListProps) {
  const theme = useTheme();

  return (
    <MaterioCard title={title} subheader={subheader}>
      {items.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
          {emptyMessage}
        </Typography>
      ) : (
        <List disablePadding sx={{ mx: -1 }}>
          {items.map((item, i) => {
            const content = (
              <ListItem
                alignItems="flex-start"
                sx={{
                  px: 1,
                  py: 1.5,
                  borderRadius: 1,
                  "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.04) },
                  borderBottom: i < items.length - 1 ? 1 : 0,
                  borderColor: "divider",
                }}
              >
                <ListItemAvatar sx={{ minWidth: 48 }}>
                  <Avatar
                    sx={{
                      width: 38,
                      height: 38,
                      bgcolor: alpha(statusColor(item.status, theme), 0.12),
                      color: statusColor(item.status, theme),
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}
                  >
                    {item.avatarLabel ?? <CalendarClock size={18} />}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {item.title}
                      </Typography>
                      {item.status && (
                        <Chip label={item.status} size="small" sx={{ height: 22, fontSize: "0.65rem" }} />
                      )}
                    </Box>
                  }
                  secondary={
                    <>
                      {item.subtitle && (
                        <Typography variant="caption" color="text.secondary" component="span" sx={{ display: "block" }}>
                          {item.subtitle}
                        </Typography>
                      )}
                      <Typography variant="caption" color="primary.main" sx={{ fontWeight: 500 }}>
                        {item.time}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            );

            return item.href ? (
              <Link key={item.id} href={item.href} style={{ textDecoration: "none", color: "inherit" }}>
                {content}
              </Link>
            ) : (
              <Box key={item.id}>{content}</Box>
            );
          })}
        </List>
      )}
    </MaterioCard>
  );
}
