import Headline from "@/components/Headline";
import LocationSettingByAuto from "@/features/LocationSettingByAuto/LocationSettingByAuto";

export default function LocationSettingByAutoPage() {
  return (
    <>
      <div className="w-dvw h-dvh flex justify-center bg-gradient-to-t from-[var(--evening-col)] to-[var(--midnight-col)]">
        <div className="flex flex-col w-17/20 items-center">
          <Headline
            preferSmall={false}
            title="観測地点確認"
            description="GPSの値に誤りがないか<br>確認して下さい。"
            className="mt-10 lg:mt-30 mb-10 lg:mb-20"
          />
          <LocationSettingByAuto />
        </div>
      </div>
    </>
  );
}
