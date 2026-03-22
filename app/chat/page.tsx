"use client";

export const dynamic = "force-dynamic";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

type Message = {
  text: string;
  name: string;
  createdAt: number;
};

export default function ChatPage() {
  const searchParams = useSearchParams();
  const tags = searchParams.get("tags")?.split(",") || [];
  const alltags = searchParams.get("alltags") || tags[0] || "";

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  const chatBoxRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const lastMessageCountRef = useRef(0);
  const shouldScrollAfterSendRef = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem("profile");
    if (saved) {
      const parsed = JSON.parse(saved);
      setName(parsed.name || "");
      setBio(parsed.bio || "");
    }
  }, []);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    setHasNewMessage(false);
    setShowScrollButton(false);
  };

  const checkScrollPosition = () => {
    const el = chatBoxRef.current;
    if (!el) return;

    const nearBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < 40;

    setShowScrollButton(!nearBottom);

    if (nearBottom) {
      setHasNewMessage(false);
    }
  };

  useEffect(() => {
    if (!tags[0]) return;

    const q = query(
      collection(db, "rooms", tags[0], "messages"),
      orderBy("createdAt")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => doc.data() as Message);
      const oldCount = lastMessageCountRef.current;

      setMessages(msgs);
      lastMessageCountRef.current = msgs.length;

      setTimeout(() => {
        if (oldCount === 0 && msgs.length > 0) {
          scrollToBottom();
          return;
        }

        if (shouldScrollAfterSendRef.current) {
          scrollToBottom();
          shouldScrollAfterSendRef.current = false;
          return;
        }

        if (msgs.length > oldCount) {
          setHasNewMessage(true);
        }
      }, 0);
    });

    return () => unsubscribe();
  }, [tags]);

  const sendMessage = async () => {
    if (!input.trim() || !name || !tags[0]) return;

    shouldScrollAfterSendRef.current = true;

    await addDoc(collection(db, "rooms", tags[0], "messages"), {
      text: input,
      name: name,
      createdAt: Date.now(),
    });

    setInput("");
  };

  const formatTime = (timestamp: number) => {
    const d = new Date(timestamp);
    return d.toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <main
      style={{
        padding: 16,
        maxWidth: 480,
        margin: "0 auto",
        fontFamily: "sans-serif",
      }}
    >
      <Link href={`/rooms?tags=${alltags}&name=${name}`}>
        <button
          style={{
            marginBottom: 14,
            padding: "10px 14px",
            borderRadius: 10,
            border: "none",
            backgroundColor: "#ddd",
            color: "#222",
            fontWeight: 700,
            cursor: "pointer",
            width: "100%",
          }}
        >
          ← 部屋一覧へ戻る
        </button>
      </Link>

      <h1
        style={{
          textAlign: "center",
          color: "#e53935",
          fontSize: 24,
          marginBottom: 12,
        }}
      >
        {tags[0]} ルーム
      </h1>

      <div
        style={{
          marginTop: 10,
          marginBottom: 16,
          padding: 12,
          borderRadius: 12,
          backgroundColor: "#fff5f5",
          border: "1px solid #ffcdd2",
        }}
      >
        <p
          style={{
            margin: "0 0 6px 0",
            fontWeight: 700,
            color: "#222",
            fontSize: 18,
          }}
        >
          {name}
        </p>
        <p
          style={{
            color: "#444",
            margin: 0,
            fontSize: 14,
            lineHeight: 1.5,
          }}
        >
          {bio}
        </p>
      </div>

      {hasNewMessage && (
        <button
          onClick={scrollToBottom}
          style={{
            width: "100%",
            marginBottom: 10,
            padding: "10px 14px",
            borderRadius: 10,
            border: "none",
            backgroundColor: "#e53935",
            color: "white",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          新着メッセージあり ↓
        </button>
      )}

      {showScrollButton && !hasNewMessage && (
        <button
          onClick={scrollToBottom}
          style={{
            width: "100%",
            marginBottom: 10,
            padding: "10px 14px",
            borderRadius: 10,
            border: "none",
            backgroundColor: "#f8d7da",
            color: "#b71c1c",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          ↓ 一番下へ戻る
        </button>
      )}

      <div
        ref={chatBoxRef}
        onScroll={checkScrollPosition}
        style={{
          border: "1px solid #ffcdd2",
          borderRadius: 12,
          padding: 12,
          height: 360,
          overflowY: "auto",
          backgroundColor: "#fffafa",
          WebkitOverflowScrolling: "touch",
          touchAction: "pan-y",
        }}
      >
        {messages.map((msg, i) => {
          const isMe = msg.name === name;

          return (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: isMe ? "flex-end" : "flex-start",
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  maxWidth: "82%",
                  backgroundColor: isMe ? "#e53935" : "#f8d7da",
                  color: isMe ? "white" : "black",
                  padding: "10px 12px",
                  borderRadius: 16,
                }}
              >
                <div style={{ fontSize: 12 }}>{msg.name}</div>

                <div style={{ marginTop: 4, lineHeight: 1.5 }}>{msg.text}</div>

                <div
                  style={{
                    fontSize: 11,
                    textAlign: "right",
                    marginTop: 4,
                    opacity: 0.7,
                  }}
                >
                  {formatTime(msg.createdAt)}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          marginTop: 14,
          alignItems: "stretch",
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          placeholder="メッセージ入力"
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 10,
            border: "1px solid #ccc",
            fontSize: 16,
          }}
        />

        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          style={{
            padding: "12px 16px",
            borderRadius: 10,
            backgroundColor: input.trim() ? "#b71c1c" : "#d7a3a3",
            color: "white",
            border: "none",
            cursor: input.trim() ? "pointer" : "default",
            fontSize: 15,
            fontWeight: 700,
          }}
        >
          送信
        </button>
      </div>
    </main>
  );
}