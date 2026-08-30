import { useCreateEntryMutation } from "@/features/entryApi/entryApi";
import { useState } from "react";
import { AiOutlineProduct } from "react-icons/ai";
import { FaHashtag } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { IoMdClose, IoMdWallet } from "react-icons/io";
import { LiaFileInvoiceSolid } from "react-icons/lia";
import { MdOutlineCalendarMonth } from "react-icons/md";

const SaleEntryForm = ({
  handleToggleCloseNewSaleEntryForm,
  partyData,
  module,
}) => {
  const currentDate = new Date().toISOString().split("T")[0];

  const [saleFormdata, setSaleFormData] = useState({
    partyId: partyData._id,
    productName: "",
    date: currentDate,
    invoiceNo: "",
    serialNo: "",
    amount: 0,
    paymentStatus: "pending",
    serviceDetail: "",
  });
  // ----------------------

  const [createEntry, { isLoading }] = useCreateEntryMutation();
  const type = module
    .replace("/", "")
    .replace(/^./, (char) => char.toUpperCase());

  const partyId = partyData._id;

  const handleOnsubmiteSalefrom = async (e) => {
    e.preventDefault();
    try {
      const response = await createEntry({ type, partyId, saleFormdata });
      handleToggleCloseNewSaleEntryForm();
    } catch (err) {
      console.log(err);
    }
  };
  // ----------------------
  if (type === "Service") {
    return (
      <div className=" absolute w-screen bg-black/75 h-screen top-0 flex flex-1 justify-center items-center z-10 -left-0">
        <div className=" bg-white rounded-lg outline-0 shadow-md p-12 relative overflow-hidden">
          <p className="text-center font-bold text-xl text-primaryBlue">
            Add New Service
          </p>
          <div className=" w-full flex justify-center pt-5 ">
            <div className=" flex justify-center">
              <form
                onSubmit={handleOnsubmiteSalefrom}
                className="flex flex-col gap-3"
              >
                {/* ------------- */}
                <div className="flex flex-col gap-2 ">
                  <div className="flex flex-row items-center font-medium gap-1 ">
                    <AiOutlineProduct size={20} />
                    <label htmlFor="">Service Detail</label>
                  </div>
                  <textarea
                    className="border w-full px-2 py-1 rounded border-borderColor shadow outline-none"
                    placeholder="Enter service details"
                    name="productName"
                    onChange={(e) => {
                      setSaleFormData({
                        ...saleFormdata,
                        serviceDetail: e.target.value,
                      });
                    }}
                  />
                </div>
                {/* ----------------- */}
                <div className="flex flex-row gap-3">
                  <div className="w-[230px] grid grid-rows-2 gap-1 ">
                    <div className="flex flex-row items-center font-medium gap-1">
                      <MdOutlineCalendarMonth size={20} />
                      <label htmlFor="">Date</label>
                    </div>
                    <input
                      type="date"
                      value={saleFormdata.date}
                      className="border w-full px-2 py-1 rounded border-borderColor shadow outline-none"
                      name="date"
                      onChange={(e) => {
                        setSaleFormData({
                          ...saleFormdata,
                          date: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className="w-[230px] grid grid-rows-2 gap-1">
                    <div className="flex flex-row items-center font-medium gap-1">
                      <FaIndianRupeeSign size={20} />
                      <label htmlFor="">Amount</label>
                    </div>
                    <input
                      type="number"
                      value={saleFormdata.amount}
                      placeholder="Enter amount"
                      className="border w-full px-2 py-1 rounded border-borderColor shadow outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      name="amount"
                      onChange={(e) => {
                        setSaleFormData({
                          ...saleFormdata,
                          amount: e.target.value,
                        });
                      }}
                    />
                  </div>
                </div>

                {/* --------------- */}
                <div className="grid grid-rows-2 gap-1">
                  <div className="flex flex-row items-center font-medium gap-1">
                    <IoMdWallet size={20} />
                    <label htmlFor="">Payment Status</label>
                  </div>
                  <div className="flex gap-3">
                    <label
                      htmlFor=""
                      className="w-[230px] border px-2 py-1.5 border-borderColor rounded shadow flex flex-row items-center gap-2 text-sm bg-green-50 text-green-500"
                    >
                      <input
                        type="radio"
                        name="paymentStatus"
                        className=" accent-green-500 cursor-pointer"
                        onChange={(e) => {
                          setSaleFormData({
                            ...saleFormdata,
                            paymentStatus: e.target.value,
                          });
                        }}
                        value="paid"
                      />
                      Paid
                    </label>
                    <label
                      htmlFor=" "
                      className="w-[230px] border px-2 py-1.5 border-borderColor rounded shadow flex flex-row items-center gap-2 text-sm bg-red-50 text-red-500 "
                    >
                      <input
                        type="radio"
                        name="paymentStatus"
                        className=" accent-red-500 cursor-pointer"
                        onChange={(e) => {
                          setSaleFormData({
                            ...saleFormdata,
                            paymentStatus: e.target.value,
                          });
                        }}
                        value="pending"
                      />
                      Pending
                    </label>
                  </div>
                </div>
                {/* ---------------- */}
                <button
                  className="bg-primaryBlue text-white font-medium py-2 outline-none rounded shadow mt-5"
                  type="submit"
                >
                  Save Service
                </button>
              </form>
            </div>
          </div>

          <div
            className=" p-2 absolute right-0 top-0 hover:scale-[1.3] cursor-pointer "
            onClick={handleToggleCloseNewSaleEntryForm}
          >
            <IoMdClose size={25} />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className=" absolute w-screen bg-black/75 h-screen top-0 flex flex-1 justify-center items-center z-10 -left-0">
      <div className=" bg-white rounded-lg outline-0 shadow-md p-12 relative overflow-hidden">
        <p className="text-center font-bold text-xl text-primaryBlue">
          Add New {type}
        </p>
        <div className=" w-full flex justify-center pt-5 ">
          <div className=" flex justify-center">
            <form
              onSubmit={handleOnsubmiteSalefrom}
              className="flex flex-col gap-3"
            >
              {/* ------------- */}
              <div className="grid grid-rows-2 gap-1">
                <div className="flex flex-row items-center font-medium gap-1">
                  <AiOutlineProduct size={20} />
                  <label htmlFor="">Product name</label>
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    className="border w-full px-2 py-1 rounded border-borderColor shadow outline-none"
                    placeholder="Enter product name"
                    name="productName"
                    onChange={(e) => {
                      setSaleFormData({
                        ...saleFormdata,
                        productName: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
              {/* ----------------- */}
              <div className="flex flex-row gap-3">
                <div className="w-[230px] grid grid-rows-2 gap-1 ">
                  <div className="flex flex-row items-center font-medium gap-1">
                    <MdOutlineCalendarMonth size={20} />
                    <label htmlFor="">Date</label>
                  </div>
                  <input
                    type="date"
                    value={saleFormdata.date}
                    className="border w-full px-2 py-1 rounded border-borderColor shadow outline-none"
                    name="date"
                    onChange={(e) => {
                      setSaleFormData({
                        ...saleFormdata,
                        date: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="w-[230px] grid grid-rows-2 gap-1">
                  <div className="flex flex-row items-center font-medium gap-1">
                    <LiaFileInvoiceSolid size={20} />
                    <label htmlFor="">Invoice Number</label>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter invoice number"
                    className="border w-full px-2 py-1 rounded border-borderColor shadow outline-none"
                    name="invoiceNo"
                    onChange={(e) => {
                      setSaleFormData({
                        ...saleFormdata,
                        invoiceNo: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
              {/* ------------- */}
              <div className="flex flex-row gap-3">
                <div className="w-[230px] grid grid-rows-2 gap-1">
                  <div className="flex flex-row items-center font-medium gap-1">
                    <FaHashtag size={20} />
                    <label htmlFor="">Serial Number</label>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter serial number"
                    className="border w-full px-2 py-1 rounded border-borderColor shadow outline-none"
                    name="serialNo"
                    onChange={(e) => {
                      setSaleFormData({
                        ...saleFormdata,
                        serialNo: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="w-[230px] grid grid-rows-2 gap-1">
                  <div className="flex flex-row items-center font-medium gap-1">
                    <FaIndianRupeeSign size={20} />
                    <label htmlFor="">Amount</label>
                  </div>
                  <input
                    type="number"
                    value={saleFormdata.amount}
                    placeholder="Enter amount"
                    className="border w-full px-2 py-1 rounded border-borderColor shadow outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    name="amount"
                    onChange={(e) => {
                      setSaleFormData({
                        ...saleFormdata,
                        amount: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
              {/* --------------- */}
              <div className="grid grid-rows-2 gap-1">
                <div className="flex flex-row items-center font-medium gap-1">
                  <IoMdWallet size={20} />
                  <label htmlFor="">Payment Status</label>
                </div>
                <div className="flex gap-3">
                  <label
                    htmlFor=""
                    className="w-[230px] border px-2 py-1.5 border-borderColor rounded shadow flex flex-row items-center gap-2 text-sm bg-green-50 text-green-500"
                  >
                    <input
                      type="radio"
                      name="paymentStatus"
                      className=" accent-green-500 cursor-pointer"
                      onChange={(e) => {
                        setSaleFormData({
                          ...saleFormdata,
                          paymentStatus: e.target.value,
                        });
                      }}
                      value="paid"
                    />
                    Paid
                  </label>
                  <label
                    htmlFor=" "
                    className="w-[230px] border px-2 py-1.5 border-borderColor rounded shadow flex flex-row items-center gap-2 text-sm bg-red-50 text-red-500 "
                  >
                    <input
                      type="radio"
                      name="paymentStatus"
                      className=" accent-red-500 cursor-pointer"
                      onChange={(e) => {
                        setSaleFormData({
                          ...saleFormdata,
                          paymentStatus: e.target.value,
                        });
                      }}
                      value="pending"
                    />
                    Pending
                  </label>
                </div>
              </div>
              {/* ---------------- */}
              <button
                className="bg-primaryBlue text-white font-medium py-2 outline-none rounded shadow mt-5"
                type="submit"
              >
                Save {type}
              </button>
            </form>
          </div>
        </div>

        <div
          className=" p-2 absolute right-0 top-0 hover:scale-[1.3] cursor-pointer "
          onClick={handleToggleCloseNewSaleEntryForm}
        >
          <IoMdClose size={25} />
        </div>
      </div>
    </div>
  );
};

export default SaleEntryForm;
