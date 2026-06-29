# Screen Dead Zone 🖥️🛡️

<table border="0">
  <tr>
    <td valign="top" width="340">
      <img src="thumbnail/thumbnail.png" alt="Screen Dead Zone" width="320" style="border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.35);">
    </td>
    <td valign="top">
      <h2 style="margin-top: 0; border-bottom: none;">Languages</h2>
      <ul style="line-height: 1.6; font-size: 14px;">
        <li><a href="README.md">Español 🇪🇸</a></li>
        <li><strong>English 🇬🇧 (Current)</strong></li>
        <li><a href="README.pt.md">Português 🇵🇹</a></li>
        <li><a href="README.zh_CN.md">简体中文 🇨🇳</a></li>
        <li><a href="README.hi.md">हिन्दी 🇮🇳</a></li>
        <li><a href="README.de.md">Deutsch 🇩🇪</a></li>
        <li><a href="README.fr.md">Français 🇫🇷</a></li>
        <li><a href="README.ja.md">日本語 🇯🇵</a></li>
      </ul>
    </td>
  </tr>
</table>

---

## Index
*   [✨ Key Features](#-key-features)
*   [🛡️ Required Permissions](#-required-permissions)
*   [🚀 Installation](#-installation)
*   [🔌 Iframe Compatibility](#-iframe-compatibility)
*   [📁 Project Structure](#-project-structure)
*   [🛡️ License](#-license)

---

**Screen Dead Zone** is an open-source Chrome extension built on **Manifest V3** designed to reserve, isolate, and limit a physical portion of your screen (dead zone), preventing the browser from rendering or exposing content under it and limiting the scrolling of the webpage to the selected area.

It is the perfect tool for users with screens having dead pixels on the edges, monitor setups with thick bezels, or simply for those who want to integrate fixed widgets (like digital clocks) and real-time security cameras directly into their browsing space without the website overlapping them.

### 🌐 Native Multilingual Support
The extension is fully localized and supports **8 languages native to the app** (English, Spanish, Portuguese, Simplified Chinese, Hindi, German, French, and Japanese). All interface elements, settings, and descriptions adjust automatically according to your browser's preferred language.

---

## ✨ Key Features

*   **📐 Dynamic Dimensions:** Fine-tune the reserved screen size as a percentage (from `0%` to `70%`).
*   **📍 Multi-directional Anchor:** Anchor the dead zone to any of the four edges: **Top**, **Bottom**, **Left**, or **Right**.
*   **🛠️ Two Layout Modes:**
    *   **Resize Mode [Recommended]:** Directly modifies the viewport (`html`) and isolates scroll. Fixed position elements (`position: fixed;`) automatically shift to the center natively without being hidden.
    *   **Spacer Mode:** Adds dynamic padding to the page edge so you can scroll above the dead zone.
*   **🔌 Iframe Compatibility:** Embed any web page or stream using iframes (Home Assistant, monitoring charts, or local security cameras).
*   **⚡ Lazy Load & Destroy:** Inactive tabs or minimized states completely destroy their iframe nodes to reduce background CPU, network, and RAM consumption to exactly 0%.
*   **⏳ Integrated Widgets:** Escalable high-visibility real-time digital clock and date widgets.
*   **🎨 Customization:** Adjust background/text colors and save setups as **Presets**.
*   **🍃 Mini Mode (Hide/Show):** Temporarily hide the bar with one click and restore it via the floating button.

---

## 🛡️ Required Permissions

To run optimally and securely under the **Manifest V3** standard, the extension requests the following permissions:

1.  **`storage`:** Allows persisting and syncing your presets, custom colors, layout mode, and anchor settings locally.
2.  **`declarativeNetRequest` and `declarativeNetRequestWithHostAccess`:** Essential to bypass security headers (such as `X-Frame-Options` or `CSP` policies) on iframes, allowing you to load local dashboards (like Home Assistant) or external resources directly.
3.  **`host_permissions: ["<all_urls>"]`:** Required to inject and style the ScreenDeadZone overlay on tabs you wish to activate, and apply header modification rules on embedded URLs.

---

## 🚀 Installation

1.  Clone this repository or download and unzip the `.zip`.
2.  Open `chrome://extensions/` and toggle **"Developer mode"** in the top right.
3.  Click **"Load unpacked"** and select the root directory containing `manifest.json`.

---

## 🔌 Iframe Compatibility

Screen Dead Zone allows you to load any web page or resource directly inside the dead zone using iframes. This is extremely useful for integrating:

*   **Control Dashboards:** Home Automation interfaces (like Home Assistant), monitoring stats, or real-time graphs.
*   **Productivity Tools:** Shared calendars, online task managers, or web media players.
*   **Local Resources:** Local web apps, local camera feeds, or any content viewable via a browser.

---

## 📁 Project Structure

```text
├── icons/             # Official extension icons
├── _locales/          # Localization translations (i18n)
├── background.js      # Background service script (Persistence and message broker)
├── content.js         # Injected content script (Styles, DOM, bounds calculations, and events)
├── manifest.json      # Extension definition (Manifest V3)
├── popup.html/js/css  # Activation popup window that opens the configuration menu
├── test_page.html     # Local test page to verify responsive behavior
├── Screenshots/       # Documentation screenshots
├── thumbnail/         # Repository thumbnail image
└── README.md          # Documentation project
```

---

## 🛡️ License

MIT License. Copyright (c) 2026.
