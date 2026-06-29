# Screen Dead Zone 🖥️🛡️

<table border="0">
  <tr>
    <td valign="top" width="340">
      <img src="thumbnail/thumbnail.png" alt="Screen Dead Zone" width="320" style="border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.35);">
    </td>
    <td valign="top">
      <h2 style="margin-top: 0; border-bottom: none;">言語 / Languages</h2>
      <p style="font-size: 13px; line-height: 1.5; margin-bottom: 15px;">
        この拡張機能は複数の言語でご利用いただけます。ドキュメントを読む言語を選択してください：
      </p>
      <ul style="line-height: 1.6; font-size: 14px;">
        <li><a href="README.md">Español 🇪🇸</a></li>
        <li><a href="README.en.md">English 🇬🇧</a></li>
        <li><a href="README.pt.md">Português 🇵🇹</a></li>
        <li><a href="README.zh_CN.md">简体中文 🇨🇳</a></li>
        <li><a href="README.hi.md">हिन्दी 🇮🇳</a></li>
        <li><a href="README.de.md">Deutsch 🇩🇪</a></li>
        <li><a href="README.fr.md">Français 🇫🇷</a></li>
        <li><strong>日本語 🇯🇵 (現在)</strong></li>
      </ul>
    </td>
  </tr>
</table>

---

## 目次
*   [✨ 主な機能](#-主な機能)
*   [📸 スクリーンショットとデモ](#-スクリーンショットとデモ)
*   [🛡️ 必要な権限](#-必要な権限)
*   [🚀 インストール方法](#-インストール方法)
*   [🔌 iframe 互換性](#-iframe-互換性)
*   [📁 プロジェクト構造](#-プロジェクト構造)
*   [🛡️ ライセンス](#-ライセンス)

---

**Screen Dead Zone** は、**Manifest V3** に基づいて構築されたオープンソースの Chrome 拡張機能で、画面の物理的な一部（デッドゾーン）を予約、隔離、制限し、ブラウザがその下にコンテンツを描画しないように設計されており、Webページのスクロールを選択した領域に制限します。

画面の端にドット抜けがあるユーザーや、ベゼル（額縁）の太いモニターを使用しているユーザー、あるいはブラウジング領域にデジタル時計や防犯カメラの映像を重ねずに埋め込みたいユーザーに最適です。

### 🌐 多言語ネイティブ対応
本拡張機能は完全に多言語化されており、**アプリ内で 8 言語に対応**（英語、スペイン語、ポルトガル語、簡体字中国語、ヒンディー語、ドイツ語、フランス語、日本語）しています。ブラウザの言語設定に合わせて自動で表示が切り替わります。

---

## ✨ 主な機能

*   **📐 動的なサイズ調整：** 画面の予約領域を `0%` から `70%` の範囲で調整可能。
*   **📍 多方向配置（アンカー）：** デッドゾーンを画面の **上（Top）**、**下（Bottom）**、**左（Left）**、**右（Right）** のいずれかに固定できます。
*   **🛠️ 2つのレイアウトモード：**
    *   **リサイズモード（Resize） [推奨]：** ビューポート（`html`）を直接縮小し、固定要素（`position: fixed;`）を自動的に画面内に押し上げます。
    *   **スペーサーモード（Spacer）：** ページ端に動的余白（Padding）を追加します。
*   **🔌 iframe 互換性：** iframe を使用して、スマートホームのダッシュボード（Home Assistantなど）や防犯カメラの映像を埋め込めます。
*   **⚡ 省電力・リソース節約設計：** バックグラウンドにある非アクティブなタブや最小化されたバーは、iframe をメモリから完全に破棄し、バックグラウンドでの CPU、ネットワーク、RAM 消費を 0% にします。
*   **⏳ 時計と日付小组件：** 高い視認性を誇る時計および日付表示。

---

## 📸 スクリーンショットとデモ

本拡張機能の動作デモ：

<table border="0" width="100%">
  <tr>
    <td align="center" valign="top" width="50%">
      <b>1. 時計小组件</b><br><br>
      <img src="Screenshots/screenshot_clock.png" alt="時計" style="border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); max-width: 95%;">
    </td>
    <td align="center" valign="top" width="50%">
      <b>2. iframe/ダッシュボード埋め込み</b><br><br>
      <img src="Screenshots/screenshot_iframe.png" alt="iframe" style="border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); max-width: 95%;">
    </td>
  </tr>
</table>

<br>
<p align="center">
  <b>3. 実際の使用状態 (IRL)</b><br>
  <img src="Screenshots/this.png" alt="IRL" width="600" style="border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
</p>

---

## 🛡️ 必要な権限

**Manifest V3**の仕様に基づき、本拡張機能は以下の権限を要求します：

1.  **`storage`：** プリセット、配色、アンカー等の設定の保存及び同期。
2.  **`declarativeNetRequest` 及び `declarativeNetRequestWithHostAccess`：** iframe上での `X-Frame-Options` や `CSP` 等の制限を回避するため。
3.  **`host_permissions: ["<all_urls>"]`：** デッドゾーンバーを挿入するため。

---

## 🚀 インストール方法

1.  本リポジトリをクローンするか、`.zip`ファイルをダウンロードして展開します。
2.  ブラウザで `chrome://extensions/` を開き、右上にある **「デベロッパー モード」** を有効にします。
3.  左上の **「パッケージ化されていない拡張機能を読み込む」** をクリックし、展開したフォルダを選択します。

---

## 🛡️ ライセンス

MIT ライセンス。Copyright (c) 2026.
