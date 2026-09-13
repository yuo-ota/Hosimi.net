import Image from "next/image";

type IconButtonProps = {
  icon: SvgIconData;
  isActive: boolean;
  clickHandle?: () => void;
  className?: string;
  // 現在の状態を示す強調表示(星座線ボタンのON/OFFなど)。isActiveとは別で、
  // isActiveはボタンとして押せるかどうかを表す
  highlighted?: boolean;
  // highlighted な状態がさらに複数ある場合の目印(星座名も表示中、など)
  badge?: boolean;
};

const IconButton = ({
  icon,
  isActive,
  clickHandle = () => {},
  className = "",
  highlighted = false,
  badge = false,
}: IconButtonProps) => {
  const bgClass = highlighted ? "bg-accent" : "bg-foreground";

  return (
    <>
      {isActive ? (
        <button
          onClick={clickHandle}
          className={`${className} relative flex justify-center items-center aspect-square w-full rounded-full ${bgClass}`}
        >
          <Image src={icon.path} alt={icon.alt} width={30} height={30} className="h-2/3" />
          {badge && (
            <span className="absolute top-0 right-0 w-1/4 aspect-square rounded-full bg-attention" />
          )}
        </button>
      ) : (
        <div
          className={`${className} relative flex justify-center items-center aspect-square w-full rounded-full ${bgClass}`}
        >
          <Image src={icon.path} alt={icon.alt} width={30} height={30} className="h-3/4" />
          {badge && (
            <span className="absolute top-0 right-0 w-1/4 aspect-square rounded-full bg-attention" />
          )}
        </div>
      )}
    </>
  );
};

export default IconButton;
