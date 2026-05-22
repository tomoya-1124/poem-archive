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
  pinned: boolean;
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
        .order("pinned", { ascending: false })
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
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    };
  return (
    <main className="min-h-screen bg-black p-8 text-white">
      <div className="mx-auto max-w-3xl">
        

        <header className="mt-10 border-b border-zinc-800 pb-8">
        <p className="text-xs tracking-[0.3em] text-zinc-500">POEM ARCHIVE</p>
        <h1 className="mt-4 text-4xl font-bold">言葉の保管庫</h1>
        <p className="mt-4 leading-7 text-zinc-400">
            夜に書いた言葉、残しておきたい感情、まだ名前のない詩。
        </p>
        <div className="mt-8 space-y-3">
            <p className="text-sm text-zinc-300">
                倫也 阿部
            </p>

            <p className="max-w-lg text-sm leading-7 text-zinc-500">
                夜に書いた言葉や、感情になりきれなかったものを記録しています。
            </p>

            <div className="flex gap-4 text-sm">
                <a
                href="https://instagram.com/r_of_the_moon"
                target="_blank"
                className="text-zinc-500 hover:text-white"
                >
                Instagram
                </a>

                <a
                href="https://github.com/tomoya-1124"
                target="_blank"
                className="text-zinc-500 hover:text-white"
                >
                GitHub
                </a>
            </div>
        </div>
        </header>

        <section className="mt-10 space-y-5">
          {message && <p>{message}</p>}

          {poems.map((poem) => (
            <Link
              key={poem.id}
              href={`/public/${poem.id}`}
              className="block rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6 transition hover:-translate-y-1 hover:border-zinc-500"
            >
                {poem.pinned && (
                <p className="mb-3 text-xs tracking-[0.25em] text-zinc-500">
                    PICKED
                </p>
                )}
              <h2 className="text-xl font-bold">{poem.title}</h2>
                <p className="mt-2 text-xs text-zinc-500">
                {formatDate(poem.created_at)}
                </p>
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

              <p className="mt-5 whitespace-pre-wrap text-sm leading-8 text-zinc-300 line-clamp-5">
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