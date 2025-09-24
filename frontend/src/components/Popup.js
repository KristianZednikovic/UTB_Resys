import React from "react";

const Popup = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Popup Content */}
      <div className="relative bg-gray-900/95 border-2 border-red-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto backdrop-blur-md">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900/95 backdrop-blur-md border-b border-red-800 p-6 rounded-t-3xl">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-red-400 drop-shadow-lg">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-red-600 to-red-800 text-white p-3 rounded-full hover:shadow-2xl transform hover:scale-105 transition-all duration-200 border-2 border-red-400 hover:border-red-300"
              aria-label="Close popup"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Popup;
