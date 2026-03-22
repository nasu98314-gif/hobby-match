"use client";

import { Suspense } from "react";
import RoomsContent from "./RoomsContent";

export default function RoomsPage() {
  return (
    <Suspense fallback={<div style={{ padding: 20 }}>読み込み中...</div>}>
      <RoomsContent />
    </Suspense>
  );
}