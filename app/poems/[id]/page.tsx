"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useParams } from "next/navigation";

type Poem = {
  id: string;
  title: string;
  body: string;
  status: string;
  is_public: boolean;
  created_at: string;
  tags: string[] | null;
};

export default function PoemDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [poem, setPoem] = useState<Poem | null>(null);
  const [message, setMessage] = useState("読み込み中...");

  useEffect(() => {
    const fetchPoem = async () => {
      const { data, error } = await supabase
        .from("poems")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setMessage("取得エラー: " + error.message);
        return;
      }

      setPoem(data);
      setMessage("");
    };

    fetchPoem();
  }, [id]);

  if (!poem) {
    return (
      <main className="min-h-screen bg-black p-8 text-white">
        <p>{message}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black p-8 text-white">
      <Link href="/" className="text-sm text-zinc-400">
        ← 一覧へ戻る
      </Link>

      <article className="mx-auto mt-12 max-w-2xl">
        <h1 className="text-3xl font-bold">{poem.title}</h1>
        {poem.tags && poem.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
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
        <div className="mt-4 flex gap-3 text-sm text-zinc-500">
          <span>{poem.is_public ? "公開" : "非公開"}</span>
        </div>
        
        <Link
          href={`/poems/${poem.id}/edit`}
          className="mt-6 inline-block rounded border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:border-white hover:text-white"
        >
          編集
        </Link>
        <div className="mt-10 whitespace-pre-wrap text-lg leading-10 text-zinc-100">
          {poem.body}
        </div>
      </article>
    </main>
  );
}