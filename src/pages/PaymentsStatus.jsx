import Toast from "@/components/Toast";
import {
  useGetAllTransactionsQuery,
  useUpdateTransactionMutation,
} from "@/features/entryApi/entryApi";
import { CheckCircle2, Clock3, RefreshCw, Search } from "lucide-react";
import { useState } from "react";
const money = (n) =>
  `₹ ${Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export default function PaymentsStatus() {
  const [filters, setFilters] = useState({
      type: "",
      status: "",
      dateRange: "",
      search: "",
    }),
    [page, setPage] = useState(1),
    [toast, setToast] = useState(null);
  const { data, isLoading, refetch } = useGetAllTransactionsQuery({
    ...filters,
    page,
  });
  const [update] = useUpdateTransactionMutation();
  const change = async (id, status) => {
    try {
      await update({ id, status }).unwrap();
      setToast("Payment status updated");
    } catch (err) {
      setToast(err?.data?.message || "Unable to update payment");
    }
  };
  return (
    <>
      <div className="page-title">
        <div>
          <div className="eyebrow">Finance / Payments</div>
          <h1>Payment status</h1>
          <p>Monitor paid and pending transactions from one place.</p>
        </div>
        <button className="btn btn-secondary" onClick={refetch}>
          <RefreshCw size={15} /> Refresh
        </button>
      </div>
      <div className="grid stats-grid" style={{ marginBottom: 16 }}>
        <div className="stat-card">
          <div className="stat-icon">
            <CheckCircle2 size={18} />
          </div>
          <div className="stat-label">Paid</div>
          <div className="stat-value">
            {money(data?.summary?.totalPaidAmount)}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Clock3 size={18} />
          </div>
          <div className="stat-label">Pending</div>
          <div className="stat-value">
            {money(data?.summary?.totalPendingAmount)}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Search size={18} />
          </div>
          <div className="stat-label">Total</div>
          <div className="stat-value">{money(data?.summary?.totalAmount)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <span style={{ fontWeight: 900 }}>#</span>
          </div>
          <div className="stat-label">Transactions</div>
          <div className="stat-value">{data?.pagination?.total || 0}</div>
        </div>
      </div>
      <div className="panel table-panel">
        <div className=" flex gap-5 px-5 py-5">
          <div className="search">
            <Search size={15} />
            <input
              placeholder="Search party…"
              value={filters.search}
              onChange={(e) => {
                setFilters({ ...filters, search: e.target.value });
                setPage(1);
              }}
            />
          </div>
          <select
            className="select"
            value={filters.type}
            onChange={(e) => {
              setFilters({ ...filters, type: e.target.value });
              setPage(1);
            }}
          >
            <option value="">All types</option>
            <option>Sale</option>
            <option>Purchase</option>
            <option>Service</option>
          </select>
          <select
            className="select"
            value={filters.status}
            onChange={(e) => {
              setFilters({ ...filters, status: e.target.value });
              setPage(1);
            }}
          >
            <option value="">All status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>
          <select
            className="select"
            value={filters.dateRange}
            onChange={(e) => {
              setFilters({ ...filters, dateRange: e.target.value });
              setPage(1);
            }}
          >
            <option value="">All dates</option>
            <option value="today">Today</option>
            <option value="7days">7 days</option>
            <option value="30days">30 days</option>
            <option value="3months">3 months</option>
          </select>
        </div>
        {isLoading ? (
          <div className="empty">Loading payments…</div>
        ) : (
          <>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Party</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data?.length ? (
                    data.data.map((t) => (
                      <tr key={t.id}>
                        <td>
                          {new Date(t.paymentDate).toLocaleDateString("en-IN")}
                        </td>
                        <td>
                          <b>{t.partyName}</b>
                        </td>
                        <td>{t.type}</td>
                        <td>
                          <b>{money(t.amount)}</b>
                        </td>
                        <td>
                          <button
                            className={`status ${t.status}`}
                            style={{ border: 0, cursor: "pointer" }}
                            onClick={() =>
                              change(
                                t.id,
                                t.status === "paid" ? "pending" : "paid",
                              )
                            }
                          >
                            {t.status}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">
                        <div className="empty">No payments found.</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="pagination">
              <span>
                Page {data?.pagination?.page || 1} of{" "}
                {data?.pagination?.totalPages || 1}
              </span>
              <button
                className="btn btn-secondary"
                disabled={!data?.pagination?.hasPreviousPage}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>
              <button
                className="btn btn-secondary"
                disabled={!data?.pagination?.hasNextPage}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
      <Toast message={toast} onClose={() => setToast(null)} />
    </>
  );
}
