import React, { useState } from "react";

export default function Tooltip({ children, label }) {
  const [show, setShow] = useState(false);

  return (
    <span
      className="relative"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <span className="absolute bottom-full mb-2 px-2 py-1 text-sm bg-black text-white rounded">
          {label}
        </span>
      )}
    </span>
  );
}
