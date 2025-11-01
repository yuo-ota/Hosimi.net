import React from "react";

type SliderData = {
  name: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  valueHandle: (value: number) => void;
};

type SettingSliderProps = {
  sliders: SliderData[];
  className?: string;
};

const SettingSlider = ({ sliders, className = "" }: SettingSliderProps) => {
  return (
    <>
      <div
        className={`${className} w-full grid grid-cols-[auto_1fr] gap-y-4 gap-x-5 items-center`}
      >
        <>
          {sliders.map((slider, index) => (
            <React.Fragment key={index}>
              <span
                key={index.toString() + "_propName"}
                className="text-sm lg:text-2xl"
              >
                {slider.name}
              </span>
              <input
                key={index.toString() + "_slider"}
                type="range"
                min={slider.min}
                max={slider.max}
                step={slider.step}
                defaultValue={slider.defaultValue}
                onChange={(e) => slider.valueHandle(Number(e.target.value))}
                className="h-[2px] lg:h-[3px] bg-foreground appearance-none cursor-pointer rounded-full
								[&::-webkit-slider-thumb]:appearance-none
								[&::-webkit-slider-thumb]:h-6
								[&::-webkit-slider-thumb]:w-2
								lg:[&::-webkit-slider-thumb]:h-8
								lg:[&::-webkit-slider-thumb]:w-3
								[&::-webkit-slider-thumb]:rounded-full
								[&::-webkit-slider-thumb]:bg-background
								[&::-webkit-slider-thumb]:border-2
								lg:[&::-webkit-slider-thumb]:border-4
								[&::-webkit-slider-thumb]:border-foreground

								[&::-moz-range-thumb]:h-6
								[&::-moz-range-thumb]:w-2
								lg:[&::-moz-range-thumb]:h-8
								lg:[&::-moz-range-thumb]:w-3
								[&::-moz-range-thumb]:rounded-full
								[&::-moz-range-thumb]:bg-background
								[&::-moz-range-thumb]:border-2
								lg:[&::-moz-range-thumb]:border-4
								[&::-moz-range-thumb]:border-foreground"
              />
            </React.Fragment>
          ))}
        </>
      </div>
    </>
  );
};

export default SettingSlider;
