# Screen Dead Zone 🖥️🛡️

<table border="0">
  <tr>
    <td valign="top" width="340">
      <img src="thumbnail/thumbnail.png" alt="Screen Dead Zone" width="320" style="border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.35);">
    </td>
    <td valign="top">
      <h2 style="margin-top: 0; border-bottom: none;">Sprachen / Languages</h2>
      <p style="font-size: 13px; line-height: 1.5; margin-bottom: 15px;">
        Diese Erweiterung ist in mehreren Sprachen verfügbar. Wählen Sie Ihre Sprache:
      </p>
      <ul style="line-height: 1.6; font-size: 14px;">
        <li><a href="README.md">Español 🇪🇸</a></li>
        <li><a href="README.en.md">English 🇬🇧</a></li>
        <li><a href="README.pt.md">Português 🇵🇹</a></li>
        <li><a href="README.zh_CN.md">简体中文 🇨🇳</a></li>
        <li><a href="README.hi.md">हिन्दी 🇮🇳</a></li>
        <li><strong>Deutsch 🇩🇪 (Aktuell)</strong></li>
        <li><a href="README.fr.md">Français 🇫🇷</a></li>
        <li><a href="README.ja.md">日本語 🇯🇵</a></li>
      </ul>
    </td>
  </tr>
</table>

---

## Inhalt
*   [✨ Hauptfunktionen](#-hauptfunktionen)
*   [📸 Screenshots und Demonstration](#-screenshots-und-demonstration)
*   [🛡️ Benötigte Berechtigungen](#-benötigte-berechtigungen)
*   [🚀 Installation](#-installation)
*   [🔌 Iframe-Kompatibilität](#-iframe-kompatibilität)
*   [📁 Projektstruktur](#-projektstruktur)
*   [🛡️ Lizenz](#-lizenz)

---

**Screen Dead Zone** ist eine Open-Source-Chrome-Erweiterung auf Basis von **Manifest V3**, die entwickelt wurde, um einen physischen Bereich Ihres Bildschirms (tote Zone) zu reservieren, zu isolieren und zu begrenzen, sodass der Browser darunter liegende Inhalte nicht rendert und das Scrollen der Webseite auf den ausgewählten Bereich beschränkt.

Dies ist ideal für Bildschirme mit defekten Pixeln an den Rändern, Monitore mit dicken Rändern oder für Benutzer, die feste Widgets (wie Digitaluhren) und Sicherheitskameras einbinden möchten.

### 🌐 Nativer mehrsprachiger Support
Die Erweiterung ist vollständig lokalisiert und unterstützt **8 native Sprachen** (Englisch, Spanisch, Portugiesisch, vereinfachtes Chinesisch, Hindi, Deutsch, Französisch und Japanisch). Die Benutzeroberfläche passt sich automatisch an.

---

## ✨ Hauptfunktionen

*   **📐 Dynamische Dimensionen:** Prozentuale Reservierung des Bildschirms von `0%` bis `70%`.
*   **📍 Multidirektionale Verankerung:** Verankern Sie die tote Zone oben (**Top**), unten (**Bottom**), links (**Left**) oder rechts (**Right**).
*   **🛠️ Zwei Layout-Modi:**
    *   **Größenänderungsmodus (Resize) [Empfohlen]:** Ändert das Viewport (`html`) und verschiebt fixierte Elemente (`position: fixed;`) automatisch.
    *   **Spacer-Modus:** Fügt dynamisches Padding hinzu.
*   **🔌 Iframe-Kompatibilität:** Betten Sie beliebige Webseiten oder Dashboards über Iframes ein.
*   **⚡ Lazy Load & Destroy:** Inaktive oder minimierte Tabs zerstören ihre Iframes, um die CPU- und RAM-Last auf 0% zu senken.
*   **⏳ Integrierte Widgets:** Nativer digitaler Uhr- und Datum-Widget.

---

## 📸 Screenshots und Demonstration

Hier sehen Sie die Erweiterung in Aktion:

<table border="0" width="100%">
  <tr>
    <td align="center" valign="top" width="50%">
      <b>1. Uhr-Widget</b><br><br>
      <img src="Screenshots/screenshot_clock.png" alt="Uhr-Widget" style="border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); max-width: 95%;">
    </td>
    <td align="center" valign="top" width="50%">
      <b>2. Iframe-Integration</b><br><br>
      <img src="Screenshots/screenshot_iframe.png" alt="Iframe" style="border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); max-width: 95%;">
    </td>
  </tr>
</table>

<br>
<p align="center">
  <b>3. Verwendung im echten Leben (IRL)</b><br>
  <img src="Screenshots/this.png" alt="Echtes Leben" width="600" style="border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
</p>

---

## 🛡️ Benötigte Berechtigungen

Die Erweiterung benötigt folgende Berechtigungen unter **Manifest V3**:

1.  **`storage`:** Speichern und Synchronisieren von Einstellungen und Presets.
2.  **`declarativeNetRequest` und `declarativeNetRequestWithHostAccess`:** Entfernt Sicherheits-Header wie `X-Frame-Options` oder `CSP` in den Iframes.
3.  **`host_permissions: ["<all_urls>"]`:** Ermöglicht das Injezieren des Overlays.

---

## 🚀 Installation

1.  Klonen Sie das Repository oder laden Sie das `.zip` herunter und entpacken Sie es.
2.  Öffnen Sie `chrome://extensions/` und aktivieren Sie den **Entwicklermodus** oben rechts.
3.  Klicken Sie auf **Entpackte Erweiterung laden** und wählen Sie den Stammordner.

---

## 🛡️ Lizenz

MIT-Lizenz. Copyright (c) 2026.
