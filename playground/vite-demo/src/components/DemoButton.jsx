import React, { useState } from "react";

function DemoButton() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>
  );
}

export default DemoButton;
