// Professional Tax Invoice Generator for Floramade Ayurveda

function numberToWordsINR(num) {
  if (!num || isNaN(num)) return "Zero Rupees Only";
  const a = [
    "", "One ", "Two ", "Three ", "Four ", "Five ", "Six ", "Seven ", "Eight ", "Nine ", "Ten ",
    "Eleven ", "Twelve ", "Thirteen ", "Fourteen ", "Fifteen ", "Sixteen ", "Seventeen ", "Eighteen ", "Nineteen "
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  const format = (n) => {
    let str = "";
    if (n > 99) {
      str += a[Math.floor(n / 100)] + "Hundred ";
      n %= 100;
    }
    if (n > 19) {
      str += b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : " ");
    } else if (n > 0) {
      str += a[n];
    }
    return str;
  };

  let n = Math.floor(num);
  let crore = Math.floor(n / 10000000);
  n %= 10000000;
  let lakh = Math.floor(n / 100000);
  n %= 100000;
  let thousand = Math.floor(n / 1000);
  n %= 1000;
  let hundredAndRest = n;

  let res = "";
  if (crore) res += format(crore) + "Crore ";
  if (lakh) res += format(lakh) + "Lakh ";
  if (thousand) res += format(thousand) + "Thousand ";
  if (hundredAndRest) res += format(hundredAndRest);

  return (res.trim() || "Zero") + " Rupees Only";
}

