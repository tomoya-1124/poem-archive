"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage("ログインエラー: " + error.message);
      return;
    }

    router.push("/");
  };

  return (
    <main className="min-h-screen bg-black p-8 text-white">
      <div className="mx-auto mt-20 max-w-md">
        <p className="text-xs tracking-[0.3em] text-zinc-500">POEM ARCHIVE</p>
        <h1 className="mt-4 text-3xl font-bold">Login</h1>

        <div className="mt-8 space-y-4">
          <input
            className="w-full rounded border border-zinc-700 bg-zinc-900 p-3 text-white"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full rounded border border-zinc-700 bg-zinc-900 p-3 text-white"
            placeholder="パスワード"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="w-full rounded bg-white px-5 py-3 font-bold text-black"
          >
            ログイン
          </button>

          {message && <p className="text-sm text-zinc-400">{message}</p>}
        </div>
      </div>
    </main>
  );
}