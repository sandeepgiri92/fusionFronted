import bgImage from "../assets/No-Data-Found-BG.png";
const DataNotFound = () => {
  return (
    <div className="w-full flex flex-col pt-10 items-center">
      <div
        className=" h-[600px] w-[600px]  bg-center bg-cover bg-no-repeat  "
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* <img src={bgImg} alt="" /> */}
      </div>
    </div>
  );
};

export default DataNotFound;
