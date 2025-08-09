import { ReactNode } from "react";

type SettingElementProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

const SettingElement = ({
  title,
  children,
  className = "",
}: SettingElementProps) => {
  return (
    <>
      <div className={`${className} flex flex-col gpa-2`}>
        <div className="text-title text-2xl lg:text-[45px]">{title}</div>
        {children}
      </div>
    </>
  );
};

export default SettingElement;
