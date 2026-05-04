import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeHtml } from "@/components/ThemeHtml";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const defaultSite = "http://localhost:3000";

function metadataBaseUrl(): URL {
  let raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : defaultSite);
  if (!/^https?:\/\//i.test(raw)) {
    raw = `https://${raw}`;
  }
  try {
    return new URL(raw);
  } catch {
    return new URL(defaultSite);
  }
}

const description =
  "Search any city for current conditions, hourly outlook, and a 7-day forecast with a live weather-driven background. Powered by OpenWeatherMap.";

export const metadata: Metadata = {
  metadataBase: metadataBaseUrl(),
  title: {
    default: "Weather App",
    template: "%s · Weather App",
  },
  description,
  keywords: [
    "weather",
    "forecast",
    "hourly weather",
    "7-day forecast",
    "OpenWeatherMap",
  ],
  openGraph: {
    title: "Weather App",
    description,
    type: "website",
    locale: "en_US",
    siteName: "Weather App",
  },
  twitter: {
    card: "summary_large_image",
    title: "Weather App",
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans transition-[background-color,color] duration-300">
        <ThemeHtml />
        {children}
      </body>
    </html>
  );
}
