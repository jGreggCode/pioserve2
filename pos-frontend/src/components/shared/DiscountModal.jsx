import { useState } from "react";
import Modal from "./Modal";
import { useDispatch, useSelector } from "react-redux";
import { addDiscount, clearDiscount } from "../../redux/slices/discountSlice";

const DiscountModal = ({ isOpen, onClose, maxDiscounts }) => {
  const dispatch = useDispatch();
  const discounts = useSelector((state) => state.discount); // array
  const [rows, setRows] = useState([]);

  const handleAddRow = () => {
    if (rows.length >= maxDiscounts) return;
    setRows((prev) => [...prev, { type: "", cardId: "" }]);
  };

  const handleChange = (index, field, value) => {
    setRows((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [field]: value } : r))
    );
  };

  const handleConfirm = () => {
    // push all to redux
    dispatch(clearDiscount());
    rows.forEach((r) => {
      if (r.type && r.cardId) dispatch(addDiscount(r));
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Discounts">
      <div className="flex flex-col gap-3">
        {rows.map((row, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <select
              value={row.type}
              onChange={(e) => handleChange(idx, "type", e.target.value)}
              className="flex-1 text-white bg-[#1f1f1f] rounded-lg px-2 py-2"
            >
              <option value="">Select Type</option>
              <option value="Senior">Senior Citizen Discount</option>
              <option value="PWD">PWD Discount</option>
            </select>
            <input
              type="text"
              placeholder="Card ID"
              value={row.cardId}
              onChange={(e) => handleChange(idx, "cardId", e.target.value)}
              className="flex-1 text-white bg-[#1f1f1f] rounded-lg px-2 py-2 placeholder:text-gray-400"
            />
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddRow}
          disabled={rows.length >= maxDiscounts}
          className="px-3 py-2 mt-2 text-sm font-medium text-white rounded bg-primary hover:bg-primary/90 disabled:opacity-50"
        >
          + Add Discount
        </button>

        <button
          onClick={handleConfirm}
          className="w-full py-3 mt-4 font-semibold text-white rounded bg-primary hover:bg-primary/90"
        >
          Confirm Discounts
        </button>
      </div>
    </Modal>
  );
};

export default DiscountModal;
