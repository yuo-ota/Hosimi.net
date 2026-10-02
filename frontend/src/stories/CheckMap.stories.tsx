import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import CheckMap from "@/features/LocationSettingByAuto/components/CheckMap";

const meta: Meta<typeof CheckMap> = {
  title: "Components/CheckMap",
  component: CheckMap,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  // 実際の画面と同じく暗い背景の上に表示する(白背景だと白文字が見えないため)
  decorators: [
    (Story) => (
      <div className="min-h-screen" style={{ backgroundColor: "#00163b" }}>
        <Story />
      </div>
    ),
  ],
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

// GPS取得中の表示を確認するためのストーリー。
// getCurrentPosition をコールバックを呼ばない実装に差し替えることで、
// 取得中の状態を維持したまま表示できるようにしている。
export const Loading: Story = {
  args: {
    ...Default.args,
  },
  decorators: [
    (Story) => {
      if (typeof navigator !== "undefined" && "geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition = () => {};
      }
      return <Story />;
    },
  ],
};
