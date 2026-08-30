import ExpenseEntryForm from "@/reusable componets/allEntriesPages/ExpenseEntryForm";
import { HeadBar } from "@/reusable componets/HeadBar";
import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { SlCalender } from "react-icons/sl";

import { useGetExpensesQuery } from "@/features/expense/expenseApi";
import DataNavigationBtns from "@/reusable componets/allEntriesPages/DataNavigationBtns";

const PetrolExpense = () => {
  const [formCloseBtn, setFormCloseBtn] = useState(false);
  const handleFormCloseBtn = () => {
    setFormCloseBtn(!formCloseBtn);
  };

  // ------------------------
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useGetExpensesQuery({
    type: "Petrol",
    page: 1,
  });

  const entries = data?.expenses || [];
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
      <div className="flex flex-row w-full h-full">
        <div className="w-full px-3">
          <HeadBar title={"Expense Management-Petrol"} />
          <div className="flex flex-col gap-5">
            <div className=" flex justify-end">
              <div className="flex gap-6">
                <div className="flex gap-4 border border-orange-800 overflow-hidden rounded ">
                  <div
                    className="flex
                 gap-3"
                  >
                    <div className="flex gap-2 items-center">
                      <p className="w-[110px] text-sm text-center font-medium">
                        01-08-2026
                      </p>
                      <div className="w-5 h-5 relative ">
                        <input
                          type="date"
                          className="outline-none h-5 w-5 absolute opacity-0"
                        />
                        <SlCalender className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <p className="w-[110px] text-sm text-center font-medium">
                        01-08-2026
                      </p>
                      <div className="w-5 h-5 relative ">
                        <input
                          type="date"
                          className="outline-none h-5 w-5 absolute opacity-0"
                        />
                        <SlCalender className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                  <button className="text-sm font-medium bg-orange-800 text-white px-3 outline-none overflow-hidden cursor-pointer active:scale-[0.98]">
                    Apply
                  </button>
                </div>
                <button
                  className="bg-orange-800 flex-1 flex items-center cursor-pointer justify-center text-white font-medium py-2 px-8 rounded gap-2 "
                  onClick={handleFormCloseBtn}
                >
                  <IoMdAdd />
                  <p>Add Petrol Expense</p>
                </button>
              </div>
            </div>

            <div>
              <div className="border">
                {/* sow all entries Conatiner */}

                {!isLoading && !isError && (
                  <>
                    {entries.length !== 0 && (
                      <div className="w-full bg-blue-100 border-b border-borderColor py-3 grid grid-cols-[1fr_1fr_4fr]">
                        <p className="px-3 font-bold">Date</p>
                        <p className="px-3 font-bold">Amount</p>
                        <p className="px-3 font-bold">Remarks</p>
                      </div>
                    )}
                    {entries.map((item, index) => (
                      <>
                        <div className="w-full h-fit border rounded" key={index}>
                          <div className="w-full border-b border-borderColor py-2 grid grid-cols-[1fr_1fr_4fr]">
                            <p className="px-3 text-sm ">{new Date(item.date).toLocaleDateString("en-GB")}</p>
                            <p className="px-3 text-sm ">&#8377; {item.amount}</p>
                            <div className="flex justify-between pr-10 ">
                              <p className="px-3 text-sm">{item.remarks}</p>
                              <div className="flex gap-5">
                                <button className="text-blue-900 cursor-pointer">
                                  <MdEdit size={22} />
                                </button>
                                <button className="text-red-600  cursor-pointer">
                                  <MdDelete size={22} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ))}

                  </>
                )}
              </div>
              {entries.length !== 0 && (
                      <DataNavigationBtns pagination={pagination}/>
                    )}
            </div>
          </div>
          {/* --------------------- */}
        </div>
      </div>
      {formCloseBtn && (
        <ExpenseEntryForm
          handleFormCloseBtn={handleFormCloseBtn}
          expenseType={"Petrol"}
        />
      )}
    </>
  );
};

export default PetrolExpense;
