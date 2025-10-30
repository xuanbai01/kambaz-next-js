"use client";
import { useState } from "react";
import { Button } from "react-bootstrap";

export default function Counter() {
  const [count, setCount] = useState(7);
  console.log(count);
  
  return (
    <div id="wd-counter-use-state" className="text-center">
      <h2>Counter: {count}</h2>
      <div className="d-flex gap-2 justify-content-center">
        <Button
          onClick={() => { setCount(count + 1); }}
          id="wd-counter-up-click"
          variant="success"
        >
          Up
        </Button>
        <Button
          onClick={() => { setCount(count - 1); }}
          id="wd-counter-down-click"
          variant="danger"
        >
          Down
        </Button>
      </div>
      <hr/>
    </div>
  );
}