import Reticle from "../assets/reticle.svg";

type SkyViewProps = {
  className?: string;
};

const SkyView = ({ className = "" }: SkyViewProps) => {
  return (
    <>
      <div className={`${className} relative`}>
        <img
          src={Reticle.src}
          alt="照準"
          className="absolute top-1/2 left-1/2 aspect-square w-[30px] transform -translate-x-1/2 -translate-y-1/2 z-20"
        />
        <div className="absolute w-full h-full"></div>
      </div>
    </>
  );
};

export default SkyView;
