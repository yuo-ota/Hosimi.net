import { useState } from "react";
import SearchIcon from "../assets/search.svg";
import { GeoLocation } from "@/type/GeoLocation";
import { getCoordsByLocationName } from "@/lib/api/geolocation";
import DecorateBorder from "@/components/DecorateBorder";

type LocationInputProps = {
  setUserPosition: (userPosition: GeoLocation) => void;
  className?: string;
};

const LocationInput = ({ setUserPosition, className = "" }: LocationInputProps) => {
  const [query, setQuery] = useState("");
  const [isInvalidQuery, setIsInvalidQuery] = useState(true)
  const [queryErrorMessage, setQueryErrorMessage] = useState("入力されていません")

  const handleSearch = async() => {
    if (!query) return;
    if (query.length === 0) return;

    const result = await getCoordsByLocationName(query);

    if (result.success) {
      const coords: GeoLocation = result.geolocationData;
      setUserPosition(coords)
    } else {
      console.error(result.error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleInputField = (fieldContent: string) => {
    setQuery(fieldContent);

    if (fieldContent.length === 0) {
      setIsInvalidQuery(true)
      setQueryErrorMessage("入力されていません")
      return;
    }
    
    setIsInvalidQuery(false);
    setQueryErrorMessage("")
  }
  
  return (
    <>
      <div className={`${className} flex flex-col`}>
        <div className="w-full flex items-center">
          <DecorateBorder isBorderPutX={true} className="w-[calc(100%-48px)] bg-foreground/30">
            <input
              type="text"
              placeholder="例) 新宿, ニューヨーク, シドニー"
              className="flex-1 text-lg lg:text-xl text-foreground h-15 lg:h-16 px-2 focus:outline-none focus:ring-0"
              value={query}
              onChange={(e) => handleInputField(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </DecorateBorder>
          <DecorateBorder isBorderPutX={true} className="bg-foreground/30">
            <button
              className="aspect-square flex justify-center items-center h-15 lg:h-16 bg-foreground/30"
              onClick={handleSearch}
            >
              <img
                src={SearchIcon.src}
                alt="検索アイコン"
                className="aspect-square h-6/10"
              />
            </button>
          </DecorateBorder>
        </div>
        {isInvalidQuery ? (
          <div className="h-5 text-attention lg:text-lg">{queryErrorMessage}</div>
        ) : (
          <div className="h-5" />
        )}
      </div>
    </>
  );
};

export default LocationInput;
