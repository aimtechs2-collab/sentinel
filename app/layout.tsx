import type { Metadata } from "next";
import { Outfit, Public_Sans } from "next/font/google";
import { NavigationProgressProvider } from "@/components/layout/NavigationProgress";
import { MuiThemeProvider } from "@/components/providers/MuiThemeProvider";
import "./globals.css";

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  weight: ["300", "400", "500", "600", "700"],
});

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Sentinel — Release Command Center",
  description: "AI-powered release command center for software engineering teams",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${publicSans.variable} ${outfit.variable} font-sans antialiased`}>
        <MuiThemeProvider>
          <NavigationProgressProvider>{children}</NavigationProgressProvider>
        </MuiThemeProvider>
      </body>
    </html>
  );
}
