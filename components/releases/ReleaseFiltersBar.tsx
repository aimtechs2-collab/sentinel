"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import { Filter } from "lucide-react";
import { MaterioCard } from "@/components/materio/crm/MaterioCard";
import { useReleaseFilters } from "@/context/ReleaseFiltersContext";
import { PERIOD_OPTIONS } from "@/lib/period-labels";
import type { Period } from "@/lib/period-range";
import { cn } from "@/lib/utils";

export function ReleaseFiltersBar({
  className,
  variant = "default",
  period,
  onPeriodChange,
}: {
  className?: string;
  variant?: "default" | "large";
  period?: Period;
  onPeriodChange?: (period: Period) => void;
}) {
  const {
    filters,
    setDepartmentId,
    setApplicationId,
    setEnvironmentId,
    clearFilters,
    hasRefinement,
    departments,
    applications,
    envOptions,
    loading,
  } = useReleaseFilters();

  const appOptions = filters.departmentId
    ? applications.filter((a) => a.departmentId === filters.departmentId)
    : applications;

  const large = variant === "large";

  const fields = (
    <Grid container spacing={large ? 2.5 : 2}>
      <Grid size={{ xs: 12, sm: 6, md: large ? 3 : 4 }}>
        <FormControl fullWidth size="small" disabled={loading}>
          <InputLabel>Department</InputLabel>
          <Select label="Department" value={filters.departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
            <MenuItem value="">All departments</MenuItem>
            {departments.map((d) => (
              <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: large ? 3 : 4 }}>
        <FormControl fullWidth size="small" disabled={loading}>
          <InputLabel>Application</InputLabel>
          <Select label="Application" value={filters.applicationId} onChange={(e) => setApplicationId(e.target.value)}>
            <MenuItem value="">All applications</MenuItem>
            {appOptions.map((a) => (
              <MenuItem key={a.id} value={a.id}>{a.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: large ? 3 : 4 }}>
        <FormControl fullWidth size="small" disabled={loading || !envOptions.length}>
          <InputLabel>Environment</InputLabel>
          <Select label="Environment" value={filters.environmentId} onChange={(e) => setEnvironmentId(e.target.value)}>
            <MenuItem value="">All environments</MenuItem>
            {envOptions.map((e) => (
              <MenuItem key={e.id} value={e.id}>
                {e.application.name} — {e.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {period !== undefined && onPeriodChange && (
        <Grid size={{ xs: 12, sm: 6, md: large ? 3 : 4 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Period</InputLabel>
            <Select label="Period" value={period} onChange={(e) => onPeriodChange(e.target.value as Period)}>
              {PERIOD_OPTIONS.map((o) => (
                <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      )}
    </Grid>
  );

  const chips =
    hasRefinement ? (
      <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
        {filters.departmentId && (
          <Chip
            size="small"
            label={departments.find((d) => d.id === filters.departmentId)?.name ?? "Department"}
            onDelete={() => setDepartmentId("")}
          />
        )}
        {filters.applicationId && (
          <Chip
            size="small"
            label={applications.find((a) => a.id === filters.applicationId)?.name ?? "Application"}
            onDelete={() => setApplicationId("")}
          />
        )}
        {filters.environmentId && (
          <Chip
            size="small"
            label={
              envOptions.find((e) => e.id === filters.environmentId)
                ? `${envOptions.find((e) => e.id === filters.environmentId)!.application.name} — ${envOptions.find((e) => e.id === filters.environmentId)!.name}`
                : "Environment"
            }
            onDelete={() => setEnvironmentId("")}
          />
        )}
      </Box>
    ) : null;

  if (large) {
    return (
      <MaterioCard
        className={className}
        title="Filters"
        subheader="Scope dashboard metrics by department, application, environment, and period"
        action={
          hasRefinement ? (
            <Button size="small" onClick={clearFilters} sx={{ textTransform: "none" }}>
              Clear
            </Button>
          ) : undefined
        }
      >
        {fields}
        {chips}
      </MaterioCard>
    );
  }

  return (
    <MaterioCard className={cn(className)} sx={{ "& .MuiCardContent-root": { py: 2, "&:last-child": { pb: 2 } } }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 1, mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "text.secondary" }}>
          <Filter size={16} />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>Filter by</Typography>
        </Box>
        {hasRefinement && (
          <Button size="small" onClick={clearFilters} sx={{ textTransform: "none", minWidth: 0 }}>
            Clear filters
          </Button>
        )}
      </Box>
      {fields}
      {chips}
    </MaterioCard>
  );
}
