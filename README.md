# Screen Dead Zone 🖥️🛡️

**Screen Dead Zone** es una extensión de Chrome de código abierto basada en **Manifest V3** diseñada para reservar, aislar y limitar una porción física de tu pantalla (zona muerta), evitando que el navegador renderice o exponga contenidos bajo ella. 

Es la herramienta perfecta para usuarios con pantallas con píxeles muertos en los bordes, configuraciones de monitores con marcos gruesos, o simplemente para quienes desean integrar widgets fijos (como relojes digitales) y cámaras de seguridad en tiempo real directamente en su espacio de navegación sin que la web se superponga sobre ellos.

---

## ✨ Características Principales

*   **📏 Ajuste de Altura Dinámico:** Configura con precisión en porcentaje (`%`) la altura que deseas reservar en el borde inferior de tu pantalla.
*   **🛠️ Dos Modos de Ajuste de Layout:**
    *   **Modo Redimensionar (Resize):** Modifica directamente el viewport (`html`) y aísla el scroll del navegador. Todos los elementos de posición fija (`position: fixed; bottom: 0;`), como barras de chat, banners de cookies o pies de página, se desplazan hacia arriba automáticamente de forma nativa sin quedar ocultos.
    *   **Modo Espaciador (Spacer):** Añade un margen de relleno (padding) dinámico al final de la página para que puedas hacer scroll por encima de la zona muerta.
*   **⏳ Widgets de Reloj y Fecha Integrados:** Muestra la hora actual en tiempo real con fuentes escalables de alta visibilidad cuando no uses una URL externa.
*   **🔌 Integración Iframe (Cámaras de Seguridad, etc.):** Inserta cualquier página o stream web (como cámaras de seguridad locales a través de reproductores WebRTC/HLS tipo `go2rtc` o dashboards de domótica).
*   **🎨 Personalización Total:** Configura el color de fondo, el color de los textos/reloj y guarda estas configuraciones como **Presets** rápidos de un solo clic.
*   **🍃 Minimizado Ágil (Botón Esconder/Mostrar):** Esconde temporalmente la Zona Muerta con un solo clic si necesitas el 100% de la pantalla para una tarea rápida, y recupérala al instante pulsando el botón verde flotante.
*   **⌨️ Atajo de Teclado Global:** Activa o desactiva la Zona Muerta rápidamente en cualquier pestaña utilizando combinaciones de teclas.

---

## 🚀 Instalación y Configuración

Sigue estos sencillos pasos para instalar la extensión de forma manual en tu navegador:

1.  **Descarga el código del repositorio:**
    *   Descarga el código como `.zip` y descomprímelo en tu ordenador, o clona el repositorio usando Git:
        ```bash
        git clone https://github.com/tu-usuario/ScreenDeadZone.git
        ```
2.  **Abre la página de extensiones en Chrome:**
    *   En la barra de direcciones de tu navegador, introduce `chrome://extensions/`.
3.  **Activa el Modo de Desarrollador:**
    *   Activa el interruptor **"Modo de desarrollador"** situado en la esquina superior derecha.
4.  **Carga la extensión:**
    *   Haz clic en el botón **"Cargar descomprimida"** en la esquina superior izquierda.
    *   Selecciona la carpeta raíz del proyecto (donde se encuentra el archivo `manifest.json`).
5.  ¡Listo! El icono de **Screen Dead Zone** aparecerá en tu barra de herramientas.

---

## ⌨️ Atajos de Teclado por Defecto

Puedes activar y desactivar la extensión rápidamente con los siguientes atajos:

*   **Mac:** `⌘ Shift 0` (Command + Shift + 0) o clic en el atajo configurado en la extensión.
*   **Windows / Linux:** `Ctrl Shift 0`

> 💡 *Puedes personalizar este atajo en cualquier momento abriendo `chrome://extensions/shortcuts` en tu navegador.*

---

## 🎥 Integración con Cámaras de Seguridad (RTSP)

Si tienes una cámara de seguridad local que transmite mediante el protocolo RTSP y quieres verla en tiempo real en tu Zona Muerta:

1.  Usa un puente local como [go2rtc](https://github.com/AlexxIT/go2rtc) para convertir el feed RTSP a WebRTC (latencia cero).
2.  Añade tu cámara en el archivo `go2rtc.yaml`:
    ```yaml
    streams:
      mi_camara: rtsp://usuario:contraseña@IP_LOCAL:554/stream
    ```
3.  Inicia `go2rtc` y abre `http://localhost:1984`.
4.  Copia el enlace de WebRTC (ej. `http://localhost:1984/stream.html?src=mi_camara`).
5.  Abre el menú de configuración de Screen Dead Zone, selecciona el modo **Iframe** y pega esa URL.

---

## 📁 Estructura del Proyecto

```text
├── icons/             # Iconos oficiales de la extensión
├── background.js      # Script de servicio de fondo (Broker de mensajería y persistencia de pestañas)
├── content.js         # Script inyectado en las páginas web (Gestión de estilos, DOM y eventos)
├── manifest.json      # Definición de la extensión (Manifest V3)
├── popup.html/js/css  # Ventana de activación rápida que abre la interfaz de configuración
├── test_page.html     # Página interactiva local para verificar que todo se redimensiona bien
└── README.md          # Documentación del proyecto
```

---

## 🛡️ Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` (si corresponde) para obtener más información.
