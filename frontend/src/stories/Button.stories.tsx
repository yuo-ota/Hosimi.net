import type { Meta, StoryObj } from "@storybook/react";
import Button from "@/components/Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    isPriority: { control: "boolean" },
    className: { control: "text" },
    handleClick: { action: "clicked" },
    children: { control: "text" },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    isPriority: false,
    children: "Default Button",
    className: "",
  },
};

export const Priority: Story = {
  args: {
    isPriority: true,
    children: "Priority Button",
    className: "",
  },
};

export const CustomStyled: Story = {
  args: {
    isPriority: false,
    children: "Custom Class",
    className: "px-6 py-2 text-lg",
  },
};
