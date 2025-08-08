import type { Meta, StoryObj } from "@storybook/react";
import CheckGPSDialog from "@/features/LocationSetting/components/CheckGPSDialog";

const meta: Meta<typeof CheckGPSDialog> = {
  title: "Components/Dialogs/CheckGPSDialog",
  component: CheckGPSDialog,
  parameters: {
    layout: "centered", // ダイアログを中央に表示
  },
};

export default meta;

type Story = StoryObj<typeof CheckGPSDialog>;

export const Default: Story = {};
