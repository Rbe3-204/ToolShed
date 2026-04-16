import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "ToolShed — Free Developer Utilities",
  description:
    "Free, open-source developer utilities. 100% client-side — nothing leaves your browser.",
  metadataBase: new URL("https://toolshed-pi.vercel.app"),
  openGraph: {
    title: "ToolShed — Free Developer Utilities",
    description:
      "Free, open-source developer utilities. 100% client-side — nothing leaves your browser.",
    type: "website",
    siteName: "ToolShed",
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolShed — Free Developer Utilities",
    description:
      "Free, open-source developer utilities. 100% client-side — nothing leaves your browser.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2586936095307690"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-950 text-gray-100 min-h-screen flex flex-col font-[family-name:var(--font-geist-sans)]`}
      >
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
