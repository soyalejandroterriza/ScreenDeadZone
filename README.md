# Screen Dead Zone 🖥️🛡️

<table border="0">
  <tr>
    <td valign="top" width="340">
      <img src="thumbnail/thumbnail.png" alt="Screen Dead Zone" width="320" style="border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.35);">
    </td>
    <td valign="top">
      <h2 style="margin-top: 0; border-bottom: none;">Idiomas / Languages</h2>
      <p style="font-size: 13px; line-height: 1.5; margin-bottom: 15px;">
        Esta extensión está disponible en múltiples idiomas. Selecciona tu idioma preferido para leer la documentación:
      </p>
      <ul style="line-height: 1.6; font-size: 14px;">
        <li><strong>Español 🇪🇸 (Principal)</strong></li>
        <li><a href="README.en.md">English 🇬🇧</a></li>
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

## Índice
*   [✨ Características Principales](#-características-principales)
*   [📸 Capturas de Pantalla y Demostración](#-capturas-de-pantalla-y-demostración)
*   [🛡️ Permisos Requeridos](#-permisos-requeridos)
*   [🚀 Instalación y Configuración](#-instalación-y-configuración)
*   [🔌 Compatibilidad con Iframes](#-compatibilidad-con-iframes)
*   [📁 Estructura del Proyecto](#-estructura-del-proyecto)
*   [🛡️ Licencia](#-licencia)

---

**Screen Dead Zone** es una extensión de Chrome de código abierto basada en **Manifest V3** diseñada para reservar, aislar y limitar una porción física de tu pantalla (zona muerta), evitando que el navegador renderice o exponga contenidos bajo ella y limitando el scroll de la página web hasta la zona seleccionada.

Es la herramienta perfecta para usuarios con pantallas con píxeles muertos en los bordes, configuraciones de monitores con marcos gruesos, o simplemente para quienes desean integrar widgets fijos (como relojes digitales) y reproductores/dashboards en tiempo real directamente en su espacio de navegación sin que la web se superponga sobre ellos.

### 🌐 Soporte Multilingüe Nativo
La extensión está completamente localizada y soporta **8 idiomas nativos** (inglés, español, portugués, chino simplificado, hindi, alemán, francés y japonés). Todos los elementos de la interfaz y la configuración se adaptan automáticamente según el idioma preferido de tu navegador.

---

## ✨ Características Principales

*   **📐 Ajuste de Medidas Dinámico:** Configura con precisión en porcentaje (de `0%` a `70%`) el tamaño que deseas reservar de tu pantalla.
*   **📍 Posicionamiento Multidireccional (Anclaje):** Permite anclar la zona muerta en cualquiera de los cuatro bordes: **Arriba (Top)**, **Abajo (Bottom)**, **Izquierda (Left)** o **Derecha (Right)**.
*   **🛠️ Dos Modos de Ajuste de Layout:**
    *   **Modo Redimensionar (Resize) [Recomendado]:** Modifica directamente el viewport (`html`) y aísla el scroll. Los elementos fijos (`position: fixed;`) se desplazan automáticamente de forma nativa hacia el centro sin quedar ocultos.
    *   **Modo Espaciador (Spacer):** Añade un margen de relleno (padding) dinámico al borde correspondiente para que puedas hacer scroll por encima de la zona muerta.
*   **🔌 Compatibilidad con Iframes:** Inserta cualquier página o stream web utilizando iframes (Home Assistant, gráficas de monitorización o paneles multimedia).
*   **⚡ Rendimiento Inteligente (Lazy Loading & Destroy):** Las pestañas inactivas o minimizadas destruyen por completo sus iframes para reducir a un 0% el consumo de CPU, red y RAM en segundo plano.
*   **⏳ Widgets de Reloj y Fecha:** Muestra la hora actual en tiempo real con fuentes escalables de alta visibilidad, auto-adaptables a formato horizontal o vertical.
*   **🎨 Personalización Total:** Configura el color de fondo/texto y guarda conjuntos de ajustes en **Presets** rápidos.
*   **🍃 Minimizado Ágil (Botón Esconder/Mostrar):** Esconde la Zona Muerta con un solo clic y recupérala mediante el botón flotante en el borde configurado.

---

## 📸 Capturas de Pantalla y Demostración

Para ver la extensión en acción, aquí tienes algunas capturas de la interfaz y un caso de uso real:

<table border="0" width="100%">
  <tr>
    <td align="center" valign="top" width="50%">
      <b>1. Widget de Reloj Integrado</b><br><br>
      <img src="Screenshots/screenshot_clock.png" alt="Reloj en la Zona Muerta" style="border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); max-width: 95%;">
    </td>
    <td align="center" valign="top" width="50%">
      <b>2. Integración de Dashboards/Webs mediante Iframe</b><br><br>
      <img src="Screenshots/screenshot_iframe.png" alt="Iframe en la Zona Muerta" style="border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); max-width: 95%;">
    </td>
  </tr>
</table>

<br>
<p align="center">
  <b>3. Resultado IRL (En la vida real)</b><br>
  <img src="Screenshots/this.png" alt="Resultado IRL" width="600" style="border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
</p>

---

## 🛡️ Permisos Requeridos

Para funcionar de forma óptima y segura bajo la especificación **Manifest V3**, la extensión solicita los siguientes permisos:

1.  **`storage` (Almacenamiento):** Permite persistir localmente y sincronizar tus presets, colores, modo de diseño y anclaje seleccionados.
2.  **`declarativeNetRequest` y `declarativeNetRequestWithHostAccess` (Modificación de Red):** Indispensable para saltarse cabeceras de seguridad restrictivas como `X-Frame-Options` o políticas `CSP` en los iframes, permitiendo que visualices dashboards locales (como Home Assistant) o recursos externos directamente en la barra.
3.  **`host_permissions: ["<all_urls>"]` (Permiso de Origen):** Necesario para poder inyectar e integrar visualmente la barra ScreenDeadZone en las pestañas donde desees activarla y aplicar las reglas de modificación de cabeceras en las URLs que insertes.

---

## 🚀 Instalación y Configuración

Sigue estos sencillos pasos para instalar la extensión de forma manual en tu navegador:

1.  **Descarga el código del repositorio:**
    *   Descarga el código como `.zip` y descomprímelo en tu ordenador, o clona el repositorio usando Git:
        ```bash
        git clone https://github.com/soyalejandroterriza/ScreenDeadZone.git
        ```
2.  **Abre la página de extensiones en Chrome:**
    *   En la barra de direcciones de tu navegador, introduce `chrome://extensions/`.
3.  **Activa el Modo de Desarrollador:**
    *   Activa el interruptor **"Modo de desarrollador"** situado en la esquina superior derecha.
4.  **Carga la extensión:**
    *   Haz clic en el botón **"Cargar descomprimida"** en la esquina superior izquierda.
    *   Selecciona la carpeta raíz del proyecto (donde se encuentra el archivo `manifest.json`).
5.  ¡Listo! Abre el menú pulsando en el icono de **Screen Dead Zone** en la barra de herramientas de tu navegador.

---

## 🔌 Compatibilidad con Iframes

Screen Dead Zone permite cargar cualquier página o recurso web directamente dentro de la zona muerta utilizando iframes. Esto es sumamente útil para integrar en tu espacio de trabajo:

*   **Dashboards de control:** Paneles de domótica (como Home Assistant), paneles de monitorización o gráficas en tiempo real.
*   **Herramientas de productividad:** Calendarios compartidos, gestores de tareas en línea o reproductores multimedia web.
*   **Recursos locales:** Web apps locales, cámaras de seguridad locales y cualquier contenido que se pueda visualizar a través de un navegador.

---

## 📁 Estructura del Proyecto

```text
├── icons/             # Iconos oficiales de la extensión
├── _locales/          # Traducciones oficiales del proyecto (i18n)
├── background.js      # Script de servicio de fondo (Persistencia y broker de mensajería)
├── content.js         # Script inyectado en las páginas web (Gestión de estilos, DOM, cálculo de bounds y eventos)
├── manifest.json      # Definición de la extensión (Manifest V3)
├── popup.html/js/css  # Ventana de activación rápida que abre la interfaz de configuración
├── Screenshots/       # Capturas de pantalla para la documentación
├── thumbnail/         # Imagen miniatura del repositorio
└── README.md          # Documentación del proyecto (Español)
```

---

## 🛡️ Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` (si corresponde) para obtener más información.
