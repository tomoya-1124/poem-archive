# Poem Archive

黒を基調にした、個人用の詩・言葉のアーカイブアプリ。

日々書いた詩や感情、断片的な言葉を保存・公開するために制作しました。  
管理画面と公開ページを分離し、作品サイトとして閲覧できる構成になっています。

---

## Features

### 管理機能
- ログイン認証（Supabase Auth）
- 詩の投稿
- 編集・削除
- 公開 / 非公開切り替え
- タグ管理
- ステータス管理
  - 下書き
  - 完成
  - 保管
- 固定（Pinned）機能
- 画像アップロード（Supabase Storage）

### 公開ページ
- 公開作品一覧
- 公開作品詳細ページ
- タグ表示
- 日付表示
- 固定作品表示
- 黒ベースの作品UI

---

## Tech Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS

### Backend / BaaS
- Supabase
  - Authentication
  - PostgreSQL
  - Storage

### Deploy
- Vercel

---

## Pages

```txt
/                  管理画面（ログイン必須）
/login             ログイン
/public            公開作品一覧
/public/[id]       公開作品詳細
/poems/[id]        管理用詳細
/poems/[id]/edit   編集画面
```

---

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

## Setup

```bash
git clone https://github.com/tomoya-1124/poem-archive.git

cd poem-archive

npm install

npm run dev
```

---

## Future Plans

* カルーセル型Reader UI
* OGP対応
* モバイルUI改善
* Markdown対応
* BGMリンク機能
* アニメーション演出
* 作品検索強化

---

## Author

Tomoya Abe

GitHub:
[https://github.com/tomoya-1124](https://github.com/tomoya-1124)