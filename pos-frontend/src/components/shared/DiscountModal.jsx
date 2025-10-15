// components/shared/DiscountModal.jsx
import { useState, useEffect } from "react";
import Modal from "./Modal";
import { useDispatch, useSelector } from "react-redux";
import { addDiscount, clearDiscount } from "../../redux/slices/discountSlice";

const DiscountModal = ({
  isOpen,
  onClose,
  order,
  maxDiscounts = 3,
  handleDiscount,
}) => {
  const dispatch = useDispatch();
  const discounts = useSelector((state) => state.discount || []);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (!isOpen) {
      setRows([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    if (order?.discounts?.length > 0) {
      setRows(
        order.discounts.map((d) => ({
          type: d.type || "",
          cardId: d.cardId || "",
          discountValue: d.discountValue || "",
        }))
      );
    } else {
      setRows([{ type: "", cardId: "", discountValue: "" }]);
    }
  }, [isOpen, order?._id]); // ✅ reset when order changes

  const handleAddRow = () => {
    if (rows.length >= maxDiscounts) return;
    setRows((prev) => [...prev, { type: "", cardId: "", discountValue: "" }]);
  };

  const handleRemoveRow = (index) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    setRows((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [field]: value } : r))
    );
  };

  const handleConfirm = () => {
    dispatch(clearDiscount());
    const toSave = [];

    rows.forEach((r) => {
      if (
        r.type &&
        r.cardId &&
        r.discountValue !== "" &&
        !isNaN(Number(r.discountValue))
      ) {
        const normalized = {
          type: r.type,
          cardId: r.cardId,
          discountValue: Number(r.discountValue),
        };
        dispatch(addDiscount(normalized));
        toSave.push(normalized);
      }
    });

    handleDiscount(toSave);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Discounts">
      <div className="flex flex-col gap-4 text-sm">
        {rows.map((row, idx) => (
          <div
            key={idx}
            className="flex flex-wrap md:flex-nowrap items-center gap-2 bg-[#2b2b2b] border border-gray-700 p-3 rounded-lg"
          >
            <div className="flex-1 min-w-[120px]">
              <label className="block mb-1 text-xs text-gray-400">
                Discount Type
              </label>
              <select
                value={row.type}
                onChange={(e) => handleChange(idx, "type", e.target.value)}
                className="w-full bg-[#1f1f1f] border border-gray-700 rounded-md px-2 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Select Type</option>
                <option value="Senior">Senior Citizen</option>
                <option value="PWD">PWD</option>
              </select>
            </div>

            <div className="flex-1 min-w-[120px]">
              <label className="block mb-1 text-xs text-gray-400">
                Card ID
              </label>
              <input
                type="text"
                value={row.cardId}
                onChange={(e) => handleChange(idx, "cardId", e.target.value)}
                placeholder="Enter card ID"
                className="w-full bg-[#1f1f1f] border border-gray-700 rounded-md px-2 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex-1 min-w-[100px]">
              <label className="block mb-1 text-xs text-gray-400">
                Discount (%)
              </label>
              <input
                type="number"
                value={row.discountValue}
                onChange={(e) =>
                  handleChange(idx, "discountValue", e.target.value)
                }
                placeholder="0"
                className="w-full bg-[#1f1f1f] border border-gray-700 rounded-md px-2 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <button
              type="button"
              onClick={() => handleRemoveRow(idx)}
              className="p-2 mt-6 text-xs font-medium text-white transition-colors bg-red-600 rounded-md hover:bg-red-700"
            >
              ✕
            </button>
          </div>
        ))}

        <div className="flex justify-between mt-2">
          <button
            type="button"
            onClick={handleAddRow}
            disabled={rows.length >= maxDiscounts}
            className="px-4 py-2 text-sm font-medium rounded-md bg-[#3a3a3a] text-white hover:bg-[#4a4a4a] disabled:opacity-50 transition-colors"
          >
            + Add Discount
          </button>

          <button
            onClick={handleConfirm}
            className="px-5 py-2 font-semibold text-white transition-colors rounded-md bg-primary hover:bg-primary/90"
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DiscountModal;
