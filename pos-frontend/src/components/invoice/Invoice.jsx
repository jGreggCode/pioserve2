import { useRef } from "react";
import { motion } from "framer-motion";
import { FaCheck } from "react-icons/fa6";
import { formatDateAndTime } from "../../utils";

const Invoice = ({ orderInfo, setShowInvoice }) => {
  const invoiceRef = useRef(null);
  const handlePrint = () => {
    const printContent = invoiceRef.current.innerHTML;
    const WinPrint = window.open("", "", "width=900,height=650");

    WinPrint.document.write(`
            <html>
              <head>
                <title>Order Receipt</title>
                <style>
                  body { font-family: Arial, sans-serif; padding: 20px; }
                  .receipt-container { width: 300px; border: 1px solid #ddd; padding: 10px; }
                  h2 { text-align: center; }
                </style>
              </head>
              <body>
                ${printContent}
              </body>
            </html>
          `);

    WinPrint.document.close();
    WinPrint.focus();
    setTimeout(() => {
      WinPrint.print();
      WinPrint.close();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-[90%] sm:w-[400px] sm:h-[500px] flex flex-col">
        {/* Receipt Content for Printing */}
        <div ref={invoiceRef} className="flex-1 p-4 overflow-y-auto">
          {/* Receipt Header */}
          <div className="flex justify-center mb-4">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
              className="flex items-center justify-center w-12 h-12 bg-green-500 border-8 border-green-500 rounded-full shadow-lg"
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="text-2xl"
              >
                <FaCheck className="text-white" />
              </motion.span>
            </motion.div>
          </div>

          <h2 className="mb-2 text-xl font-bold text-center">Order Receipt</h2>
          <p className="text-center text-gray-600">Thank you for your order!</p>

          {/* Order Details */}
          <div className="pt-4 mt-4 text-sm text-gray-700 border-t">
            <p>
              <strong>Order ID:</strong>{" "}
              {Math.floor(new Date(orderInfo.orderDate).getTime())}
            </p>
            <p>
              <strong>Server Name:</strong> {orderInfo.employeeData.name}
            </p>
            <p>
              <strong>Table Number:</strong> {orderInfo.table.tableNo}
            </p>
            <p>
              <strong>Date/Time:</strong>{" "}
              {formatDateAndTime(orderInfo.orderDate)}
            </p>
            <p>
              <strong>Customer Name:</strong> {orderInfo.customerDetails.name}
            </p>
            <p>
              <strong>Phone:</strong> {orderInfo.customerDetails.phone ?? "N/A"}
            </p>
            <p>
              <strong>Guests:</strong> {orderInfo.customerDetails.guests}
            </p>
          </div>

          {/* Items Summary */}
          <div className="pt-4 mt-4 border-t">
            <h3 className="text-sm font-semibold">Items Ordered</h3>
            <ul className="text-sm text-gray-700">
              {orderInfo.items.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between text-xs"
                >
                  <span>
                    {item.name} x{item.quantity}
                  </span>
                  <span>&#8369;{item.price.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bills Summary */}
          <div className="pt-4 mt-4 text-sm border-t">
            <p>
              <strong>Subtotal:</strong> &#8369;
              {orderInfo.bills.total.toFixed(2)}
            </p>
            <p>
              <strong>Tax:</strong> &#8369;{orderInfo.bills.tax.toFixed(2)}
            </p>
            <p className="font-semibold text-md">
              <strong>Grand Total:</strong> &#8369;
              {orderInfo.bills.totalWithTax.toFixed(2)}
            </p>
          </div>

          {/* Payment Details */}
          <div className="mt-2 mb-2 text-xs">
            {orderInfo.paymentMethod === "Cash" ? (
              <p>
                <strong>Payment Method:</strong> {orderInfo.paymentMethod}
              </p>
            ) : (
              <>
                <p>
                  <strong>Payment Method:</strong> {orderInfo.paymentMethod}
                </p>
                <p>
                  <strong>Razorpay Order ID:</strong>{" "}
                  {orderInfo.paymentData?.razorpay_order_id}
                </p>
                <p>
                  <strong>Razorpay Payment ID:</strong>{" "}
                  {orderInfo.paymentData?.razorpay_payment_id}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs text-blue-500 rounded-lg hover:underline"
          >
            Print Receipt
          </button>
          <button
            onClick={() => {
              setShowInvoice(false);
            }}
            className="px-4 py-2 text-xs text-red-500 rounded-lg hover:underline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
