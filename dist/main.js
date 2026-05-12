"use strict";
const defaultLogo = 'data:image/svg+xml;utf8,' +
    encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 96" role="img" aria-label="Invizion Holding">
      <rect width="420" height="96" fill="white"/>
      <path d="M31 72 66 24l35 48H80L66 52 52 72H31Z" fill="#1e2a4a"/>
      <path d="M66 24 48 72h18l11-29-11-19Z" fill="#D4A574"/>
      <text x="124" y="49" fill="#1e2a4a" font-family="Arial, Helvetica, sans-serif" font-size="29" font-weight="700" letter-spacing="4">INVIZION</text>
      <text x="126" y="72" fill="#D4A574" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700" letter-spacing="7">HOLDING</text>
    </svg>
  `);
let rows = [
    { id: 1, description: 'Strategic Advisory Services — Q2 2026', qty: '40 h', rate: '250.00', amount: '10,000.00' },
    { id: 2, description: 'Market Entry Analysis Report', qty: '1', rate: '4,500.00', amount: '4,500.00' },
    { id: 3, description: 'Executive Briefing Sessions', qty: '6', rate: '750.00', amount: '4,500.00' },
    { id: 4, description: 'Due Diligence Review — Project Atlas', qty: '1', rate: '6,800.00', amount: '6,800.00' },
    { id: 5, description: 'Documentation & Deliverables Preparation', qty: '12 h', rate: '180.00', amount: '2,160.00' },
];
let currency = 'USD';
let vatRate = 20;
let invoiceDate = '2026-04-21';
let dueDate = '2026-05-21';
let logos = [{ id: 'default', name: 'INVIZION HOLDING', url: defaultLogo }];
let selectedLogoId = 'default';
const currencySymbols = {
    USD: '$',
    TRY: '₺',
    EUR: '€',
};
const icon = {
    plus: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    trash: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14"/></svg>',
    print: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v7H6z"/></svg>',
};
function parseNumber(value) {
    const cleaned = value.replace(/[^0-9.-]/g, '');
    return Number.parseFloat(cleaned) || 0;
}
function formatNumber(value) {
    return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function formatDateDisplay(dateString) {
    const date = new Date(`${dateString}T00:00:00`);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}
function calculateRowAmount(qty, rate) {
    return formatNumber(parseNumber(qty) * parseNumber(rate));
}
function totals() {
    const subtotal = rows.reduce((sum, row) => sum + parseNumber(row.amount), 0);
    const vat = subtotal * (vatRate / 100);
    return { subtotal, vat, total: subtotal + vat };
}
function escapeAttribute(value) {
    return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
function currentLogo() {
    return logos.find((logo) => logo.id === selectedLogoId) ?? logos[0];
}
function render() {
    const app = document.querySelector('#app');
    if (!app)
        return;
    const logo = currentLogo();
    const invoiceTotals = totals();
    const currencyName = `${currency} (${currencySymbols[currency]})`;
    app.innerHTML = `
    <div class="app-shell">
      <aside class="control-panel no-print" aria-label="Invoice controls">
        <button class="primary-button" type="button" data-action="print">${icon.print} Print Invoice</button>
        <section class="logo-panel">
          <h2>Logo Management</h2>
          <select data-field="selectedLogoId" aria-label="Select invoice logo">
            ${logos.map((item) => `<option value="${item.id}" ${item.id === selectedLogoId ? 'selected' : ''}>${item.name}</option>`).join('')}
          </select>
          <div class="logo-preview"><img src="${logo.url}" alt="${escapeAttribute(logo.name)}" /></div>
          <label class="upload-button">${icon.plus} Upload New Logo<input type="file" accept="image/svg+xml,image/png,image/jpeg" data-action="upload-logo" /></label>
        </section>
      </aside>

      <main class="invoice-page">
        <div class="top-accent"></div>
        <div class="invoice-content">
          <div class="invoice-main">
            <header class="invoice-header">
              <img class="invoice-logo" src="${logo.url}" alt="${escapeAttribute(logo.name)}" />
              <div class="invoice-title-block">
                <h1 contenteditable="true">INVOICE</h1>
                <p contenteditable="true">FATURA</p>
              </div>
            </header>

            <section class="invoice-meta" aria-label="Invoice details">
              <div><span>INVOICE #</span><strong contenteditable="true">INV-2026-0421</strong></div>
              <div><span>DATE</span><input type="date" value="${invoiceDate}" data-field="invoiceDate" /><strong class="print-value">${formatDateDisplay(invoiceDate)}</strong></div>
              <div><span>DUE DATE</span><input type="date" value="${dueDate}" data-field="dueDate" /><strong class="print-value">${formatDateDisplay(dueDate)}</strong></div>
              <div>
                <span>CURRENCY</span>
                <select data-field="currency">
                  ${['USD', 'TRY', 'EUR'].map((code) => `<option value="${code}" ${code === currency ? 'selected' : ''}>${code} (${currencySymbols[code]})</option>`).join('')}
                </select>
                <strong class="print-value">${currencyName}</strong>
              </div>
            </section>

            <section class="parties-grid">
              <div>
                <span class="section-label">FROM</span>
                <strong contenteditable="true">INVIZION CAPITAL</strong>
                <p contenteditable="true">Başakşehir, İstanbul, Türkiye<br />info@invizionholding.com<br />+90 555 002 22 00<br />FAX: +90 212 302 61</p>
              </div>
              <div>
                <span class="section-label">BILLED TO</span>
                <strong contenteditable="true">Example Corporation</strong>
                <p contenteditable="true">Attn: Mr. Jane Smith<br />Mazide Mah. East Boulevard Cad.<br />36485 Sarıyer / Istanbul<br />Tax ID: 0987654321</p>
              </div>
            </section>

            <div class="table-controls no-print"><button class="secondary-button" type="button" data-action="add-row">${icon.plus} Add Row</button></div>

            <table class="invoice-table">
              <thead><tr><th contenteditable="true">DESCRIPTION</th><th contenteditable="true">QTY</th><th contenteditable="true">RATE</th><th contenteditable="true">AMOUNT</th><th class="no-print">DEL</th></tr></thead>
              <tbody>
                ${rows.map((row) => `
                  <tr>
                    <td><input value="${escapeAttribute(row.description)}" data-row="${row.id}" data-column="description" /></td>
                    <td><input value="${escapeAttribute(row.qty)}" data-row="${row.id}" data-column="qty" /></td>
                    <td><input value="${escapeAttribute(row.rate)}" data-row="${row.id}" data-column="rate" /></td>
                    <td><input value="${escapeAttribute(row.amount)}" data-row="${row.id}" data-column="amount" /></td>
                    <td class="no-print"><button class="delete-button" type="button" data-action="delete-row" data-row="${row.id}" ${rows.length === 1 ? 'disabled' : ''} aria-label="Delete ${escapeAttribute(row.description)}">${icon.trash}</button></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <section class="totals-card" aria-label="Invoice totals">
              <div><span>Subtotal</span><span>${formatNumber(invoiceTotals.subtotal)}</span></div>
              <div class="vat-row"><label>VAT (<input type="number" value="${vatRate}" data-field="vatRate" />%)</label><span>${formatNumber(invoiceTotals.vat)}</span></div>
              <div class="total-row"><span>TOTAL DUE</span><strong>${currency} ${formatNumber(invoiceTotals.total)}</strong></div>
            </section>
          </div>

          <footer class="invoice-footer">
            <section class="footer-details">
              <div><span class="section-label">PAYMENT DETAILS</span><p contenteditable="true">Bank: Türkiye İş Bankası A.Ş.<br />IBAN: TR50 0000 0000 0000 0000 0000 00<br />SWIFT-GIBTR88 - Reference: INV-2026-0421</p></div>
              <div><span class="section-label">TERMS &amp; NOTES</span><p contenteditable="true">Payment due within 30 days of issue.<br />Late payments subject to 10% monthly interest.<br /><em>Thank you for your business.</em></p></div>
            </section>
            <div class="footer-bar"><span contenteditable="true">www.invizionholding.com</span><span>INVIZION HOLDING - INVOICE</span></div>
          </footer>
        </div>
      </main>
    </div>
  `;
}
function addRow() {
    const newId = Math.max(...rows.map((row) => row.id), 0) + 1;
    rows = [...rows, { id: newId, description: 'New Service Item', qty: '1', rate: '0.00', amount: '0.00' }];
    render();
}
function deleteRow(id) {
    if (rows.length > 1) {
        rows = rows.filter((row) => row.id !== id);
        render();
    }
}
function updateCell(id, field, value) {
    rows = rows.map((row) => {
        if (row.id !== id)
            return row;
        const updatedRow = { ...row, [field]: value };
        if (field === 'qty' || field === 'rate') {
            updatedRow.amount = calculateRowAmount(updatedRow.qty, updatedRow.rate);
        }
        return updatedRow;
    });
    render();
}
function uploadLogo(fileInput) {
    const file = fileInput.files?.[0];
    if (!file)
        return;
    const reader = new FileReader();
    reader.onload = (event) => {
        const newLogo = {
            id: Date.now().toString(),
            name: file.name.replace(/\.[^/.]+$/, ''),
            url: event.target?.result,
        };
        logos = [...logos, newLogo];
        selectedLogoId = newLogo.id;
        render();
    };
    reader.readAsDataURL(file);
    fileInput.value = '';
}
document.addEventListener('click', (event) => {
    const target = event.target;
    const button = target.closest('button[data-action]');
    if (!button)
        return;
    const action = button.dataset.action;
    if (action === 'print')
        window.print();
    if (action === 'add-row')
        addRow();
    if (action === 'delete-row')
        deleteRow(Number(button.dataset.row));
});
document.addEventListener('change', (event) => {
    const target = event.target;
    const rowId = target.dataset.row;
    const column = target.dataset.column;
    if (target.dataset.action === 'upload-logo' && target instanceof HTMLInputElement) {
        uploadLogo(target);
        return;
    }
    if (rowId && column) {
        updateCell(Number(rowId), column, target.value);
        return;
    }
    switch (target.dataset.field) {
        case 'invoiceDate':
            invoiceDate = target.value;
            render();
            break;
        case 'dueDate':
            dueDate = target.value;
            render();
            break;
        case 'currency':
            currency = target.value;
            render();
            break;
        case 'vatRate':
            vatRate = Number.parseFloat(target.value) || 0;
            render();
            break;
        case 'selectedLogoId':
            selectedLogoId = target.value;
            render();
            break;
        default:
            break;
    }
});
render();
