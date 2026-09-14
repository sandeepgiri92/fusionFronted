// ============================================================
// FUSION ENTERPRISES — Bill / Invoice PDF Generator
// Generates a professional A4 invoice matching the official
// printed bill format (red header, customer box, line items
// table, totals, payment summary, signature footer).
// Uses the browser's print-to-PDF (vector, high quality).
// ============================================================

// ---------- helpers ----------
const money = (n) =>
  `Rs. ${Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const moneyShort = (n) =>
  `${Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const fmtDate = (d) => {
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "—";
  return dt.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// ---------- Indian number to words ----------

const ones = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];
const tens = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];

const twoDigits = (n) => {
  if (n < 20) return ones[n];
  return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
};

const threeDigits = (n) => {
  const h = Math.floor(n / 100);
  const r = n % 100;
  let str = "";
  if (h) str += ones[h] + " Hundred";
  if (r) str += (h ? " " : "") + twoDigits(r);
  return str;
};

const numberToWordsIndian = (num) => {
  num = Math.floor(Number(num) || 0);
  if (num === 0) return "Zero";

  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;
  const hundred = num;

  let str = "";
  if (crore) str += threeDigits(crore) + " Crore ";
  if (lakh) str += twoDigits(lakh) + " Lakh ";
  if (thousand) str += twoDigits(thousand) + " Thousand ";
  if (hundred) str += threeDigits(hundred);

  return str.trim();
};

const amountInWords = (n) => {
  const num = Number(n || 0);
  const rupees = Math.floor(num);
  const paise = Math.round((num - rupees) * 100);
  let words = numberToWordsIndian(rupees) + " Rupees";
  if (paise > 0) words += " and " + numberToWordsIndian(paise) + " Paise";
  return words + " Only";
};

// ---------- API base (for Word bill download) ----------

const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000";

// ---------- company constants ----------

const COMPANY = {
  name: "FUSION ENTERPRISES",
  address:
    "Shop No.34, Kinjal Complex, Yashwant Shrushti, Boisar (W), Tal &amp; Dist - Palghar 401501",
  email: "fusionenterprises92@gmail.com",
  mobile: "8983638563",
};

// ---------- build line items ----------

const buildItems = (type, entry) => {
  const items = [];
  if (type === "Service") {
    items.push({
      particulars: esc(entry.serviceDetail || "Service charges"),
      qty: 1,
      rate: Number(entry.amount || 0),
    });
  } else {
    items.push({
      particulars: esc(entry.productName || "Product"),
      qty: 1,
      rate: Number(entry.amount || 0),
    });
    if (entry.serialNo) {
      items.push({
        particulars: `Serial No: ${esc(entry.serialNo)}`,
        qty: "",
        rate: "",
      });
    }
    if (entry.invoiceNo) {
      items.push({
        particulars: `Invoice Ref: ${esc(entry.invoiceNo)}`,
        qty: "",
        rate: "",
      });
    }
  }
  if (entry.remarks) {
    items.push({
      particulars: `Remarks: ${esc(entry.remarks)}`,
      qty: "",
      rate: "",
    });
  }
  // pad to at least 5 rows
  while (items.length < 5) {
    items.push({ particulars: "", qty: "", rate: "" });
  }
  return items;
};

// ---------- HTML generator ----------

