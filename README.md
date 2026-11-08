# MY HOTEL LOG

宿泊したホテルの思い出を記録・管理できるWebアプリです。

## アプリURL

https://hotel-review-react.vercel.app/

## 使用技術

- React
- TypeScript
- Vite
- Supabase Auth / Database
- React Hook Form
- Biome
- Vercel

## 実装済みの機能

### ホテルの記録・管理

- ホテルの登録・一覧表示・詳細表示・編集・削除
- ホテル名・地域・評価の登録
- Supabaseへのデータ保存
- レスポンシブ対応

### 画像機能

- ホテルごとに最大3枚の画像を登録
- 画像のリサイズ・圧縮
- 登録済み画像の追加・削除
- 詳細画面での画像スライド表示
- 5秒ごとの自動スライド

### 認証機能

- Supabase Authによる新規登録・ログイン・ログアウト
- メールアドレス認証
- パスワード再設定
- React Hook Formによるフォーム管理

## 現在のデータ保存方法

ユーザー認証にはSupabase Authを使用しています。
ホテルの記録と画像データはSupabase Databaseに保存しています。
RLSによって、ログインユーザーごとのデータアクセスを制御しています。

## 今後実装したい機能

- 画像データをSupabase Storageに移行
- ホテルの検索・絞り込み機能
- UI・UX改善
- ホテル記録の共有機能

## 学習したこと

- Reactのコンポーネント分割とprops
- useState・useEffect・useRef
- 配列操作（map・filter・find）
- TypeScriptによる型定義
- React Hook Formによるフォーム管理
- Supabase Authを利用した認証機能
- Supabase Databaseを利用したデータの取得・登録・更新・削除
- RLSによるユーザーごとのアクセス制御
- localStorageによるデータ保存
- FileReader・Canvasを使った画像処理
- CSSのコンポーネントごとの分割と共通スタイルの管理
- Git・GitHubを使ったバージョン管理
- Vercelを使ったアプリのデプロイ・公開URLの設定

## 技術選定について

[Supabase Authを採用した理由](docs/adr/20261017-supabase-auth.md)