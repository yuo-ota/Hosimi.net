const LocationSettingByManual = () => {
  return (
    <>
      <div className="mb-10 lg:mb-30 w-full h-full lg:h-[500px] flex flex-col lg:grid lg:grid-flow-row lg:grid-rows-[auto_1fr] lg:grid-cols-2 gap-4">
        <div className="h-[100px] w-full lg:w-auto lg:row-span-1 bg-blue-200"></div>
        <div className="flex-1 lg:col-span-1 w-full lg:w-auto lg:row-span-2 bg-green-200"></div>
        <div className="h-[100px] lg:row-span-1 w-full lg:w-auto bg-red-200"></div>
      </div>
    </>
  );
};

export default LocationSettingByManual;
