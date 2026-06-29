# Screen Dead Zone 🖥️🛡️

<table border="0">
  <tr>
    <td valign="top" width="340">
      <img src="thumbnail/thumbnail.png" alt="Screen Dead Zone" width="320" style="border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.35);">
    </td>
    <td valign="top">
      <h2 style="margin-top: 0; border-bottom: none;">语言 / Languages</h2>
      <p style="font-size: 13px; line-height: 1.5; margin-bottom: 15px;">
        此扩展支持多种语言。请选择您的语言以阅读文档：
      </p>
      <ul style="line-height: 1.6; font-size: 14px;">
        <li><a href="README.md">Español 🇪🇸</a></li>
        <li><a href="README.en.md">English 🇬🇧</a></li>
        <li><a href="README.pt.md">Português 🇵🇹</a></li>
        <li><strong>简体中文 🇨🇳 (当前)</strong></li>
        <li><a href="README.hi.md">हिन्दी 🇮🇳</a></li>
        <li><a href="README.de.md">Deutsch 🇩🇪</a></li>
        <li><a href="README.fr.md">Français 🇫🇷</a></li>
        <li><a href="README.ja.md">日本語 🇯🇵</a></li>
      </ul>
    </td>
  </tr>
</table>

---

## 目录
*   [✨ 主要功能](#-主要功能)
*   [📸 截图展示与演示](#-截图展示与演示)
*   [🛡️ 所需权限](#-所需权限)
*   [🚀 安装步骤](#-安装步骤)
*   [🔌 Iframe 兼容性](#-iframe-兼容性)
*   [📁 项目结构](#-项目结构)
*   [🛡️ 授权协议](#-授权协议)

---

**Screen Dead Zone** 是一款基于 **Manifest V3** 的开源 Chrome 浏览器扩展，旨在预留、隔离和限制屏幕的物理区域（死区），防止浏览器在其下方渲染或显示内容，并将网页的滚动限制在所选区域内。

它非常适合屏幕边缘有坏点、显示器边框较厚的用户，或者想要在浏览空间中直接集成固定小组件（如数字时钟）和实时监控摄像头而又不被网页遮挡的用户。

### 🌐 原生多语言支持
该扩展已完全本地化，支持扩展中**原生的 8 种语言**（英语、西班牙语、葡萄牙语、简体中文、印地语、德语、法语和日语）。界面元素会根据浏览器的语言自动调整。

---

## ✨ 主要功能

*   **📐 动态大小：** 精确微调预留屏幕大小的百分比（从 `0%` 到 `70%`）。
*   **📍 多向锚定：** 将死区固定到四个边缘中的任意一个：**上**、**下**、**左**或**右**。
*   **🛠️ 两种布局模式：**
    *   **调整大小模式（Resize） [推荐]：** 直接修改视口 (`html`) 并隔离滚动。固定定位元素 (`position: fixed;`) 会自动移至中心，不会被遮挡。
    *   **占位符模式（Spacer）：** 在页面边缘添加动态填充，以便您可以在死区上方滚动。
*   **🔌 Iframe 兼容性：** 使用 iframe 嵌入任何网页（Home Assistant、监控图表或本地摄像头）。
*   **⚡ 延迟加载和销毁：** 处于不活动或最小化状态的标签页会完全销毁其 iframe 节点，以将后台 CPU、网络和内存消耗降低至 0%。
*   **⏳ 集成时钟：** 高可视性的实时数字时钟 and 日期组件。
*   **🎨 个性化定制：** 自定义背景和文字颜色，并将设置保存为**快速预设**。
*   **🍃 快速最小化：** 点击一次即可隐藏死区，并通过悬浮按钮随时恢复。

---

## 📸 截图展示与演示

在实际应用中查看此扩展：

<table border="0" width="100%">
  <tr>
    <td align="center" valign="top" width="50%">
      <b>1. 集成时钟小组件</b><br><br>
      <img src="Screenshots/screenshot_clock.png" alt="时钟" style="border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); max-width: 95%;">
    </td>
    <td align="center" valign="top" width="50%">
      <b>2. 集成 Iframe/控制面板</b><br><br>
      <img src="Screenshots/screenshot_iframe.png" alt="Iframe" style="border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); max-width: 95%;">
    </td>
  </tr>
</table>

<br>
<p align="center">
  <b>3. 真实使用效果 (IRL)</b><br>
  <img src="Screenshots/this.png" alt="IRL" width="600" style="border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
</p>

---

## 🛡️ 所需权限

为在 **Manifest V3** 规范下安全、高效运行，此扩展请求以下权限：

1.  **`storage` (存储)：** 在本地保存并同步您的预设、颜色、布局模式和锚定设置。
2.  **`declarativeNetRequest` 和 `declarativeNetRequestWithHostAccess` (网络修改)：** 用于跳过限制性的 `X-Frame-Options` 或 `CSP` 安全标头。
3.  **`host_permissions: ["<all_urls>"]` (主机权限)：** 在任意标签页上注入 ScreenDeadZone 容器。

---

## 🚀 安装步骤

1.  克隆存储库或下载并解压 `.zip` 文件。
2.  打开 `chrome://extensions/` 并在右上角开启 **“开发者模式”**。
3.  点击 **“加载已解压的扩展程序”** 并选择根文件夹。

---

## 🛡️ 授权协议

MIT License. Copyright (c) 2026.
