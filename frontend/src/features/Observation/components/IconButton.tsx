import Image from "next/image";

type IconButtonProps = {
  icon: SvgIconData;
  isActive: boolean;
  clickHandle?: () => void;
  className?: string;
};

const IconButton = ({
  icon,
  isActive,
  clickHandle = () => {},
  className = "",
}: IconButtonProps) => {
  return (
    <>
      {isActive ? (
        <button
          onClick={clickHandle}
          className={`${className} flex justify-center items-center aspect-square w-full rounded-full bg-foreground`}
        >
          <Image src={icon.path} alt={icon.alt} width={30} height={30} className="h-2/3" />
        </button>
      ) : (
        <div
          className={`${className} flex justify-center items-center aspect-square w-full rounded-full bg-foreground`}
        >
          <Image src={icon.path} alt={icon.alt} width={30} height={30} className="h-3/4" />
        </div>
      )}
    </>
  );
};

export default IconButton;
