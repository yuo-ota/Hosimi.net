import ArrowIcon from "../assets/arrow.svg";

type StarInformationSheetProps = {
  sheetWidth: number;
  starData: StarData;
  isOpenSheet: boolean;
  setIsOpenSheet: (isOpenSheet: boolean) => void;
  className?: string;
};

const StarInformationSheet = ({
  sheetWidth,
  starData,
  isOpenSheet,
  setIsOpenSheet,
  className = "",
}: StarInformationSheetProps) => {
  return (
    <>
      <div
        className={`${className} flex flex-col lg:gap-y-10 bg-foreground/30 backdrop-blur-lg rounded-md border border-foreground/30 shadow-lg`}
        style={{ right: isOpenSheet ? 0 : sheetWidth * -1 }}
      >
        <button className="w-full h-[80px] border-b border-foreground/30 pl-10 flex items-center">
          <img src={ArrowIcon.src} alt="戻るボタン" className="h-2/5" />
        </button>
      </div>
    </>
  );
};

export default StarInformationSheet;
