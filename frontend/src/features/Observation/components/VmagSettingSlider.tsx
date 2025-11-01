"use client";

import { useRef, useState } from "react";
import IconButton from "./IconButton";
import StarIcon from "../assets/star.svg";
import StartShineIcon from "../assets/star_shine.svg";
import TriangleIcon from "../assets/triangle.svg";
import { useStarData } from "@/context/StarDataContext";
import Image from "next/image";

type VmagSettingSliderProps = {
  className?: string;
};

const VmagSettingSlider = ({
  className,
}: VmagSettingSliderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [bottomSliderValue, setBottomSliderValue] = useState<number>(-1);
  const [topSliderValue, setTopSliderValue] = useState<number>(3);
  const [bottomThumbDragging, setBottomThumbDragging] =
    useState<boolean>(false);
  const [topThumbDragging, setTopThumbDragging] = useState<boolean>(false);
  const { setVMagRanges } = useStarData();

  const min = -1;
  const max = 5;

  const changedBottomSliderValue = (n: number) => {
    if (n < topSliderValue) {
      setBottomSliderValue(n);
    } else {
      setTopSliderValue(n);
      setBottomSliderValue(n);
    }

    setVMagRanges({ min: bottomSliderValue, max: topSliderValue });
  };
  const changedTopSliderValue = (n: number) => {
    if (n > bottomSliderValue) {
      setTopSliderValue(n);
    } else {
      setBottomSliderValue(n);
      setTopSliderValue(n);
    }

    setVMagRanges({ min: bottomSliderValue, max: topSliderValue });
  };

  const getGradient = (
    bottomValue: number,
    topValue: number,
    isBottom: boolean
  ) => {
    const value = isBottom ? bottomValue : topValue;
    const ratio = ((value - min) / (max - min)) * 100;
    if (bottomValue < topValue) {
      isBottom = !isBottom;
    }

    const color = isBottom ? "var(--accent-color)" : "var(--base-color)";
    const rightColor = isBottom ? "var(--base-color)" : "rgba(0, 0, 0, 0)";
    return `linear-gradient(180deg, ${color} ${ratio}%, ${rightColor} ${ratio}%)`;
  };

  const getZIndex = (
    bottomValue: number,
    topValue: number,
    isBottom: boolean
  ) => {
    if (bottomValue < topValue) {
      isBottom = !isBottom;
    }

    const zIndex = isBottom ? 10 : 20;
    return zIndex;
  };

  return (
    <>
      <div
        className={`${className} bg-foreground rounded-full flex flex-col justify-between items-center touch-pan-x`}
      >
        <IconButton
          icon={{ path: StarIcon.src, alt: "低等級アイコン" }}
          isActive={false}
          className="flex-none"
        />
        <div
          ref={containerRef}
          className="relative aspect-square flex-1 pointer-events-none"
        >
          <input
            type="range"
            min={min}
            max={max}
            step={0.1}
            className="absolute left-[calc(50%-2.5px)] w-[5px] lg:w-[3px] h-full appearance-none cursor-pointer rounded-full
								[&::-webkit-slider-thumb]:appearance-none
								[&::-webkit-slider-thumb]:h-6
								[&::-webkit-slider-thumb]:w-6
								lg:[&::-webkit-slider-thumb]:w-7
								lg:[&::-webkit-slider-thumb]:h-2.5
								[&::-webkit-slider-thumb]:rounded-full
								[&::-webkit-slider-thumb]:bg-foreground
								[&::-webkit-slider-thumb]:border-3
								lg:[&::-webkit-slider-thumb]:border-3
								[&::-webkit-slider-thumb]:border-base-color
								[&::-webkit-slider-thumb]:pointer-events-auto

								[&::-moz-range-thumb]:h-6
								[&::-moz-range-thumb]:w-6
								lg:[&::-moz-range-thumb]:w-7
								lg:[&::-moz-range-thumb]:h-2.5
								[&::-moz-range-thumb]:rounded-full
								[&::-moz-range-thumb]:bg-foreground
								[&::-moz-range-thumb]:border-3
								lg:[&::-moz-range-thumb]:border-3
								[&::-moz-range-thumb]:border-base-color
								[&::-moz-range-thumb]:pointer-events-auto"
            onChange={(e) =>
              changedBottomSliderValue(parseFloat(e.target.value))
            }
            onMouseDown={() => setBottomThumbDragging(true)}
            onMouseUp={() => setBottomThumbDragging(false)}
            onTouchStart={() => setBottomThumbDragging(true)}
            onTouchEnd={() => setBottomThumbDragging(false)}
            onPointerDown={() => setBottomThumbDragging(true)}
            onPointerUp={() => setBottomThumbDragging(false)}
            value={bottomSliderValue}
            style={{
              background: getGradient(bottomSliderValue, topSliderValue, true),
              zIndex: getZIndex(bottomSliderValue, topSliderValue, true),
              writingMode: "vertical-lr",
            }}
          />
          <input
            type="range"
            min={min}
            max={max}
            step={0.1}
            className="absolute left-[calc(50%-2.5px)] w-[5px] lg:w-[3px] h-full appearance-none cursor-pointer rounded-full
								[&::-webkit-slider-thumb]:appearance-none
								[&::-webkit-slider-thumb]:h-6
								[&::-webkit-slider-thumb]:w-6
								lg:[&::-webkit-slider-thumb]:w-7
								lg:[&::-webkit-slider-thumb]:h-2.5
								[&::-webkit-slider-thumb]:rounded-full
								[&::-webkit-slider-thumb]:bg-foreground
								[&::-webkit-slider-thumb]:border-3
								lg:[&::-webkit-slider-thumb]:border-3
								[&::-webkit-slider-thumb]:border-base-color
								[&::-webkit-slider-thumb]:pointer-events-auto

								[&::-moz-range-thumb]:h-6
								[&::-moz-range-thumb]:w-6
								lg:[&::-moz-range-thumb]:w-7
								lg:[&::-moz-range-thumb]:h-2.5
								[&::-moz-range-thumb]:rounded-full
								[&::-moz-range-thumb]:bg-foreground
								[&::-moz-range-thumb]:border-3
								lg:[&::-moz-range-thumb]:border-3
								[&::-moz-range-thumb]:border-base-color
								[&::-moz-range-thumb]:pointer-events-auto"
            onChange={(e) => changedTopSliderValue(parseFloat(e.target.value))}
            onMouseDown={() => setTopThumbDragging(true)}
            onMouseUp={() => setTopThumbDragging(false)}
            onTouchStart={() => setTopThumbDragging(true)}
            onTouchEnd={() => setTopThumbDragging(false)}
            onPointerDown={() => setTopThumbDragging(true)}
            onPointerUp={() => setTopThumbDragging(false)}
            value={topSliderValue}
            style={{
              background: getGradient(bottomSliderValue, topSliderValue, false),
              zIndex: getZIndex(bottomSliderValue, topSliderValue, false),
              writingMode: "vertical-lr",
            }}
          />
          <div className="relative w-full h-[calc(100%-6px)] mt-[3px] lg:h-[calc(100%-10px)] lg:mt-[5px]">
            {bottomThumbDragging && (
              <div
                className="flex justify-center items-center absolute left-1/2 h-[40px] w-auto bg-foreground rounded-lg ml-9"
                style={{
                  top: `calc(${
                    ((bottomSliderValue - min) / (max - min)) * 100
                  }% - 20px)`,
                }}
              >
                <span className="text-[var(--base-color)] text-sm mx-2 font-num">
                  {bottomSliderValue}
                </span>
                <Image
                  src={TriangleIcon.src}
                  alt="先端要素"
                  width={24}
                  height={24}
                  className="absolute transform origin-top-right left-0 -translate-x-3/4"
                />
              </div>
            )}
            {topThumbDragging && (
              <div
                className="flex justify-center items-center absolute left-1/2 h-[40px] w-auto bg-foreground rounded-lg ml-9"
                style={{
                  top: `calc(${
                    ((topSliderValue - min) / (max - min)) * 100
                  }% - 20px)`,
                }}
              >
                <span className="text-[var(--base-color)] text-sm mx-2 font-num">
                  {topSliderValue}
                </span>
                <Image
                  src={TriangleIcon.src}
                  alt="先端要素"
                  width={24}
                  height={24}
                  className="absolute transform origin-top-right left-0 -translate-x-3/4"
                />
              </div>
            )}
          </div>
        </div>
        <IconButton
          icon={{ path: StartShineIcon.src, alt: "高等級アイコン" }}
          isActive={false}
          className="flex-none"
        />
      </div>
    </>
  );
};

export default VmagSettingSlider;
