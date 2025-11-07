import React, { Suspense, lazy } from "react";

const LazyComponent = lazy(() => import("./LazyComponent"));

export default function SuspenseExample() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
