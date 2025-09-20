import type { Metadata } from "next";
import "./globals.css";
import TypekitLoader from "@/utils/TypekitLoader";
import { UserPositionProvider } from "@/context/UserPositionContext";
import { StarDataProvider } from "@/context/StarDataContext";

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
      <body className="antialiased">
        <UserPositionProvider>
          <StarDataProvider>
            <TypekitLoader />
            <body className={`antialiased`}>{children}</body>
          </StarDataProvider>
        </UserPositionProvider>
      </body>
    </html>
  );
}
