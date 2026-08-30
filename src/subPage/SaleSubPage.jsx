import { useGetEntryQuery } from "@/features/entryApi/entryApi";
import DataNavigationBtns from "@/reusable componets/allEntriesPages/DataNavigationBtns";
import SaleEntryForm from "@/reusable componets/allEntriesPages/SaleEntryForm";
import TableHeader from "@/reusable componets/allEntriesPages/Table/TableHeader";
import TableRows from "@/reusable componets/allEntriesPages/Table/TableRows";
import EntryDetailAndSerchBar from "@/reusable componets/EntryDetailAndSerchBar";
import { useEffect, useState } from "react";

const SaleSubPage = ({ partyData, module }) => {
  const partyId = partyData._id;
  const [toggleCloseNewSaleEntryForm, setToggleCloseNewSaleEntryForm] =
    useState(false);

  const handleToggleCloseNewSaleEntryForm = () => {
    setToggleCloseNewSaleEntryForm(!toggleCloseNewSaleEntryForm);
  };
  // -------------------------
  const type = module
    .replace("/", "")
    .replace(/^./, (char) => char.toUpperCase());
  const [page, setPage] = useState("1");

  // -------------------------

  // -------------------------------------------------

  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchValue]);

  // ----------------------------------------------

  const { data, isLoading, isError } = useGetEntryQuery({
    type,
    partyId,
    page,
    searchValue: debouncedSearch,
    month,
    year,
  });

  const entries = data?.data || [];
  const pagination = data?.pagination || {
    currentPage: 1,
    limit: 10,
    totalData: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  };

  return (
    <>
      <div className=" h-[calc(100%-5px)] w-full px-3  py-2.5  flex flex-col gap-3  ">
        {/* add and search filter container */}
        <EntryDetailAndSerchBar
          partyData={partyData}
          handleToggleCloseNewSaleEntryForm={handleToggleCloseNewSaleEntryForm}
          year={year}
          month={month}
          setYear={setYear}
          setMonth={setMonth}
          serachValue={searchValue}
          setSearchValue={setSearchValue}
        />
        {/* sow all entries Conatiner */}
        <div className=" h-[calc(100%-115px)] flex flex-col justify-between ">
          <div className="w-full h-fit border rounded ">
            {isError && <div>is error</div>}
            {isLoading && <div>is Loading</div>}

            {!isLoading && !isError && (
              <>
                {entries.length !== 0 && <TableHeader type={type} />}
                {entries.map((item, index) => (
                  <>
                    <TableRows type={type} key={index} data={item} />
                  </>
                ))}
              </>
            )}
          </div>

          {entries.length !== 0 && <DataNavigationBtns pagination={pagination} />}
          
        </div>
      </div>

      {toggleCloseNewSaleEntryForm && (
        <SaleEntryForm
          handleToggleCloseNewSaleEntryForm={handleToggleCloseNewSaleEntryForm}
          partyData={partyData}
          module={module}
        />
      )}
    </>
  );
};

export default SaleSubPage;
