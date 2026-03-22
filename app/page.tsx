"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const tags = [
    "デザイン","建築","絵画","金工","木工",
    "映像","音楽","旅行","料理","ゲーム",
    "読書","食べ歩き","スポーツ"
  ];

  const [selected, setSelected] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("profile");
    if (saved) {
      const parsed = JSON.parse(saved);
      setName(parsed.name || "");
      setBio(parsed.bio || "");
    }
  }, []);

  const toggleTag = (tag: string) => {
    if (selected.includes(tag)) {
      setSelected(selected.filter((t) => t !== tag));
    } else {
      setSelected([...selected, tag]);
    }
  };

  const canGo = name !== "" && selected.length > 0;

  return (
    <main
      style={{
        padding: 16,
        maxWidth: 480,
        margin: "0 auto",
        fontFamily: "sans-serif"
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#e53935",
          fontSize: 28,
          marginBottom: 20
        }}
      >
        趣味マッチング
      </h1>

      <div
        style={{
          marginBottom: 16,
          padding: 14,
          borderRadius: 14,
          backgroundColor: "#fff5f5",
          border: "1px solid #ffcdd2"
        }}
      >
        <p style={{ margin: "0 0 8px 0", fontSize: 15, color: "#222" }}>
          <strong>名前:</strong> {name || "未設定"}
        </p>

        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: "#444" }}>
          <strong>自己紹介:</strong> {bio || "未設定"}
        </p>
      </div>

      <Link href="/profile">
        <button
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 12,
            backgroundColor: "#e53935",
            color: "white",
            border: "none",
            marginBottom: 18,
            cursor: "pointer",
            fontSize: 16,
            fontWeight: 600
          }}
        >
          プロフィール設定
        </button>
      </Link>

      <p style={{ marginBottom: 10, fontSize: 15 }}>タグを選択</p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10
        }}
      >
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            style={{
              padding: "10px 14px",
              borderRadius: 20,
              border: selected.includes(tag)
                ? "2px solid #e53935"
                : "1px solid #ccc",
              backgroundColor: selected.includes(tag)
                ? "#e53935"
                : "#fff",
              color: selected.includes(tag)
                ? "white"
                : "black",
              cursor: "pointer",
              fontSize: 14
            }}
          >
            {tag}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 18 }}>
        <p style={{ fontSize: 14, lineHeight: 1.5 }}>
          <strong>選択中:</strong> {selected.join(", ") || "なし"}
        </p>
      </div>

      <div style={{ marginTop: 20 }}>
        {canGo ? (
          <Link href={`/rooms?tags=${selected.join(",")}&name=${name}`}>
            <button
              style={{
                width: "100%",
                padding: 16,
                borderRadius: 14,
                backgroundColor: "#b71c1c",
                color: "white",
                border: "none",
                fontSize: 17,
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              部屋へ
            </button>
          </Link>
        ) : (
          <p style={{ color: "gray", fontSize: 14 }}>
            ※プロフィールとタグを設定してください
          </p>
        )}
      </div>
    </main>
  );
}