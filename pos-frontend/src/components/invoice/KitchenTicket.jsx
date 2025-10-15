/*
 * Licensed Software
 * For authorized client use only.
 * Unauthorized modification or redistribution is prohibited.
 * Full license terms available in LICENSE.md
 */

import { useRef } from "react";
import { FaCheck } from "react-icons/fa6";
import { formatDateAndTime } from "../../utils";

const KitchenTicket = ({ orderInfo, setShowInvoice }) => {
  const ticketRef = useRef(null);

  const handlePrint = () => {
    const printableHtml = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Kitchen Order Ticket</title>
        <style>
          @page {
            size: 58mm auto;
            margin: 0;
          }
          * {
            font-weight: bold;
          }
          body {
            font-family: "Courier New", Courier, monospace;
            font-size: 13px;
            margin: 0;
            padding: 0;
          }
          .ticket {
            width: 72mm;
            padding: 8px;
            margin: 0 auto;
          }
          .center { text-align: center; }
          h2 { margin: 4px 0; font-size: 15px; }
          .muted { color: #555; font-size: 11px; }
          .line { border-top: 1px dashed #000; margin: 6px 0; }
          .item { display: flex; justify-content: space-between; margin: 6px 0; font-size: 14px; }
          .item span:first-child { font-weight: bold; }
          .foot { margin-top: 8px; font-size: 10px; text-align:center; }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="center">
            <h2>KITCHEN ORDER TICKET</h2>
            <div class="muted">${formatDateAndTime(orderInfo.orderDate)}</div>
          </div>

          <div>
            <p><strong>Order ID:</strong> ${Math.floor(
              new Date(orderInfo.orderDate).getTime()
            )}</p>
            <p><strong>Table:</strong> ${orderInfo.table?.tableNo}</p>
            <p><strong>Server:</strong> ${orderInfo.employeeData?.name}</p>
            <p><strong>Customer:</strong> ${
              orderInfo.customerDetails?.name ?? "N/A"
            }</p>
             <p><strong>Note:</strong> ${orderInfo.note || "None"}</p>
          </div>

          <div class="line"></div>

          <div>
            ${orderInfo.items
              .map(
                (i) => `
                <div class="item">
                  <span>${i.quantity}x ${i.name}</span>
                  <span>${i.notes ? "(" + i.notes + ")" : ""}</span>
                </div>`
              )
              .join("")}
          </div>

          <div class="line"></div>
          <div class="center foot">Send to kitchen - Not a receipt</div>
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
            <h3 className="text-lg font-bold text-gray-800">
              Kitchen Order Ticket
            </h3>
            <p className="text-xs text-gray-500">
              Printable order list — to be sent to the kitchen
            </p>
          </div>
        </div>

        {/* Ticket content */}
        <div
          ref={ticketRef}
          className="flex-1 overflow-y-auto p-4 bg-[#fafafa] text-sm"
          style={{ minHeight: 0 }}
        >
          <div className="mb-3 text-center">
            <div className="text-xs text-gray-600">
              {formatDateAndTime(orderInfo.orderDate)}
            </div>
          </div>

          <div className="bg-white rounded-md p-3 border border-[#eee] shadow-sm">
            <div className="mb-2 text-xs text-gray-700">
              <div>
                <strong>Order ID:</strong>{" "}
                {Math.floor(new Date(orderInfo.orderDate).getTime())}
              </div>
              <div>
                <strong>Table:</strong> {orderInfo.table?.tableNo}
              </div>
              <div>
                <strong>Server:</strong> {orderInfo.employeeData?.name}
              </div>
              <div>
                <strong>Customer:</strong>{" "}
                {orderInfo.customerDetails?.name ?? "N/A"}
              </div>
              <div className="font-bold">
                <strong>Note:</strong> {orderInfo.note || "None"}
              </div>
            </div>

            <div className="line my-2 border-t border-dashed border-[#e6e6e6]" />

            {/* Items */}
            <div>
              <h4 className="mb-2 text-sm font-semibold text-gray-800">
                Items to Prepare
              </h4>
              <ul className="space-y-2">
                {orderInfo.items.map((item, idx) => (
                  <li key={idx} className="flex items-center justify-between">
                    <div className="text-sm font-bold">
                      {item.quantity}x {item.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.notes ?? ""}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#eee] flex items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-sm text-blue-600 transition rounded-md bg-blue-50 hover:bg-blue-100"
          >
            Print Ticket
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

export default KitchenTicket;
