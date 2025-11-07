import React from "react";

export default function Loader({ size = 40, color = "#4f46e5" }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: `4px solid ${color}33`,
        borderTop: `4px solid ${color}`,
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}
    />
  );
}

// Add CSS in your global CSS
// @keyframes spin {
//   0% { transform: rotate(0deg); }
//   100% { transform: rotate(360deg); }
// }
