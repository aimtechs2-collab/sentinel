"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme, alpha } from "@mui/material/styles";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import type { LucideIcon } from "lucide-react";

export type CrmStatCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: number;
  sparkline?: number[];
  color?: "primary" | "success" | "warning" | "error" | "info";
};

export function CrmStatCard({ title, value, subtitle, icon: Icon, trend, sparkline, color = "primary" }: CrmStatCardProps) {
  const theme = useTheme();
  const mainColor = theme.palette[color].main;
  const chartData = (sparkline ?? [3, 5, 4, 6, 5, 7, 6]).map((v, i) => ({ i, v }));

  return (
    <Box
      sx={{
        p: 3,
        height: "100%",
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        boxShadow: theme.palette.mode === "dark" ? "0 2px 10px rgba(19,17,32,0.4)" : "0 2px 10px rgba(46,38,61,0.06)",
        transition: "box-shadow 0.2s",
        "&:hover": { boxShadow: theme.palette.mode === "dark" ? "0 4px 16px rgba(19,17,32,0.5)" : "0 4px 16px rgba(46,38,61,0.1)" },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 2 }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: alpha(mainColor, 0.12),
            color: mainColor,
          }}
        >
          <Icon size={22} />
        </Box>
        {trend !== undefined && (
          <Typography
            variant="caption"
            sx={{
              px: 1,
              py: 0.25,
              borderRadius: 1,
              fontWeight: 600,
              bgcolor: trend >= 0 ? alpha(theme.palette.success.main, 0.12) : alpha(theme.palette.error.main, 0.12),
              color: trend >= 0 ? "success.main" : "error.main",
            }}
          >
            {trend >= 0 ? "+" : ""}
            {trend}%
          </Typography>
        )}
      </Box>

      <Typography variant="body2" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary", mb: 0.5 }}>
        {value}
      </Typography>
      {subtitle && (
        <Typography variant="caption" color="text.secondary">
          {subtitle}
        </Typography>
      )}

      {sparkline && sparkline.length > 0 && (
        <Box sx={{ height: 48, mt: 2, mx: -1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={`spark-${color}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={mainColor} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={mainColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke={mainColor} strokeWidth={2} fill={`url(#spark-${color})`} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Box>
  );
}
