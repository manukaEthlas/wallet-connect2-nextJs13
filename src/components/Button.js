import React from "react";

function Button({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-10 py-4 text-white bg-blue-700 border rounded-full hover:bg-blue-900"
    >
      {children}
    </button>
  );
}

export default Button;
