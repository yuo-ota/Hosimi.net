import type { Meta, StoryObj } from "@storybook/react-webpack5";
import Headline from "@/components/Headline";

const meta: Meta<typeof Headline> = {
  title: "Components/Headline",
  component: Headline,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof Headline>;

export const Default: Story = {
  args: {
    title: "セクションタイトル",
    description: "このセクションの説明がここに入ります。",
  },
};
