import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import VmagSettingSlider from "@/features/Observation/components/VmagSettingSlider";
import { StarDataProvider } from "@/context/StarDataContext";

const meta: Meta<typeof VmagSettingSlider> = {
  title: "Components/VmagSettingSlider",
  component: VmagSettingSlider,
  parameters: {
    layout: "centered", // ダイアログを中央に表示
  },
  // useStarData を呼ぶため Provider が要る。
  // Storybook では星データの取得は失敗するが、Provider 側で握り潰されるため表示は成立する。
  decorators: [
    (Story) => (
      <StarDataProvider>
        <Story />
      </StarDataProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof VmagSettingSlider>;

export const Default: Story = {
  args: {
    className: "w-full h-[500px]"
  }
};