export function openProfessionalInvoice(order) {
  const printWindow = window.open("", "_blank", "width=850,height=950");
  if (!printWindow) return;

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const orderDate = order.createdAt ? new Date(order.createdAt) : new Date();
  const invoiceDateStr = orderDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const invoiceTimeStr = orderDate.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const invoiceNo = `INV-FLR-${String(order.orderId || order._id || Date.now()).replace(/[^a-zA-Z0-9]/g, "").slice(-8).toUpperCase()}`;
  const paymentMode = (order.paymentMethod || "razorpay").toUpperCase() === "COD" ? "Cash On Delivery (COD)" : "Prepaid (Online Payment / Razorpay)";
  const totalAmount = Number(order.amount) || 0;
  const taxableAmount = Math.round((totalAmount / 1.05) * 100) / 100;
  const gstAmount = Math.round((totalAmount - taxableAmount) * 100) / 100;
  const cgstAmount = (gstAmount / 2).toFixed(2);
  const sgstAmount = (gstAmount / 2).toFixed(2);

  const items = Array.isArray(order.items) && order.items.length > 0 ? order.items : [
    { name: "Ayurvedic Formulation", quantity: 1, price: totalAmount }
  ];

  const itemsRows = items.map((item, idx) => {
    const qty = Number(item.quantity) || 1;
    const itemTotal = (Number(item.price) || 0) * qty || totalAmount;
    const itemTaxable = (itemTotal / 1.05).toFixed(2);

    return `
      <tr>
        <td class="text-center">${String(idx + 1).padStart(2, "0")}</td>
        <td>
          <div class="item-name">${item.name}</div>
          <div class="item-sub">HSN: 30049011 • Certified Ayurvedic Medicament</div>
        </td>
        <td class="text-center font-bold">${qty}</td>
        <td class="text-right">₹${Number(item.price || itemTotal).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
        <td class="text-right">₹${Number(itemTaxable).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
        <td class="text-center">5%</td>
        <td class="text-right font-bold">₹${Number(itemTotal).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
      </tr>
    `;
  }).join("");

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>Tax Invoice - ${invoiceNo}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,400&display=swap');
          
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
          body {
            font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background-color: #F8F6F0;
            color: #261611;
            padding: 30px 20px;
            font-size: 13px;
            line-height: 1.5;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .no-print-bar {
            max-width: 800px;
            margin: 0 auto 20px auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #123D2B;
            color: #F8F4E9;
            padding: 12px 20px;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          }

          .btn-print {
            background: #D4AF55;
            color: #F8F4E9;
            border: none;
            padding: 8px 18px;
            border-radius: 8px;
            font-weight: 700;
            cursor: pointer;
            font-size: 13px;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            transition: all 0.2s;
          }

          .btn-print:hover {
            background: #A03314;
          }

          .btn-close {
            background: transparent;
            color: #F8F4E9;
            border: 1px solid rgba(255,247,235,0.3);
            padding: 8px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 13px;
          }

          .invoice-box {
            max-width: 800px;
            margin: 0 auto;
            background: #FFFFFF;
            border: 1px solid #E8D9C5;
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(57, 22, 13, 0.05);
            position: relative;
          }

          /* Header */
          .header-table {
            width: 100%;
            border-bottom: 2px solid #123D2B;
            padding-bottom: 20px;
            margin-bottom: 24px;
          }

          .logo-img {
            max-width: 250px;
            height: auto;
            display: block;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.06));
          }

          .brand-tagline {
            font-size: 11px;
            color: #D4AF55;
            font-weight: 600;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            margin-top: 6px;
          }

          .invoice-title {
            text-align: right;
          }

          .invoice-title h1 {
            font-size: 24px;
            font-weight: 800;
            color: #123D2B;
            letter-spacing: -0.02em;
            text-transform: uppercase;
          }

          .invoice-title .badge {
            display: inline-block;
            background: #FAF5EB;
            color: #D4AF55;
            border: 1px solid #E8D9C5;
            font-size: 11px;
            font-weight: 700;
            padding: 3px 10px;
            border-radius: 20px;
            margin-top: 4px;
            text-transform: uppercase;
          }

          /* Info Grid */
          .info-grid {
            display: table;
            width: 100%;
            margin-bottom: 24px;
          }

          .info-col {
            display: table-cell;
            width: 50%;
            vertical-align: top;
          }

          .info-col:first-child {
            padding-right: 20px;
          }

          .info-col:last-child {
            padding-left: 20px;
          }

          .info-card {
            background: #FAF8F5;
            border: 1px solid #E8D9C5;
            border-radius: 12px;
            padding: 16px;
            height: 100%;
          }

          .card-title {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            color: #D4AF55;
            letter-spacing: 0.05em;
            border-bottom: 1px solid #E8D9C5;
            padding-bottom: 6px;
            margin-bottom: 10px;
          }

          .info-row {
            margin-bottom: 4px;
            font-size: 12px;
          }

          .info-row strong {
            color: #123D2B;
          }

          /* Order Metadata Strip */
          .metadata-strip {
            background: #F8F4E9;
            border: 1px solid #E8D9C5;
            border-radius: 10px;
            padding: 12px 16px;
            display: flex;
            justify-content: space-between;
            margin-bottom: 24px;
            font-size: 12px;
          }

          .meta-item span {
            color: #D4AF55;
            font-weight: 700;
            text-transform: uppercase;
            font-size: 10px;
            display: block;
            margin-bottom: 2px;
          }

          .meta-item strong {
            color: #123D2B;
            font-size: 13px;
          }

          /* Products Table */
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-size: 12px;
          }

          .items-table th {
            background: #123D2B;
            color: #F8F4E9;
            font-weight: 700;
            text-transform: uppercase;
            font-size: 10px;
            letter-spacing: 0.04em;
            padding: 10px 12px;
            text-align: left;
          }

          .items-table td {
            padding: 12px;
            border-bottom: 1px solid #E8D9C5;
          }

          .items-table tr:nth-child(even) td {
            background: #FDFAF5;
          }

          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .font-bold { font-weight: 700; }

          .item-name {
            font-weight: 700;
            color: #123D2B;
            font-size: 13px;
          }

          .item-sub {
            font-size: 10px;
            color: #7A6962;
            margin-top: 2px;
          }

          /* Summary Calculations */
          .summary-table {
            width: 100%;
            margin-top: 10px;
            margin-bottom: 24px;
          }

          .words-col {
            width: 55%;
            vertical-align: top;
            padding-right: 20px;
          }

          .calc-col {
            width: 45%;
            vertical-align: top;
          }

          .words-box {
            background: #FAF8F5;
            border: 1px solid #E8D9C5;
            border-radius: 10px;
            padding: 14px;
          }

          .calc-box {
            border: 1px solid #E8D9C5;
            border-radius: 10px;
            overflow: hidden;
          }

          .calc-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 14px;
            font-size: 12px;
            border-bottom: 1px solid #E8D9C5;
          }

          .calc-row:last-child {
            border-bottom: none;
          }

          .calc-total {
            background: #123D2B;
            color: #F8F4E9;
            font-weight: 800;
            font-size: 15px;
            padding: 12px 14px;
          }

          .calc-total span:last-child {
            color: #D4AF55;
          }

          /* Tax Note */
          .tax-note {
            font-size: 11px;
            color: #7A6962;
            margin-top: 8px;
            line-height: 1.4;
          }

          /* Sign & Stamp */
          .footer-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            border-top: 1px solid #E8D9C5;
            padding-top: 20px;
            margin-top: 20px;
          }

          .terms-block {
            max-width: 450px;
            font-size: 10px;
            color: #7A6962;
            line-height: 1.5;
          }

          .sign-block {
            text-align: right;
            font-size: 11px;
          }

          .sign-box {
            margin-top: 30px;
            border-top: 1px dashed #123D2B;
            padding-top: 6px;
            font-weight: 700;
            color: #123D2B;
          }

          @media print {
            body {
              background: white !important;
              padding: 0 !important;
            }

            .no-print-bar {
              display: none !important;
            }

            .invoice-box {
              box-shadow: none !important;
              border: 1px solid #DDD !important;
              padding: 25px !important;
              max-width: 100% !important;
            }

            @page {
              size: A4 portrait;
              margin: 12mm;
            }
          }
        </style>
      </head>
      <body>
        <div class="no-print-bar">
          <div>
            <strong>Floramade Official Tax Invoice</strong>
            <span style="opacity: 0.7; font-size: 11px; margin-left: 10px;">• Ready for download / print</span>
          </div>
          <div style="display: flex; gap: 10px;">
            <button class="btn-print" onclick="window.print()">
              🖨️ Print / Save as PDF
            </button>
            <button class="btn-close" onclick="window.close()">
              ✕ Close
            </button>
          </div>
        </div>

        <div class="invoice-box">
          <!-- Top Header Table -->
          <table class="header-table">
            <tr>
              <td style="vertical-align: middle;">
                <img src="${origin}/floramade-official-logo.png" alt="Floramade" class="logo-img" onerror="this.src='${origin}/logo.png'" />
                <div class="brand-tagline">Pure Ayurvedic Formulations • Natural Healing</div>
              </td>
              <td class="invoice-title" style="vertical-align: middle;">
                <h1>TAX INVOICE</h1>
                <div class="badge">Original For Recipient</div>
              </td>
            </tr>
          </table>

          <!-- Metadata Strip -->
          <div class="metadata-strip">
            <div class="meta-item">
              <span>Invoice Number</span>
              <strong>${invoiceNo}</strong>
            </div>
            <div class="meta-item">
              <span>Invoice Date</span>
              <strong>${invoiceDateStr}</strong>
            </div>
            <div class="meta-item">
              <span>Order ID</span>
              <strong>#${order.orderId || order._id}</strong>
            </div>
            <div class="meta-item">
              <span>Payment Mode</span>
              <strong>${paymentMode}</strong>
            </div>
          </div>

          <!-- Two Column Billed By / Billed To -->
          <div class="info-grid">
            <div class="info-col">
              <div class="info-card">
                <div class="card-title">Sold By & Registered Office</div>
                <div class="info-row"><strong>Floramade Healthcare Pvt. Ltd.</strong></div>
                <div class="info-row">Herbal Formulations & Wellness Division</div>
                <div class="info-row">Rohini Sector 21, New Delhi - 110086, India</div>
                <div class="info-row"><strong>Ayurvedic Mfg Lic:</strong> DL-AYUR-2024-9982</div>
                <div class="info-row"><strong>GSTIN:</strong> 07AAACF8921M1Z5</div>
                <div class="info-row"><strong>Helpline:</strong> +91 9220251059</div>
                <div class="info-row"><strong>Email:</strong> floramade517@gmail.com</div>
              </div>
            </div>

            <div class="info-col">
              <div class="info-card">
                <div class="card-title">Billed To & Shipping Address</div>
                <div class="info-row"><strong>${order.address?.fullName || "Valued Customer"}</strong></div>
                <div class="info-row">${order.address?.addressLine || "Address on File"}</div>
                <div class="info-row">${order.address?.city || ""}${order.address?.state ? ", " + order.address.state : ""} - ${order.address?.pincode || ""}</div>
                <div class="info-row"><strong>Contact:</strong> ${order.address?.phone || "+91 9220251059"}</div>
                <div class="info-row"><strong>Place of Supply:</strong> ${order.address?.state || "Delhi, India"}</div>
                ${order.paymentId ? `<div class="info-row" style="font-size:10px; color:#D4AF55; margin-top:6px;"><strong>Razorpay ID:</strong> ${order.paymentId}</div>` : ""}
              </div>
            </div>
          </div>

          <!-- Items Table -->
          <table class="items-table">
            <thead>
              <tr>
                <th style="width: 5%;" class="text-center">#</th>
                <th style="width: 45%;">Item Description</th>
                <th style="width: 8%;" class="text-center">Qty</th>
                <th style="width: 14%;" class="text-right">Unit Price</th>
                <th style="width: 14%;" class="text-right">Taxable Val</th>
                <th style="width: 8%;" class="text-center">GST</th>
                <th style="width: 16%;" class="text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>

          <!-- Summary Breakdown -->
          <table class="summary-table">
            <tr>
              <td class="words-col">
                <div class="words-box">
                  <div style="font-size: 10px; text-transform: uppercase; color: #D4AF55; font-weight: 700; margin-bottom: 4px;">Amount in Words:</div>
                  <div style="font-size: 13px; font-weight: 700; color: #123D2B; line-height: 1.4;">
                    ${numberToWordsINR(totalAmount)}
                  </div>
                  <div class="tax-note">
                    * Inclusive of all applicable Central GST (2.5%) & State GST (2.5%) for Ayurvedic herbal formulations.
                  </div>
                </div>
              </td>
              <td class="calc-col">
                <div class="calc-box">
                  <div class="calc-row">
                    <span>Taxable Amount</span>
                    <strong>₹${taxableAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong>
                  </div>
                  <div class="calc-row">
                    <span>CGST (2.5%)</span>
                    <span>₹${cgstAmount}</span>
                  </div>
                  <div class="calc-row">
                    <span>SGST (2.5%)</span>
                    <span>₹${sgstAmount}</span>
                  </div>
                  <div class="calc-row">
                    <span>Shipping & Handling</span>
                    <strong style="color: #2D7A3A;">FREE</strong>
                  </div>
                  <div class="calc-row calc-total">
                    <span>Grand Total:</span>
                    <span>₹${totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </td>
            </tr>
          </table>

          <!-- Footer Declaration & Signature -->
          <div class="footer-section">
            <div class="terms-block">
              <strong>Declaration & Terms:</strong><br />
              1. We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.<br />
              2. 100% Certified Ayurvedic herbs prepared following traditional Shastric methods.<br />
              3. For questions, reach our customer care at <strong>+91 9220251059</strong> or <strong>floramade517@gmail.com</strong>.
            </div>

            <div class="sign-block">
              <div style="font-weight: 700; color: #123D2B;">For Floramade Healthcare Pvt. Ltd.</div>
              <div class="sign-box">Authorized Signatory</div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