export function makeBillHtml({ type, party, entry }) {
  const isService = type === "Service";
  const total = Number(entry.amount || 0);
  const paid = Number(entry.totalPaid || 0);
  const due = Math.max(total - paid, 0);
  const status = paid <= 0 ? "UNPAID" : paid >= total ? "PAID" : "PARTIAL";

  const docTitle = isService ? "SERVICE RECEIPT" : "SALES INVOICE";
  const docNumber = isService
    ? `SR-${String(entry._id || "")
        .slice(-8)
        .toUpperCase()}`
    : entry.invoiceNo ||
      `INV-${String(entry._id || "")
        .slice(-8)
        .toUpperCase()}`;

  const partyName = esc(party?.name || "Customer");
  const partyContact = esc(party?.contactNo || "—");

  const items = buildItems(type, entry);
  const itemsRows = items
    .map(
      (it, i) => `
      <tr>
        <td class="center">${i + 1}</td>
        <td>${it.particulars}</td>
        <td class="center">${it.qty}</td>
        <td class="right">${it.rate !== "" ? moneyShort(it.rate) : ""}</td>
        <td class="right">${it.rate !== "" ? moneyShort(it.rate) : ""}</td>
      </tr>`,
    )
    .join("");

  const paymentsHtml =
    entry.payments && entry.payments.length
      ? `
      <div class="payment-history-block">
        <h3>Payment History</h3>
        <table class="pay-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            ${entry.payments
              .map(
                (p, i) => `
              <tr>
                <td class="center">${i + 1}</td>
                <td class="center">${fmtDate(p.paymentDate)}</td>
                <td class="right">${moneyShort(p.amount)}</td>
                <td>${esc(p.remarks || "—")}</td>
              </tr>`,
              )
              .join("")}
          </tbody>
        </table>
      </div>`
      : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${docTitle} — ${docNumber}</title>
<style>
  @page { size: A4; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { background: #fff; }
  body {
    font-family: Arial, Helvetica, sans-serif;
    color: #111;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .bill {
    width: 210mm;
    min-height: 297mm;
    padding: 14mm 12mm 18mm;
    position: relative;
    background: #fff;
  }

  /* ---- header ---- */
  .header {
    text-align: center;
    border-bottom: 2.5px solid #111;
    padding-bottom: 10px;
    margin-bottom: 12px;
  }
  .company-name {
    font-size: 30px;
    font-weight: bold;
    color: #c0392b;
    letter-spacing: 2px;
    margin-bottom: 3px;
  }
  .company-addr {
    font-size: 10.5px;
    line-height: 1.55;
    color: #222;
  }
  .company-contact {
    font-size: 10.5px;
    margin-top: 2px;
    color: #222;
  }

  /* ---- doc title ---- */
  .doc-title {
    text-align: center;
    font-size: 15px;
    font-weight: bold;
    letter-spacing: 3px;
    text-transform: uppercase;
    margin: 6px 0 12px;
    border: 1.5px solid #111;
    padding: 5px 0;
    background: #f8f8f8;
  }

  /* ---- meta / customer box ---- */
  .meta-section {
    display: flex;
    gap: 0;
    margin-bottom: 12px;
    border: 1.5px solid #111;
  }
  .meta-left, .meta-right {
    flex: 1;
    padding: 9px 12px;
    font-size: 11px;
  }
  .meta-left {
    border-right: 1.5px solid #111;
  }
  .meta-row {
    margin-bottom: 7px;
    display: flex;
    align-items: baseline;
    gap: 6px;
  }
  .meta-row:last-child { margin-bottom: 0; }
  .meta-label {
    font-weight: bold;
    min-width: 62px;
    color: #444;
  }
  .meta-value {
    flex: 1;
    border-bottom: 1px dotted #888;
    padding-bottom: 1px;
    font-weight: 600;
  }

  /* ---- items table ---- */
  .items-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 0;
  }
  .items-table th, .items-table td {
    border: 1px solid #111;
    padding: 6px 8px;
    font-size: 10.5px;
  }
  .items-table thead th {
    background: #f0f0f0;
    font-weight: bold;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 8px;
  }
  .items-table td.center { text-align: center; }
  .items-table td.right { text-align: right; }
  .items-table td:first-child { text-align: center; width: 8%; }
  .items-table td:nth-child(2) { width: 52%; }
  .items-table td:nth-child(3) { text-align: center; width: 10%; }
  .items-table td:nth-child(4) { text-align: right; width: 15%; }
  .items-table td:nth-child(5) { text-align: right; width: 15%; }
  .items-table tr { height: 26px; }

  /* ---- totals row ---- */
  .totals-row {
    display: flex;
    border: 1px solid #111;
    border-top: 0;
    margin-bottom: 14px;
  }
  .words-box {
    flex: 1;
    padding: 9px 12px;
    font-size: 10.5px;
    border-right: 1px solid #111;
    display: flex;
    align-items: center;
  }
  .words-box b { margin-right: 6px; white-space: nowrap; }
  .words-box span { font-style: italic; }
  .total-box {
    width: 35%;
    padding: 9px 12px;
    text-align: right;
    font-size: 12px;
  }
  .total-box .grand {
    font-size: 17px;
    font-weight: bold;
    margin-top: 3px;
  }

  /* ---- payment summary ---- */
  .pay-summary {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 14px;
  }
  .pay-summary th, .pay-summary td {
    border: 1.5px solid #111;
    padding: 8px;
    font-size: 11px;
    text-align: center;
  }
  .pay-summary th {
    background: #f0f0f0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .pay-summary td { font-weight: bold; }
  .pay-summary .status-cell {
    font-weight: bold;
    font-size: 12px;
  }
  .pay-summary .status-cell.paid { color: #18824a; }
  .pay-summary .status-cell.unpaid { color: #c0392b; }
  .pay-summary .status-cell.partial { color: #e67e22; }

  /* ---- payment history ---- */
  .payment-history-block {
    margin-bottom: 14px;
  }
  .payment-history-block h3 {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 6px;
    color: #444;
  }
  .pay-table {
    width: 100%;
    border-collapse: collapse;
  }
  .pay-table th, .pay-table td {
    border: 1px solid #999;
    padding: 5px 8px;
    font-size: 10px;
    text-align: left;
  }
  .pay-table th {
    background: #f8f8f8;
    text-transform: uppercase;
  }
  .pay-table td.center { text-align: center; }
  .pay-table td.right { text-align: right; }

  /* ---- footer ---- */
  .footer {
    position: absolute;
    bottom: 16mm;
    left: 12mm;
    right: 12mm;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  .footer-left {
    font-size: 10px;
    color: #555;
    max-width: 45%;
  }
  .footer-right {
    text-align: center;
    width: 180px;
  }
  .footer-right .for-text {
    color: #c0392b;
    font-weight: bold;
    font-size: 13px;
    margin-bottom: 35px;
  }
  .footer-right .sign-line {
    border-top: 1px solid #111;
    padding-top: 3px;
    font-size: 10px;
    color: #444;
  }

  /* ---- print ---- */
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
  @media screen {
    body { background: #e9e9e9; }
    .bill {
      margin: 20px auto;
      box-shadow: 0 4px 30px rgba(0,0,0,0.18);
    }
  }
</style>
</head>
<body>
<div class="bill">

  <!-- ========== HEADER ========== -->
  <div class="header">
    <div class="company-name">${COMPANY.name}</div>
    <div class="company-addr">${COMPANY.address}</div>
    <div class="company-contact">Email: ${COMPANY.email} &nbsp;|&nbsp; Mob: ${COMPANY.mobile}</div>
  </div>

  <!-- ========== DOC TITLE ========== -->
  <div class="doc-title">${docTitle}</div>

  <!-- ========== CUSTOMER / META BOX ========== -->
  <div class="meta-section">
    <div class="meta-left">
      <div class="meta-row">
        <span class="meta-label">${isService ? "Receipt No.:" : "Invoice No.:"}</span>
        <span class="meta-value">${esc(isService ? docNumber : entry.invoiceNo || docNumber)}</span>
      </div>
      <div class="meta-row">
        <span class="meta-label">M/s:</span>
        <span class="meta-value">${partyName}</span>
      </div>
      <div class="meta-row">
        <span class="meta-label">Mobile:</span>
        <span class="meta-value">${partyContact}</span>
      </div>
    </div>
    <div class="meta-right">
      <div class="meta-row">
        <span class="meta-label">Date:</span>
        <span class="meta-value">${fmtDate(entry.date)}</span>
      </div>
      ${
        !isService && entry.serialNo
          ? `
      <div class="meta-row">
        <span class="meta-label">Serial No:</span>
        <span class="meta-value">${esc(entry.serialNo)}</span>
      </div>`
          : ""
      }
      <div class="meta-row">
        <span class="meta-label">Type:</span>
        <span class="meta-value">${isService ? "Service" : "Sale"}</span>
      </div>
    </div>
  </div>

  <!-- ========== LINE ITEMS TABLE ========== -->
  <table class="items-table">
    <thead>
      <tr>
        <th>Sr. No.</th>
        <th>Particulars</th>
        <th>Qty</th>
        <th>Rate (Rs.)</th>
        <th>Amount (Rs.)</th>
      </tr>
    </thead>
    <tbody>
      ${itemsRows}
    </tbody>
  </table>

  <!-- ========== TOTALS ROW ========== -->
  <div class="totals-row">
    <div class="words-box">
      <b>Rs. in Words:</b>
      <span>${amountInWords(total)}</span>
    </div>
    <div class="total-box">
      <div>Total</div>
      <div class="grand">${moneyShort(total)}</div>
    </div>
  </div>

  <!-- ========== PAYMENT SUMMARY ========== -->
  <table class="pay-summary">
    <thead>
      <tr>
        <th>Total Amount</th>
        <th>Paid Amount</th>
        <th>Balance Due</th>
        <th>Payment Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>${moneyShort(total)}</td>
        <td>${moneyShort(paid)}</td>
        <td>${moneyShort(due)}</td>
        <td class="status-cell ${status.toLowerCase()}">${status}</td>
      </tr>
    </tbody>
  </table>

  <!-- ========== PAYMENT HISTORY ========== -->
  ${paymentsHtml}

  <!-- ========== FOOTER ========== -->
  <div class="footer">
    <div class="footer-left">
      ${entry.remarks ? `<b>Notes:</b> ${esc(entry.remarks)}` : ""}
    </div>
    <div class="footer-right">
      <div class="for-text">For ${COMPANY.name}</div>
      <div class="sign-line">Authorised Signatory</div>
    </div>
  </div>

</div>

<script>
  // Auto-trigger print on load
  window.addEventListener('load', function() {
    setTimeout(function() {
      window.focus();
      window.print();
    }, 300);
  });
</script>
</body>
</html>`;
}

// ---------- open bill in new window & print ----------

const openBillWindow = (html) => {
  const w = window.open("", "_blank", "width=820,height=900");
  if (!w) {
    alert("Please allow pop-ups to generate the bill.");
    return null;
  }
  w.document.open();
  w.document.write(html);
  w.document.close();
  return w;
};

// ---------- deliver bill (main entry point) ----------

export async function deliverBill({ type, party, entry }) {
  const html = makeBillHtml({ type, party, entry });
  const name = `${
    type === "Service" ? "Service-Receipt" : "Sales-Invoice"
  }-${entry.invoiceNo || String(entry._id || "").slice(-8)}.pdf`;

  // Mobile — try Web Share API with the entry data so user can share to WhatsApp etc.
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isMobile && navigator.share) {
    try {
      await navigator.share({
        title: type === "Service" ? "Service Receipt" : "Sales Invoice",
        text: `${party?.name || "Customer"} — ${money(entry.amount)}`,
      });
      // Still open print window after share
      openBillWindow(html);
      return { shared: true, name, type, party, entry };
    } catch (err) {
      if (err?.name === "AbortError") throw err;
      // fall through to opening print window
    }
  }

  // Desktop / fallback — open print window
  openBillWindow(html);
  return { shared: false, name, type, party, entry };
}

// ---------- download Word bill (exact printed format template) ----------

export async function downloadBillDocx({ type, entry }) {
  const res = await fetch(
    `${API_URL}/api/entry/${type}/${entry._id}/bill-docx`,
    { credentials: "include" },
  );
  if (!res.ok) throw new Error("Unable to generate Word bill");
  const blob = await res.blob();
  const cd = res.headers.get("Content-Disposition") || "";
  const m = cd.match(/filename="?([^";]+)"?/);
  const name = m
    ? m[1]
    : `${type === "Service" ? "Service-Receipt" : "Invoice"}-${entry.invoiceNo || String(entry._id || "").slice(-8)}.docx`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  return name;
}

// -----------------------------

export async function downloadBillPdf({ type, entry }) {
  const res = await fetch(
    `${API_URL}/api/entry/${type}/${entry._id}/bill-pdf`,
    {
      credentials: "include",
    },
  );
  if (!res.ok) throw new Error("Unable to generate PDF bill");
  const blob = await res.blob();
  const cd = res.headers.get("Content-Disposition") || "";
  const m = cd.match(/filename="?([^";]+)"?/);
  const name = m
    ? m[1]
    : `${type === "Service" ? "Service-Receipt" : "Invoice"}-${entry.invoiceNo || String(entry._id || "").slice(-8)}.pdf`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  return name;
}

// ---------- re-print bill ----------

export function printBill(doc) {
  // Accept either the new doc object {type,party,entry} or a legacy blob
  if (doc && doc.type && doc.entry) {
    const html = makeBillHtml({
      type: doc.type,
      party: doc.party,
      entry: doc.entry,
    });
    openBillWindow(html);
    return;
  }
  // Legacy: blob was an HTML blob
  if (doc instanceof Blob) {
    const url = URL.createObjectURL(doc);
    const w = window.open(url, "_blank");
    if (w) {
      w.addEventListener("load", () => w.print(), { once: true });
    }
    return url;
  }
}

export { money as billMoney };
