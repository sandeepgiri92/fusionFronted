import { CiSearch } from "react-icons/ci";
import { FaCalendarDays } from "react-icons/fa6";
import { IoAddSharp, IoCallOutline } from "react-icons/io5";
const EntryDetailAndSerchBar = ({
  partyData,
  handleToggleCloseNewSaleEntryForm,
  year,
  month,
  setYear,
  setMonth,
  serachValue,
  setSearchValue,
}) => {
  return (
    <div className="grid grid-cols-[1.5fr_2fr] items-start h-[115px]">
      <div>
        <p className=" font-semibold text-xl">{partyData.name}</p>
        <p className=" text-sm font-medium flex items-end pt-1 gap-2 text-gray-500">
          <IoCallOutline size={18} /> {partyData.contactNo}
        </p>
      </div>
      <div className="flex flex-col gap-3 items-end ">
        <button
          className="bg-primaryBlue px-10 rounded font-medium text-white py-2 w-fit text-sm flex flex-row items-center gap-2"
          onClick={handleToggleCloseNewSaleEntryForm}
        >
          <IoAddSharp size={20} />
          Add New Entry
        </button>
        <div
          className="flex
         gap-2 items-center"
        >
          <div className=" relative border border-borderColor rounded shadow px-2 py-1">
            <input
              type="text"
              placeholder="Search by Serial & Invoice No."
              className="w-full  py-1 pl-8 outline-none text-sm"
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
              value={serachValue}
            />
            <CiSearch
              size={20}
              className=" absolute left-2 top-1/2 -translate-y-1/2"
            />
          </div>
          {/* - */}
          <div className="flex items-center gap-2 text-sm border py-2 px-3 rounded border-borderColor shadow cursor-pointer group ">
            <p className="w-[110px] text-center">
              {month && year
                ? `${year}-${String(month).padStart(2, "0")}`
                : "Select Month"}
            </p>
            <div className="h-5 w-5 relative ">
              <input
                className="w-5 h-5 absolute opacity-0 cursor-pointer"
                type="month"
                onChange={(e) => {
                  const [selectedYear, selectedMonth] =
                    e.target.value.split("-");

                  setYear(selectedYear);
                  setMonth(selectedMonth);
                }}
                value={
                  month && year
                    ? `${year}-${String(month).padStart(2, "0")}`
                    : ""
                }
              />
              <span>
                <FaCalendarDays
                  size={20}
                  color="#1c398e"
                  className="cursor-pointer"
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntryDetailAndSerchBar;
