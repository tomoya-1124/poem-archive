"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Poem = {
  id: string;
  title: string;
  body: string;
  status: string;
  is_public: boolean;
  created_at: string;
  tags: string[] | null;
  pinned: boolean;
};

export default function Home() {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [message, setMessage] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("draft");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPoems = async () => {
    const { data, error } = await supabase
      .from("poems")
      .select("*")
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      setMessage("取得エラー: " + error.message);
      return;
    }

    setPoems(data ?? []);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        router.push("/login");
        return;
      }

      setAuthChecked(true);
      fetchPoems();
    };

    checkAuth();
  }, [router]);;

  const handleSave = async () => {
  if (!title.trim() || !body.trim()) {
    setMessage("タイトルと本文を入力してください");
    return;
  }
    const { error } = await supabase.from("poems").insert({
      title,
      body,
      status,
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
    setStatus("draft");
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
  const handleTogglePinned = async (
    id: string,
    current: boolean
  ) => {
    const { error } = await supabase
      .from("poems")
      .update({
        pinned: !current,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      setMessage("固定設定エラー: " + error.message);
      return;
    }

    fetchPoems();
  };
  const filteredPoems = poems.filter((poem) => {
    const matchesSearch =
      poem.title.toLowerCase().includes(search.toLowerCase()) ||
      poem.body.toLowerCase().includes(search.toLowerCase()) ||
      (poem.tags ?? []).some((tag) =>
        tag.toLowerCase().includes(search.toLowerCase())
      );

    const matchesStatus =
      filterStatus === "all" || poem.status === filterStatus;

    return matchesSearch && matchesStatus;
  });
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!authChecked) {
    return (
      <main className="min-h-screen bg-black p-8 text-white">
        <p>ログイン確認中...</p>
      </main>
    );
  }
  const itemsPerPage = 5;

  const totalPages = Math.ceil(filteredPoems.length / itemsPerPage);

  const paginatedPoems = filteredPoems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold">Poem Archive</h1>
      <button
        onClick={async () => {
          await supabase.auth.signOut();
          router.push("/login");
        }}
        className="mt-4 rounded border border-zinc-700 px-3 py-1 text-sm text-zinc-400 hover:border-white hover:text-white"
      >
        ログアウト
      </button>
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

        <select
          className="w-full rounded border border-zinc-700 bg-zinc-900 p-3 text-white"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="draft">下書き</option>
          <option value="complete">完成</option>
          <option value="archive">保管</option>
        </select>

        <button
          onClick={handleSave}
          className="rounded bg-white px-5 py-2 text-black font-bold"
        >
          保存
        </button>

        {message && <p>{message}</p>}
      </section>
      <section className="mt-12 max-w-3xl space-y-4">
        <input
          className="w-full rounded border border-zinc-700 bg-zinc-900 p-3 text-white"
          placeholder="検索..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />

        <select
          className="w-full rounded border border-zinc-700 bg-zinc-900 p-3 text-white"
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="all">すべて</option>
          <option value="draft">下書き</option>
          <option value="complete">完成</option>
          <option value="archive">保管</option>
        </select>
      </section>
      <section className="mt-12 max-w-3xl">
        <h2 className="text-xl font-bold">作品一覧</h2>

        <div className="mt-4 space-y-4">
          {paginatedPoems.map((poem) => (
            <Link
              key={poem.id}
              href={`/poems/${poem.id}`}
              className="block rounded border border-zinc-800 bg-zinc-950 p-5 hover:border-zinc-500"
            >
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">{poem.title}</h3>

                {poem.pinned && (
                  <span className="text-xs text-yellow-400">
                    ★
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-zinc-500">
                {formatDate(poem.created_at)}
              </p>
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
              <div className="mt-4 flex flex-wrap gap-2">
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
              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleTogglePinned(poem.id, poem.pinned);
                  }}
                  className="rounded border border-zinc-700 px-3 py-1 text-xs text-zinc-400 hover:border-white hover:text-white"
                >
                  {poem.pinned ? "固定解除" : "固定"}
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(poem.id);
                  }}
                  className="rounded border border-zinc-700 px-3 py-1 text-xs text-zinc-400 hover:border-red-500 hover:text-red-400"
                >
                  削除
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleTogglePublic(poem.id, poem.is_public);
                  }}
                  className="rounded border border-zinc-700 px-3 py-1 text-xs text-zinc-400 hover:border-white hover:text-white"
                >
                  {poem.is_public ? "非公開にする" : "公開する"}
                </button>
              </div>
              
              
            </Link>
          ))}
        </div>
        {totalPages > 1 && (
          <div className="mt-8 flex items-center gap-3">
            <button
              onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
              disabled={currentPage === 1}
              className="rounded border border-zinc-700 px-3 py-1 text-sm text-zinc-400 disabled:opacity-30"
            >
              前へ
            </button>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1;

                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`rounded border px-3 py-1 text-sm ${
                      currentPage === pageNumber
                        ? "border-white text-white"
                        : "border-zinc-700 text-zinc-400 hover:border-white hover:text-white"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() =>
                setCurrentPage((page) => Math.min(page + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="rounded border border-zinc-700 px-3 py-1 text-sm text-zinc-400 disabled:opacity-30"
            >
              次へ
            </button>
          </div>
        )}
      </section>
    </main>
  );
}