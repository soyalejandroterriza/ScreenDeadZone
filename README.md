# Screen Dead Zone 🖥️🛡️

<div style="display: flex; gap: 20px; align-items: flex-start; margin-bottom: 25px; flex-wrap: wrap;">
  <img src="thumbnail/thumbnail.png" alt="Screen Dead Zone" width="320" style="border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.35); flex-shrink: 0; margin-bottom: 10px;">
  <div style="flex: 1; min-width: 250px;">
    <h2 style="margin-top: 0;">Index / Índice / 目录 / सूचकांक / Verzeichnis / Table / 目次</h2>
    <ul style="line-height: 1.6;">
      <li><a href="#english-🇬🇧">English 🇬🇧</a></li>
      <li><a href="#español-🇪🇸">Español 🇪🇸</a></li>
      <li><a href="#português-🇵🇹">Português 🇵🇹</a></li>
      <li><a href="#简体中文-🇨🇳">简体中文 🇨🇳</a></li>
      <li><a href="#हिन्दी-🇮🇳">हिन्दी 🇮🇳</a></li>
      <li><a href="#deutsch-🇩🇪">Deutsch 🇩🇪</a></li>
      <li><a href="#français-🇫🇷">Français 🇫🇷</a></li>
      <li><a href="#日本語-🇯🇵">日本語 🇯🇵</a></li>
    </ul>
  </div>
</div>

---

## English 🇬🇧

**Screen Dead Zone** is an open-source Chrome extension built on **Manifest V3** designed to reserve, isolate, and limit a physical portion of your screen (dead zone), preventing the browser from rendering or exposing content under it.

It is the perfect tool for users with screens having dead pixels on the edges, monitor setups with thick bezels, or simply for those who want to integrate fixed widgets (like digital clocks) and real-time security cameras directly into their browsing space without the website overlapping them.

### 🌐 Native Multilingual Support
The extension is fully localized and supports **8 languages native to the app** (English, Spanish, Portuguese, Simplified Chinese, Hindi, German, French, and Japanese). All interface elements, settings, and descriptions adjust automatically according to your browser's preferred language.

### ✨ Key Features
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

### 🚀 Installation
1.  Clone this repository or download and unzip the `.zip`.
2.  Open `chrome://extensions/` and toggle **"Developer mode"** in the top right.
3.  Click **"Load unpacked"** and select the root directory containing `manifest.json`.

---

## Español 🇪🇸

**Screen Dead Zone** es una extensión de Chrome de código abierto basada en **Manifest V3** diseñada para reservar, aislar y limitar una porción física de tu pantalla (zona muerta), evitando que el navegador renderice o exponga contenidos bajo ella.

Es la herramienta perfecta para usuarios con pantallas con píxeles muertos en los bordes, configuraciones de monitores con marcos gruesos, o simplemente para quienes desean integrar widgets fijos (como relojes digitales) y cámaras de seguridad en tiempo real directamente en su espacio de navegación sin que la web se superponga sobre ellos.

### 🌐 Soporte Multilingüe Nativo
La extensión está completamente localizada y soporta **8 idiomas nativos** (inglés, español, portugués, chino simplificado, hindi, alemán, francés y japonés). Todos los elementos de la interfaz se adaptan automáticamente según el idioma de tu navegador.

### ✨ Características Principales
*   **📐 Ajuste de Medidas Dinámico:** Configura con precisión en porcentaje (de `0%` a `70%`) el tamaño que deseas reservar de tu pantalla.
*   **📍 Posicionamiento Multidireccional (Anclaje):** Permite anclar la zona muerta en cualquiera de los cuatro bordes: **Arriba (Top)**, **Abajo (Bottom)**, **Izquierda (Left)** o **Derecha (Right)**.
*   **🛠️ Dos Modos de Ajuste de Layout:**
    *   **Modo Redimensionar (Resize) [Recomendado]:** Modifica directamente el viewport (`html`) y aísla el scroll. Los elementos fijos (`position: fixed;`) se desplazan automáticamente de forma nativa sin quedar ocultos.
    *   **Modo Espaciador (Spacer):** Añade un margen de relleno (padding) dinámico para que puedas hacer scroll por encima de la zona muerta.
