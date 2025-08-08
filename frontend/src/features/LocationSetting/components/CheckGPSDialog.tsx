"use client";

import DualButton from "@/components/DualButton";
import Headline from "@/components/Headline";
import CloseIcon from "@/features/LocationSetting/assets/close.svg";

const CheckGPSDialog = () => {
  return (
    <>
      <div
        className="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-[80dvh] p-5 flex flex-col items-start absolute z-20 bg-foreground/30 backdrop-blur-lg
    rounded-md border border-foreground/30 shadow-lg"
      >
        <div className="w-full flex justify-between items-start justify-items-end">
          <Headline
            preferSmall={true}
            title="観測地点確認"
            description="指定された地点はこちらで間違いありませんか？"
            className="mb-5 lg:mb-10"
          />
          <img
            src={`${CloseIcon.src}`}
            alt="閉じるボタン"
            className="aspect-square h-full max-h-[60px]"
          />
        </div>
        <div className="flex-1 w-full bg-red-200 mb-5 lg:mb-10"></div>
        <div className="flex mt-auto w-full">
          <DualButton
            buttons={[
              {
                isPriority: true,
                children: (
                  <>
                    <span className="text-base md:text-xl">
                      手動設定に切り替える
                    </span>
                  </>
                ),
                handleClick: () => console.log("戻るボタン"),
                className: "flex-1 w-full lg:px-4 py-2",
              },
              {
                isPriority: false,
                children: "確認",
                handleClick: () => console.log("確認ボタン"),
                className: "flex-1 w-full lg:px-4 py-2 text-base md:text-xl",
              },
            ]}
            className="flex w-full justify-between items-center gap-x-5 gap-y-3 flex-col lg:flex-row"
          />
        </div>
      </div>
    </>
  );
};

export default CheckGPSDialog;
