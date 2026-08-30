export const HeadBar = ({ title }) => {
  return (
    <div className="h-[50px] w-full  flex items-center px-3">
      <h2 className="text-xl font-semibold text-headingBlack">{title}</h2>
    </div>
  );
};
