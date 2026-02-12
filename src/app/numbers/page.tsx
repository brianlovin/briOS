import { Suspense } from "react";

import { NumbersContent } from "./NumbersContent";

export default function NumbersPage() {
  return (
    <Suspense>
      <NumbersContent />
    </Suspense>
  );
}
