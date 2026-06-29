# Screen Dead Zone 🖥️🛡️

<table border="0">
  <tr>
    <td valign="top" width="340">
      <img src="thumbnail/thumbnail.png" alt="Screen Dead Zone" width="320" style="border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.35);">
    </td>
    <td valign="top">
      <h2 style="margin-top: 0; border-bottom: none;">Langues / Languages</h2>
      <p style="font-size: 13px; line-height: 1.5; margin-bottom: 15px;">
        Cette extension est disponible en plusieurs langues. Sélectionnez votre langue :
      </p>
      <ul style="line-height: 1.6; font-size: 14px;">
        <li><a href="README.md">Español 🇪🇸</a></li>
        <li><a href="README.en.md">English 🇬🇧</a></li>
        <li><a href="README.pt.md">Português 🇵🇹</a></li>
        <li><a href="README.zh_CN.md">简体中文 🇨🇳</a></li>
        <li><a href="README.hi.md">हिन्दी 🇮🇳</a></li>
        <li><a href="README.de.md">Deutsch 🇩🇪</a></li>
        <li><strong>Français 🇫🇷 (Actuelle)</strong></li>
        <li><a href="README.ja.md">日本語 🇯🇵</a></li>
      </ul>
    </td>
  </tr>
</table>

---

## Table des matières
*   [✨ Caractéristiques principales](#-caractéristiques-principales)
*   [📸 Captures d'écran et démonstrations](#-captures-décran-et-démonstrations)
*   [🛡️ Autorisations requises](#-autorisations-requises)
*   [🚀 Installation](#-installation)
*   [🔌 Compatibilité Iframe](#-compatibilité-iframe)
*   [📁 Structure du projet](#-structure-du-projet)
*   [🛡️ Licence](#-licence)

---

**Screen Dead Zone** est une extension Chrome open-source basée sur **Manifest V3** conçue pour réserver, isoler et limiter une partie physique de votre écran (zone morte), empêchant le navigateur de restituer du contenu en dessous et limitant le défilement de la page Web à la zone sélectionnée.

C'est l'outil parfait pour masquer les pixels morts sur les bords de l'écran ou pour afficher des widgets fixes et des flux de caméras locaux sans chevauchement.

### 🌐 Support multilingue natif
L'extension est entièrement localisée et prend en charge **8 langues natives** (anglais, espagnol, portugais, chinois simplifié, hindi, allemand, français et japonais). La langue s'adapte automatiquement.

---

## ✨ Caractéristiques principales

*   **📐 Dimensions dynamiques:** Réservez de `0%` à `70%` de la taille de votre écran.
*   **📍 Ancrage multidirectionnel:** Fixez la zone morte sur n'importe quel bord : **Haut**, **Bas**, **Gauche** ou **Droite**.
*   **🛠️ Deux modes d'ajustement:**
    *   **Mode Redimensionner [Recommandé]:** Modifie directement le viewport (`html`) et déplace automatiquement les éléments en position fixe (`position: fixed;`).
    *   **Mode Espaceur (Spacer):** Ajoute une marge interne dynamique pour permettre le défilement.
*   **🔌 Compatibilité Iframe:** Intégrez des dashboards Home Assistant ou des pages web.
*   **⚡ Libération de ressources (Lazy Load & Destroy):** Les onglets en arrière-plan détruisent leurs iframes pour réduire la consommation de processeur et de RAM à 0%.
*   **⏳ Widgets d'horloge et de date:** Affiche l'heure actuelle en temps réel avec des polices à haute visibilité.

---

## 📸 Captures d'écran et démonstrations

Pour voir l'extension en action :

<table border="0" width="100%">
  <tr>
    <td align="center" valign="top" width="50%">
      <b>1. Widget Horloge</b><br><br>
      <img src="Screenshots/screenshot_clock.png" alt="Horloge" style="border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); max-width: 95%;">
    </td>
    <td align="center" valign="top" width="50%">
      <b>2. Intégration Iframe / Dashboard</b><br><br>
      <img src="Screenshots/screenshot_iframe.png" alt="Iframe" style="border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); max-width: 95%;">
    </td>
  </tr>
</table>

<br>
<p align="center">
  <b>3. Utilisation réelle (IRL)</b><br>
  <img src="Screenshots/this.png" alt="Utilisation IRL" width="600" style="border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
</p>

---

## 🛡️ Autorisations requises

Sous le standard **Manifest V3**, l'extension demande :

1.  **`storage` :** Pour sauvegarder vos préréglages, couleurs et options d'ancrage localement.
2.  **`declarativeNetRequest` et `declarativeNetRequestWithHostAccess` :** Pour outrepasser les en-têtes restrictifs comme `X-Frame-Options` ou `CSP` et charger des dashboards locaux.
3.  **`host_permissions: ["<all_urls>"]` :** Pour intégrer l'overlay dans les onglets.

---

## 🚀 Installation

1.  Clonez ce dépôt ou téléchargez et décompressez le fichier `.zip`.
2.  Ouvrez `chrome://extensions/` et activez le **"Mode développeur"** en haut à droite.
3.  Cliquez sur **"Charger l'extension non empaquetée"** et sélectionnez le dossier.

---

## 🛡️ Licence

Licence MIT. Copyright (c) 2026.
