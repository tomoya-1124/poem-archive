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
  tags: string[] | null;
  is_public: boolean;
  pinned: boolean;
  image_url: string | null;
  created_at: string;
};

export default function PoemDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [poem, setPoem] = useState<Poem | null>(null);
  const [message, setMessage] = useState("読み込み中...");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
        {poem.image_url && (
          <img
            src={poem.image_url}
            alt={poem.title}
            className="mb-8 max-h-[520px] w-full rounded-2xl object-cover"
          />
        )}

        <h1 className="text-3xl font-bold tracking-wide">{poem.title}</h1>

        <p className="mt-3 text-sm text-zinc-500">
          {formatDate(poem.created_at)}
        </p>

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

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400">
            {poem.status === "draft"
              ? "下書き"
              : poem.status === "complete"
              ? "完成"
              : "保管"}
          </span>

          <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400">
            {poem.is_public ? "公開中" : "非公開"}
          </span>

          {poem.pinned && (
            <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400">
              固定中
            </span>
          )}
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