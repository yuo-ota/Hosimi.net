import Headline from "@/components/Headline";
import LocationSettingByManual from "@/features/LocationSettingByManual.tsx/LocationSettingByManual";

export default function LocationSettingByManualPage() {
  return (
    <>
      <div className="w-dvw h-dvh flex justify-center">
        <div className="flex flex-col w-17/20">
          <Headline
            preferSmall={false}
            title="観測地点手動設定"
            description="観測地点を下部の入力欄から検索してください。"
            className="mt-10 lg:mt-30 mb-10 lg:mb-20"
          />
          <LocationSettingByManual />
        </div>
      </div>
    </>
  );
}
