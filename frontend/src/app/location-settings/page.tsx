import Headline from "@/components/Headline";
import LocationSetting from "@/features/LocationSetting/LocationSetting";

export default function LocationSettingPage() {
  return (
    <>
      <div className="w-dvw h-dvh flex justify-center">
        <div className="w-17/20">
          <Headline
            title="観測地点設定方法選択"
            description="観測値を設定するための方法を選んでください"
            className="mt-10 lg:mt-30 mb-10 lg:mb-20"
          />
          <LocationSetting />
        </div>
      </div>
    </>
  );
}
