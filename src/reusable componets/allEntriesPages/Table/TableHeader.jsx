const TableHeader = ({ type }) => {
  if (type === "Service") {
    return (
      <div className="w-full bg-blue-100 border-b border-borderColor py-3 grid grid-cols-[1.4fr_4fr_3fr_1.5fr_2fr] text-sm font-semibold">
        <p className="px-2 ">Date</p>
        <p className="px-2 ">Service Detail</p>
        <p className="px-2 ">Remarks</p>
        <p className="px-2 ">Amount</p>
        <p className="px-2 ">Payment Status</p>
      </div>
    );
  }
  return (
    <div className="w-full bg-blue-100 border-b border-borderColor py-3 grid grid-cols-[1.4fr_2.1fr_2.4fr_2.1fr_2.5fr_1.5fr_2fr] text-sm font-semibold">
      <p className="px-2 ">Date</p>
      <p className="px-2 ">Product Name</p>
      <p className="px-2 ">Invoice Number</p>
      <p className="px-2 ">Serial Number</p>
      <p className="px-2 ">Remarks</p>
      <p className="px-2 ">Amount</p>
      <p className="px-2 ">Payment Status</p>
    </div>
  );
};

export default TableHeader;
