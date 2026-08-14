"use client";

import { useEffect } from "react";
import { trackRegistroExitoso } from "@/lib/meta-pixel";

export default function RegistroExitosoTracker() {
  useEffect(() => {
    trackRegistroExitoso();
  }, []);

  return null;
}
