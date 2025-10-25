import Headline from "@/components/Headline";
import LocationSettingByManual from "@/features/LocationSettingByManual/LocationSettingByManual";

export default function LocationSettingByManualPage() {
  return (
    <>
      <div className="w-dvw h-dvh flex justify-center bg-gradient-to-t from-[var(--evening-col)] to-[var(--midnight-col)]">
        <div className="flex flex-col w-17/20">
          <Headline
            preferSmall={false}
            title="観測地点設定"
            description="検索欄から任意の地点を<br>入力して下さい。"
            className="mt-10 lg:mt-30 mb-10 lg:mb-20"
          />
          <LocationSettingByManual />
        </div>
      </div>
    </>
  );
}
