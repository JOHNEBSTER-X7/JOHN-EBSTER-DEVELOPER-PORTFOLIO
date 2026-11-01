import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Northstar CRM | Sales Workspace",
  description: "A portfolio CRM application for managing contacts and sales pipelines.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
