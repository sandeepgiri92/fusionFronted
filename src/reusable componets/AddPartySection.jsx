import { useGetPartiesQuery } from "@/features/party/partyApi";
import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import PartyDetailCard from "./PartyDetailCard";
const AddPartySection = ({
  handleToggleCloseNewPartyEntryFormBtn,
  module,
  handlePartyAsBtn,
}) => {
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  // 400ms debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchText]);

  const { data, isLoading, isFetching, isError } = useGetPartiesQuery({
    module,
    search: debouncedSearch,
  });

  const parties = data?.data || [];
  return (
    <div className="w-[250px] p-2 h-full flex flex-col gap-3">
      <button
        onClick={handleToggleCloseNewPartyEntryFormBtn}
        className="bg-primaryBlue cursor-pointer w-full rounded py-2 outline-0 shadow text-white font-semibold active:scale-[0.98]"
      >
        Add New Party
      </button>
      {/* search input */}
      <div className=" relative border border-borderColor rounded shadow">
        <input
          type="text"
          value={searchText}
          placeholder="Search by Party name"
          className="w-full  py-1 pl-10 outline-none"
          onChange={(e) => setSearchText(e.target.value)}
        />
        <CiSearch
          size={20}
          className=" absolute left-2 top-1/2 -translate-y-1/2"
        />
      </div>
      {/* all party are show here */}
      <div className="w-full border h-full rounded overflow-hidden shadow">
        <div className="w-full h-full overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-4">
          {/* part in detail */}
          {isLoading && <p className="text-center text-gray-500">Loading...</p>}

          {/* Error */}
          {isError && (
            <p className="text-center text-red-500">Failed to load parties</p>
          )}

          {/* ---------------------------- */}
          {/* Parties */}
          {!isLoading && !isError && (
            <div>
              {parties.length > 0 ? (
                parties.map((party) => (
                  <PartyDetailCard
                    handlePartyAsBtn={handlePartyAsBtn}
                    key={party._id}
                    party={party}
                  />
                ))
              ) : (
                <p className="py-5 text-center text-gray-500">No Party Found</p>
              )}
            </div>
          )}

          {/* ------------------------- */}
        </div>
      </div>
    </div>
  );
};

export default AddPartySection;
