import { ReactNode } from "react";

type LocationSettingButtonProps = {
  children: ReactNode;
  isBorderPutX: boolean;
  className?: string;
};

const LocationSettingElement = ({
  children,
  isBorderPutX = true,
  className = "",
}: LocationSettingButtonProps) => {
  return (
    <>
      <div
        className={`${className} corner-dots flex items-center justify-center p-4 lg:p-8 bg-foreground/30 backdrop-blur-lg
    ${isBorderPutX ? "border-l border-r" : "border-t border-b"} border-foreground shadow-lg overflow-visible`}
      >
        {children}
      </div>
    </>
  );
};

export default LocationSettingElement;
