import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Printer, Smartphone, FileDown } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { useQuery } from "@tanstack/react-query";
import type { SalesOrderWithDetails } from "@shared/schema";

interface SalesOrderDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: SalesOrderWithDetails | null;
}

export function SalesOrderDetail({
  open,
  onOpenChange,
  order,
}: SalesOrderDetailProps) {
  const { data: balanceData } = useQuery<{ previousBalance: number; currentBalance: number }>({
    queryKey: ["/api/customer-balance-for-sale", order?.id],
    enabled: open && !!order?.id && !!order?.customerId,
  });

  if (!order) return null;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatNumber = (value: string | null, decimals: number) => {
    if (!value) return "—";
    return Number(value).toFixed(decimals);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const subtotal = order.lineItems.reduce((sum, item) => sum + (parseFloat(item.totalKwd || "0")), 0);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${order.invoiceNumber || order.id} - Iqbal Electronics</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            
            * { margin: 0; padding: 0; box-sizing: border-box; }
            
            body { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
              background: #fff;
              color: #1a1a2e;
              line-height: 1.5;
              font-size: 13px;
            }
            
            .invoice-container {
              max-width: 800px;
              margin: 0 auto;
              padding: 40px;
            }
            
            /* Header Section */
            .invoice-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 40px;
              padding-bottom: 30px;
              border-bottom: 3px solid #1a1a2e;
            }
            
            .company-info h1 {
              font-size: 28px;
              font-weight: 700;
              color: #1a1a2e;
              margin-bottom: 8px;
              letter-spacing: -0.5px;
            }
            
            .company-info p {
              color: #64748b;
              font-size: 12px;
              line-height: 1.6;
            }
            
            .invoice-title-box {
              text-align: right;
            }
            
            .invoice-badge {
              display: inline-block;
              background: linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%);
              color: #fff;
              padding: 8px 24px;
              font-size: 14px;
              font-weight: 600;
              letter-spacing: 2px;
              text-transform: uppercase;
              border-radius: 4px;
              margin-bottom: 12px;
            }
            
            .invoice-number {
              font-size: 24px;
              font-weight: 700;
              color: #1a1a2e;
              margin-bottom: 4px;
            }
            
            .invoice-date {
              color: #64748b;
              font-size: 13px;
            }
            
            /* Info Section */
            .info-section {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 40px;
              margin-bottom: 40px;
            }
            
            .info-block h3 {
              font-size: 10px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 1.5px;
              color: #94a3b8;
              margin-bottom: 12px;
            }
            
            .info-block .name {
              font-size: 18px;
              font-weight: 600;
              color: #1a1a2e;
              margin-bottom: 4px;
            }
            
            .info-block .details {
              color: #64748b;
              font-size: 13px;
            }
            
            /* Items Table */
            .items-section {
              margin-bottom: 30px;
            }
            
            .items-table {
              width: 100%;
              border-collapse: collapse;
            }
            
            .items-table thead tr {
              background: #f8fafc;
            }
            
            .items-table th {
              padding: 14px 16px;
              text-align: left;
              font-size: 10px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #64748b;
              border-bottom: 2px solid #e2e8f0;
            }
            
            .items-table th:last-child,
            .items-table th:nth-child(3),
            .items-table th:nth-child(4) {
              text-align: right;
            }
            
            .items-table td {
              padding: 16px;
              border-bottom: 1px solid #f1f5f9;
              vertical-align: top;
            }
            
            .items-table td:last-child,
            .items-table td:nth-child(3),
            .items-table td:nth-child(4) {
              text-align: right;
            }
            
            .item-name {
              font-weight: 500;
              color: #1a1a2e;
            }
            
            .item-imei {
              font-size: 11px;
              color: #94a3b8;
              margin-top: 4px;
              font-family: 'SF Mono', Monaco, monospace;
            }
            
            .item-qty {
              font-weight: 500;
              color: #1a1a2e;
            }
            
            .item-price {
              color: #64748b;
            }
            
            .item-total {
              font-weight: 600;
              color: #1a1a2e;
            }
            
            /* Totals Section */
            .totals-section {
              display: flex;
              justify-content: flex-end;
              margin-bottom: 40px;
            }
            
            .totals-box {
              width: 280px;
            }
            
            .totals-row {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              border-bottom: 1px solid #f1f5f9;
            }
            
            .totals-row.grand-total {
              background: linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%);
              color: #fff;
              padding: 16px 20px;
              margin-top: 10px;
              border-radius: 6px;
              border: none;
            }
            
            .totals-label {
              color: #64748b;
              font-size: 13px;
            }
            
            .totals-value {
              font-weight: 600;
              font-size: 13px;
            }
            
            .grand-total .totals-label {
              color: rgba(255,255,255,0.8);
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            
            .grand-total .totals-value {
              font-size: 20px;
              font-weight: 700;
            }
            
            /* Footer Section */
            .footer-section {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 40px;
              padding-top: 30px;
              border-top: 1px solid #e2e8f0;
            }
            
            .payment-info h4,
            .notes-section h4 {
              font-size: 10px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 1.5px;
              color: #94a3b8;
              margin-bottom: 12px;
            }
            
            .payment-info p {
              color: #64748b;
              font-size: 12px;
              line-height: 1.8;
            }
            
            .thank-you-section {
              text-align: center;
              margin-top: 50px;
              padding: 30px;
              background: #f8fafc;
              border-radius: 8px;
            }
            
            .thank-you-section h3 {
              font-size: 18px;
              font-weight: 600;
              color: #1a1a2e;
              margin-bottom: 8px;
            }
            
            .thank-you-section p {
              color: #64748b;
              font-size: 13px;
            }
            
            .signature-section {
              margin-top: 50px;
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 60px;
            }
            
            .signature-box {
              text-align: center;
            }
            
            .signature-line {
              border-top: 1px solid #1a1a2e;
              padding-top: 10px;
              margin-top: 50px;
            }
            
            .signature-label {
              font-size: 11px;
              color: #64748b;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            
            /* Print Styles */
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .invoice-container { padding: 20px; }
              .invoice-badge { background: #1a1a2e !important; -webkit-print-color-adjust: exact; }
              .grand-total { background: #1a1a2e !important; -webkit-print-color-adjust: exact; }
            }
            
            @page { margin: 0.5cm; }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <!-- Header -->
            <div class="invoice-header">
              <div class="company-info">
                <h1>Iqbal Electronics</h1>
                <p>
                  Co. WLL<br>
                  Kuwait City, Kuwait<br>
                  info@iqbalelectronics.com
                </p>
              </div>
              <div class="invoice-title-box">
                <div class="invoice-badge">Invoice</div>
                <div class="invoice-number">${order.invoiceNumber || `INV-${order.id}`}</div>
                <div class="invoice-date">${formatDate(order.saleDate)}</div>
              </div>
            </div>
            
            <!-- Billing Info -->
            <div class="info-section">
              <div class="info-block">
                <h3>Bill To</h3>
                <div class="name">${order.customer?.name || "Walk-in Customer"}</div>
                <div class="details">
                  ${order.customer?.phone ? `Phone: ${order.customer.phone}` : ""}
                </div>
              </div>
              <div class="info-block" style="text-align: right;">
                <h3>Invoice Details</h3>
                <div class="details">
                  <strong>Invoice No:</strong> ${order.invoiceNumber || `INV-${order.id}`}<br>
                  <strong>Date:</strong> ${formatDate(order.saleDate)}<br>
                  ${order.deliveryDate ? `<strong>Delivery:</strong> ${formatDate(order.deliveryDate)}` : ""}
                </div>
              </div>
            </div>
            
            <!-- Items Table -->
            <div class="items-section">
              <table class="items-table">
                <thead>
                  <tr>
                    <th style="width: 40px;">#</th>
                    <th>Description</th>
                    <th style="width: 80px;">Qty</th>
                    <th style="width: 120px;">Unit Price</th>
                    <th style="width: 120px;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${order.lineItems.map((item, index) => `
                    <tr>
                      <td>${String(index + 1).padStart(2, '0')}</td>
                      <td>
                        <div class="item-name">${item.itemName}</div>
                        ${item.imeiNumbers && item.imeiNumbers.length > 0 
                          ? `<div class="item-imei">IMEI: ${item.imeiNumbers.join(", ")}</div>` 
                          : ""}
                      </td>
                      <td class="item-qty">${item.quantity}</td>
                      <td class="item-price">${formatNumber(item.priceKwd, 3)} KWD</td>
                      <td class="item-total">${formatNumber(item.totalKwd, 3)} KWD</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
            
            <!-- Totals -->
            <div class="totals-section">
              <div class="totals-box">
                ${order.customerId ? `
                <div class="totals-row">
                  <span class="totals-label">Previous Balance</span>
                  <span class="totals-value">${(balanceData?.previousBalance || 0).toFixed(3)} KWD</span>
                </div>
                ` : ''}
                <div class="totals-row">
                  <span class="totals-label">Invoice Amount</span>
                  <span class="totals-value">${subtotal.toFixed(3)} KWD</span>
                </div>
                <div class="totals-row grand-total">
                  <span class="totals-label">Current Balance</span>
                  <span class="totals-value">${order.customerId ? (balanceData?.currentBalance || 0).toFixed(3) : formatNumber(order.totalKwd, 3)} KWD</span>
                </div>
              </div>
            </div>
            
            <!-- Footer -->
            <div class="footer-section">
              <div class="payment-info">
                <h4>Payment Information</h4>
                <p>
                  Payment is due upon receipt.<br>
                  Accepted: Cash, Bank Transfer, Knet
                </p>
              </div>
              <div class="notes-section">
                <h4>Terms & Conditions</h4>
                <p style="color: #64748b; font-size: 11px; line-height: 1.6;">
                  Goods once sold cannot be returned or exchanged.<br>
                  Warranty as per manufacturer terms.
                </p>
              </div>
            </div>
            
            <!-- Thank You -->
            <div class="thank-you-section">
              <h3>Thank You for Your Business!</h3>
              <p>We appreciate your trust in Iqbal Electronics. For any queries, please contact us.</p>
            </div>
            
            <!-- Signatures -->
            <div class="signature-section">
              <div class="signature-box">
                <div class="signature-line">
                  <div class="signature-label">Authorized Signature</div>
                </div>
              </div>
              <div class="signature-box">
                <div class="signature-line">
                  <div class="signature-label">Customer Signature</div>
                </div>
              </div>
            </div>
          </div>
          
          <script>
            window.onload = function() { 
              setTimeout(function() { window.print(); }, 300);
            }
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  const handleDownloadPDF = () => {
    const pdfWindow = window.open("", "_blank");
    if (!pdfWindow) return;

    const subtotal = order.lineItems.reduce((sum, item) => sum + (parseFloat(item.totalKwd || "0")), 0);

    pdfWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${order.invoiceNumber || order.id} - Iqbal Electronics</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            
            * { margin: 0; padding: 0; box-sizing: border-box; }
            
            body { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
              background: #fff;
              color: #1a1a2e;
              line-height: 1.5;
              font-size: 13px;
            }
            
            .invoice-container {
              max-width: 800px;
              margin: 0 auto;
              padding: 40px;
            }
            
            .invoice-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 40px;
              padding-bottom: 30px;
              border-bottom: 3px solid #1a1a2e;
            }
            
            .company-info h1 {
              font-size: 28px;
              font-weight: 700;
              color: #1a1a2e;
              margin-bottom: 8px;
              letter-spacing: -0.5px;
            }
            
            .company-info p {
              color: #64748b;
              font-size: 12px;
              line-height: 1.6;
            }
            
            .invoice-title-box {
              text-align: right;
            }
            
            .invoice-badge {
              display: inline-block;
              background: linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%);
              color: #fff;
              padding: 8px 24px;
              font-size: 14px;
              font-weight: 600;
              letter-spacing: 2px;
              text-transform: uppercase;
              border-radius: 4px;
              margin-bottom: 12px;
            }
            
            .invoice-number {
              font-size: 24px;
              font-weight: 700;
              color: #1a1a2e;
              margin-bottom: 4px;
            }
            
            .invoice-date {
              color: #64748b;
              font-size: 13px;
            }
            
            .info-section {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 40px;
              margin-bottom: 40px;
            }
            
            .info-block h3 {
              font-size: 10px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 1.5px;
              color: #94a3b8;
              margin-bottom: 12px;
            }
            
            .info-block .name {
              font-size: 18px;
              font-weight: 600;
              color: #1a1a2e;
              margin-bottom: 4px;
            }
            
            .info-block .details {
              color: #64748b;
              font-size: 13px;
            }
            
            .items-section {
              margin-bottom: 30px;
            }
            
            .items-table {
              width: 100%;
              border-collapse: collapse;
            }
            
            .items-table thead tr {
              background: #f8fafc;
            }
            
            .items-table th {
              padding: 14px 16px;
              text-align: left;
              font-size: 10px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #64748b;
              border-bottom: 2px solid #e2e8f0;
            }
            
            .items-table th:last-child,
            .items-table th:nth-child(3),
            .items-table th:nth-child(4) {
              text-align: right;
            }
            
            .items-table td {
              padding: 16px;
              border-bottom: 1px solid #f1f5f9;
              vertical-align: top;
            }
            
            .items-table td:last-child,
            .items-table td:nth-child(3),
            .items-table td:nth-child(4) {
              text-align: right;
            }
            
            .item-name {
              font-weight: 500;
              color: #1a1a2e;
            }
            
            .item-imei {
              font-size: 11px;
              color: #94a3b8;
              margin-top: 4px;
              font-family: 'SF Mono', Monaco, monospace;
            }
            
            .item-qty {
              font-weight: 500;
              color: #1a1a2e;
            }
            
            .item-price {
              color: #64748b;
            }
            
            .item-total {
              font-weight: 600;
              color: #1a1a2e;
            }
            
            .totals-section {
              display: flex;
              justify-content: flex-end;
              margin-bottom: 40px;
            }
            
            .totals-box {
              width: 280px;
            }
            
            .totals-row {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              border-bottom: 1px solid #f1f5f9;
            }
            
            .totals-row.grand-total {
              background: linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%);
              color: #fff;
              padding: 16px 20px;
              margin-top: 10px;
              border-radius: 6px;
              border: none;
            }
            
            .totals-label {
              color: #64748b;
              font-size: 13px;
            }
            
            .totals-value {
              font-weight: 600;
              font-size: 13px;
            }
            
            .grand-total .totals-label {
              color: rgba(255,255,255,0.8);
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            
            .grand-total .totals-value {
              font-size: 20px;
              font-weight: 700;
            }
            
            .footer-section {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 40px;
              padding-top: 30px;
              border-top: 1px solid #e2e8f0;
            }
            
            .payment-info h4,
            .notes-section h4 {
              font-size: 10px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 1.5px;
              color: #94a3b8;
              margin-bottom: 12px;
            }
            
            .payment-info p {
              color: #64748b;
              font-size: 12px;
              line-height: 1.8;
            }
            
            .thank-you-section {
              text-align: center;
              margin-top: 50px;
              padding: 30px;
              background: #f8fafc;
              border-radius: 8px;
            }
            
            .thank-you-section h3 {
              font-size: 18px;
              font-weight: 600;
              color: #1a1a2e;
              margin-bottom: 8px;
            }
            
            .thank-you-section p {
              color: #64748b;
              font-size: 13px;
            }
            
            .signature-section {
              margin-top: 50px;
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 60px;
            }
            
            .signature-box {
              text-align: center;
            }
            
            .signature-line {
              border-top: 1px solid #1a1a2e;
              padding-top: 10px;
              margin-top: 50px;
            }
            
            .signature-label {
              font-size: 11px;
              color: #64748b;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            
            .pdf-instructions {
              text-align: center;
              padding: 20px;
              background: #fef3c7;
              border: 2px solid #f59e0b;
              border-radius: 8px;
              margin-bottom: 20px;
              font-size: 14px;
              color: #92400e;
            }
            
            .pdf-instructions strong {
              display: block;
              font-size: 16px;
              margin-bottom: 8px;
            }
            
            .pdf-instructions .shortcut {
              display: inline-block;
              background: #fff;
              border: 1px solid #d97706;
              padding: 4px 12px;
              border-radius: 4px;
              font-family: monospace;
              font-weight: 600;
              margin: 4px;
            }
            
            @media print {
              .pdf-instructions { display: none !important; }
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .invoice-container { padding: 20px; }
              .invoice-badge { background: #1a1a2e !important; -webkit-print-color-adjust: exact; }
              .grand-total { background: #1a1a2e !important; -webkit-print-color-adjust: exact; }
            }
            
            @page { margin: 0.5cm; }
          </style>
        </head>
        <body>
          <div class="pdf-instructions">
            <strong>Save Invoice as PDF</strong>
            Press <span class="shortcut">Ctrl + P</span> (Windows) or <span class="shortcut">Cmd + P</span> (Mac)<br>
            Then select <strong>"Save as PDF"</strong> or <strong>"Microsoft Print to PDF"</strong> as the destination.
          </div>
          <div class="invoice-container">
            <div class="invoice-header">
              <div class="company-info">
                <h1>Iqbal Electronics</h1>
                <p>
                  Co. WLL<br>
                  Kuwait City, Kuwait<br>
                  info@iqbalelectronics.com
                </p>
              </div>
              <div class="invoice-title-box">
                <div class="invoice-badge">Invoice</div>
                <div class="invoice-number">${order.invoiceNumber || `INV-${order.id}`}</div>
                <div class="invoice-date">${formatDate(order.saleDate)}</div>
              </div>
            </div>
            
            <div class="info-section">
              <div class="info-block">
                <h3>Bill To</h3>
                <div class="name">${order.customer?.name || "Walk-in Customer"}</div>
                <div class="details">
                  ${order.customer?.phone ? `Phone: ${order.customer.phone}` : ""}
                </div>
              </div>
              <div class="info-block" style="text-align: right;">
                <h3>Invoice Details</h3>
                <div class="details">
                  <strong>Invoice No:</strong> ${order.invoiceNumber || `INV-${order.id}`}<br>
                  <strong>Date:</strong> ${formatDate(order.saleDate)}<br>
                  ${order.deliveryDate ? `<strong>Delivery:</strong> ${formatDate(order.deliveryDate)}` : ""}
                </div>
              </div>
            </div>
            
            <div class="items-section">
              <table class="items-table">
                <thead>
                  <tr>
                    <th style="width: 40px;">#</th>
                    <th>Description</th>
                    <th style="width: 80px;">Qty</th>
                    <th style="width: 120px;">Unit Price</th>
                    <th style="width: 120px;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${order.lineItems.map((item, index) => `
                    <tr>
                      <td>${String(index + 1).padStart(2, '0')}</td>
                      <td>
                        <div class="item-name">${item.itemName}</div>
                        ${item.imeiNumbers && item.imeiNumbers.length > 0 
                          ? `<div class="item-imei">IMEI: ${item.imeiNumbers.join(", ")}</div>` 
                          : ""}
                      </td>
                      <td class="item-qty">${item.quantity}</td>
                      <td class="item-price">${formatNumber(item.priceKwd, 3)} KWD</td>
                      <td class="item-total">${formatNumber(item.totalKwd, 3)} KWD</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
            
            <div class="totals-section">
              <div class="totals-box">
                ${order.customerId ? `
                <div class="totals-row">
                  <span class="totals-label">Previous Balance</span>
                  <span class="totals-value">${(balanceData?.previousBalance || 0).toFixed(3)} KWD</span>
                </div>
                ` : ''}
                <div class="totals-row">
                  <span class="totals-label">Invoice Amount</span>
                  <span class="totals-value">${subtotal.toFixed(3)} KWD</span>
                </div>
                <div class="totals-row grand-total">
                  <span class="totals-label">Current Balance</span>
                  <span class="totals-value">${order.customerId ? (balanceData?.currentBalance || 0).toFixed(3) : formatNumber(order.totalKwd, 3)} KWD</span>
                </div>
              </div>
            </div>
            
            <div class="footer-section">
              <div class="payment-info">
                <h4>Payment Information</h4>
                <p>
                  Payment is due upon receipt.<br>
                  Accepted: Cash, Bank Transfer, Knet
                </p>
              </div>
              <div class="notes-section">
                <h4>Terms & Conditions</h4>
                <p style="color: #64748b; font-size: 11px; line-height: 1.6;">
                  Goods once sold cannot be returned or exchanged.<br>
                  Warranty as per manufacturer terms.
                </p>
              </div>
            </div>
            
            <div class="thank-you-section">
              <h3>Thank You for Your Business!</h3>
              <p>We appreciate your trust in Iqbal Electronics. For any queries, please contact us.</p>
            </div>
            
            <div class="signature-section">
              <div class="signature-box">
                <div class="signature-line">
                  <div class="signature-label">Authorized Signature</div>
                </div>
              </div>
              <div class="signature-box">
                <div class="signature-line">
                  <div class="signature-label">Customer Signature</div>
                </div>
              </div>
            </div>
          </div>
          
          <script>
            window.onload = function() { 
              setTimeout(function() { window.print(); }, 500);
            }
          </script>
        </body>
      </html>
    `);

    pdfWindow.document.close();
  };

  const handleWhatsAppShare = () => {
    const lineItemsText = order.lineItems.map((item, index) => {
      let text = `${index + 1}. ${item.itemName} - Qty: ${item.quantity} - ${formatNumber(item.totalKwd, 3)} KWD`;
      if (item.imeiNumbers && item.imeiNumbers.length > 0) {
        text += `\n   IMEI: ${item.imeiNumbers.join(", ")}`;
      }
      return text;
    }).join("\n");

    const message = `*SALES INVOICE*
Iqbal Electronics Co. WLL

Invoice No: ${order.invoiceNumber || "—"}
Date: ${formatDate(order.saleDate)}
Customer: ${order.customer?.name || "—"}

*Items:*
${lineItemsText}

*Total: ${formatNumber(order.totalKwd, 3)} KWD*

Thank you for your business!`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between gap-4">
          <DialogTitle data-testid="dialog-title-so-detail">Sales Invoice Details</DialogTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              data-testid="button-print-invoice"
            >
              <Printer className="h-4 w-4 mr-1" />
              Print
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadPDF}
              data-testid="button-download-pdf"
            >
              <FileDown className="h-4 w-4 mr-1" />
              PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleWhatsAppShare}
              className="text-green-600 hover:text-green-700"
              data-testid="button-whatsapp-share"
            >
              <SiWhatsapp className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Sale Date</p>
              <p className="font-medium" data-testid="text-so-date">{formatDate(order.saleDate)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Invoice Number</p>
              <p className="font-medium font-mono" data-testid="text-so-invoice">
                {order.invoiceNumber || "—"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-1">Customer</p>
            <p className="font-medium" data-testid="text-so-customer">
              {order.customer?.name || "—"}
            </p>
          </div>

          <Separator />

          <div>
            <p className="text-xs text-muted-foreground mb-2">Line Items</p>
            {order.lineItems.length === 0 ? (
              <p className="text-sm text-muted-foreground">No items</p>
            ) : (
              <div className="space-y-3">
                {order.lineItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-md bg-muted/50"
                    data-testid={`item-row-${index}`}
                  >
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex-1">
                        <p className="font-medium">{item.itemName}</p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity} × {formatNumber(item.priceKwd, 3)} KWD
                        </p>
                      </div>
                      <div className="text-right font-mono">
                        <p>{formatNumber(item.totalKwd, 3)} KWD</p>
                      </div>
                    </div>
                    {item.imeiNumbers && item.imeiNumbers.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-border">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                          <Smartphone className="h-3 w-3" />
                          <span>IMEI Numbers ({item.imeiNumbers.length})</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {item.imeiNumbers.map((imei, imeiIndex) => (
                            <Badge 
                              key={imeiIndex} 
                              variant="secondary" 
                              className="text-xs font-mono"
                              data-testid={`imei-badge-${index}-${imeiIndex}`}
                            >
                              {imei}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          <div className="p-3 rounded-md bg-muted/50">
            <p className="text-xs text-muted-foreground mb-1">Total (KWD)</p>
            <p className="text-lg font-semibold font-mono" data-testid="text-so-total-kwd">
              {formatNumber(order.totalKwd, 3)}
            </p>
          </div>

          {order.deliveryDate && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Delivery Date</p>
              <p className="font-medium" data-testid="text-so-delivery">{formatDate(order.deliveryDate)}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
