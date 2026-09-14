import AppModal from "@/components/AppModal";
import Toast from "@/components/Toast";
import {
  useCreateStockMutation,
  useDeleteStockMutation,
  useGetStockQuery,
  useUpdateStockMutation,
} from "@/features/stock/stockApi";
import { Edit3, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import { useState } from "react";
const today = () => new Date().toISOString().slice(0, 10);
const empty = () => ({
  itemName: "",
  quantity: "",
  date: today(),
  remarks: "",
});
export default function Stock() {
  const [filters, setFilters] = useState({
      search: "",
      dateFrom: "",
      dateTo: "",
    }),
    [page, setPage] = useState(1),
    [modal, setModal] = useState(null),
    [form, setForm] = useState(empty()),
    [toast, setToast] = useState(null);
  const { data, isLoading, refetch } = useGetStockQuery({ ...filters, page });
  const [create, { isLoading: creating }] = useCreateStockMutation(),
    [update, { isLoading: updating }] = useUpdateStockMutation(),
    [remove] = useDeleteStockMutation();
  const rows = data?.data || [];
  const save = async (e) => {
    e.preventDefault();
    try {
      if (modal) {
        await update({
          id: modal._id,
          ...form,
          quantity: Number(form.quantity),
        }).unwrap();
        setToast("Stock updated");
      } else {
        await create({ ...form, quantity: Number(form.quantity) }).unwrap();
        setToast("Stock added");
      }
      setModal(null);
      setForm(empty());
    } catch (err) {
      setToast(err?.data?.message || "Unable to save stock");
    }
  };
  const edit = (r) => {
    setForm({
      itemName: r.itemName,
      quantity: r.quantity,
      date: new Date(r.date).toISOString().slice(0, 10),
      remarks: r.remarks || "",
    });
    setModal(r);
  };
  const del = async (id) => {
    if (!confirm("Delete this stock record?")) return;
    try {
      await remove(id).unwrap();
      setToast("Stock deleted");
    } catch (e) {
      setToast(e?.data?.message || "Unable to delete stock");
    }
  };
  return (
    <>
      <div className="page-title">
        <div>
          <div className="eyebrow">Workspace / Inventory</div>
          <h1>Stock</h1>
          <p>Track stock entries and quickly find items by name or date.</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setForm(empty());
            setModal(false);
          }}
        >
          <Plus size={16} /> Add new stock
        </button>
      </div>
      <div className="panel table-panel">
        <div className="toolbar">
          <div className="search">
            <Search size={15} />
            <input
              placeholder="Search item name…"
              value={filters.search}
              onChange={(e) => {
                setFilters({ ...filters, search: e.target.value });
                setPage(1);
              }}
            />
          </div>

          <button className="small-btn" onClick={refetch}>
            <RefreshCw size={15} />
          </button>
        </div>
        {isLoading ? (
          <div className="empty">Loading stock…</div>
        ) : (
          <>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Item name</th>
                    <th>Quantity</th>
                    <th>Status</th>
                    <th>Remarks</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length ? (
                    rows.map((r) => (
                      <tr key={r._id}>
                        <td>{new Date(r.date).toLocaleDateString("en-IN")}</td>
                        <td>
                          <b>{r.itemName}</b>
                        </td>
                        <td>{r.quantity}</td>
                        <td>
                          <span className={`status ${r.status}`}>
                            {r.status === "in-stock"
                              ? "In Stock"
                              : "Out of Stock"}
                          </span>
                        </td>
                        <td>{r.remarks || "—"}</td>
                        <td>
                          <div className="actions">
                            <button
                              className="small-btn"
                              onClick={() => edit(r)}
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              className="small-btn"
                              onClick={() => del(r._id)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6">
                        <div className="empty">No stock records found.</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="pagination">
              <span>
                Page {data?.pagination?.currentPage || 1} of{" "}
                {data?.pagination?.totalPages || 1} ·{" "}
                {data?.pagination?.totalData || 0} records
              </span>
              <button
                className="btn btn-secondary"
                disabled={!data?.pagination?.hasPreviousPage}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>
              <button
                className="btn btn-secondary"
                disabled={!data?.pagination?.hasNextPage}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
      {modal !== null && (
        <AppModal
          title={modal ? "Edit stock" : "Add new stock"}
          onClose={() => setModal(null)}
        >
          <form onSubmit={save}>
            <div className="form-grid">
              <div className="field full">
                <label>Item name</label>
                <input
                  autoFocus
                  className="input"
                  value={form.itemName}
                  onChange={(e) =>
                    setForm({ ...form, itemName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="field">
                <label>Quantity</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  className="input"
                  value={form.quantity}
                  onChange={(e) =>
                    setForm({ ...form, quantity: e.target.value })
                  }
                  required
                />
              </div>
              <div className="field">
                <label>Date</label>
                <input
                  type="date"
                  className="input"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                />
              </div>
              <div className="field full">
                <label>Remarks</label>
                <textarea
                  className="textarea"
                  rows="3"
                  value={form.remarks}
                  onChange={(e) =>
                    setForm({ ...form, remarks: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setModal(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                disabled={creating || updating}
              >
                {creating || updating
                  ? "Saving…"
                  : modal
                    ? "Update stock"
                    : "Add stock"}
              </button>
            </div>
          </form>
        </AppModal>
      )}
      <Toast message={toast} onClose={() => setToast(null)} />
    </>
  );
}
