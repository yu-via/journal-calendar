import React, { useState, useEffect } from "react";

export default function Modal({ isOpen, onClose, onSave, date, initialText,onNavigate }) {
  const [text, setText] = useState(initialText);

  
  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(text);
    onClose();
  };

  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('default', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const handleNavigate = (direction) => {
    onSave(text);
    onNavigate(direction);

  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center"
      onClick={onClose}
    >
      <div className="flex items-center gap-4"  onClick={(e) => e.stopPropagation()}>
      <button
            className="text-2xl bg-white hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => handleNavigate(-1)}
          >
            ❮
          </button>
          
      <div
        className="bg-white p-6 rounded-2xl shadow-2xl w-[512px] mx-4 transform transition-all"
      >
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Journal for {formattedDate}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-2xl"
          >
            &times;
          </button>
        </div>
        <textarea
          className="w-full h-48 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Write your journal entry here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
      <button
            className="text-2xl bg-white hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => handleNavigate(1)}
          >
            ❯
          </button>
          </div>
    </div>
  );
}