"use client";
import { useEffect, useState } from "react";

import { Loading } from "@/components/icons/Loading";

export function LoadingSpinner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (!show) {
    return null;
  }

  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin">
        <Loading size={24} className="text-primary" />
      </div>
    </div>
  );
}
