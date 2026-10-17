# MY HOTEL LOG

宿泊したホテルの思い出を記録・管理できるWebアプリです。

## アプリURL

https://hotel-review-react.vercel.app/

## 使用技術

- React
- TypeScript
- Vite
- Supabase Auth
- React Hook Form
- Biome
- Vercel

## 実装済みの機能

### ホテルの記録・管理

- ホテルの登録・一覧表示・詳細表示・編集・削除
- ホテル名・地域・評価の登録
- localStorageへのデータ保存
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

ログイン機能にはSupabase Authを使用していますが、
ホテルの記録は現在、ブラウザのlocalStorageに保存しています。
そのため、現時点ではユーザーごとのデータ管理や、
異なる端末間でのデータ共有には対応していません。

## 今後実装したい機能

- ホテルデータをSupabaseのデータベースに保存
- ログインユーザーごとのデータ管理
- 画像の外部ストレージへの保存
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
- localStorageによるデータ保存
- FileReader・Canvasを使った画像処理
- Git・GitHubを使ったバージョン管理

## 技術選定について

- [Supabase Authを採用した理由](docs/adr/20261017-supabase-auth.md)