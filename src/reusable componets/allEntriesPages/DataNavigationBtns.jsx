const DataNavigationBtns = ({ pagination }) => {
  return (
    <div className="flex justify-center gap-2 py-3">
      <button className=" border border-borderColor w-18 py-1 rounded cursor-pointer font-medium hover:bg-primaryBlue hover:text-white hover:scale-[0.90] transition-all duration-75 shadow text-gray-500">
        First
      </button>
      <button className=" border border-borderColor w-18 py-1 rounded cursor-pointer font-medium hover:bg-primaryBlue hover:text-white hover:scale-[0.90] transition-all duration-75 shadow text-gray-500">
        Prev
      </button>
      <p className=" text-center  font-medium text-sm px-5 flex flex-row items-center text-primaryBlue text-gray-500">
        Page {pagination.currentPage} of {pagination.totalPages}
      </p>
      <button className=" border border-borderColor w-18 py-1 rounded cursor-pointer font-medium hover:bg-primaryBlue hover:text-white hover:scale-[0.90] transition-all duration-75 shadow text-gray-500">
        Next
      </button>
      <button className=" border border-borderColor w-18 py-1 rounded cursor-pointer font-medium hover:bg-primaryBlue hover:text-white hover:scale-[0.90] transition-all duration-75 shadow text-gray-500">
        Last
      </button>
    </div>
  );
};

export default DataNavigationBtns;
