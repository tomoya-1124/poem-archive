"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type Poem = {
  id: string;
  title: string;
  body: string;
  status: string;
  is_public: boolean;
  created_at: string;
  tags: string[] | null;
};

export default function Home() {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [message, setMessage] = useState("");
  const [tags, setTags] = useState("");

  const fetchPoems = async () => {
    const { data, error } = await supabase
      .from("poems")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage("取得エラー: " + error.message);
      return;
    }

    setPoems(data ?? []);
  };

  useEffect(() => {
    fetchPoems();
  }, []);

  const handleSave = async () => {
  if (!title.trim() || !body.trim()) {
    setMessage("タイトルと本文を入力してください");
    return;
  }
    const { error } = await supabase.from("poems").insert({
      title,
      body,
      status: "draft",
      is_public: false,
      tags: tags
        .split(/[,、]/)
        .map((tag) => tag.trim())
        .filter(Boolean),
    });

    if (error) {
      setMessage("保存エラー: " + error.message);
      return;
    }

    setTitle("");
    setBody("");
    setTags("");
    setMessage("保存しました");
    fetchPoems();
  };
  const handleDelete = async (id: string) => {
    const ok = window.confirm("この作品を削除しますか？");

    if (!ok) return;

    const { error } = await supabase.from("poems").delete().eq("id", id);

    if (error) {
      setMessage("削除エラー: " + error.message);
      return;
    }

    setMessage("削除しました");
    fetchPoems();
  };
  const handleTogglePublic = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from("poems")
      .update({
        is_public: !current,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      setMessage("公開設定エラー: " + error.message);
      return;
    }

    setMessage(!current ? "公開にしました" : "非公開にしました");
    fetchPoems();
  };

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold">Poem Archive</h1>

      <section className="mt-8 max-w-2xl space-y-4">
        <input
          className="w-full rounded bg-zinc-900 p-3 text-white border border-zinc-700"
          placeholder="タイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full min-h-52 rounded bg-zinc-900 p-3 text-white border border-zinc-700"
          placeholder="本文"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />

        <input
          className="w-full rounded border border-zinc-700 bg-zinc-900 p-3 text-white"
          placeholder="タグ：夜, 青春, 嘘"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <button
          onClick={handleSave}
          className="rounded bg-white px-5 py-2 text-black font-bold"
        >
          保存
        </button>

        {message && <p>{message}</p>}
      </section>

      <section className="mt-12 max-w-3xl">
        <h2 className="text-xl font-bold">作品一覧</h2>

        <div className="mt-4 space-y-4">
          {poems.map((poem) => (
            <Link
              key={poem.id}
              href={`/poems/${poem.id}`}
              className="block rounded border border-zinc-800 bg-zinc-950 p-5 hover:border-zinc-500"
            >
              <h3 className="text-lg font-bold">{poem.title}</h3>
              <p className="mt-3 whitespace-pre-wrap text-zinc-300 line-clamp-3">
                {poem.body}
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

              <div className="mt-4 flex gap-3 text-sm text-zinc-500">
                <span>{poem.is_public ? "公開" : "非公開"}</span>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete(poem.id);
                }}
                className="mt-4 rounded border border-zinc-700 px-3 py-1 text-sm text-zinc-300 hover:border-red-500 hover:text-red-400"
              >
                削除
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleTogglePublic(poem.id, poem.is_public);
                }}
                className="mt-4 mr-3 rounded border border-zinc-700 px-3 py-1 text-sm text-zinc-300 hover:border-white hover:text-white"
              >
                {poem.is_public ? "非公開にする" : "公開する"}
              </button>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}