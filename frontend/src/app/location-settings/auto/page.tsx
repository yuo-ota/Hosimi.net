import Headline from "@/components/Headline";
import { Suspense, lazy } from "react";
import type { Metadata } from "next";

const LocationSettingByAuto = lazy(() => import("@/features/LocationSettingByAuto/LocationSettingByAuto"));

export const metadata: Metadata = {
  title: "観測地点確認",
};

export default function LocationSettingByAutoPage() {
  return (
    <>
      <div className="w-dvw min-h-dvh flex justify-center bg-gradient-to-t from-[var(--evening-col)] to-[var(--midnight-col)]">
        <div className="flex flex-col w-17/20 items-center">
          <Headline
            preferSmall={false}
            title="観測地点確認"
            description="GPSの値に誤りがないか<br>確認して下さい。"
            className="mt-10 lg:mt-30 mb-10 lg:mb-20"
          />
          <Suspense fallback={<div className="text-foreground">読み込み中...</div>}>
            <LocationSettingByAuto />
          </Suspense>
        </div>
      </div>
    </>
  );
}
