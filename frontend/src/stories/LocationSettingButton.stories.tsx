import type { Meta, StoryObj } from "@storybook/react";
import LocationSettingButton from "@/components/LocationSettingButton";
import ExampleIcon from "@/stories/assets/github.svg";

const meta: Meta<typeof LocationSettingButton> = {
  title: "Components/LocationSettingButton",
  component: LocationSettingButton,
  tags: ["autodocs"],
  argTypes: {
    handleClick: { action: "clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof LocationSettingButton>;

const mockIcon: SvgIconData = {
  path: ExampleIcon.src,
  alt: "Location Icon",
};

export const Default: Story = {
  args: {
    icon: mockIcon,
    buttonTitle: "位置情報の設定",
    buttonDescription: "あああああ",
    handleClick: () => {},
    className: "w-[700px] h-[500px]",
  },
};

export const LargeButton: Story = {
  args: {
    ...Default.args,
    className: "w-[700px] h-[500px]",
    buttonTitle: "大きいボタン",
  },
};

export const WithLongDescription: Story = {
  args: {
    ...Default.args,
    buttonDescription: (
      <div className="text-left">
        GPS情報をもとに自動的に設定します。
        <br />
        GPSを許可する必要があります。
      </div>
    ),
  },
};
