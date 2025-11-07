import React from "react";

export default function Pagination({ current, total, onChange }) {
  const pages = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <div className="flex gap-2">
      {pages.map((page) => (
        <button
          key={page}
          className={`px-3 py-1 rounded ${
            page === current ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => onChange(page)}
        >
          {page}
        </button>
      ))}
    </div>
  );
}
