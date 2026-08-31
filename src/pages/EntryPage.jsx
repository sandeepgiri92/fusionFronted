import { Edit3, Plus, RefreshCw, Search, Trash2, Users } from "lucide-react";
import { useMemo, useState } from "react";

import AppModal from "@/components/AppModal";
import Toast from "@/components/Toast";

import {
  useCreatePartyMutation,
  useDeletePartyMutation,
  useGetPartiesQuery,
  useUpdatePartyMutation,
} from "@/features/party/partyApi";

import {
  useCreateEntryMutation,
  useDeleteEntryMutation,
  useGetEntryQuery,
  useUpdateEntryMutation,
} from "@/features/entryApi/entryApi";

const money = (n) => {
  return `₹ ${Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export default function EntryPage({ type }) {
  const module = type.toLowerCase();

  const [partyId, setPartyId] = useState("");
  const [searchParty, setSearchParty] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);

  const emptyForm = () => ({
    date: new Date().toISOString().slice(0, 10),
    productName: "",
    invoiceNo: "",
    serialNo: "",
    serviceDetail: "",
    amount: "",
    paymentStatus: "pending",
    remarks: "",
  });

  const [form, setForm] = useState(emptyForm);

  // =========================
  // PARTIES
  // =========================

  const { data: partiesData, isLoading: partiesLoading } = useGetPartiesQuery({
    module,
    search: searchParty,
  });

  const parties = partiesData?.data || [];

  // =========================
  // ENTRIES
  // =========================

  const { data, isLoading, isError, refetch } = useGetEntryQuery(
    {
      type,
      partyId,
      page,
      searchValue: search,
    },
    {
      skip: !partyId,
    },
  );

  // =========================
  // MUTATIONS
  // =========================

  const [createParty, { isLoading: creatingParty }] = useCreatePartyMutation();

  const [updateParty] = useUpdatePartyMutation();

  const [deleteParty] = useDeletePartyMutation();

  const [createEntry, { isLoading: creating }] = useCreateEntryMutation();

  const [updateEntry, { isLoading: updating }] = useUpdateEntryMutation();

  const [deleteEntry] = useDeleteEntryMutation();

  // =========================
  // DATA
  // =========================

  const rows = data?.data || [];
  const pagination = data?.pagination;

  const selectedParty = useMemo(
    () => parties.find((p) => p._id === partyId),
    [parties, partyId],
  );

  // =========================
  // SUBMIT ENTRY
  // =========================

  const submit = async (e) => {
    e.preventDefault();

    try {
      if (modal?.entry) {
        await updateEntry({
          type,
          id: modal.entry._id,
          partyId,
          entryData: form,
        }).unwrap();

        setToast(`${type} updated successfully`);
      } else {
        await createEntry({
          type,
          partyId,
          entryData: form,
        }).unwrap();

        setToast(`${type} added successfully`);
      }

      setModal(null);
      setForm(emptyForm());
      refetch();
    } catch (err) {
      setToast(err?.data?.message || "Operation failed");
    }
  };

  // =========================
  // ADD PARTY
  // =========================

  const addParty = async (e) => {
    e.preventDefault();

    try {
      await createParty({
        name: e.target.name.value,
        contactNo: e.target.contact.value,
        module,
      }).unwrap();

      setToast("Party saved");
      setModal(null);
    } catch (err) {
      setToast(err?.data?.message || "Unable to save party");
    }
  };

  // =========================
  // EDIT ENTRY
  // =========================

  const editEntry = (entry) => {
    setForm({
      date: entry.date
        ? new Date(entry.date).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),

      productName: entry.productName || "",
      invoiceNo: entry.invoiceNo || "",
      serialNo: entry.serialNo || "",
      serviceDetail: entry.serviceDetail || "",
      amount: entry.amount ?? "",
      paymentStatus: entry.paymentStatus || "pending",
      remarks: entry.remarks || "",
    });

    setModal({
      entry,
    });
  };

  // =========================
  // DELETE ENTRY
  // =========================

  const remove = async (id) => {
    if (!confirm("Delete this entry permanently?")) {
      return;
    }

    try {
      await deleteEntry({
        type,
        id,
      }).unwrap();

      setToast("Entry deleted");
      refetch();
    } catch (err) {
      setToast(err?.data?.message || "Unable to delete");
    }
  };

  // =========================
  // EDIT PARTY
  // =========================

  const editParty = async () => {
    if (!selectedParty) {
      return;
    }

    const name = prompt("Party name", selectedParty.name);

    if (name === null) {
      return;
    }

    const contact = prompt("Mobile number", selectedParty.contactNo);

    if (contact === null) {
      return;
    }

    try {
      await updateParty({
        id: selectedParty._id,
        name,
        contactNo: contact,
      }).unwrap();

      setToast("Party updated");
    } catch (err) {
      setToast(err?.data?.message || "Unable to update");
    }
  };

  // =========================
  // DELETE PARTY
  // =========================

  const removeParty = async () => {
    if (!selectedParty || !confirm("Remove this party?")) {
      return;
    }

    try {
      await deleteParty(selectedParty._id).unwrap();

      setPartyId("");
      setPage(1);
      setToast("Party removed");
    } catch (err) {
      setToast(err?.data?.message || "This party cannot be removed");
    }
  };

  // =========================
  // RENDER
  // =========================

  return (
    <>
      {/* =========================
          PAGE TITLE
      ========================== */}

      <div className="page-title">
        <div>
          <div className="eyebrow">Workspace / {type}</div>

          <h1>{type}s</h1>

          <p>
            Manage {type.toLowerCase()} records, payment status and history.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => {
            if (!partyId) {
              setToast("Select a party first");
              return;
            }

            setForm(emptyForm());

            setModal({
              entry: null,
            });
          }}
        >
          <Plus size={16} />
          Add {type}
        </button>
      </div>

      {/* =========================
          PARTY TOOLBAR
      ========================== */}

      <div
        className="panel"
        style={{
          marginBottom: 16,
        }}
      >
        <div
          className="toolbar"
          style={{
            padding: 0,
            border: 0,
          }}
        >
          {/* Party Search */}

          <div className="search">
            <Search size={15} />

            <input
              placeholder="Search parties…"
              value={searchParty}
              onChange={(e) => {
                setSearchParty(e.target.value);

                setPage(1);
              }}
            />
          </div>

          {/* Party Select */}

          <select
            className="select"
            style={{
              maxWidth: 270,
            }}
            value={partyId}
            onChange={(e) => {
              setPartyId(e.target.value);

              setPage(1);
              setSearch("");
            }}
          >
            <option value="">
              {partiesLoading ? "Loading parties…" : "Select party"}
            </option>

            {parties.map((party) => (
              <option value={party._id} key={party._id}>
                {party.name} · {party.contactNo}
              </option>
            ))}
          </select>

          {/* New Party */}

          <button
            className="btn btn-secondary"
            onClick={() =>
              setModal({
                party: true,
              })
            }
          >
            <Users size={15} />
            New party
          </button>

          {/* Edit/Delete Party */}

          {selectedParty && (
            <>
              <button
                className="small-btn"
                title="Edit party"
                onClick={editParty}
              >
                <Edit3 size={15} />
              </button>

              <button
                className="small-btn"
                title="Remove party"
                onClick={removeParty}
              >
                <Trash2 size={15} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* =========================
          ENTRY TABLE
      ========================== */}

      {partyId ? (
        <div className="panel table-panel">
          {/* Table Toolbar */}

          <div className="toolbar">
            <div className="search">
              <Search size={15} />

              <input
                placeholder={`Search ${type.toLowerCase()} records…`}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);

                  setPage(1);
                }}
              />
            </div>

            <button className="small-btn" onClick={refetch} title="Refresh">
              <RefreshCw size={15} />
            </button>
          </div>

          {/* Loading */}

          {isLoading ? (
            <div className="empty">Loading records…</div>
          ) : isError ? (
            /* Error */

            <div className="empty">
              <b>Could not load records</b>

              <button className="btn btn-secondary" onClick={refetch}>
                Try again
              </button>
            </div>
          ) : (
            /* Data */

            <>
              <div className="table-wrap">
                <table className="table">
                  {/* TABLE HEAD */}

                  <thead>
                    <tr>
                      {type === "Service" ? (
                        <>
                          <th>Date</th>
                          <th>Service</th>
                        </>
                      ) : (
                        <>
                          <th>Date</th>
                          <th>Product</th>
                          <th>Invoice</th>
                          <th>Serial</th>
                        </>
                      )}

                      <th>Remarks</th>
                      <th>Amount</th>
                      <th>Payment</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  {/* TABLE BODY */}

                  <tbody>
                    {rows.length > 0 ? (
                      rows.map((row) => (
                        <tr key={row._id}>
                          {/* DATE */}

                          <td>
                            {row.date
                              ? new Date(row.date).toLocaleDateString("en-IN")
                              : "—"}
                          </td>

                          {/* SERVICE */}

                          {type === "Service" ? (
                            <td>{row.serviceDetail || "—"}</td>
                          ) : (
                            <>
                              {/* PRODUCT */}

                              <td>{row.productName || "—"}</td>

                              {/* INVOICE */}

                              <td>{row.invoiceNo || "—"}</td>

                              {/* SERIAL */}

                              <td>{row.serialNo || "—"}</td>
                            </>
                          )}

                          {/* REMARKS */}

                          <td>{row.remarks || "—"}</td>

                          {/* AMOUNT */}

                          <td>
                            <b>{money(row.amount)}</b>
                          </td>

                          {/* PAYMENT */}

                          <td>
                            <span
                              className={`status ${
                                row.paymentStatus || "pending"
                              }`}
                            >
                              {row.paymentStatus || "pending"}
                            </span>
                          </td>

                          {/* ACTIONS */}

                          <td>
                            <div className="actions">
                              {/* EDIT */}

                              <button
                                className="small-btn"
                                title="Edit"
                                onClick={() => editEntry(row)}
                              >
                                <Edit3 size={14} />
                              </button>

                              {/* DELETE */}

                              <button
                                className="small-btn"
                                title="Delete"
                                onClick={() => remove(row._id)}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      /* NO DATA */

                      <tr>
                        <td colSpan={type === "Service" ? 7 : 9}>
                          <div className="empty">No records found.</div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* =========================
                  PAGINATION
              ========================== */}

              <div className="pagination">
                <span>
                  Page {pagination?.currentPage || 1} of{" "}
                  {pagination?.totalPages || 1} · {pagination?.totalData || 0}{" "}
                  records
                </span>

                {/* PREVIOUS */}

                <button
                  className="btn btn-secondary"
                  disabled={!pagination?.hasPreviousPage}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </button>

                {/* NEXT */}

                <button
                  className="btn btn-secondary"
                  disabled={!pagination?.hasNextPage}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        /* NO PARTY SELECTED */

        <div className="panel empty">
          <b>Select a party to view {type.toLowerCase()} records</b>

          <span>Or create a new party to get started.</span>
        </div>
      )}

      {/* =========================
          CREATE PARTY MODAL
      ========================== */}

      {modal?.party && (
        <AppModal title="Create party" onClose={() => setModal(null)}>
          <form onSubmit={addParty}>
            <div className="form-grid">
              {/* NAME */}

              <div className="field">
                <label>Name</label>

                <input
                  className="input"
                  name="name"
                  required
                  placeholder="Customer / supplier name"
                />
              </div>

              {/* MOBILE */}

              <div className="field">
                <label>Mobile</label>

                <input
                  className="input"
                  name="contact"
                  required
                  placeholder="10 digit mobile"
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

              <button className="btn btn-primary" disabled={creatingParty}>
                {creatingParty ? "Saving…" : "Save party"}
              </button>
            </div>
          </form>
        </AppModal>
      )}

      {/* =========================
          ADD / EDIT ENTRY MODAL
      ========================== */}

      {modal && !modal.party && (
        <AppModal
          title={`${modal.entry ? "Edit" : "Add"} ${type}`}
          onClose={() => setModal(null)}
        >
          <form onSubmit={submit}>
            <div className="form-grid">
              {/* SERVICE */}

              {type === "Service" ? (
                <div className="field full">
                  <label>Service detail</label>

                  <textarea
                    className="textarea"
                    rows="3"
                    value={form.serviceDetail}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        serviceDetail: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              ) : (
                <>
                  {/* PRODUCT */}

                  <div className="field full">
                    <label>Product name</label>

                    <input
                      className="input"
                      value={form.productName}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          productName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  {/* INVOICE */}

                  <div className="field">
                    <label>Invoice number</label>

                    <input
                      className="input"
                      value={form.invoiceNo}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          invoiceNo: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  {/* SERIAL */}

                  <div className="field">
                    <label>Serial number</label>

                    <input
                      className="input"
                      value={form.serialNo}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          serialNo: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </>
              )}

              {/* DATE */}

              <div className="field">
                <label>Date</label>

                <input
                  type="date"
                  className="input"
                  value={form.date}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      date: e.target.value,
                    })
                  }
                  required
                />
              </div>

              {/* AMOUNT */}

              <div className="field">
                <label>Amount</label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="input"
                  value={form.amount}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      amount: e.target.value,
                    })
                  }
                  required
                />
              </div>

              {/* REMARKS */}

              <div className="field full">
                <label>Remarks</label>

                <textarea
                  className="textarea"
                  rows="3"
                  value={form.remarks}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      remarks: e.target.value,
                    })
                  }
                  placeholder="Optional remarks"
                />
              </div>

              {/* PAYMENT STATUS */}

              <div className="field full">
                <label>Payment status</label>

                <div className="radio-row">
                  {/* PAID */}

                  <label
                    className={`radio ${
                      form.paymentStatus === "paid" ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="pay"
                      checked={form.paymentStatus === "paid"}
                      onChange={() =>
                        setForm({
                          ...form,
                          paymentStatus: "paid",
                        })
                      }
                    />
                    Paid
                  </label>

                  {/* PENDING */}

                  <label
                    className={`radio ${
                      form.paymentStatus === "pending" ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="pay"
                      checked={form.paymentStatus === "pending"}
                      onChange={() =>
                        setForm({
                          ...form,
                          paymentStatus: "pending",
                        })
                      }
                    />
                    Pending
                  </label>
                </div>
              </div>
            </div>

            {/* FORM ACTIONS */}

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
                {creating || updating ? "Saving…" : "Save changes"}
              </button>
            </div>
          </form>
        </AppModal>
      )}

      {/* =========================
          TOAST
      ========================== */}

      <Toast
        message={toast}
        type={
          toast?.toLowerCase().includes("unable") ||
          toast?.toLowerCase().includes("failed") ||
          toast?.toLowerCase().includes("cannot") ||
          toast?.toLowerCase().includes("operation failed")
            ? "error"
            : "success"
        }
        onClose={() => setToast(null)}
      />
    </>
  );
}
