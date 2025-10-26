import type { Meta, StoryObj } from "@storybook/react";
import VmagSettingSlider from "@/features/Observation/components/VmagSettingSlider";

const meta: Meta<typeof VmagSettingSlider> = {
  title: "Components/VmagSettingSlider",
  component: VmagSettingSlider,
  parameters: {
    layout: "centered", // ダイアログを中央に表示
  },
};

export default meta;

type Story = StoryObj<typeof VmagSettingSlider>;

export const Default: Story = {
  args: {
    className: "w-full h-[500px]"
  }
};
