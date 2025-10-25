import Headline from "@/components/Headline";
import LocationSetting from "@/features/LocationSetting/LocationSetting";

export default function LocationSettingPage() {
  return (
    <>
      <div className="w-dvw h-dvh flex justify-center bg-gradient-to-t from-[var(--sunset-col)] via-[var(--sunset-evening-mid-col)] to-[var(--evening-col)]">
        <div className="w-17/20">
          <Headline
            preferSmall={false}
            title="観測地点設定"
            description="観測地を設定するため、<br>方法を選んでください。"
            className="mt-10 lg:mt-30 mb-10 lg:mb-20"
          />
          <LocationSetting />
        </div>
      </div>
    </>
  );
}
