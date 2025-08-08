import { ReactNode } from "react";

type LocationSettingButtonProps = {
  icon: SvgIconData;
  buttonTitle: string;
  buttonDescription: ReactNode;
  handleClick: () => void;
  className?: string;
};

const LocationSettingButton = ({
  icon,
  buttonTitle,
  buttonDescription,
  handleClick,
  className = "",
}: LocationSettingButtonProps) => {
  return (
    <>
      <button
        className={`${className} flex flex-col items-center justify-center gap-y-10 bg-foreground/30 backdrop-blur-lg
    rounded-md border border-foreground/30 shadow-lg`}
        onClick={handleClick}
      >
        <div className="w-full h-2/5 flex justify-center items-center">
          <img
            src={`${icon.path}`}
            alt={`${icon.alt}`}
            className="h-full w-auto"
          />
        </div>
        <div className="flex flex-col items-center justify-around gap-y-1">
          <span className="font-title text-xl lg:text-4xl">{buttonTitle}</span>
          {buttonDescription}
        </div>
      </button>
    </>
  );
};

export default LocationSettingButton;
