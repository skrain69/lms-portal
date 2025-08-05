// src/components/AvatarModal.js
import { X } from "lucide-react";

const AvatarModal = ({ photoURL, onClose }) => {
  if (!photoURL) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
      <div className="relative bg-white dark:bg-gray-900 rounded-lg p-4 shadow-lg max-w-xs w-full">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <img
          src={photoURL}
          alt="User Avatar"
          className="w-full h-auto rounded-md object-contain"
        />
      </div>
    </div>
  );
};

export default AvatarModal;
