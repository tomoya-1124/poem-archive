"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Poem = {
  id: string;
  title: string;
  body: string;
  created_at: string;
  tags: string[] | null;
};

export default function PublicPoemsPage() {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [message, setMessage] = useState("読み込み中...");

  useEffect(() => {
    const fetchPublicPoems = async () => {
      const { data, error } = await supabase
        .from("poems")
        .select("*")
        .eq("is_public", true)
        .order("created_at", { ascending: false });

      if (error) {
        setMessage("取得エラー: " + error.message);
        return;
      }

      setPoems(data ?? []);
      setMessage("");
    };

    fetchPublicPoems();
  }, []);

  return (
    <main className="min-h-screen bg-black p-8 text-white">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm text-zinc-500">
          ← 管理画面へ
        </Link>

        <header className="mt-10">
          <p className="text-sm tracking-widest text-zinc-500">PUBLIC POEMS</p>
          <h1 className="mt-2 text-4xl font-bold">公開作品</h1>
          <p className="mt-4 text-zinc-400">
            書き残した言葉たち。
          </p>
        </header>

        <section className="mt-10 space-y-5">
          {message && <p>{message}</p>}

          {poems.map((poem) => (
            <Link
              key={poem.id}
              href={`/poems/${poem.id}`}
              className="block rounded border border-zinc-800 bg-zinc-950 p-6 hover:border-zinc-500"
            >
              <h2 className="text-xl font-bold">{poem.title}</h2>

                {poem.tags && poem.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                    {poem.tags.map((tag) => (
                    <span
                        key={tag}
                        className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-400"
                    >
                        #{tag}
                    </span>
                    ))}
                </div>
                )}

              <p className="mt-4 whitespace-pre-wrap text-zinc-300 line-clamp-4">
                {poem.body}
              </p>

              
            </Link>
          ))}

          {!message && poems.length === 0 && (
            <p className="text-zinc-500">公開中の作品はまだありません。</p>
          )}
        </section>
      </div>
    </main>
  );
}