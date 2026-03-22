"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { db } from "../../firebase";
import { collection, onSnapshot } from "firebase/firestore";

type RoomInfo = {
  tag: string;
  count: number;
};

export default function RoomsPage() {
  const searchParams = useSearchParams();
  const tags = searchParams.get("tags");
  const name = searchParams.get("name");

  const tagList = tags ? tags.split(",") : [];
  const [rooms, setRooms] = useState<RoomInfo[]>([]);

  useEffect(() => {
    const unsubscribes: (() => void)[] = [];

    tagList.forEach((tag) => {
      const unsubscribe = onSnapshot(
        collection(db, "rooms", tag, "messages"),
        (snapshot) => {
          setRooms((prev) => {
            const others = prev.filter((room) => room.tag !== tag);
            return [...others, { tag, count: snapshot.size }];
          });
        }
      );

      unsubscribes.push(unsubscribe);
    });

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [tags]);

  return (
    <main
      style={{
        padding: 16,
        maxWidth: 480,
        margin: "0 auto",
        fontFamily: "sans-serif"
      }}
    >
      <Link href="/">
        <button
          style={{
            marginBottom: 16,
            padding: "10px 14px",
            borderRadius: 10,
            border: "none",
            backgroundColor: "#ddd",
            color: "#222",
            fontWeight: 700,
            cursor: "pointer",
            width: "100%"
          }}
        >
          ← トップへ戻る
        </button>
      </Link>

      <h1
        style={{
          marginBottom: 8,
          color: "#e53935",
          fontSize: 26,
          textAlign: "center"
        }}
      >
        参加できる部屋
      </h1>

      <p
        style={{
          color: "#666",
          marginBottom: 20,
          textAlign: "center",
          fontSize: 14
        }}
      >
        {name} さんが参加できる趣味ルーム
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {rooms.map((room) => (
          <Link
            key={room.tag}
            href={`/chat?tags=${room.tag}&name=${name}&alltags=${tags}`}
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                border: "1px solid #ffcdd2",
                borderRadius: 14,
                padding: 16,
                cursor: "pointer",
                backgroundColor: "#fff5f5"
              }}
            >
              <h2 style={{ margin: 0, fontSize: 18, color: "#b71c1c" }}>
                {room.tag} ルーム
              </h2>
              <p style={{ marginTop: 8, color: "#555", fontSize: 14 }}>
                メッセージ数: {room.count}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}