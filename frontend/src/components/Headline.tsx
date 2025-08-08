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
      <div className={`${className} flex gap-x-2 items-stretch`}>
        <div className="w-[3px] bg-accent" />
        <div className="flex flex-col gap-y-1 py-[2px]">
          <span
            className={`font-title text-foreground ${
              preferSmall ? "text-2xl lg:text-4xl" : "text-3xl lg:text-6xl"
            }`}
          >
            {title}
          </span>
          <span
            className={`text-foreground ${
              preferSmall ? "text-sm lg:text-xl" : "text-sm lg:text-2xl"
            }`}
          >
            {description}
          </span>
        </div>
      </div>
    </>
  );
};
export default Headline;
