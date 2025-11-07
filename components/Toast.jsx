import React, { useEffect, useState } from "react";

export default function Toast({ message, duration = 3000 }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-3 rounded shadow">
      {message}
    </div>
  );
}
