import { ReactNode } from "react";

type LocationSettingButtonProps = {
  children: ReactNode;
  isBorderPutX: boolean;
  className?: string;
};

const DecorateBorder = ({
  children,
  isBorderPutX = true,
  className = "",
}: LocationSettingButtonProps) => {
  return (
    <>
      <div
        className={`${className} corner-dots flex items-center justify-center bg-foreground/30 backdrop-blur-lg
    ${isBorderPutX ? "border-l border-r" : "border-t border-b"} border-foreground shadow-lg overflow-visible`}
      >
        {children}
      </div>
    </>
  );
};

export default DecorateBorder;
