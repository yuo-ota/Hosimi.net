import SearchIcon from "../assets/search.svg";

type LocationInputProps = {
  className?: string;
};

const LocationInput = ({ className = "" }: LocationInputProps) => {
  return (
    <>
      <div className={`${className} flex flex-col`}>
        <div className="w-full flex items-center">
          <input
            type="text"
            placeholder="例) 新宿, ニューヨーク, シドニー"
            className="flex-1 bg-foreground rounded-l-md text-base h-12 px-2 focus:outline-none focus:ring-0"
          />
          <button className="aspect-square rounded-r-md bg-base flex justify-center items-center h-12">
            <img
              src={SearchIcon.src}
              alt="検索アイコン"
              className="aspect-square h-6/10"
            />
          </button>
        </div>
        {true ? (
          <div className="h-5 text-attention">入力された値が不正です</div>
        ) : (
          <div className="h-5" />
        )}
      </div>
    </>
  );
};

export default LocationInput;
