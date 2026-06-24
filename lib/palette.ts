/**
 * Materio-inspired design tokens (CRM light theme).
 * Primary #9155FD · background #F4F5FA · text #2E263D
 * Tailwind and globals.css mirror these values.
 */

export const palette = {
  brand: {
    25: "#faf8ff",
    50: "#f3efff",
    100: "#e9e1ff",
    200: "#d4c4fe",
    300: "#b794fd",
    400: "#9e69fd",
    500: "#9155fd",
    600: "#804bdf",
    700: "#6f42c1",
    800: "#5c3799",
    900: "#4a2d7a",
    950: "#2e1a52",
  },
  accent: {
    50: "#f3efff",
    100: "#e9e1ff",
    200: "#d4c4fe",
    300: "#b794fd",
    400: "#9e69fd",
    500: "#9155fd",
    600: "#804bdf",
    700: "#6f42c1",
    800: "#5c3799",
    900: "#4a2d7a",
  },
  gray: {
    25: "#fcfcfd",
    50: "#f4f5fa",
    100: "#eeedf0",
    200: "#eaeaf4",
    300: "#d5d4e8",
    400: "#a5a3ae",
    500: "#8a8d93",
    600: "#6d6b77",
    700: "#4a4556",
    800: "#3a3541",
    900: "#2e263d",
    950: "#1e1a27",
  },
  success: {
    50: "#e8faf0",
    100: "#d4f4e2",
    500: "#56ca00",
    600: "#4db600",
    700: "#3d9100",
  },
  warning: {
    50: "#fff7e8",
    100: "#ffecd1",
    500: "#ffb400",
    600: "#e6a200",
    700: "#cc9000",
  },
  error: {
    50: "#ffeef0",
    100: "#ffd5da",
    500: "#ff4c51",
    600: "#e64449",
    700: "#cc3d41",
  },
  surface: "#f4f5fa",
  border: "#eaeaf4",
  sidebar: "#ffffff",
  foreground: "#2e263d",
  ai: "#9155fd",
} as const;

export type ReadinessTier = "high" | "medium" | "low";

export const readinessTokens: Record<
  ReadinessTier,
  { color: string; ring: string; bg: string; text: string; label: string }
> = {
  high: {
    color: palette.success[500],
    ring: "ring-success-500/30",
    bg: "bg-success-50",
    text: "text-success-700",
    label: "Ready",
  },
  medium: {
    color: palette.warning[500],
    ring: "ring-warning-500/30",
    bg: "bg-warning-50",
    text: "text-warning-700",
    label: "At risk",
  },
  low: {
    color: palette.error[500],
    ring: "ring-error-500/30",
    bg: "bg-error-50",
    text: "text-error-700",
    label: "Not ready",
  },
};

export function readinessTier(value: number): ReadinessTier {
  if (value >= 80) return "high";
  if (value >= 50) return "medium";
  return "low";
}

export function readinessColor(value: number): string {
  return readinessTokens[readinessTier(value)].color;
}

export const sourceTokens = {
  database: {
    bg: "bg-brand-50",
    text: "text-brand-600",
    border: "border-brand-200",
  },
  demo: {
    bg: "bg-accent-100",
    text: "text-accent-700",
    border: "border-accent-200",
  },
} as const;

export const statusTokens: Record<string, { bg: string; text: string }> = {
  Approved: { bg: "bg-success-50", text: "text-success-600" },
  Passed: { bg: "bg-success-50", text: "text-success-600" },
  Ready: { bg: "bg-success-50", text: "text-success-600" },
  Connected: { bg: "bg-success-50", text: "text-success-600" },
  Shipped: { bg: "bg-success-50", text: "text-success-600" },
  Go: { bg: "bg-success-50", text: "text-success-600" },
  Active: { bg: "bg-success-50", text: "text-success-600" },
  Verified: { bg: "bg-success-50", text: "text-success-600" },
  Pending: { bg: "bg-warning-50", text: "text-warning-600" },
  Running: { bg: "bg-warning-50", text: "text-warning-600" },
  "At Risk": { bg: "bg-warning-50", text: "text-warning-600" },
  Verifying: { bg: "bg-warning-50", text: "text-warning-600" },
  Scheduled: { bg: "bg-brand-50", text: "text-brand-600" },
  Planned: { bg: "bg-brand-50", text: "text-brand-600" },
  "In Progress": { bg: "bg-brand-50", text: "text-brand-600" },
  Deferred: { bg: "bg-gray-100", text: "text-gray-600" },
  Rejected: { bg: "bg-error-50", text: "text-error-600" },
  Failed: { bg: "bg-error-50", text: "text-error-600" },
  Blocked: { bg: "bg-error-50", text: "text-error-600" },
  "No-Go": { bg: "bg-error-50", text: "text-error-600" },
  Error: { bg: "bg-error-50", text: "text-error-600" },
  "Rolled Back": { bg: "bg-error-50", text: "text-error-600" },
  Disconnected: { bg: "bg-gray-100", text: "text-gray-600" },
  Paused: { bg: "bg-gray-100", text: "text-gray-600" },
  "Not Started": { bg: "bg-gray-100", text: "text-gray-600" },
  Complete: { bg: "bg-success-50", text: "text-success-600" },
  "N/A": { bg: "bg-gray-100", text: "text-gray-600" },
};

/** Chart / knowledge-graph node colors */
export const chartColors = {
  person: palette.success[500],
  release: palette.brand[500],
  service: "#16b1ff",
  ticket: palette.warning[500],
  change: palette.accent[500],
  incident: palette.error[500],
} as const;
