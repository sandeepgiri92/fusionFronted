import { MdEdit } from "react-icons/md";
const TableRows = ({ data, type }) => {
  if (type === "Service") {
    return (
      <div className="w-full border-b border-borderColor py-3 grid grid-cols-[1.4fr_6fr_1.5fr_2fr] text-[12px] font-medium">
        <p className="px-2 uppercase ">
          {new Date(data.date).toISOString().split("T")[0]}
        </p>
        <p className="px-2  uppercase  ">{data.serviceDetail}</p>
        <p className="px-2 uppercase flex flex-row gap-1 ">
          <span className="font-bold">&#8377;</span>
          <span
            className={`${data.paymentStatus === "pending" ? "text-red-600" : "text-green-600"}`}
          >
            {Number(data.amount).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </p>
        <div className="flex justify-between pr-2 items-center ">
          <p
            className={`px-4 uppercase ${data.paymentStatus === "pending" ? "text-red-600 bg-red-50" : "text-green-600 bg-green-50"}  rounded-2xl py-0.5`}
          >
            {data.paymentStatus}
          </p>
          <button className="text-blue-900 cursor-pointer">
            <MdEdit size={15} />
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full border-b border-borderColor py-3 grid grid-cols-[1.4fr_2.1fr_2.4fr_2.1fr_1.5fr_2fr] text-[12px] font-medium">
      <p className="px-2 uppercase ">
        {new Date(data.date).toISOString().split("T")[0]}
      </p>
      <p className="px-2  uppercase ">{data.productName}</p>
      <p className="px-2 uppercase ">{data.invoiceNo}</p>
      <p className="px-2 uppercase ">{data.serialNo}</p>
      <p className="px-2 uppercase flex flex-row gap-1 ">
        <span className="font-bold">&#8377;</span>
        <span
          className={`${data.paymentStatus === "pending" ? "text-red-600" : "text-green-600"}`}
        >
          {Number(data.amount).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </p>
      <div className="flex justify-between pr-2 items-center ">
        <p
          className={`px-4 uppercase ${data.paymentStatus === "pending" ? "text-red-600 bg-red-50" : "text-green-600 bg-green-50"}  rounded-2xl py-0.5`}
        >
          {data.paymentStatus}
        </p>
        <button className="text-blue-900 cursor-pointer">
          <MdEdit size={15} />
        </button>
      </div>
    </div>
  );
};

export default TableRows;
