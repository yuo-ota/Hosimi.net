import { ReactNode } from "react";
import Button from "@/components/Button";

type ButtonProps = {
  isPriority: boolean;
  children: ReactNode;
  handleClick: () => void;
  className?: string;
};

type DualButtonProps = {
  buttons: ButtonProps[];
  className?: string;
};

const DualButton = ({ buttons, className = "" }: DualButtonProps) => {
  return (
    <>
      <div className={`${className}`}>
        {buttons.map((b, i) => (
          <Button
            key={i}
            isPriority={b.isPriority}
            handleClick={b.handleClick}
            className={b.className}
          >
            {b.children}
          </Button>
        ))}
      </div>
    </>
  );
};

export default DualButton;
