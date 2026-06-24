"use client";

import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { MaterioCard } from "./MaterioCard";
import type { WeeklyPoint } from "@/lib/materio/chart-data";

type WeeklyOverviewChartProps = {
  data: WeeklyPoint[];
  title?: string;
  subheader?: string;
};

export function WeeklyOverviewChart({
  data,
  title = "Weekly Overview",
  subheader = "Releases scheduled per week",
}: WeeklyOverviewChartProps) {
  const theme = useTheme();
  const grid = theme.palette.mode === "dark" ? "rgba(231,227,252,0.08)" : "#eaeaf4";
  const tick = theme.palette.text.secondary;

  return (
    <MaterioCard title={title} subheader={subheader}>
      <Box sx={{ height: 280, mx: -1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="4 4" stroke={grid} vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: tick }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: tick }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: `1px solid ${theme.palette.divider}`,
                background: theme.palette.background.paper,
                boxShadow: theme.shadows[4],
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="releases" name="Releases" fill={theme.palette.primary.main} radius={[6, 6, 0, 0]} maxBarSize={32} />
            <Bar dataKey="atRisk" name="At risk / blocked" fill={theme.palette.warning.main} radius={[6, 6, 0, 0]} maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </MaterioCard>
  );
}
