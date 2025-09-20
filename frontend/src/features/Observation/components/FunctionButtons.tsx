import IconButton from "./IconButton";
import VmagSettingSlider from "./VmagSettingSlider";

type ButtonProps = {
  icon: SvgIconData;
  clickHandle: () => void;
};

type FunctionButtonsProps = {
  icons: ButtonProps[];
};

const FunctionButtons = ({
  icons,
}: FunctionButtonsProps) => {
  return (
    <>
      <div className="absolute flex flex-col py-5 gap-y-3 h-full ml-5 w-9">
        {icons.map((elem, index) => (
          <IconButton
            key={index}
            icon={elem.icon}
            clickHandle={elem.clickHandle}
            isActive={true}
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
