import Headline from "@/components/Headline";
import { lazy, Suspense } from "react";

const LocationSettingByManual = lazy(() => import("@/features/LocationSettingByManual/LocationSettingByManual"));

export default function LocationSettingByManualPage() {
  return (
    <>
      <div className="w-dvw min-h-dvh flex justify-center bg-gradient-to-t from-[var(--evening-col)] to-[var(--midnight-col)]">
        <div className="flex flex-col w-17/20">
          <Headline
            preferSmall={false}
            title="観測地点設定"
            description="検索欄から任意の地点を<br>入力して下さい。"
            className="mt-10 lg:mt-30 mb-10 lg:mb-20"
          />
          <Suspense fallback={<div className="text-foreground">読み込み中...</div>}>
            <LocationSettingByManual />
          </Suspense>
        </div>
      </div>
    </>
  );
}
