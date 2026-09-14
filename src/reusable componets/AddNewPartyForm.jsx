import { useCreatePartyMutation } from "@/features/party/partyApi";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";

const AddNewPartyForm = ({ handleToggleCloseNewPartyEntryFormBtn, module }) => {
  const [newPartyFormData, setNewPartyFormData] = useState({
    name: "",
    contactNo: "",
    address: "",
    module: module.split("/").filter(Boolean).pop(),
  });

  const [createParty, { isLoading }] = useCreatePartyMutation();

  const handleAddNewParty = async (e) => {
    e.preventDefault();
    try {
      const response = await createParty(newPartyFormData);
      console.log(response);
      handleToggleCloseNewPartyEntryFormBtn();
    } catch (err) {
      console.log(err);
      handleToggleCloseNewPartyEntryFormBtn();
    }
  };

  return (
    <div className=" absolute w-screen bg-black/75 h-screen top-0 flex flex-1 justify-center items-center z-10 -left-0">
      <div className="w-[700px] h-[500px] bg-white rounded-lg outline-0 shadow-md p-4 pt-18 relative overflow-hidden">
        <p className="text-center font-bold text-xl text-primaryBlue">
          Add New Party Form
        </p>
        <div className="flex flex-1 justify-center items-center mt-10">
          <form
            onSubmit={handleAddNewParty}
            className="flex flex-col gap-6 w-[400px]"
          >
            <div className="flex flex-col">
              <label htmlFor="" className="font-semibold pb-3">
                Party Name
              </label>
              <input
                type="text"
                placeholder="Enter Party Name"
                className="border border-borderColor shadow outline-none p-2 rounded"
                onChange={(e) => {
                  setNewPartyFormData({
                    ...newPartyFormData,
                    name: e.target.value,
                  });
                }}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="" className="font-semibold pb-3">
                Party Contact No.
              </label>
              <input
                type="text"
                placeholder="Enter Party Contact Number"
                className="border border-borderColor shadow outline-none p-2 rounded"
                onChange={(e) => {
                  setNewPartyFormData({
                    ...newPartyFormData,
                    contactNo: e.target.value,
                  });
                }}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="party-address" className="font-semibold pb-3">
                Party Address
              </label>
              <textarea
                id="party-address"
                placeholder="Enter Party Address"
                className="border border-borderColor shadow outline-none p-2 rounded"
                rows={3}
                onChange={(e) => {
                  setNewPartyFormData({
                    ...newPartyFormData,
                    address: e.target.value,
                  });
                }}
              />
            </div>
            <button
              className="bg-primaryBlue w-full py-2 text-white shadow rounded outline-none"
              type="submit"
            >
              Save Party
            </button>
          </form>
        </div>
        <div
          className=" p-2 absolute right-0 top-0 hover:scale-[1.3] cursor-pointer "
          onClick={handleToggleCloseNewPartyEntryFormBtn}
        >
          <IoMdClose size={25} />
        </div>
      </div>
    </div>
  );
};

export default AddNewPartyForm;
