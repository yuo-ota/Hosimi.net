import React from "react";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import DualButton from "@/components/DualButton";

const meta: Meta<typeof DualButton> = {
  title: "Components/DualButton",
  component: DualButton,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof DualButton>;

export const Default: Story = {
  args: {
    buttons: [
      {
        isPriority: true,
        children: "Primary",
        handleClick: () => alert("Primary button clicked"),
        isActive: true,
        className: "px-4 py-2",
      },
      {
        isPriority: false,
        children: "Secondary",
        handleClick: () => alert("Secondary button clicked"),
        isActive: true,
        className: "px-4 py-2",
      },
    ],
    className: "flex gap-2",
  },
};

export const WithCustomStyle: Story = {
  args: {
    buttons: [
      {
        isPriority: true,
        children: (
          <>
            <span className="text-base">地点設定方法選択画面へ</span>
            <span className="text-base md:text-2xl">戻る</span>
          </>
        ),
        handleClick: () => console.log("戻るボタン"),
        isActive: true,
        className: "w-2/5 px-4 py-2",
      },
      {
        isPriority: false,
        children: "確認",
        handleClick: () => console.log("確認ボタン"),
        isActive: true,
        className: "w-2/5 px-4 py-2 text-base md:text-2xl",
      },
    ],
    className: "flex w-[800px] justify-between h-[45px] md:h-[77px]",
  },
};
