import { createTheme, type Theme, type ThemeOptions } from "@mui/material/styles";
import { palette } from "@/lib/palette";

export type ThemeMode = "light" | "dark" | "semi-dark";

const materioPrimary = palette.brand[500];
const materioSuccess = palette.success[500];
const materioWarning = palette.warning[500];
const materioError = palette.error[500];
const materioInfo = "#16b1ff";

const sharedTypography: ThemeOptions["typography"] = {
  fontFamily: "var(--font-public-sans), system-ui, sans-serif",
  h4: { fontWeight: 600, fontSize: "1.5rem", lineHeight: 1.375 },
  h5: { fontWeight: 600, fontSize: "1.125rem", lineHeight: 1.5556 },
  h6: { fontWeight: 600, fontSize: "0.9375rem", lineHeight: 1.4667 },
  body1: { fontSize: "0.9375rem", lineHeight: 1.4667 },
  body2: { fontSize: "0.8125rem", lineHeight: 1.5385 },
  caption: { fontSize: "0.75rem", lineHeight: 1.5 },
};

const sharedShape: ThemeOptions["shape"] = { borderRadius: 8 };

function lightPalette(): ThemeOptions["palette"] {
  return {
    mode: "light",
    primary: { main: materioPrimary, light: palette.brand[400], dark: palette.brand[600], contrastText: "#fff" },
    secondary: { main: "#8a8d93", light: "#a5a3ae", dark: "#6d6b77", contrastText: "#fff" },
    success: { main: materioSuccess, light: palette.success[50], dark: palette.success[700], contrastText: "#fff" },
    warning: { main: materioWarning, light: palette.warning[50], dark: palette.warning[700], contrastText: "#fff" },
    error: { main: materioError, light: palette.error[50], dark: palette.error[700], contrastText: "#fff" },
    info: { main: materioInfo, light: "#d6f4ff", dark: "#0e8bcc", contrastText: "#fff" },
    background: { default: palette.surface, paper: "#ffffff" },
    text: { primary: palette.foreground, secondary: palette.gray[600], disabled: palette.gray[400] },
    divider: palette.border,
  };
}

function darkPalette(): ThemeOptions["palette"] {
  return {
    mode: "dark",
    primary: { main: materioPrimary, light: palette.brand[300], dark: palette.brand[700], contrastText: "#fff" },
    secondary: { main: "#a5a3ae", light: "#d5d4e8", dark: "#6d6b77", contrastText: "#fff" },
    success: { main: materioSuccess, light: "#3d9100", dark: "#56ca00", contrastText: "#fff" },
    warning: { main: materioWarning, light: "#cc9000", dark: "#ffb400", contrastText: "#fff" },
    error: { main: materioError, light: "#cc3d41", dark: "#ff4c51", contrastText: "#fff" },
    info: { main: materioInfo, light: "#0e8bcc", dark: "#16b1ff", contrastText: "#fff" },
    background: { default: "#28243d", paper: "#312d4b" },
    text: { primary: "rgba(231, 227, 252, 0.87)", secondary: "rgba(231, 227, 252, 0.6)", disabled: "rgba(231, 227, 252, 0.38)" },
    divider: "rgba(231, 227, 252, 0.12)",
  };
}

function componentOverrides(mode: ThemeMode): ThemeOptions["components"] {
  const isDark = mode === "dark";
  const paperBg = isDark ? "#312d4b" : "#ffffff";
  const shadow = isDark ? "0px 2px 10px 0px rgba(19, 17, 32, 0.4)" : "0px 2px 10px 0px rgba(46, 38, 61, 0.06)";

  return {
    MuiCssBaseline: {
      styleOverrides: {
        body: { scrollbarColor: isDark ? "#6d6b77 #312d4b" : "#d5d4e8 #f4f5fa" },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: `1px solid ${isDark ? "rgba(231, 227, 252, 0.12)" : palette.border}`,
          boxShadow: shadow,
          backgroundImage: "none",
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: { padding: "20px 24px 12px" },
        title: { fontSize: "1.125rem", fontWeight: 600 },
        subheader: { fontSize: "0.8125rem", marginTop: 2 },
      },
    },
    MuiCardContent: {
      styleOverrides: { root: { padding: "12px 24px 24px", "&:last-child": { paddingBottom: 24 } } },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          borderRadius: 8,
          "&.MuiButton-containedPrimary": { boxShadow: "0 2px 6px rgba(145, 85, 253, 0.4)" },
        },
      },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 500, borderRadius: 6 } },
    },
    MuiTableCell: {
      styleOverrides: {
        head: { fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.4px" },
        root: { borderColor: isDark ? "rgba(231, 227, 252, 0.12)" : palette.border },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none", backgroundColor: paperBg },
      },
    },
  };
}

export function createMaterioTheme(mode: ThemeMode): Theme {
  const muiMode = mode === "dark" ? "dark" : "light";
  const paletteConfig = muiMode === "dark" ? darkPalette() : lightPalette();

  return createTheme({
    palette: paletteConfig,
    typography: sharedTypography,
    shape: sharedShape,
    components: componentOverrides(mode),
  });
}
