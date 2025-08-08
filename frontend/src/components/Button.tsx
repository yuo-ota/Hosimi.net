import { ReactNode } from "react";

type ButtonProps = {
  isPriority: boolean;
  children: ReactNode;
  handleClick: () => void;
  className?: string;
};

const Button = ({
  isPriority,
  children,
  handleClick,
  className = "",
}: ButtonProps) => {
  return (
    <>
      <button
        className={`${className} ${
          isPriority
            ? `bg-foreground text-base border-foreground`
            : `bg-base text-foreground border-accent shadow-lg shadow-accent/50`
        } border-2 rounded-full`}
        onClick={handleClick}
      >
        {children}
      </button>
    </>
  );
};

export default Button;