*   **🔌 Compatibilidad con Iframes:** Inserta cualquier página o stream web utilizando iframes (Home Assistant, gráficas o cámaras locales).
*   **⚡ Rendimiento Inteligente (Lazy Loading & Destroy):** Las pestañas inactivas o minimizadas destruyen por completo sus iframes para reducir a un 0% el consumo de CPU, red y RAM en segundo plano.
*   **⏳ Widgets de Reloj y Fecha:** Muestra la hora actual en tiempo real con fuentes escalables de alta visibilidad.
*   **🎨 Personalización Total:** Configura el color de fondo/texto y guarda conjuntos de ajustes en **Presets**.
*   **🍃 Minimizado Ágil (Botón Esconder/Mostrar):** Esconde temporalmente la Zona Muerta con un solo clic y recupérala mediante el botón flotante.

### 🚀 Instalación
1.  Clona el repositorio o descarga y descomprime el `.zip`.
2.  Abre `chrome://extensions/` y activa el **"Modo de desarrollador"** (arriba a la derecha).
3.  Haz clic en **"Cargar descomprimida"** y selecciona la carpeta que contiene el archivo `manifest.json`.

---

## Português 🇵🇹

**Screen Dead Zone** é uma extensão de código aberto para o Chrome baseada no **Manifest V3**, projetada para reservar, isolar e limitar uma porção física da tela (zona morta), evitando que o navegador renderize ou exiba conteúdo abaixo dela.

É a ferramenta ideal para telas com pixels mortos nas bordas, monitores com molduras grossas ou para quem quer integrar widgets fixos (como relógios digitais) e câmeras de segurança diretamente na navegação.

### 🌐 Suporte Multilíngue Nativo
A extensão está totalmente localizada e suporta **8 idiomas nativos** (inglês, espanhol, português, chinês simplificado, hindi, alemão, francês e japonês). A interface se adapta automaticamente ao idioma do navegador.

### ✨ Principais Recursos
*   **📐 Dimensões Dinâmicas:** Ajuste a área reservada de `0%` a `70%` da tela.
*   **📍 Âncora Multidirecional:** Fixe a zona morta em qualquer borda: **Topo**, **Base**, **Esquerda** ou **Direita**.
*   **🛠️ Dois Modos de Layout:**
    *   **Modo Redimensionar [Recomendado]:** Redimensiona o viewport (`html`) e impede a sobreposição de elementos fixos (`position: fixed;`).
    *   **Modo Espaçador:** Adiciona padding dinâmico na borda da página para permitir a rolagem.
*   **🔌 Compatibilidade com Iframes:** Embuta qualquer painel do Home Assistant ou feeds usando iframes.
*   **⚡ Carregamento Inteligente (Lazy Load & Destroy):** Abas inativas destroem os nós de iframe para reduzir o consumo de CPU, rede e RAM a 0%.
*   **⏳ Relógio Integrado:** Relógio digital de alta visibilidade e data.

---

## 简体中文 🇨🇳

**Screen Dead Zone** 是一款基于 **Manifest V3** 的开源 Chrome 浏览器扩展，旨在预留、隔离和限制屏幕的物理区域（死区），防止浏览器在其下方渲染或显示内容。

它非常适合屏幕边缘有坏点、显示器边框较厚的用户，或者想要在浏览空间中直接集成固定小组件（如数字时钟）和实时监控摄像头而又不被网页遮挡的用户。

### 🌐 原生多语言支持
该扩展已完全本地化，支持扩展中**原生的 8 种语言**（英语、西班牙语、葡萄牙语、简体中文、印地语、德语、法语和日语）。界面元素会根据浏览器的语言自动调整。

### ✨ 主要功能
*   **📐 动态大小：** 精确微调预留屏幕大小的百分比（从 `0%` 到 `70%`）。
*   **📍 多向锚定：** 将死区固定到四个边缘中的任意一个：**上**、**下**、**左**或**右**。
*   **🛠️ 两种布局模式：**
    *   **调整大小模式（Resize） [推荐]：** 直接修改视口 (`html`) 并隔离滚动。固定定位元素 (`position: fixed;`) 会自动移至中心，不会被遮挡。
    *   **占位符模式（Spacer）：** 在页面边缘添加动态填充，以便您可以在死区上方滚动。
