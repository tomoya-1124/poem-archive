"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Poem = {
  id: string;
  title: string;
  body: string;
  tags: string[] | null;
  is_public: boolean;
  created_at: string;
  image_url: string | null;
};

export default function PublicPoemDetailPage() {
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
        .eq("is_public", true)
        .single();

      if (error) {
        setMessage("作品が見つかりません");
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
        <div className="mx-auto max-w-2xl">
          <Link href="/public" className="text-sm text-zinc-500">
            ← 公開作品一覧へ
          </Link>
          <p className="mt-10 text-zinc-400">{message}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black p-8 text-white">
      <article className="mx-auto max-w-2xl pt-10">
        <Link href="/public" className="text-sm text-zinc-500">
          ← 公開作品一覧へ
        </Link>

        <h1 className="mt-12 text-4xl font-bold">{poem.title}</h1>

        {poem.image_url && (
          <img
            src={poem.image_url}
            alt={poem.title}
            className="mb-8 max-h-[520px] w-full rounded-2xl bg-zinc-950 object-contain"
          />
        )}

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

        <div className="mt-12 whitespace-pre-wrap text-lg leading-10 text-zinc-100">
          {poem.body}
        </div>
      </article>
    </main>
  );
}