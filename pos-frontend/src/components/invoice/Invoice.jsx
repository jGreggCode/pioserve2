/*
 * Licensed Software
 * For authorized client use only.
 * Unauthorized modification or redistribution is prohibited.
 * Full license terms available in LICENSE.md
 */

import { useRef } from "react";
import { motion } from "framer-motion";
import { FaCheck } from "react-icons/fa6";
import { formatDateAndTime } from "../../utils";

const Invoice = ({ orderInfo, setShowInvoice }) => {
  const invoiceRef = useRef(null);

  const handlePrint = () => {
    const printableHtml = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Receipt</title>
        <style>
          @page {
            size: 72mm auto;
            margin: 0;
          }
          body {
            font-family: "Courier New", monospace;
            font-size: 11px;
            margin: 0;
            padding: 0;
          }
          .receipt {
            width: 72mm;
            padding: 8px;
            margin: 0 auto;
          }
          .center { text-align: center; }
          .logo {
            width: 60px;
            margin: 0 auto 4px;
          }
          h2 { margin: 3px 0; font-size: 13px; text-transform: uppercase; }
          .muted { color: #666; font-size: 10px; }
          .line { border-top: 1px dashed #999; margin: 6px 0; }
          .item { display: flex; justify-content: space-between; margin: 2px 0; }
          .totals .row { display: flex; justify-content: space-between; font-weight: bold; }
          .foot { margin-top: 8px; font-size: 9px; text-align: center; color: #444; }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="center">
            <img src="/logo.png" alt="logo" class="logo" />
            <h2>Order Receipt</h2>
            <div class="muted">${formatDateAndTime(orderInfo.orderDate)}</div>
          </div>

          <p><strong>Order ID:</strong> ${Math.floor(
            new Date(orderInfo.orderDate).getTime()
          )}</p>
          <p><strong>Server:</strong> ${orderInfo.employeeData?.name}</p>
          <p><strong>Table:</strong> ${orderInfo.table?.tableNo}</p>
          <p><strong>Customer:</strong> ${
            orderInfo.customerDetails?.name ?? "N/A"
          }</p>

          <div class="line"></div>

          ${orderInfo.items
            .map(
              (i) => `
              <div class="item">
                <span>${i.name} (${i.pricePerQuantity.toFixed(0)} × ${
                i.quantity
              })</span>
                <span>₱${i.price.toFixed(2)}</span>
              </div>`
            )
            .join("")}

          <div class="line"></div>

          <div class="totals">
            <div class="row"><span>Subtotal</span><span>₱${orderInfo.bills.total.toFixed(
              2
            )}</span></div>
            <div class="row"><span>Tax</span><span>₱${orderInfo.bills.tax.toFixed(
              2
            )}</span></div>
            ${
              orderInfo.bills.discountAmount
                ? `<div class="row"><span>Discount</span><span>-₱${orderInfo.bills.discountAmount.toFixed(
                    2
                  )}</span></div>`
                : ""
            }
            <div class="row"><span>Grand Total</span><span>₱${orderInfo.bills.totalWithTax.toFixed(
              2
            )}</span></div>
          </div>

          <div class="line"></div>

          <div class="center">
            <strong>Payment Method:</strong> ${orderInfo.paymentMethod}
          </div>

          <div class="foot">Thank you for dining with us!<br/>Powered by PioServe</div>
        </div>
      </body>
    </html>
    `;

    const printWin = window.open("", "_blank", "width=400,height=600");
    printWin.document.write(printableHtml);
    printWin.document.close();
    printWin.focus();
    setTimeout(() => printWin.print(), 400);
  };

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="bg-white rounded-xl shadow-lg w-full max-w-md sm:h-[600px] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-5 text-white border-b bg-gradient-to-r from-green-500 to-green-600">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20">
            <FaCheck className="text-lg text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Order Complete</h3>
            <p className="text-xs opacity-90">
              Printable invoice summary for your customer
            </p>
          </div>
        </div>

        {/* Content */}
        <div
          ref={invoiceRef}
          className="flex-1 overflow-y-auto p-5 bg-[#fdfdfd] text-sm"
        >
          <div className="flex flex-col items-center mb-4">
            <img
              src="/logo.png"
              alt="logo"
              className="object-contain w-20 mb-2"
            />
            <span className="text-xs text-gray-500">
              {formatDateAndTime(orderInfo.orderDate)}
            </span>
          </div>

          <div className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
            <div className="grid gap-1 mb-2 text-xs text-gray-700">
              <p>
                <strong>Order ID:</strong>{" "}
                {Math.floor(new Date(orderInfo.orderDate).getTime())}
              </p>
              <p>
                <strong>Server:</strong> {orderInfo.employeeData?.name}
              </p>
              <p>
                <strong>Table:</strong> {orderInfo.table?.tableNo}
              </p>
              <p>
                <strong>Customer:</strong>{" "}
                {orderInfo.customerDetails?.name ?? "N/A"}
              </p>
              <p>
                <strong>Phone:</strong>{" "}
                {orderInfo.customerDetails?.phone ?? "N/A"}
              </p>
            </div>

            <div className="my-3 border-t border-dashed"></div>

            <h4 className="mb-2 font-semibold text-gray-800">Items Ordered</h4>
            <ul className="divide-y divide-gray-200 divide-dashed">
              {orderInfo.items.map((item, idx) => (
                <li key={idx} className="flex justify-between py-1 text-xs">
                  <div>
                    <span className="font-medium">{item.name}</span>{" "}
                    <span className="text-gray-500">×{item.quantity}</span>
                  </div>
                  <span className="font-semibold">
                    ₱{(item.pricePerQuantity * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="my-3 border-t border-dashed"></div>

            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₱{orderInfo.bills.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>₱{orderInfo.bills.tax.toFixed(2)}</span>
              </div>
              {orderInfo.bills.discountAmount > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Discount</span>
                  <span>-₱{orderInfo.bills.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 mt-1 font-bold text-gray-900 border-t">
                <span>Grand Total</span>
                <span>₱{orderInfo.bills.totalWithTax.toFixed(2)}</span>
              </div>
            </div>

            <div className="my-3 border-t border-dashed"></div>

            <div className="text-xs text-gray-700">
              <p>
                <strong>Payment:</strong> {orderInfo.paymentMethod}
              </p>
              {orderInfo.paymentMethod !== "Cash" && orderInfo.paymentData && (
                <>
                  <p>
                    <strong>Order ID:</strong>{" "}
                    {orderInfo.paymentData.razorpay_order_id}
                  </p>
                  <p>
                    <strong>Payment ID:</strong>{" "}
                    {orderInfo.paymentData.razorpay_payment_id}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t bg-gray-50">
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-sm font-medium text-blue-600 transition bg-blue-100 rounded-md hover:bg-blue-200"
          >
            Print Receipt
          </button>
          <button
            onClick={() => setShowInvoice(false)}
            className="px-4 py-2 text-sm font-medium text-red-600 transition bg-red-100 rounded-md hover:bg-red-200"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Invoice;
