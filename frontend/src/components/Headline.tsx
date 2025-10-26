import React from "react";

type HeadlineProps = {
  preferSmall: boolean;
  title: string;
  description: string;
  className?: string;
};

const Headline = ({
  preferSmall,
  title,
  description,
  className,
}: HeadlineProps) => {
  return (
    <>
      <div className={`flex flex-col items-center justify-centertext-center ${className}`}>
          <span
            className={`font-title text-foreground ${
              preferSmall ? "text-3xl lg:text-4xl" : "text-3xl lg:text-6xl"
            }`}
          >
            {title}
          </span>
          <span
            className={`flex flex-col items-center text-foreground ${
              preferSmall ? "text-sm lg:text-xl" : "text-sm lg:text-2xl"
            }`}
          >
            {description.split("<br>").map((line, index) => (
              <div key={index}>
                {line}
              </div>
            ))}
          </span>
      </div>
    </>
  );
};
export default Headline;
