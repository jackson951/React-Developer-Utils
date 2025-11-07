import React from "react";
import ReactDOM from "react-dom";

export default function PortalExample({ children }) {
  return ReactDOM.createPortal(
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 flex items-center justify-center">
      {children}
    </div>,
    document.body
  );
}
