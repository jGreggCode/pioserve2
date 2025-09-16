// components/common/NoteModal.jsx
import React, { useState } from "react";

const NoteModal = ({ isOpen, onClose, onSave, initialValue = "" }) => {
  const [note, setNote] = useState(initialValue);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#1f1f1f] rounded-xl p-6 w-[90%] max-w-md">
        <h2 className="mb-4 text-lg font-bold text-white">Add Note</h2>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Type your note here..."
          className="w-full h-28 rounded-lg p-3 bg-[#292929] text-white border border-[#3a3a3a] resize-none"
        />

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(note);
              onClose();
            }}
            className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;
