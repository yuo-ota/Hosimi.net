import type { Meta, StoryObj } from "@storybook/react";
import LocationInput from "@/features/LocationSettingByManual/components/LocationInput";

const meta: Meta<typeof LocationInput> = {
  title: "Components/LocationInput",
  component: LocationInput,
  tags: ["autodocs"],
  args: {
    className: "",
  },
};

export default meta;
type Story = StoryObj<typeof LocationInput>;

export const Default: Story = {
  args: {
    className: "max-w-md", // デフォルト表示用に横幅を制限
  },
};

export const WithCustomWidth: Story = {
  args: {
    className: "w-96", // カスタム幅
  },
};

export const FullWidth: Story = {
  args: {
    className: "w-[500px]", // 画面幅いっぱい
  },
};
