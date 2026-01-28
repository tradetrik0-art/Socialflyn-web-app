import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Socialflyn - AI-Powered Agency Platform",
  description: "Scale your social media with AI-assisted content and automation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
        {children}
      </body>
    </html>
  );
}
