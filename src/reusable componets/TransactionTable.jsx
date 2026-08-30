const TransactionTable = ({ transactions = [] }) => {
  return (
    <div className="w-full overflow-hidden rounded-md border border-slate-200 bg-white">
      {/* Table */}
      <table className="w-full border-collapse">
        {/* Header */}
        <thead>
          <tr className="bg-blue-100">
            <th className="px-4 py-3 text-left text-sm font-medium text-slate-900">
              Date
            </th>

            <th className="px-4 py-3 text-left text-sm font-medium text-slate-900">
              Type
            </th>

            <th className="px-4 py-3 text-left text-sm font-medium text-slate-900">
              Party Name
            </th>

            <th className="px-4 py-3 text-right text-sm font-medium text-slate-900">
              Amount
            </th>

            <th className="px-4 py-3 text-center text-sm font-medium text-slate-900">
              Status
            </th>
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((item, index) => (
              <tr
                key={item.transactionId || index}
                className="border-t border-slate-200 transition hover:bg-slate-50"
              >
                {/* Date */}
                <td className="px-4 py-3 text-sm text-slate-900">
                  {new Date(item.paymentDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>

                {/* Type */}
                <td className="px-4 py-3 text-sm text-slate-900">
                  {item.type}
                </td>

                {/* Party */}
                <td className="px-4 py-3 text-sm text-slate-900">
                  {item.partyName}
                </td>

                {/* Amount */}
                <td className="px-4 py-3 text-right text-sm font-medium text-slate-900">
                  ₹{Number(item.amount).toLocaleString("en-IN")}
                </td>

                {/* Status */}
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-flex min-w-[78px] justify-center rounded-full px-3 py-1 text-xs font-semibold text-white ${
                      item.status === "paid" ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {item.status === "paid" ? "Paid" : "Pending"}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="5"
                className="py-10 text-center text-sm text-slate-400"
              >
                No transactions found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
