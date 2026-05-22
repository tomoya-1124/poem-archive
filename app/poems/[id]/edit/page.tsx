"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";

export default function EditPoemPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [tags, setTags] = useState("");

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [message, setMessage] = useState("読み込み中...");

  useEffect(() => {
    const fetchPoem = async () => {
      const { data, error } = await supabase
        .from("poems")
        .select("title, body, tags")
        .eq("id", id)
        .single();

      if (error) {
        setMessage("取得エラー: " + error.message);
        return;
      }

      setTitle(data.title);
      setBody(data.body);
      setTags((data.tags ?? []).join(", "));
      setMessage("");
    };

    fetchPoem();
  }, [id]);

  const handleUpdate = async () => {
    if (!title.trim() || !body.trim()) {
      setMessage("タイトルと本文を入力してください");
      return;
    }

    const { error } = await supabase
      .from("poems")
      .update({
        title,
        body,
        tags: tags
            .split(/[,、]/)
            .map((tag) => tag.trim())
            .filter(Boolean),
        updated_at: new Date().toISOString(),
        })
      .eq("id", id);

    if (error) {
      setMessage("更新エラー: " + error.message);
      return;
    }

    router.push(`/poems/${id}`);
  };

  return (
    <main className="min-h-screen bg-black p-8 text-white">
      <h1 className="text-3xl font-bold">作品を編集</h1>

      <div className="mt-8 max-w-2xl space-y-4">
        <input
          className="w-full rounded border border-zinc-700 bg-zinc-900 p-3 text-white"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="min-h-80 w-full rounded border border-zinc-700 bg-zinc-900 p-3 text-white"
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
          onClick={handleUpdate}
          className="rounded bg-white px-5 py-2 font-bold text-black"
        >
          更新
        </button>

        {message && <p>{message}</p>}
      </div>
    </main>
  );
}