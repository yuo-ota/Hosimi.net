import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "観測",
};

export default function ObservationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
