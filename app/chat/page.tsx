"use client";

import { Suspense } from "react";
import ChatContent from "./ChatContent";

export default function ChatPage() {
  return (
    <Suspense fallback={<div style={{ padding: 20 }}>読み込み中...</div>}>
      <ChatContent />
    </Suspense>
  );
}