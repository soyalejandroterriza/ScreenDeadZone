# Screen Dead Zone 🖥️🛡️

<table border="0">
  <tr>
    <td valign="top" width="340">
      <img src="thumbnail/thumbnail.png" alt="Screen Dead Zone" width="320" style="border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.35);">
    </td>
    <td valign="top">
      <h2 style="margin-top: 0; border-bottom: none;">भाषा / Languages</h2>
      <p style="font-size: 13px; line-height: 1.5; margin-bottom: 15px;">
        यह एक्सटेंशन कई भाषाओं में उपलब्ध है। दस्तावेज़ पढ़ने के लिए अपनी भाषा चुनें:
      </p>
      <ul style="line-height: 1.6; font-size: 14px;">
        <li><a href="README.md">Español 🇪🇸</a></li>
        <li><a href="README.en.md">English 🇬🇧</a></li>
        <li><a href="README.pt.md">Português 🇵🇹</a></li>
        <li><a href="README.zh_CN.md">简体中文 🇨🇳</a></li>
        <li><strong>हिन्दी 🇮🇳 (वर्तमान)</strong></li>
        <li><a href="README.de.md">Deutsch 🇩🇪</a></li>
        <li><a href="README.fr.md">Français 🇫🇷</a></li>
        <li><a href="README.ja.md">日本語 🇯🇵</a></li>
      </ul>
    </td>
  </tr>
</table>

---

## सूचकांक
*   [✨ मुख्य विशेषताएं](#-मुख्य-विशेषताएं)
*   [📸 स्क्रीनशॉट और प्रदर्शन](#-स्क्रीनशॉट-और-प्रदर्शन)
*   [🛡️ आवश्यक अनुमतियाँ](#-आवश्यक-अनुमतियाँ)
*   [🚀 स्थापना](#-स्थापना)
*   [🛡️ लाइसेंस](#-लाइसेंस)

---

**Screen Dead Zone** एक ओपन-सोर्स क्रोम एक्सटेंशन है जो **Manifest V3** पर आधारित है। इसे आपकी स्क्रीन के भौतिक हिस्से (डेड ज़ोन) को आरक्षित और सीमित करने के लिए डिज़ाइन किया गया है, जिससे ब्राउज़र इसके नीचे की सामग्री को प्रदर्शित नहीं कर पाता है और वेबपेज की स्क्रॉलिंग को चयनित क्षेत्र तक सीमित कर देता है।

यह उन उपयोगकर्ताओं के लिए एक बेहतरीन उपकरण है जिनकी स्क्रीन के किनारों पर पिक्सेल खराब हैं, या जो ब्राउज़िंग के दौरान बिना किसी व्यवधान के डिजिटल घड़ी या सुरक्षा कैमरों जैसी चीज़ों को देखना चाहते हैं।

### 🌐 मूल बहुभाषी समर्थन
यह एक्सटेंशन पूरी तरह से स्थानीयकृत है और ऐप में **8 भाषाओं का समर्थन** (अंग्रेजी, स्पेनिश, पुर्तगाली, सरलीकृत चीनी, हिंदी, जर्मन, फ्रेंच और जापानी) करता है।

---

## ✨ मुख्य विशेषताएं

*   **📐 गतिशील आयाम:** आरक्षित स्क्रीन के आकार को `0%` से `70%` के बीच सेट करें।
*   **📍 बहु-दिशात्मक लंगर (Anchor):** डेड ज़ोन को चारों किनारों में से किसी पर भी लॉक करें: **ऊपर**, **नीचे**, **बाएं** या **दाएं**।
*   **🛠️ दो लेआउट मोड:**
    *   **आकार बदलें मोड (Resize) [अनुशंसित]:** यह सीधे व्यूपोर्ट (`html`) को संशोधित करता है। फिक्स्ड पोजीशन वाले तत्व (`position: fixed;`) अपने आप खिसक जाते हैं।
    *   **स्पेसर मोड (Spacer):** पेज के किनारे पर पैडिंग जोड़ता है।
*   **🔌 आईफ्रेम अनुकूलता:** आईफ्रेम का उपयोग करके किसी भी वेब पेज को एम्बेड करें।
*   **⚡ मेमोरी सेविंग लोड और डिस्ट्रॉय:** बैकग्राउंड टैब अपने आईफ्रेम को नष्ट कर देते हैं ताकि रैम और सीपीयू की खपत 0% रहे।
*   **⏳ घड़ी और तारीख:** रीयल-टाइम डिजिटल घड़ी विजेट।

---

## 📸 स्क्रीनशॉट और प्रदर्शन

काम करते हुए एक्सटेंशन के स्क्रीनशॉट:

<table border="0" width="100%">
  <tr>
    <td align="center" valign="top" width="50%">
      <b>1. घड़ी विजेट</b><br><br>
      <img src="Screenshots/screenshot_clock.png" alt="घड़ी" style="border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); max-width: 95%;">
    </td>
    <td align="center" valign="top" width="50%">
      <b>2. आईफ्रेम एकीकरण</b><br><br>
      <img src="Screenshots/screenshot_iframe.png" alt="आईफ्रेम" style="border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); max-width: 95%;">
    </td>
  </tr>
</table>

<br>
<p align="center">
  <b>3. वास्तविक दुनिया का परिणाम (IRL)</b><br>
  <img src="Screenshots/this.png" alt="IRL परिणाम" width="600" style="border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
</p>

---

## 🛡️ आवश्यक अनुमतियाँ

एक्सटेंशन इन अनुमतियों का अनुरोध करता है:

1.  **`storage`:** सेटिंग्स को स्थानीय रूप से सहेजने के लिए।
2.  **`declarativeNetRequest` / `declarativeNetRequestWithHostAccess`:** `X-Frame-Options` जैसी सुरक्षा सीमाओं को बायपास करने के लिए।
3.  **`host_permissions: ["<all_urls>"]`:** ओवरले को इंजेक्ट करने के लिए।

---

## 🚀 स्थापना

1.  कोड डाउनलोड और अनज़िप करें।
2.  `chrome://extensions/` खोलें और ऊपर दाईं ओर **"Developer mode"** चालू करें।
3.  **"Load unpacked"** पर क्लिक करें और फ़ोल्डर चुनें।

---

## 🛡️ लाइसेंस

MIT License. Copyright (c) 2026.
