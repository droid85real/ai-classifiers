import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Auto Category & Tag Generator",
  description:
    "Automatically classify products and generate SEO metadata using AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
