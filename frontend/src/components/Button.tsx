import { ReactNode } from "react";

type ButtonProps = {
  isPriority: boolean;
  children: ReactNode;
  handleClick: () => void;
  isActive: boolean;
  className?: string;
};

const Button = ({
  isPriority,
  children,
  handleClick,
  isActive,
  className = "",
}: ButtonProps) => {
  return (
    <>
      <button
        className={`${className} ${
          isPriority
            ? `bg-foreground text-base border-foreground`
            : `bg-base text-foreground border-accent shadow-lg shadow-accent/50`
        } border-2 rounded-full
        disabled:shadow-none disabled:inset-shadow-sm disabled:inset-shadow-attention/20 disabled:text-foreground/50 disabled:border-attention/30`}
        onClick={handleClick}
        disabled={!isActive}
      >
        {children}
      </button>
    </>
  );
};

export default Button;
