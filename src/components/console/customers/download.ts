import type { CustomerDetail, CustomerRow } from "@/lib/content/customers";
import { downloadCSV, downloadHTML } from "../shared/download";

export function downloadCustomersCSV(customers: CustomerRow[]) {
  downloadCSV(
    `emita-customers-${new Date().toISOString().slice(0, 10)}.csv`,
    ["Account", "Name", "Phone", "Email", "Meter", "DMA", "Zone", "Group", "Tariff", "Type", "Status", "Balance", "Last reading", "Current reading", "Modified"],
    customers.map((c) => [
      c.accountNumber, c.name, c.phone, c.email, c.meterNumber, c.dma, c.zone, c.group, c.tariff, c.billingType,
      c.status, c.balance, c.lastReadingValue, c.currentReadingValue, c.modifiedAt,
    ])
  );
}

export function downloadStatement(customer: CustomerRow, detail: CustomerDetail) {
  const rows = detail.invoices
    .map(
      (inv) => `<tr>
        <td>${inv.number}</td>
        <td>${inv.period}</td>
        <td>${inv.issuedDate}</td>
        <td>${inv.dueDate}</td>
        <td style="text-align:right">KSh ${inv.amount.toLocaleString()}</td>
        <td style="text-transform:capitalize">${inv.status}</td>
      </tr>`
    )
    .join("");

  const paymentRows = detail.payments
    .map(
      (p) => `<tr>
        <td>${p.date}</td>
        <td>${p.method}</td>
        <td>${p.reference}</td>
        <td>${p.appliedTo}</td>
        <td style="text-align:right">KSh ${p.amount.toLocaleString()}</td>
      </tr>`
    )
    .join("");

  const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>Statement — ${customer.accountNumber}</title>
<style>
  body { font-family: -apple-system, Segoe UI, Arial, sans-serif; color: #111827; padding: 40px; max-width: 780px; margin: 0 auto; }
  h1 { font-size: 20px; margin-bottom: 2px; }
  .muted { color: #667085; font-size: 12.5px; }
  .head { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #111827; padding-bottom: 16px; margin-bottom: 20px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 24px; margin-bottom: 24px; font-size: 13px; }
  .grid div span { display: block; color: #667085; font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 2px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 12.5px; }
  th, td { padding: 8px 6px; border-bottom: 1px solid #eef2f7; text-align: left; }
  th { text-transform: uppercase; font-size: 10px; letter-spacing: 0.06em; color: #667085; }
  .balance { text-align: right; font-size: 15px; font-weight: 700; margin-top: 8px; }
  @media print { body { padding: 0; } }
</style>
</head>
<body>
  <div class="head">
    <div>
      <h1>EMITA</h1>
      <div class="muted">Account statement</div>
    </div>
    <div class="muted" style="text-align:right">
      Generated ${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
    </div>
  </div>

  <div class="grid">
    <div><span>Customer</span>${customer.name}</div>
    <div><span>Account number</span>${customer.accountNumber}</div>
    <div><span>Phone</span>${customer.phone}</div>
    <div><span>Email</span>${customer.email}</div>
    <div><span>Address</span>${customer.address}</div>
    <div><span>Meter number</span>${customer.meterNumber}</div>
    <div><span>Zone / DMA</span>${customer.zone} / ${customer.dma}</div>
    <div><span>Tariff</span>${customer.tariff}</div>
  </div>

  <h3>Invoices</h3>
  <table>
    <thead><tr><th>Invoice</th><th>Period</th><th>Issued</th><th>Due</th><th style="text-align:right">Amount</th><th>Status</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>

  <h3>Payments</h3>
  <table>
    <thead><tr><th>Date</th><th>Method</th><th>Reference</th><th>Applied to</th><th style="text-align:right">Amount</th></tr></thead>
    <tbody>${paymentRows || '<tr><td colspan="5" class="muted">No payments recorded.</td></tr>'}</tbody>
  </table>

  <div class="balance">Current balance: KSh ${customer.balance.toLocaleString()}</div>
</body>
</html>`;

  downloadHTML(`statement-${customer.accountNumber}.html`, html);
}
