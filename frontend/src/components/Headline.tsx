type HeadlineProps = {
  title: string;
  description: string;
};

const Headline = ({ title, description }: HeadlineProps) => {
  return (
    <>
      <div className="flex gap-x-2 items-stretch">
        <div className="w-[3px] bg-accent" />
        <div className="flex flex-col gap-y-1 py-[2px]">
          <span className="font-title text-foreground text-6xl">{title}</span>
          <span className="font-body text-foreground text-2xl">
            {description}
          </span>
        </div>
      </div>
    </>
  );
};
export default Headline;
