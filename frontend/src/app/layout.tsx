import type { Metadata } from "next";
import "./globals.css";
import TypekitLoader from "@/utils/TypekitLoader";

export const metadata: Metadata = {
  title: "Astronom",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="jp">
      <TypekitLoader />
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
