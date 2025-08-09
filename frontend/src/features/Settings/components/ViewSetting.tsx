import SettingSlider from "./SettingSlider";

const ViewSetting = () => {
  return (
    <>
      <div className="flex gap-5 w-full mt-5 flex-col lg:flex-row">
        <div className="lg:max-w-[600px] lg:flex-1 h-[100px] bg-background border-1 border-foreground rounded-lg"></div>
        <SettingSlider
          sliders={[
            {
              name: "コントラスト",
              min: 0,
              max: 1,
              step: 0.1,
              valueHandle: (value) => console.log(value),
            },
            {
              name: "星サイズ",
              min: 1,
              max: 5,
              step: 0.5,
              valueHandle: (value) => console.log(value),
            },
          ]}
        />
      </div>
    </>
  );
};

export default ViewSetting;
