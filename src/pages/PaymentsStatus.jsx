import {useGetAllTransactionsQuery} from "@/features/entryApi/entryApi";import {CheckCircle2,Clock3,Search,RefreshCw,Scale} from "lucide-react";import {useState} from "react";
const money=n=>`₹ ${Number(n||0).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})}`;
export default function PaymentsStatus(){
  const [filters,setFilters]=useState({type:"",status:"",dateRange:"",search:""});
  const [page,setPage]=useState(1);
  const {data,isLoading,refetch}=useGetAllTransactionsQuery({...filters,page});
  const summary=data?.summary||{};
  const pagination=data?.pagination||{};
  const hasActiveFilters=!!(filters.type||filters.status||filters.dateRange||filters.search);
  return <>
    <div className="page-title">
      <div>
        <div className="eyebrow">Finance / Payments</div>
        <h1>Payments</h1>
        <p>Track total, paid and remaining amounts with payment history.</p>
      </div>
      <button className="btn btn-secondary" onClick={refetch}><RefreshCw size={15}/> Refresh</button>
    </div>

    <div className="grid stats-grid" style={{marginBottom:16}}>
      <div className="stat-card">
        <div className="stat-icon"><Scale size={18}/></div>
        <div className="stat-label">Total {hasActiveFilters?"(filtered)":""}</div>
        <div className="stat-value">{money(summary.totalAmount)}</div>
      </div>
      <div className="stat-card">
        <div className="stat-icon" style={{background:"#ecfdf5",color:"#16a34a"}}><CheckCircle2 size={18}/></div>
        <div className="stat-label">Total paid {hasActiveFilters?"(filtered)":""}</div>
        <div className="stat-value" style={{color:"#16a34a"}}>{money(summary.totalPaidAmount)}</div>
      </div>
      <div className="stat-card">
        <div className="stat-icon" style={{background:"#fff1f2",color:"#dc2626"}}><Clock3 size={18}/></div>
        <div className="stat-label">Total due {hasActiveFilters?"(filtered)":""}</div>
        <div className="stat-value" style={{color:"#dc2626"}}>{money(summary.totalDueAmount)}</div>
      </div>
      <div className="stat-card">
        <div className="stat-icon"><Search size={18}/></div>
        <div className="stat-label">Transactions {hasActiveFilters?"(filtered)":""}</div>
        <div className="stat-value">{summary.transactionCount||pagination.total||0}</div>
      </div>
    </div>

    <div className="panel table-panel">
      <div className="toolbar">
        <div className="search">
          <Search size={15}/>
          <input placeholder="Search party name or mobile…" value={filters.search} onChange={e=>{setFilters({...filters,search:e.target.value});setPage(1)}}/>
        </div>
        <select className="select" value={filters.type} onChange={e=>{setFilters({...filters,type:e.target.value});setPage(1)}}>
          <option value="">All types</option>
          <option>Sale</option>
          <option>Purchase</option>
          <option>Service</option>
        </select>
        <select className="select" value={filters.status} onChange={e=>{setFilters({...filters,status:e.target.value});setPage(1)}}>
          <option value="">All status</option>
          <option value="pending">Unpaid</option>
          <option value="partial">Partial</option>
          <option value="paid">Paid</option>
        </select>
        <select className="select" value={filters.dateRange} onChange={e=>{setFilters({...filters,dateRange:e.target.value});setPage(1)}}>
          <option value="">All dates</option>
          <option value="today">Today</option>
          <option value="7days">7 days</option>
          <option value="30days">30 days</option>
          <option value="3months">3 months</option>
        </select>
        {hasActiveFilters&&<button className="btn btn-secondary" onClick={()=>{setFilters({type:"",status:"",dateRange:"",search:""});setPage(1)}}><RefreshCw size={14}/> Clear</button>}
      </div>

      {isLoading?(
        <div className="empty">Loading payments…</div>
      ):(
        <>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Party</th>
                  <th>Type</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Due</th>
                  <th>Status</th>
                  <th>History</th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.length?data.data.map(t=>(
                  <tr key={t.id}>
                    <td>{new Date(t.paymentDate).toLocaleDateString("en-IN")}</td>
                    <td><b>{t.partyName}</b></td>
                    <td>{t.type}</td>
                    <td>{money(t.amount)}</td>
                    <td>{money(t.totalPaid)}</td>
                    <td><b>{money(t.remainingAmount)}</b></td>
                    <td><span className={`status ${t.status}`}>{t.status==="paid"?"Paid":t.status==="partial"?"Partial":"Unpaid"}</span></td>
                    <td>
                      {t.payments?.length?t.payments.map(p=>(
                        <div key={p._id} style={{fontSize:10,marginBottom:3}}>
                          {new Date(p.paymentDate).toLocaleDateString("en-IN")} · <b>{money(p.amount)}</b>
                        </div>
                      )):<span style={{color:"#94a3b8"}}>No payment</span>}
                    </td>
                  </tr>
                )):<tr><td colSpan="8"><div className="empty">No payments found.</div></td></tr>}
              </tbody>
            </table>
          </div>

          <div className="pagination pagination-with-totals">
            <div className="pagination-totals">
              <div className="pag-total paid">
                <span className="pag-total-label">Total Paid</span>
                <span className="pag-total-value">{money(summary.totalPaidAmount)}</span>
              </div>
              <div className="pag-total unpaid">
                <span className="pag-total-label">Total Unpaid</span>
                <span className="pag-total-value">{money(summary.totalDueAmount)}</span>
              </div>
            </div>
            <div className="pagination-controls">
              <span>Page {pagination.page||1} of {pagination.totalPages||1} · {pagination.total||0} records</span>
              <button className="btn btn-secondary" disabled={!pagination.hasPreviousPage} onClick={()=>setPage(page-1)}>Previous</button>
              <button className="btn btn-secondary" disabled={!pagination.hasNextPage} onClick={()=>setPage(page+1)}>Next</button>
            </div>
          </div>
        </>
      )}
    </div>
  </>;
}
