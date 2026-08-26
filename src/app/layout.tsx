import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mystify Observatory",
  description: "A portfolio operating system for exploring engineering work.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
