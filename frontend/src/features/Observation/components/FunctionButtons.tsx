import IconButton from "./IconButton";
import VmagSettingSlider from "./VmagSettingSlider";

type ButtonProps = {
  icon: SvgIconData;
  clickHandle: () => void;
  highlighted?: boolean;
  badge?: boolean;
};

type FunctionButtonsProps = {
  icons: ButtonProps[];
};

const FunctionButtons = ({
  icons,
}: FunctionButtonsProps) => {
  return (
    <>
      <div className="absolute flex flex-col py-5 gap-y-3 h-full ml-5 w-12 lg:w-9">
        {icons.map((elem, index) => (
          <IconButton
            key={index}
            icon={elem.icon}
            clickHandle={elem.clickHandle}
            isActive={true}
            highlighted={elem.highlighted}
            badge={elem.badge}
            className="flex-none"
          />
        ))}
        <VmagSettingSlider
          className="w-full flex-1"
        />
      </div>
    </>
  );
};

export default FunctionButtons;
