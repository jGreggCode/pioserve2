import { useRef } from "react";
import { motion } from "framer-motion";
import { FaCheck } from "react-icons/fa6";
import { formatDateAndTime } from "../../utils";

const Invoice = ({ orderInfo, setShowInvoice }) => {
  const invoiceRef = useRef(null);
  console.log(orderInfo);

  const handlePrint = () => {
    const printableHtml = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Receipt</title>
        <style>
          @page {
            size: 72mm auto; /* Thermal receipt width */
            margin: 0;       /* Remove default margins */
          }
          body {
            font-family: "Courier New", Courier, monospace;
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
            height: auto;
            margin: 0 auto 5px;
          }
          h2 { margin: 4px 0; font-size: 13px; }
          .muted { color: #555; font-size: 10px; }
          .line { border-top: 1px dashed #999; margin: 6px 0; }
          .item { display: flex; justify-content: space-between; margin: 2px 0; }
          .totals { margin-top: 6px; }
          .totals .row { display:flex; justify-content:space-between; font-weight: bold; }
          .foot { margin-top: 8px; font-size: 9px; text-align:center; }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="center">
            <img src="/logo.png" alt="logo" class="logo" />
            <h2>Order Receipt</h2>
            <div class="muted">${formatDateAndTime(orderInfo.orderDate)}</div>
          </div>

          <div>
            <p><strong>Order ID:</strong> ${Math.floor(
              new Date(orderInfo.orderDate).getTime()
            )}</p>
            <p><strong>Server:</strong> ${orderInfo.employeeData?.name}</p>
            <p><strong>Table:</strong> ${orderInfo.table?.tableNo}</p>
            <p><strong>Customer:</strong> ${orderInfo.customerDetails?.name}</p>
          </div>

          <div class="line"></div>

          <div>
            ${orderInfo.items
              .map(
                (i) => `
                <div class="item">
                  <span>${i.name} x${i.quantity}</span>
                  <span>₱${(i.price * i.quantity).toFixed(2)}</span>
                </div>`
              )
              .join("")}
          </div>

          <div class="line"></div>

          <div class="totals">
            <div class="row"><span>Subtotal</span><span>₱${orderInfo.bills.total.toFixed(
              2
            )}</span></div>
            <div class="row"><span>Tax</span><span>₱${orderInfo.bills.tax.toFixed(
              2
            )}</span></div>
            <div class="row"><span>Grand Total</span><span>₱${orderInfo.bills.totalWithTax.toFixed(
              2
            )}</span></div>
          </div>

          <div class="line"></div>
          <div class="center">Thank you for your order!</div>
          <div class="foot">Powered by Pioserve</div>
        </div>
      </body>
    </html>
  `;

    const printWin = window.open("", "_blank", "width=400,height=600");
    printWin.document.write(printableHtml);
    printWin.document.close();
    printWin.focus();

    setTimeout(() => {
      printWin.print();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md sm:h-[600px] flex flex-col overflow-hidden">
        {/* Top / Header */}
        <div className="p-4 border-b border-[#eee] flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-full shadow-md">
              <FaCheck className="text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Order Receipt</h3>
            <p className="text-xs text-gray-500">
              Printable receipt — includes order details & totals
            </p>
          </div>
        </div>

        {/* Receipt content (used for both on-screen preview and printing) */}
        <div
          ref={invoiceRef}
          className="flex-1 overflow-y-auto p-4 bg-[#fafafa] text-sm"
          style={{ minHeight: 0 }} // ensures nice scrolling inside modal
        >
          {/* Printable header (logo + basic info) */}
          <div className="flex flex-col items-center mb-3">
            <img
              src="/logo.png"
              alt="logo"
              className="object-contain w-20 h-auto mb-2"
            />
            <div className="text-xs text-gray-600">
              {formatDateAndTime(orderInfo.orderDate)}
            </div>
          </div>

          {/* Order meta */}
          <div className="bg-white rounded-md p-3 border border-[#eee] shadow-sm">
            <div className="mb-2 text-xs text-gray-700">
              <div>
                <strong>Order ID:</strong>{" "}
                {Math.floor(new Date(orderInfo.orderDate).getTime())}
              </div>
              <div>
                <strong>Server:</strong> {orderInfo.employeeData?.name}
              </div>
              <div>
                <strong>Table:</strong> {orderInfo.table?.tableNo}
              </div>
              <div>
                <strong>Customer:</strong>{" "}
                {orderInfo.customerDetails?.name ?? "N/A"}
              </div>
              <div>
                <strong>Phone:</strong>{" "}
                {orderInfo.customerDetails?.phone ?? "N/A"}
              </div>
            </div>

            <div className="line my-2 border-t border-dashed border-[#e6e6e6]" />

            {/* Items */}
            <div>
              <h4 className="mb-2 text-sm font-semibold text-gray-800">
                Items Ordered
              </h4>
              <ul className="space-y-2">
                {orderInfo.items.map((item, idx) => (
                  <li key={idx} className="flex items-center justify-between">
                    <div className="text-xs text-gray-700">
                      <div className="font-medium">
                        {item.name}{" "}
                        <span className="text-xs text-gray-500">
                          x{item.quantity}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.category ?? ""}
                      </div>
                    </div>
                    <div className="text-xs font-semibold">
                      ₱{(item.pricePerQuantity * item.quantity).toFixed(2)}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="line my-3 border-t border-dashed border-[#e6e6e6]" />

            {/* Bills */}
            <div className="text-sm">
              <div className="flex justify-between mb-1 text-gray-600">
                <span>Subtotal</span>
                <span>₱{orderInfo.bills.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-1 text-gray-600">
                <span>Tax</span>
                <span>₱{orderInfo.bills.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mt-2 text-base font-bold text-gray-800">
                <span>Grand Total</span>
                <span>₱{orderInfo.bills.totalWithTax.toFixed(2)}</span>
              </div>
            </div>

            <div className="line my-3 border-t border-dashed border-[#e6e6e6]" />

            {/* Payment info */}
            <div className="text-xs text-gray-700">
              <div>
                <strong>Payment:</strong> {orderInfo.paymentMethod}
              </div>
              {orderInfo.paymentMethod !== "Cash" && orderInfo.paymentData && (
                <>
                  <div>
                    <strong>Order ID:</strong>{" "}
                    {orderInfo.paymentData.razorpay_order_id}
                  </div>
                  <div>
                    <strong>Payment ID:</strong>{" "}
                    {orderInfo.paymentData.razorpay_payment_id}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer / actions */}
        <div className="p-4 border-t border-[#eee] flex items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-sm text-blue-600 transition rounded-md bg-blue-50 hover:bg-blue-100"
          >
            Print Receipt
          </button>
          <button
            onClick={() => setShowInvoice(false)}
            className="px-4 py-2 text-sm text-red-600 transition rounded-md bg-red-50 hover:bg-red-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
