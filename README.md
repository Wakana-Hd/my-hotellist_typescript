# React版 ホテルレビューサイト

宿泊したホテルの思い出を記録・管理できるWebアプリです。

## 進捗

### 基本構成
- React環境構築（Vite）
- HotelCardコンポーネント作成
- Headerコンポーネント作成
- propsでデータを受け渡し
- map()でホテル一覧表示

### CRUD機能
- ホテル登録（Create）
- ホテル一覧表示（Read）
- ホテル編集（Update）
- ホテル削除（Delete）

### データ管理
- useStateで状態管理
- useEffectでlocalStorage保存
- localStorageからデータ読み込み

### 画像機能
- 最大3枚の画像アップロード
- 編集時の画像プレビュー表示
- 編集時に登録済み画像を1枚ずつ削除
- Canvasを使った画像リサイズ
- JPEG形式への画像圧縮
- 詳細画面で画像を横スクロール表示
- 現在の画像位置をドットで表示
- 5秒ごとの画像自動スライド

### 画面構成
- 一覧画面
- 詳細画面
- 登録画面
- 編集画面
- 画面切り替え（一覧 ⇔ 詳細 ⇔ 登録・編集）
- 共通Header
- レスポンシブ対応

### 公開
- VercelでWeb公開

## 学習したこと
- props
- useState
- useEffect
- map()
- filter()
- find()
- 三項演算子
- 条件付きレンダリング
- localStorage
- FileReader
- コンポーネント分割
- stateによる画面切り替え
- useRef
- setInterval()
- 配列のindex
- %（剰余演算子）

## 今後やること
- スマートフォンでのUI調整
- 実際に使用しながらUI・UXを改善
- ログイン機能
- データベースへの保存
- 検索・絞り込み機能
- ホテル記録の共有機能
- 編集時の画像追加・変更機能
- TypeScriptへの移行