*   **🔌 Iframe 兼容性：** 使用 iframe 嵌入任何网页（Home Assistant、监控图表或本地摄像头）。
*   **⚡ 延迟加载和销毁：** 处于不活动或最小化状态的标签页会完全销毁其 iframe 节点，以将后台 CPU、网络和内存消耗降低至 0%。
*   **⏳ 集成时钟：** 高可视性的实时数字时钟和日期组件。

---

## हिन्दी 🇮🇳

**Screen Dead Zone** एक ओपन-सोर्स क्रोम एक्सटेंशन है जो **Manifest V3** पर आधारित है। इसे आपकी स्क्रीन के भौतिक हिस्से (डेड ज़ोन) को आरक्षित और सीमित करने के लिए डिज़ाइन किया गया है, जिससे ब्राउज़र इसके नीचे की सामग्री को प्रदर्शित नहीं कर पाता है।

यह उन उपयोगकर्ताओं के लिए एक बेहतरीन उपकरण है जिनकी स्क्रीन के किनारों पर पिक्सेल खराब हैं, या जो ब्राउज़िंग के दौरान बिना किसी व्यवधान के डिजिटल घड़ी या सुरक्षा कैमरों जैसी चीज़ों को देखना चाहते हैं।

### 🌐 मूल बहुभाषी समर्थन
यह एक्सटेंशन पूरी तरह से स्थानीयकृत है और ऐप में **8 भाषाओं का समर्थन** (अंग्रेजी, स्पेनिश, पुर्तगाली, सरलीकृत चीनी, हिंदी, जर्मan, फ्रेंच और जापानी) करता है।

### ✨ मुख्य विशेषताएं
*   **📐 गतिशील आयाम:** आरक्षित स्क्रीन के आकार को `0%` से `70%` के बीच सेट करें।
*   **📍 बहु-दिशात्मक लंगर (Anchor):** डेड ज़ोन को चारों किनारों में से किसी पर भी लॉक करें: **ऊपर**, **नीचे**, **बाएं** या **दाएं**।
*   **🛠️ दो लेआउट मोड:**
    *   **आकार बदलें मोड (Resize) [अनुशंसित]:** यह सीधे व्यूपोर्ट (`html`) को संशोधित करता है। फिक्स्ड पोजीशन वाले तत्व (`position: fixed;`) अपने आप केंद्र की ओर खिसक जाते हैं।
    *   **स्पेसर मोड (Spacer):** पेज के किनारे पर पैडिंग जोड़ता है।
*   **🔌 आईफ्रेम अनुकूलता:** आईफ्रेम का उपयोग करके किसी भी वेब पेज को एम्बेड करें।
*   **⚡ मेमोरी सेविंग लोड और डिस्ट्रॉय:** बैकग्राउंड टैब अपने आईफ्रेम को नष्ट कर देते हैं ताकि रैम और सीपीयू की खपत 0% रहे।

---

## Deutsch 🇩🇪

**Screen Dead Zone** ist eine Open-Source-Chrome-Erweiterung auf Basis von **Manifest V3**, die entwickelt wurde, um einen physischen Bereich Ihres Bildschirms (tote Zone) zu reservieren, zu isolieren und zu begrenzen, sodass der Browser darunter liegende Inhalte nicht rendert.

Dies ist ideal für Bildschirme mit defekten Pixeln an den Rändern, Monitore mit dicken Rändern oder für Benutzer, die feste Widgets (wie Digitaluhren) und Sicherheitskameras einbinden möchten.

### 🌐 Nativer mehrsprachiger Support
Die Erweiterung ist vollständig lokalisiert und unterstützt **8 native Sprachen** (Englisch, Spanisch, Portugiesisch, vereinfachtes Chinesisch, Hindi, Deutsch, Französisch und Japanisch). Die Benutzeroberfläche passt sich automatisch an.

### ✨ Hauptfunktionen
*   **📐 Dynamische Dimensionen:** Prozentuale Reservierung des Bildschirms von `0%` bis `70%`.
*   **📍 Multidirektionale Verankerung:** Verankern Sie die tote Zone oben (**Top**), unten (**Bottom**), links (**Left**) oder rechts (**Right**).
*   **🛠️ Zwei Layout-Modi:**
    *   **Größenänderungsmodus (Resize) [Empfohlen]:** Ändert das Viewport (`html`) und verschiebt fixierte Elemente (`position: fixed;`) automatisch.
    *   **Spacer-Modus:** Fügt dynamisches Padding hinzu.
