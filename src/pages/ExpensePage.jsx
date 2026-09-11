import {useState} from "react";
import {Plus,Edit3,Trash2,RefreshCw} from "lucide-react";
import AppModal from "@/components/AppModal";
import Toast from "@/components/Toast";
import {useGetExpensesQuery,useCreateExpenseMutation,useUpdateExpenseMutation,useDeleteExpenseMutation} from "@/features/expense/expenseApi";

const money=n=>`₹ ${Number(n||0).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2})}`;

export default function ExpensePage({type,title}){
  const hasPaymentStatus=["smc","other"].includes(String(type||"").toLowerCase());
  const [page,setPage]=useState(1),[modal,setModal]=useState(null),[toast,setToast]=useState(null);
  const [form,setForm]=useState({
    date:new Date().toISOString().slice(0,10),
    amount:'',
    remarks:'',
    expenseType:type,
    ...(hasPaymentStatus?{status:'pending'}:{})
  });

  const {data,isLoading,refetch}=useGetExpensesQuery({type,page});
  const [create,{isLoading:creating}]=useCreateExpenseMutation();
  const [update,{isLoading:updating}]=useUpdateExpenseMutation();
  const [remove]=useDeleteExpenseMutation();
  const rows=data?.expenses||[];

  const openNew=()=>{
    setForm({
      date:new Date().toISOString().slice(0,10),
      amount:'',
      remarks:'',
      expenseType:type,
      ...(hasPaymentStatus?{status:'pending'}:{})
    });
    setModal({expense:null});
  };

  const submit=async e=>{
    e.preventDefault();
    try{
      if(modal.expense){
        await update({id:modal.expense._id,...form}).unwrap();
        setToast('Expense updated');
      }else{
        await create({expenseData:form}).unwrap();
        setToast('Expense added');
      }
      setModal(null);
    }catch(err){
      setToast(err?.data?.message||'Unable to save expense');
    }
  };

  const edit=e=>{
    setForm({
      date:new Date(e.date).toISOString().slice(0,10),
      amount:e.amount,
      remarks:e.remarks,
      expenseType:e.expenseType,
      ...(hasPaymentStatus?{status:e.status||'pending'}:{})
    });
    setModal({expense:e});
  };

  const del=async id=>{
    if(!confirm('Delete this expense?'))return;
    try{
      await remove(id).unwrap();
      setToast('Expense deleted');
    }catch(err){
      setToast(err?.data?.message||'Unable to delete');
    }
  };

  return <>
    <div className="page-title">
      <div>
        <div className="eyebrow">Workspace / Expenses</div>
        <h1>{title}</h1>
        <p>Track and maintain every {type.toUpperCase()} expense.</p>
      </div>
      <button className="btn btn-primary" onClick={openNew}><Plus size={16}/> Add expense</button>
    </div>

    <div className="panel table-panel">
      <div className="toolbar">
        <div><b style={{fontSize:12}}>{data?.pagination?.totalData||0}</b><span style={{fontSize:10,color:'#94a3b8'}}> records</span></div>
        <button className="small-btn" style={{marginLeft:'auto'}} onClick={refetch}><RefreshCw size={15}/></button>
      </div>

      {isLoading?<div className="empty">Loading expenses…</div>:<>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Remarks</th>
                <th>Amount</th>
                {hasPaymentStatus&&<th>Status</th>}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length?rows.map(r=><tr key={r._id}>
                <td>{new Date(r.date).toLocaleDateString('en-IN')}</td>
                <td style={{textTransform:'uppercase',fontWeight:700}}>{r.expenseType}</td>
                <td>{r.remarks}</td>
                <td><b>{money(r.amount)}</b></td>

                {hasPaymentStatus&&(
                  <td>
                    <span
                      className="status"
                      style={{
                        display:'inline-flex',
                        minWidth:78,
                        justifyContent:'center',
                        borderRadius:999,
                        padding:'4px 10px',
                        fontSize:12,
                        fontWeight:600,
                        background:r.status==='paid'?'#22c55e':'#ef4444',
                        color:'#fff'
                      }}
                    >
                      {r.status==='paid'?'Paid':'Pending'}
                    </span>
                  </td>
                )}

                <td>
                  <div className="actions">
                    <button className="small-btn" onClick={()=>edit(r)}><Edit3 size={14}/></button>
                    <button className="small-btn" onClick={()=>del(r._id)}><Trash2 size={14}/></button>
                  </div>
                </td>
              </tr>):<tr>
                <td colSpan={hasPaymentStatus?6:5}><div className="empty">No expenses recorded.</div></td>
              </tr>}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <span>Page {data?.pagination?.currentPage||1} of {data?.pagination?.totalPages||1}</span>
          <button className="btn btn-secondary" disabled={!data?.pagination?.hasPreviousPage} onClick={()=>setPage(page-1)}>Previous</button>
          <button className="btn btn-secondary" disabled={!data?.pagination?.hasNextPage} onClick={()=>setPage(page+1)}>Next</button>
        </div>
      </>}
    </div>

    {modal&&<AppModal title={`${modal.expense?'Edit':'Add'} expense`} onClose={()=>setModal(null)}>
      <form onSubmit={submit}>
        <div className="form-grid">
          <div className="field">
            <label>Date</label>
            <input type="date" className="input" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} required/>
          </div>

          <div className="field">
            <label>Amount</label>
            <input type="number" min="0" step="0.01" className="input" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} required/>
          </div>

          {hasPaymentStatus&&(
            <div className="field">
              <label>Payment Status</label>
              <select
                className="select"
                value={form.status}
                onChange={e=>setForm({...form,status:e.target.value})}
                required
              >
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          )}

          <div className="field full">
            <label>Remarks</label>
            <textarea className="textarea" rows="4" value={form.remarks} onChange={e=>setForm({...form,remarks:e.target.value})} required placeholder="What was this expense for?"/>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={()=>setModal(null)}>Cancel</button>
          <button className="btn btn-primary" disabled={creating||updating}>{creating||updating?'Saving…':'Save expense'}</button>
        </div>
      </form>
    </AppModal>}

    <Toast message={toast} type={toast?.toLowerCase().includes('unable')?'error':'success'} onClose={()=>setToast(null)}/>
  </>;
}
