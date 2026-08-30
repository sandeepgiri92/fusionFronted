import AddNewPartyForm from "@/reusable componets/AddNewPartyForm";
import AddPartySection from "@/reusable componets/AddPartySection";
import DataNotFound from "@/reusable componets/DataNotFound";
import { HeadBar } from "@/reusable componets/HeadBar";
import SaleSubPage from "@/subPage/saleSubPage";
import { useState } from "react";
import { useLocation } from "react-router-dom";
const Service = () => {
  const location = useLocation();
  // ------------------------
  const [toggleCloseNewPartyEntryFormBtn, setToggleCloseNewPartyEntryFormBtn] =
    useState(false);
  const handleToggleCloseNewPartyEntryFormBtn = () => {
    setToggleCloseNewPartyEntryFormBtn(!toggleCloseNewPartyEntryFormBtn);
  };
  // ------------------------

  // --------------------------

  const [activeParty, setActiveParty] = useState(null);

  const handlePartyAsBtn = (data) => {
    setActiveParty(data);
  };

  // ----------------------------

  return (
    <section className="h-full">
      <HeadBar title={"Service Management"} />
      <div className="h-[calc(100%-50px)] w-full flex ">
        {/* sales party entry container */}
        <AddPartySection
          handleToggleCloseNewPartyEntryFormBtn={() =>
            handleToggleCloseNewPartyEntryFormBtn()
          }
          module={location.pathname.split("/").filter(Boolean).pop()}
          handlePartyAsBtn={handlePartyAsBtn}
        />
        {/* sales new entry and all entry show */}
        <div className=" h-full w-[calc(100%-250px)]">
          {/* ---------------- sub page are here */}
          {activeParty ? (
            <SaleSubPage partyData={activeParty} module={location.pathname} />
          ) : (
            <div>
              <DataNotFound />
            </div>
          )}
        </div>
      </div>
      {toggleCloseNewPartyEntryFormBtn && (
        <AddNewPartyForm
          handleToggleCloseNewPartyEntryFormBtn={
            handleToggleCloseNewPartyEntryFormBtn
          }
          module={location.pathname}
        />
      )}
    </section>
  );
};

export default Service;
