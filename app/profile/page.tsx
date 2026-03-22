"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  const saveProfile = () => {
    localStorage.setItem(
      "profile",
      JSON.stringify({ name, bio })
    );

    router.push("/");
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>プロフィール設定</h1>

      <input
        placeholder="名前"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />

      <textarea
        placeholder="自己紹介"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        style={{
          display: "block",
          marginBottom: 10,
          height: 80
        }}
      />

      <button onClick={saveProfile}>保存</button>
    </main>
  );
}