import type { Meta, StoryObj } from "@storybook/react-webpack5";
import CheckMap from "@/features/LocationSettingByAuto/components/CheckMap";

const meta: Meta<typeof CheckMap> = {
  title: "Components/CheckMap",
  component: CheckMap,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CheckMap>;

export const Default: Story = {
  args: {
    handleGPSChenge: () => {
      console.log("GPS manually changed.");
      return [35.681236, 139.767125]; // 東京駅などのダミー緯度経度
    },
    className: "w-full h-screen",
  },
};