*   **🔌 Iframe-Kompatibilität:** Betten Sie beliebige Webseiten oder Dashboards über Iframes ein.
*   **⚡ Lazy Load & Destroy:** Inaktive oder minimierte Tabs zerstören ihre Iframes, um die CPU- und RAM-Last auf 0% zu senken.

---

## Français 🇫🇷

**Screen Dead Zone** est une extension Chrome open-source basée sur **Manifest V3** conçue pour réserver, isoler et limiter une partie physique de votre écran (zone morte), empêchant le navigateur de restituer du contenu en dessous.

C'est l'outil parfait pour masquer les pixels morts sur les bords de l'écran ou pour afficher des widgets fixes et des flux de caméras locaux sans chevauchement.

### 🌐 Support multilingue natif
L'extension est entièrement localisée et prend en charge **8 langues natives** (anglais, espagnol, portugais, chinois simplifié, hindi, allemand, français et japonais). La langue s'adapte automatiquement.

### ✨ Caractéristiques principales
*   **📐 Dimensions dynamiques:** Réservez de `0%` à `70%` de la taille de votre écran.
*   **📍 Ancrage multidirectionnel:** Fixez la zone morte sur n'importe quel bord : **Haut**, **Bas**, **Gauche** ou **Droite**.
*   **🛠️ Deux modes d'ajustement:**
    *   **Mode Redimensionner [Recommandé]:** Modifie directement le viewport (`html`) et déplace automatiquement les éléments en position fixe (`position: fixed;`).
    *   **Mode Espaceur (Spacer):** Ajoute une marge interne dynamique pour permettre le défilement.
*   **🔌 Compatibilité Iframe:** Intégrez des dashboards Home Assistant ou des pages web.
*   **⚡ Libération de ressources (Lazy Load & Destroy):** Les onglets en arrière-plan détruisent leurs iframes pour réduire la consommation de processeur et de RAM à 0%.

---

## 日本語 🇯🇵

**Screen Dead Zone** は、**Manifest V3** に基づいて構築されたオープンソースの Chrome 拡張機能で、画面の物理的な一部（デッドゾーン）を予約、隔離、制限し、ブラウザがその下にコンテンツを描画しないように設計されています。

画面の端にドット抜けがあるユーザーや、ベゼル（額縁）の太いモニターを使用しているユーザー、あるいはブラウジング領域にデジタル時計や防犯カメラの映像を重ねずに埋め込みたいユーザーに最適です。

### 🌐 多言語ネイティブ対応
本拡張機能は完全に多言語化されており、**アプリ内で 8 言語に対応**（英語、スペイン語、ポルトガル語、簡体字中国語、ヒンディー語、ドイツ語、フランス語、日本語）しています。ブラウザの言語設定に合わせて自動で表示が切り替わります。

### ✨ 主な機能
*   **📐 動的なサイズ調整：** 画面の予約領域を `0%` から `70%` の範囲で調整可能。
*   **📍 多方向配置（アンカー）：** デッドゾーンを画面の **上（Top）**、**下（Bottom）**、**左（Left）**、**右（Right）** のいずれかに固定できます。
*   **🛠️ 2つのレイアウトモード：**
    *   **リサイズモード（Resize） [推奨]：** ビューポート（`html`）を直接縮小し、固定要素（`position: fixed;`）を画面内に押し上げます。
    *   **スペーサーモード（Spacer）：** ページ端に動的余白（Padding）を追加します。
*   **🔌 iframe 互換性：** iframe を使用して、スマートホームのダッシュボード（Home Assistantなど）や防犯カメラ의 映像を埋め込めます。
*   **⚡ 省電力・リソース節約設計：** バックグラウンドにある非アクティブなタブや最小化されたバーは、iframe をメモリから完全に破棄し、バックグラウンドでの CPU、ネットワーク、RAM 消費を 0% にします。

---

## 🛡️ License

MIT License. Copyright (c) 2026.
