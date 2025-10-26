import type { Metadata } from "next";
import "./globals.css";
import TypekitLoader from "@/utils/TypekitLoader";
import { UserPositionProvider } from "@/context/UserPositionContext";
import { StarDataProvider } from "@/context/StarDataContext";
import { SettingProvider } from "@/context/SettingContext";

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
      <body className="antialiased overflow-y-auto overflow-x-hidden h-dvh">
        <UserPositionProvider>
          <StarDataProvider>
            <SettingProvider>
              <TypekitLoader />
              {children}
            </SettingProvider>
          </StarDataProvider>
        </UserPositionProvider>
      </body>
    </html>
  );
}
