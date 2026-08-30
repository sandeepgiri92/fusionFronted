import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useCreateExpenseMutation } from "@/features/expense/expenseApi"
const ExpenseEntryForm = ({handleFormCloseBtn , expenseType}) => {

  const [formData,setFormData] = useState({
    expenseType,
    date:"",
    amount:"",
    remarks:"",
  })

  const [createExpense,{isLoading}] = useCreateExpenseMutation()

  const handdleExpenseForm = async (e) =>{
    e.preventDefault()
    const res = await createExpense({expenseData:formData})
    handleFormCloseBtn()
  }


  return (
    <div className=" absolute w-screen bg-black/55 h-screen top-0 flex flex-row justify-end z-10 -left-0">
      <div className="w-[400px] h-screen bg-white  outline-0 shadow-lg  overflow-hidden">
        <div className=" border-b py-5 px-5 border-borderColor">
          <div className="relative ">
            <p className="font-bold text-xl text-primaryBlue">
              Add New Exprense
            </p>
            <div
              className="  absolute right-0 top-0 hover:text-red-500 cursor-pointer hover:scale-[0.98] "
              
            >
              <IoMdClose size={25} onClick={handleFormCloseBtn}/>
            </div>
          </div>
        </div>
        {/* ----------------- */}
        <div className="py-5 px-5" >
            <form className="flex flex-col gap-5" onSubmit={handdleExpenseForm}>
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="" className="font-medium">Expense Type</label>
                    <div className="border px-2 py-1.5 rounded border-borderColor shadow">
                        <p className="text-sm">{expenseType}</p>
                    </div>
                </div>
                {/* ------------ */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="" className="font-medium">Date</label>
                    <div className="border px-2 py-1 rounded border-borderColor shadow">
                        <input type="date" onChange={(e)=>setFormData({...formData, date:e.target.value})}  className=" text-sm outline-none"/>
                    </div>
                </div>
                {/* -------------- */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="" className="font-medium">Amount (&#x20B9;)</label>
                    <div className="border px-2 py-1 rounded border-borderColor shadow">
                        <input type="text"  className=" text-sm outline-none" onChange={(e)=>setFormData({...formData, amount:e.target.value})}/>
                    </div>
                </div>
                {/* ------------------ */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="" className="font-medium">Remarks</label>
                    <div className="border px-2 py-1 rounded border-borderColor shadow">
                        <textarea name="" id="" placeholder="Enter Expense" className=" text-sm w-full h-[110px] outline-none" onChange={(e)=>setFormData({...formData, remarks:e.target.value})}/>
                    </div>
                </div>
                {/* ------- */}
                <div className="flex flex-row gap-5">
                    <button className="px-5 py-1.5 bg-orange-800 rounded shadow text-white cursor-pointer hover:border hover:border-orange-500">Save Expense</button>
                    <button className="px-5 py-1.5 rounded shadow bg-white hover:border hover:border-red-500   text-black  cursor-pointer" type="submikt">Cancel</button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default ExpenseEntryForm;
