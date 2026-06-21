(function() {
  // Evitar inyecciones duplicadas
  if (window.hasScreenDeadZoneInjected) return;
  window.hasScreenDeadZoneInjected = true;

  // Configuraciones globales por defecto
  let currentHeight = 15; // altura en %
  let isEnabled = false;  // estado activo de la ventana actual
  let layoutMode = 'resize';
  let bgColor = '#000000'; // color de fondo por defecto
  let fgColor = '#ffffff'; // color de texto por defecto
  let displayMode = 'clock'; // 'clock' o 'iframe'
  let embedUrl = ''; // URL a embeber en la zona muerta
  let savedPresets = []; // Lista de presets guardados
  let shortcutText = 'Cmd Derecho + Shift + 0'; // Atajo de teclado configurado en Chrome

  let host = null;
  let shadow = null;
  let spacer = null;
  let globalStyleEl = null;
  let clockInterval = null;
  let isMinimized = false; // Estado temporal para esconder la barra en la pestaña actual

  // Elementos del menú de configuración a pantalla completa
  let menuHost = null;
  let menuShadow = null;

  // Dar formato amigable al atajo de teclado devuelto por Chrome
  const formatShortcut = (str) => {
    if (!str) return "Cmd Derecho + Shift + 0";
    if (str === "") return "Sin configurar (hazlo en chrome://extensions/shortcuts)";
    return str
      .replace("Command+", "⌘ ")
      .replace("Shift+", "⇧ ")
      .replace("Ctrl+", "Ctrl ")
      .replace("Alt+", "Alt ");
  };

  // Inicializar variables CSS globales en el documentElement
  const initStyles = () => {
    if (globalStyleEl) return;
    globalStyleEl = document.createElement('style');
    globalStyleEl.id = 'screen-dead-zone-global-styles';
    globalStyleEl.textContent = `
      :root {
        --sdz-height: 0px;
        --sdz-height-percent: 0%;
      }
      
      /* MODO RESIZE: Redimensiona la altura del HTML e aísla la barra de scroll */
      html.sdz-active.sdz-mode-resize {
        height: calc(100% - var(--sdz-height)) !important;
        overflow: hidden !important; /* Desactiva la barra de scroll del viewport general */
        box-sizing: border-box !important;
        transform: translate3d(0, 0, 0) !important; /* Crea un contexto de contención para elementos position: fixed */
      }
      html.sdz-active.sdz-mode-resize body {
        height: 100% !important;
        overflow-y: auto !important; /* Muestra scroll únicamente en el body, frenándolo sobre la zona muerta */
        box-sizing: border-box !important;
        position: relative !important;
      }

      /* MODO SPACER: Añade padding al final */
      html.sdz-active.sdz-mode-spacer {
        box-sizing: border-box !important;
      }
      html.sdz-active.sdz-mode-spacer body {
        padding-bottom: var(--sdz-height) !important;
        box-sizing: border-box !important;
      }
    `;
    document.documentElement.appendChild(globalStyleEl);
  };
  initStyles();

  // Calcular la altura real en px
  const getPxHeight = (percent) => {
    if (!isEnabled) return 0;
    return (window.innerHeight * percent) / 100;
  };

  // Crear o actualizar el espaciador (solo para modo spacer)
  const updateSpacer = (pxHeight) => {
    if (layoutMode === 'spacer' && isEnabled && currentHeight > 0) {
      if (!spacer) {
        spacer = document.createElement('div');
        spacer.id = 'screen-dead-zone-spacer';
        spacer.style.setProperty('display', 'block', 'important');
        spacer.style.setProperty('clear', 'both', 'important');
        spacer.style.setProperty('pointer-events', 'none', 'important');
        spacer.style.setProperty('width', '100%', 'important');
        spacer.style.setProperty('background', 'transparent', 'important');
        spacer.style.setProperty('border', 'none', 'important');
        spacer.style.setProperty('margin', '0', 'important');
      }
      spacer.style.setProperty('height', `${pxHeight}px`, 'important');
      
      if (document.body && spacer.parentNode !== document.body) {
        document.body.appendChild(spacer);
      }
    } else {
      if (spacer && spacer.parentNode) {
        spacer.parentNode.removeChild(spacer);
      }
      spacer = null;
    }
  };

  // Detener el reloj
  const stopClock = () => {
    if (clockInterval) {
      clearInterval(clockInterval);
      clockInterval = null;
    }
  };

  // Iniciar el reloj digital y la fecha
  const startClock = (containerEl) => {
    stopClock();

    const timeEl = containerEl.querySelector('.clock-time');
    const dateEl = containerEl.querySelector('.clock-date');

    if (!timeEl || !dateEl) return;

    const updateTime = () => {
      const now = new Date();

      // Formato XX:XX:XX
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      timeEl.textContent = `${hours}:${minutes}:${seconds}`;

      // Formato DD/MM/YYYY
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      dateEl.textContent = `${day}/${month}/${year}`;
    };

    updateTime();
    clockInterval = setInterval(updateTime, 1000);
  };

  // Eliminar elementos inyectados de la barra
  const removeElements = () => {
    stopClock();
    if (host && host.parentNode) {
      host.parentNode.removeChild(host);
    }
    host = null;
    shadow = null;

    if (spacer && spacer.parentNode) {
      spacer.parentNode.removeChild(spacer);
    }
    spacer = null;
  };

  // Actualizar el DOM y el CSS de la página
  const updateLayout = () => {
    // Al haber un cambio global de layout, restauramos el estado minimizado
    isMinimized = false;

    const pxHeight = getPxHeight(currentHeight);
    const percentHeight = isEnabled ? currentHeight : 0;

    // Actualizar propiedades CSS en la raíz del documento
    document.documentElement.style.setProperty('--sdz-height', `${pxHeight}px`);
    document.documentElement.style.setProperty('--sdz-height-percent', `${percentHeight}%`);

    if (isEnabled && currentHeight > 0) {
      // Limpiar clases previas de modo
      document.documentElement.classList.remove('sdz-mode-resize', 'sdz-mode-spacer');
      document.body?.classList.remove('sdz-mode-resize', 'sdz-mode-spacer');

      // Añadir clases activas
      document.documentElement.classList.add('sdz-active', `sdz-mode-${layoutMode}`);
      document.body?.classList.add('sdz-active', `sdz-mode-${layoutMode}`);

      createDeadZoneElement();
      updateSpacer(pxHeight);

      if (host) {
        host.style.setProperty('height', `${pxHeight}px`, 'important');
        host.style.setProperty('display', 'block', 'important');
        if (layoutMode === 'resize') {
          host.style.setProperty('bottom', 'calc(-1 * var(--sdz-height))', 'important');
        } else {
          host.style.setProperty('bottom', '0', 'important');
        }
        
        // Habilitar clics interactivos si hay un iframe, de lo contrario dejar pasar los clics
        if (displayMode === 'iframe' && embedUrl) {
          host.style.setProperty('pointer-events', 'auto', 'important');
        } else {
          host.style.setProperty('pointer-events', 'none', 'important');
        }

        const container = shadow?.querySelector('.container');
        if (container) {
          container.classList.remove('minimized');
          container.style.setProperty('--sdz-bg-color', bgColor);
          container.style.setProperty('--sdz-fg-color', fgColor);
          
          if (pxHeight < 45) {
            container.classList.add('mini-mode');
          } else {
            container.classList.remove('mini-mode');
          }
        }

        const showBtn = shadow?.querySelector('.show-btn');
        if (showBtn) {
          showBtn.style.display = 'none';
        }
      }
    } else {
      document.documentElement.classList.remove('sdz-active', 'sdz-mode-resize', 'sdz-mode-spacer');
      document.body?.classList.remove('sdz-active', 'sdz-mode-resize', 'sdz-mode-spacer');
      removeElements();
    }
  };

  // Aplicar temporalmente el estado minimizado (escondido) de la barra
  const setMinimizedState = (minimized) => {
    isMinimized = minimized;
    if (!shadow) return;

    const container = shadow.querySelector('.container');
    const showBtn = shadow.querySelector('.show-btn');

    if (isMinimized) {
      // Colapsar la barra a 0px
      document.documentElement.style.setProperty('--sdz-height', '0px');
      document.documentElement.style.setProperty('--sdz-height-percent', '0%');
      
      // Quitar clases activas del layout para restaurar el scroll/diseño normal
      document.documentElement.classList.remove('sdz-active', 'sdz-mode-resize', 'sdz-mode-spacer');
      document.body?.classList.remove('sdz-active', 'sdz-mode-resize', 'sdz-mode-spacer');

      if (host) {
        host.style.setProperty('height', '0px', 'important');
        host.style.setProperty('bottom', '0', 'important');
        // Debe permitir eventos para poder hacer clic en "Mostrar"
        host.style.setProperty('pointer-events', 'auto', 'important');
      }
      
      if (container) container.classList.add('minimized');
      if (showBtn) showBtn.style.display = 'flex';
      
      stopClock();
      updateSpacer(0);
    } else {
      // Restaurar la barra
      const pxHeight = getPxHeight(currentHeight);
      document.documentElement.style.setProperty('--sdz-height', `${pxHeight}px`);
      document.documentElement.style.setProperty('--sdz-height-percent', `${currentHeight}%`);
      
      // Restaurar clases activas del layout
      if (isEnabled && currentHeight > 0) {
        document.documentElement.classList.add('sdz-active', `sdz-mode-${layoutMode}`);
        document.body?.classList.add('sdz-active', `sdz-mode-${layoutMode}`);
      }

      if (host) {
        host.style.setProperty('height', `${pxHeight}px`, 'important');
        if (layoutMode === 'resize') {
          host.style.setProperty('bottom', 'calc(-1 * var(--sdz-height))', 'important');
        } else {
          host.style.setProperty('bottom', '0', 'important');
        }
        if (displayMode === 'iframe' && embedUrl) {
          host.style.setProperty('pointer-events', 'auto', 'important');
        } else {
          host.style.setProperty('pointer-events', 'none', 'important');
        }
      }
      
      if (container) container.classList.remove('minimized');
      if (showBtn) showBtn.style.display = 'none';
      
      if (displayMode !== 'iframe' || !embedUrl) {
        startClock(container);
      }
      updateSpacer(pxHeight);
    }
  };

  // Crear la barra de la zona muerta
  const createDeadZoneElement = () => {
    if (!document.body) return;

    if (host) {
      const container = shadow.querySelector('.container');
      const hasIframe = !!container.querySelector('iframe');
      const shouldHaveIframe = (displayMode === 'iframe' && !!embedUrl);
      const currentIframeSrc = hasIframe ? container.querySelector('iframe').src : '';
      
      if (hasIframe !== shouldHaveIframe || (shouldHaveIframe && currentIframeSrc !== embedUrl)) {
        removeElements();
      }
    }

    if (!host) {
      host = document.createElement('div');
      host.id = 'screen-dead-zone-host';
      host.style.setProperty('position', 'fixed', 'important');
      host.style.setProperty('bottom', '0', 'important');
      host.style.setProperty('left', '0', 'important');
      host.style.setProperty('width', '100%', 'important');
      host.style.setProperty('z-index', '2147483647', 'important');

      shadow = host.attachShadow({ mode: 'open' });
      
      let innerContentHtml = '';
      if (displayMode === 'iframe' && embedUrl) {
        innerContentHtml = `<iframe src="${embedUrl}" style="width: 100%; height: 100%; border: none; background: transparent; overflow: auto;"></iframe>`;
      } else {
        innerContentHtml = `
          <div class="clock-widget">
            <div class="clock-time">00:00:00</div>
            <div class="clock-date">01/01/2026</div>
          </div>
        `;
      }

      shadow.innerHTML = `
        <style>
          :host {
            all: initial;
          }
          .container {
            width: 100%;
            height: 100%;
            background-color: var(--sdz-bg-color, #000000);
            color: var(--sdz-fg-color, #ffffff);
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.3);
            box-sizing: border-box;
            border-top: 1px solid rgba(255, 255, 255, 0.15);
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            overflow: hidden;
          }
          .clock-widget {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 2px;
            pointer-events: none;
            text-shadow: 0 2px 4px rgba(0,0,0,0.5);
          }
          .clock-time {
            font-size: min(17vw, calc(var(--sdz-height) * 0.52)) !important;
            font-weight: 700;
            letter-spacing: 0.02em;
            line-height: 1;
          }
          .clock-date {
            font-size: min(7vw, calc(var(--sdz-height) * 0.18)) !important;
            font-weight: 500;
            opacity: 0.8;
            letter-spacing: 0.05em;
            line-height: 1;
            margin-top: 6px;
          }
          .container.mini-mode .clock-date {
            display: none;
          }
          .container.mini-mode .clock-time {
            font-size: 13px;
          }
          iframe {
            width: 100%;
            height: 100%;
            border: none;
            display: block;
          }

          /* Botones para Esconder/Mostrar la barra de forma ágil */
          .toggle-btn {
            background: rgba(15, 23, 42, 0.8);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.15);
            color: #cbd5e1;
            font-family: inherit;
            font-size: 11px;
            font-weight: 600;
            padding: 5px 12px;
            border-radius: 9999px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 5px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
            transition: all 0.2s ease;
            user-select: none;
            pointer-events: auto; /* Captura clics en cualquier modo */
          }
          .toggle-btn:hover {
            color: white;
            background: rgba(30, 41, 59, 0.95);
            border-color: rgba(255, 255, 255, 0.3);
            transform: scale(1.03);
          }
          .toggle-btn svg {
            flex-shrink: 0;
          }
          
          /* Botón Esconder (posicionado en el borde superior central de la barra) */
          .hide-btn {
            position: absolute;
            top: 6px;
            left: 50%;
            transform: translateX(-50%);
            opacity: 0.35;
            transition: opacity 0.2s ease, transform 0.2s ease;
          }
          .container:hover .hide-btn {
            opacity: 0.85;
          }
          .hide-btn:hover {
            opacity: 1 !important;
            transform: translateX(-50%) !important;
          }

          /* Botón Mostrar (flota en la parte inferior central cuando está minimizada) */
          .show-btn {
            position: fixed;
            bottom: 12px;
            left: 50%;
            transform: translateX(-50%);
            display: none;
            background: rgba(22, 163, 74, 0.9); /* Fondo verde */
            border-color: rgba(255, 255, 255, 0.2);
            color: white;
            z-index: 2147483647;
          }
          .show-btn:hover {
            background: #15803d;
            transform: translateX(-50%) scale(1.03);
          }

          .container.minimized {
            display: none !important;
          }
        </style>
        <div class="container">
          ${innerContentHtml}
          
          <button class="toggle-btn hide-btn" title="Esconder temporalmente la Zona Muerta">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
            <span>Esconder</span>
          </button>
        </div>
        
        <button class="toggle-btn show-btn" title="Mostrar la Zona Muerta de nuevo">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
          <span>Mostrar</span>
        </button>
      `;

      // Registrar eventos para Esconder / Mostrar
      const hideBtn = shadow.querySelector('.hide-btn');
      const showBtn = shadow.querySelector('.show-btn');

      hideBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setMinimizedState(true);
      });

      showBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setMinimizedState(false);
      });

      if (displayMode !== 'iframe' || !embedUrl) {
        startClock(shadow.querySelector('.container'));
      } else {
        stopClock();
      }
    }

    if (host.parentNode !== document.body) {
      document.body.appendChild(host);
    }
  };

  // ==========================================
  // MENÚ DE CONFIGURACIÓN A PANTALLA COMPLETA
  // ==========================================

  const toggleFullscreenMenu = () => {
    if (!document.body) return;

    if (menuHost) {
      const backdrop = menuShadow.querySelector('.backdrop');
      if (backdrop && backdrop.classList.contains('active')) {
        backdrop.classList.remove('active');
        setTimeout(() => {
          if (menuHost && menuHost.parentNode) {
            menuHost.parentNode.removeChild(menuHost);
          }
          menuHost = null;
          menuShadow = null;
        }, 300);
        return;
      }
    }

    chrome.runtime.sendMessage({ type: "GET_TAB_STATE" }, (state) => {
      if (state && state.shortcut) {
        shortcutText = formatShortcut(state.shortcut);
      }
      buildAndShowMenu();
    });
  };

  const buildAndShowMenu = () => {
    if (menuHost) return;

    menuHost = document.createElement('div');
    menuHost.id = 'screen-dead-zone-menu-host';
    menuHost.style.setProperty('position', 'fixed', 'important');
    menuHost.style.setProperty('top', '0', 'important');
    menuHost.style.setProperty('left', '0', 'important');
    menuHost.style.setProperty('width', '100vw', 'important');
    menuHost.style.setProperty('height', '100vh', 'important');
    menuHost.style.setProperty('z-index', '2147483646', 'important');

    menuShadow = menuHost.attachShadow({ mode: 'open' });
    menuShadow.innerHTML = `
      <style>
        :host {
          all: initial;
        }
        /* Fondo difuminado (Backdrop) que se limita al área sin zona muerta */
        .backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: calc(100vh - var(--sdz-height, 0px)) !important;
          background: rgba(8, 10, 18, 0.7);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-sizing: border-box;
          font-family: 'Outfit', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
          color: #f1f5f9;
        }
        .backdrop.active {
          opacity: 1;
          pointer-events: auto;
        }
        
        /* Panel central principal adaptado al alto de la no-dead-zone con margen de 20px */
        .card {
          background: rgba(17, 24, 39, 0.85); /* Slate 900 */
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          width: 90%;
          max-width: 820px;
          height: calc(100% - 40px) !important; /* Alto completo de la no-dead-zone menos 20px arriba y abajo */
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
          display: grid;
          grid-template-columns: 1.1fr 1.3fr;
          overflow: hidden;
          transform: scale(0.94);
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .backdrop.active .card {
          transform: scale(1);
        }
        
        /* Columna izquierda (Explicación e Info) con soporte para scroll si es pequeña */
        .left-column {
          background: linear-gradient(145deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%);
          padding: 32px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-right: 1px solid rgba(255, 255, 255, 0.05);
          box-sizing: border-box;
          overflow-y: auto;
          gap: 20px;
        }
        
        .logo-area {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .logo-title {
          font-size: 20px;
          font-weight: 800;
          background: linear-gradient(135deg, #ffffff 40%, #94a3b8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.02em;
        }
        
        .info-area {
          margin-top: 10px;
        }
        .info-heading {
          font-size: 24px;
          font-weight: 700;
          line-height: 1.25;
          margin-bottom: 12px;
          background: linear-gradient(135deg, #4ade80 0%, #16a34a 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .info-p {
          font-size: 13.5px;
          color: #94a3b8;
          line-height: 1.6;
          margin-bottom: 16px;
        }
        
        .shortcut-info {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          padding: 12px;
          font-size: 12.5px;
          line-height: 1.5;
          color: #cbd5e1;
        }
        .shortcut-key {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 6px;
          padding: 2px 6px;
          font-family: monospace;
          font-weight: bold;
          color: #4ade80;
        }

        .active-window-indicator {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(34, 197, 94, 0.08);
          border: 1px solid rgba(34, 197, 94, 0.15);
          border-radius: 12px;
          padding: 10px 14px;
          font-size: 13px;
          font-weight: 600;
          color: #4ade80;
        }
        .indicator-dot {
          width: 8px;
          height: 8px;
          background-color: #22c55e;
          border-radius: 50%;
          box-shadow: 0 0 8px #22c55e;
        }
        .active-window-indicator.disabled {
          background: rgba(148, 163, 184, 0.08);
          border-color: rgba(148, 163, 184, 0.15);
          color: #94a3b8;
        }
        .active-window-indicator.disabled .indicator-dot {
          background-color: #64748b;
          box-shadow: none;
        }

        /* Columna derecha (Ajustes y Controles) */
        .right-column {
          padding: 32px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow-y: auto;
          box-sizing: border-box;
          gap: 20px;
        }
        
        .right-column::-webkit-scrollbar {
          width: 5px;
        }
        .right-column::-webkit-scrollbar-track {
          background: transparent;
        }
        .right-column::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 3px;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .section-title {
          font-size: 16px;
          font-weight: 700;
          color: #ffffff;
        }
        .close-btn {
          background: rgba(255, 255, 255, 0.05);
          border: none;
          color: #94a3b8;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .close-btn:hover {
          color: white;
          background: rgba(239, 68, 68, 0.15);
        }

        /* Grupos de ajuste */
        .control-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .control-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .control-label {
          font-size: 13px;
          font-weight: 600;
          color: #e2e8f0;
        }
        .control-desc {
          font-size: 11px;
          color: #64748b;
          line-height: 1.4;
        }

        /* Switch global de activación */
        .activation-row {
          background: rgba(34, 197, 94, 0.03);
          border: 1px solid rgba(34, 197, 94, 0.12);
          border-radius: 14px;
          padding: 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 22px;
        }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider {
          position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
          background-color: #334155;
          transition: .25s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 34px;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .slider:before {
          position: absolute; content: ""; height: 16px; width: 16px; left: 3px; bottom: 2px;
          background-color: white;
          transition: .25s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 50%;
          box-shadow: 0 1px 3px rgba(0,0,0,0.4);
        }
        input:checked + .slider { background-color: #22c55e; }
        input:checked + .slider:before { transform: translateX(20px); }

        /* Valor de altura display */
        .height-display {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 2px 8px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 700;
          color: #4ade80;
        }

        /* Slider Range */
        input[type=range] {
          -webkit-appearance: none;
          width: 100%;
          background: transparent;
          margin-top: 4px;
        }
        input[type=range]:focus { outline: none; }
        input[type=range]::-webkit-slider-runnable-track {
          width: 100%; height: 6px; cursor: pointer; background: #1e293b; border-radius: 3px;
        }
        input[type=range]::-webkit-slider-thumb {
          height: 18px; width: 18px; border-radius: 50%; background: #22c55e; cursor: pointer;
          -webkit-appearance: none; margin-top: -6px; box-shadow: 0 0 8px rgba(34, 197, 94, 0.4);
        }
        .ticks {
          display: flex; justify-content: space-between; font-size: 9px; color: #64748b; margin-top: 3px;
        }

        /* Selector de Contenido */
        .radio-tabs {
          display: flex;
          background: rgba(15, 23, 42, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 10px;
          padding: 4px;
          gap: 4px;
        }
        .radio-tab {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          font-size: 12px;
          font-weight: 600;
          color: #94a3b8;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.2s;
        }
        .radio-tab:hover {
          color: white;
          background: rgba(255,255,255,0.02);
        }
        .radio-tab input {
          position: absolute; opacity: 0; width: 0; height: 0;
        }
        .radio-tab:has(input:checked) {
          background: #1e293b;
          color: #4ade80;
          border: 1px solid rgba(255,255,255,0.05);
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }

        /* Input de URL */
        .input-url-wrapper {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-top: 2px;
        }
        .input-url {
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 12px;
          outline: none;
          width: 100%;
          box-sizing: border-box;
        }
        .input-url:focus { border-color: #22c55e; }

        /* Color Pickers */
        .color-row {
          display: flex;
          gap: 12px;
        }
        .color-field {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
          background: rgba(15, 23, 42, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 6px 12px;
          border-radius: 10px;
          transition: all 0.2s;
        }
        .color-field:hover {
          border-color: rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.02);
        }
        input[type="color"] {
          -webkit-appearance: none; border: none; width: 22px; height: 22px; border-radius: 6px; cursor: pointer; background: transparent;
        }
        input[type="color"]::-webkit-color-swatch-wrapper { padding: 0; }
        input[type="color"]::-webkit-color-swatch {
          border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 6px;
        }
        .color-label { font-size: 12px; font-weight: 500; color: #cbd5e1; }

        /* Modos de Redimensión */
        .modes-row {
          display: flex;
          gap: 10px;
        }
        .mode-card {
          flex: 1;
          background: rgba(15, 23, 42, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 10px;
          cursor: pointer;
          display: flex;
          gap: 8px;
          align-items: flex-start;
          transition: all 0.2s;
        }
        .mode-card:hover {
          background: rgba(255,255,255,0.01);
          border-color: rgba(255, 255, 255, 0.1);
        }
        .mode-card input {
          margin-top: 2px;
          accent-color: #22c55e;
        }
        .mode-card-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .mode-card-title {
          font-size: 11.5px;
          font-weight: 700;
          color: #cbd5e1;
        }
        .mode-card-desc {
          font-size: 9px;
          color: #64748b;
          line-height: 1.3;
        }
        .mode-card:has(input:checked) {
          border-color: rgba(34, 197, 94, 0.35);
          background: rgba(34, 197, 94, 0.03);
        }
        .mode-card:has(input:checked) .mode-card-title {
          color: white;
        }

        /* Presets Section */
        .presets-block {
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          padding-top: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .preset-form {
          display: flex;
          gap: 6px;
        }
        .preset-input {
          flex: 1;
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          border-radius: 8px;
          padding: 6px 12px;
          font-size: 12px;
          outline: none;
        }
        .preset-input:focus { border-color: #22c55e; }
        .preset-btn {
          background: #16a34a;
          border: none;
          color: white;
          border-radius: 8px;
          padding: 6px 14px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .preset-btn:hover { background: #15803d; }
        
        .presets-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          max-height: 110px;
          overflow-y: auto;
          padding-right: 2px;
        }
        .preset-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(15, 23, 42, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 6px 10px;
          border-radius: 8px;
        }
        .preset-name {
          font-size: 11px;
          font-weight: 600;
          color: #cbd5e1;
        }
        .preset-item-actions {
          display: flex;
          gap: 6px;
        }
        .action-btn {
          border: none;
          border-radius: 4px;
          padding: 3px 8px;
          font-size: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
        }
        .load-action {
          background: rgba(34, 197, 94, 0.15);
          color: #4ade80;
          border: 1px solid rgba(34, 197, 94, 0.2);
        }
        .load-action:hover {
          background: #22c55e;
          color: white;
        }
        .delete-action {
          background: rgba(239, 68, 68, 0.1);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.15);
        }
        .delete-action:hover {
          background: #ef4444;
          color: white;
        }
        .empty-presets {
          font-size: 11px;
          color: #64748b;
          text-align: center;
          padding: 8px 0;
          font-style: italic;
        }
      </style>
      
      <div class="backdrop">
        <div class="card">
          <!-- Columna Izquierda (Logo e Info) -->
          <div class="left-column">
            <div class="logo-area">
              <svg class="logo-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="28" height="28">
                <path d="M 44 110 L 84 110 L 80 96 L 48 96 Z" fill="#475569" />
                <rect x="52" y="94" width="24" height="12" fill="#64748b" rx="2" />
                <rect x="14" y="14" width="100" height="80" rx="8" fill="#334155" />
                <rect x="20" y="20" width="88" height="68" rx="4" fill="#0f172a" />
                <rect x="20" y="64" width="88" height="24" rx="2" fill="#22c55e" opacity="0.9" />
                <text x="64" y="79" font-family="sans-serif" font-size="8" font-weight="bold" fill="#ffffff" text-anchor="middle">DZ</text>
              </svg>
              <span class="logo-title">ScreenDeadZone</span>
            </div>
            
            <div class="info-area">
              <h1 class="info-heading">Control de Zona Muerta</h1>
              <p class="info-p">Determina una zona de tu pantalla en la que no se muestre el navegador.</p>
              <div class="shortcut-info">
                Puedes pulsar <span class="shortcut-key">${shortcutText}</span> o hacer clic en el icono para abrir/cerrar este panel.
              </div>
            </div>
            
            <div class="active-window-indicator ${isEnabled ? '' : 'disabled'}">
              <div class="indicator-dot"></div>
              <span class="indicator-text">${isEnabled ? 'Zona Muerta Activa en esta Ventana' : 'Zona Muerta Desactivada'}</span>
            </div>
          </div>
          
          <!-- Columna Derecha (Ajustes) -->
          <div class="right-column">
            <div class="panel-header">
              <h2 class="section-title">Ajustes</h2>
              <button class="close-btn" title="Cerrar Ajustes">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <!-- Switch Activación -->
            <div class="activation-row">
              <div>
                <span class="control-label">Activar Zona Muerta</span>
                <p class="control-desc">Aplica la barra a toda la ventana actual</p>
              </div>
              <label class="switch">
                <input type="checkbox" id="menu-enable-toggle" ${isEnabled ? 'checked' : ''}>
                <span class="slider"></span>
              </label>
            </div>

            <!-- Control Altura -->
            <div class="control-group">
              <div class="control-header">
                <label class="control-label">Altura de la barra</label>
                <span class="height-display"><span id="menu-height-val">${currentHeight}</span>%</span>
              </div>
              <input type="range" id="menu-height-range" min="0" max="50" value="${currentHeight}" step="1">
              <div class="ticks">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
              </div>
            </div>

            <!-- Personalización de Colores -->
            <div class="control-group">
              <label class="control-label">Personalización de Colores</label>
              <div class="color-row">
                <div class="color-field">
                  <input type="color" id="menu-bg-color" value="${bgColor}">
                  <span class="color-label">Fondo</span>
                </div>
                <div class="color-field">
                  <input type="color" id="menu-fg-color" value="${fgColor}">
                  <span class="color-label">Texto</span>
                </div>
              </div>
            </div>

            <!-- Contenido de Zona Muerta -->
            <div class="control-group">
              <label class="control-label">Contenido de la Barra</label>
              <div class="radio-tabs">
                <label class="radio-tab">
                  <input type="radio" name="menu-display-mode" value="clock" ${displayMode === 'clock' ? 'checked' : ''}>
                  <span>Reloj y Fecha</span>
                </label>
                <label class="radio-tab">
                  <input type="radio" name="menu-display-mode" value="iframe" ${displayMode === 'iframe' ? 'checked' : ''}>
                  <span>Web Embebida (Iframe)</span>
                </label>
              </div>
              <div class="input-url-wrapper" id="menu-url-wrapper" style="display: ${displayMode === 'iframe' ? 'flex' : 'none'};">
                <input type="url" id="menu-embed-url" class="input-url" placeholder="https://ejemplo.com/widget-reloj" value="${embedUrl}">
                <p class="control-desc">Webs protegidas (como YouTube) no admiten ser embebidas por seguridad.</p>
              </div>
            </div>

            <!-- Modo Redimensionamiento -->
            <div class="control-group">
              <label class="control-label">Modo de Redimensionamiento</label>
              <div class="modes-row">
                <label class="mode-card">
                  <input type="radio" name="menu-layout-mode" value="resize" ${layoutMode === 'resize' ? 'checked' : ''}>
                  <div class="mode-card-content">
                    <span class="mode-card-title">Redimensionar</span>
                    <span class="mode-card-desc">Frena el scroll de la web arriba de la barra.</span>
                  </div>
                </label>
                <label class="mode-card">
                  <input type="radio" name="menu-layout-mode" value="spacer" ${layoutMode === 'spacer' ? 'checked' : ''}>
                  <div class="mode-card-content">
                    <span class="mode-card-title">Margen Inferior</span>
                    <span class="mode-card-desc">Añade relleno al final de la página.</span>
                  </div>
                </label>
              </div>
            </div>

            <!-- Presets -->
            <div class="presets-block">
              <label class="control-label">Sets de Ajustes (Presets)</label>
              <div class="preset-form">
                <input type="text" id="menu-preset-name" class="preset-input" placeholder="Nombre (ej. Noche, Trabajo)" maxlength="20">
                <button id="menu-save-preset-btn" class="preset-btn">Guardar</button>
              </div>
              <div class="presets-list" id="menu-presets-list">
                <!-- Renderizados por JS -->
              </div>
            </div>

          </div>
        </div>
      </div>
    `;

    setupMenuListeners();

    // Agregar al DOM y activar transiciones
    if (menuHost.parentNode !== document.body) {
      document.body.appendChild(menuHost);
    }
    
    // Forzar reflow y activar clases
    setTimeout(() => {
      const backdrop = menuShadow.querySelector('.backdrop');
      if (backdrop) backdrop.classList.add('active');
    }, 10);

    renderMenuPresets();
  };

  // Configurar listeners del menú de pantalla completa
  const setupMenuListeners = () => {
    if (!menuShadow) return;

    const backdrop = menuShadow.querySelector('.backdrop');
    const closeBtn = menuShadow.querySelector('.close-btn');
    const enableToggle = menuShadow.querySelector('#menu-enable-toggle');
    const heightRange = menuShadow.querySelector('#menu-height-range');
    const heightValSpan = menuShadow.querySelector('#menu-height-val');
    const bgColorInp = menuShadow.querySelector('#menu-bg-color');
    const fgColorInp = menuShadow.querySelector('#menu-fg-color');
    const radioDisplayModes = menuShadow.querySelectorAll('input[name="menu-display-mode"]');
    const urlWrapper = menuShadow.querySelector('#menu-url-wrapper');
    const urlInp = menuShadow.querySelector('#menu-embed-url');
    const radioLayoutModes = menuShadow.querySelectorAll('input[name="menu-layout-mode"]');
    
    // Preset inputs
    const presetNameInp = menuShadow.querySelector('#menu-preset-name');
    const savePresetBtn = menuShadow.querySelector('#menu-save-preset-btn');

    // Cerrar menú
    const closeMenu = () => {
      backdrop.classList.remove('active');
      setTimeout(() => {
        if (menuHost && menuHost.parentNode) {
          menuHost.parentNode.removeChild(menuHost);
        }
        menuHost = null;
        menuShadow = null;
      }, 300);
    };

    closeBtn.addEventListener('click', closeMenu);
    
    // Cerrar al pulsar Escape
    window.addEventListener('keydown', function escListener(e) {
      if (e.key === 'Escape') {
        closeMenu();
        window.removeEventListener('keydown', escListener);
      }
    });

    // Cerrar al hacer clic fuera de la tarjeta
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeMenu();
      }
    });

    // Toggle de activación global
    enableToggle.addEventListener('change', () => {
      chrome.runtime.sendMessage({
        type: "SET_TAB_STATE",
        windowId: true, // Esto le dice al background que resuelva la ventana activa del emisor
        isEnabled: enableToggle.checked
      });
      
      const indicator = menuShadow.querySelector('.active-window-indicator');
      const indicatorText = menuShadow.querySelector('.indicator-text');
      if (enableToggle.checked) {
        indicator.classList.remove('disabled');
        indicatorText.textContent = 'Zona Muerta Activa en esta Ventana';
      } else {
        indicator.classList.add('disabled');
        indicatorText.textContent = 'Zona Muerta Desactivada';
      }
    });

    // Control de Rango de Altura
    heightRange.addEventListener('input', (e) => {
      const val = e.target.value;
      heightValSpan.textContent = val;
      chrome.storage.local.set({ deadZoneHeight: parseInt(val, 10) });
    });

    // Color Pickers
    bgColorInp.addEventListener('input', (e) => {
      chrome.storage.local.set({ deadZoneBgColor: e.target.value });
    });
    fgColorInp.addEventListener('input', (e) => {
      chrome.storage.local.set({ deadZoneFgColor: e.target.value });
    });

    // Modos de visualización
    radioDisplayModes.forEach(radio => {
      radio.addEventListener('change', (e) => {
        if (e.target.checked) {
          const val = e.target.value;
          urlWrapper.style.display = val === 'iframe' ? 'flex' : 'none';
          chrome.storage.local.set({ deadZoneDisplayMode: val });
        }
      });
    });

    // URL embebida
    urlInp.addEventListener('change', (e) => {
      chrome.storage.local.set({ deadZoneEmbedUrl: e.target.value.trim() });
    });

    // Modos de redimensionamiento
    radioLayoutModes.forEach(radio => {
      radio.addEventListener('change', (e) => {
        if (e.target.checked) {
          chrome.storage.local.set({ deadZoneMode: e.target.value });
        }
      });
    });

    // Guardar preset
    savePresetBtn.addEventListener('click', () => {
      const name = presetNameInp.value.trim();
      if (!name) {
        alert('Escribe un nombre para el preset.');
        return;
      }

      const duplicateIndex = savedPresets.findIndex(p => p.name.toLowerCase() === name.toLowerCase());
      const presetData = {
        name: name,
        height: parseInt(heightRange.value, 10),
        bgColor: bgColorInp.value,
        fgColor: fgColorInp.value,
        mode: menuShadow.querySelector('input[name="menu-layout-mode"]:checked').value,
        displayMode: menuShadow.querySelector('input[name="menu-display-mode"]:checked').value,
        embedUrl: urlInp.value.trim()
      };

      if (duplicateIndex >= 0) {
        if (confirm(`Ya existe un preset llamado "${name}". ¿Sobrescribir?`)) {
          savedPresets[duplicateIndex] = presetData;
        } else {
          return;
        }
      } else {
        savedPresets.push(presetData);
      }

      chrome.storage.local.set({ deadZonePresets: savedPresets }, () => {
        presetNameInp.value = '';
        renderMenuPresets();
      });
    });
  };

  // Renderizar la lista de presets dentro del menú fullscreen
  const renderMenuPresets = () => {
    if (!menuShadow) return;

    const listContainer = menuShadow.querySelector('#menu-presets-list');
    listContainer.innerHTML = '';

    if (savedPresets.length === 0) {
      listContainer.innerHTML = '<div class="empty-presets">No tienes presets guardados.</div>';
      return;
    }

    savedPresets.forEach((preset, index) => {
      const item = document.createElement('div');
      item.className = 'preset-item';
      item.innerHTML = `
        <span class="preset-name">${preset.name}</span>
        <div class="preset-item-actions">
          <button class="action-btn load-action" data-index="${index}">Cargar</button>
          <button class="action-btn delete-action" data-index="${index}">Eliminar</button>
        </div>
      `;

      item.querySelector('.load-action').addEventListener('click', () => {
        loadMenuPreset(preset);
      });

      item.querySelector('.delete-action').addEventListener('click', () => {
        if (confirm(`¿Eliminar preset "${preset.name}"?`)) {
          savedPresets.splice(index, 1);
          chrome.storage.local.set({ deadZonePresets: savedPresets }, renderMenuPresets);
        }
      });

      listContainer.appendChild(item);
    });
  };

  // Cargar preset dentro del menú
  const loadMenuPreset = (preset) => {
    chrome.storage.local.set({
      deadZoneHeight: preset.height,
      deadZoneBgColor: preset.bgColor,
      deadZoneFgColor: preset.fgColor,
      deadZoneMode: preset.mode,
      deadZoneDisplayMode: preset.displayMode || 'clock',
      deadZoneEmbedUrl: preset.embedUrl || ''
    }, () => {
      // Sincronizar los inputs visuales del menú si está abierto
      if (menuShadow) {
        menuShadow.querySelector('#menu-height-range').value = preset.height;
        menuShadow.querySelector('#menu-height-val').textContent = preset.height;
        menuShadow.querySelector('#menu-bg-color').value = preset.bgColor;
        menuShadow.querySelector('#menu-fg-color').value = preset.fgColor;
        
        const rLayout = menuShadow.querySelector(`input[name="menu-layout-mode"][value="${preset.mode}"]`);
        if (rLayout) rLayout.checked = true;

        const dMode = preset.displayMode || 'clock';
        const rDisplay = menuShadow.querySelector(`input[name="menu-display-mode"][value="${dMode}"]`);
        if (rDisplay) rDisplay.checked = true;

        menuShadow.querySelector('#menu-url-wrapper').style.display = dMode === 'iframe' ? 'flex' : 'none';
        menuShadow.querySelector('#menu-embed-url').value = preset.embedUrl || '';
      }
    });
  };

  // Sincronizar estados locales desde cambios externos de almacenamiento (ej: de presets)
  const syncSettingsOnStorageChange = (changes) => {
    if (changes.deadZoneHeight) currentHeight = changes.deadZoneHeight.newValue;
    if (changes.deadZoneMode) layoutMode = changes.deadZoneMode.newValue;
    if (changes.deadZoneBgColor) bgColor = changes.deadZoneBgColor.newValue;
    if (changes.deadZoneFgColor) fgColor = changes.deadZoneFgColor.newValue;
    if (changes.deadZoneDisplayMode) displayMode = changes.deadZoneDisplayMode.newValue;
    if (changes.deadZoneEmbedUrl) embedUrl = changes.deadZoneEmbedUrl.newValue;
    if (changes.deadZonePresets) savedPresets = changes.deadZonePresets.newValue || [];

    // Sincronizar menú si estuviera abierto
    if (menuShadow) {
      if (changes.deadZoneHeight) {
        menuShadow.querySelector('#menu-height-range').value = currentHeight;
        menuShadow.querySelector('#menu-height-val').textContent = currentHeight;
      }
      if (changes.deadZoneBgColor) menuShadow.querySelector('#menu-bg-color').value = bgColor;
      if (changes.deadZoneFgColor) menuShadow.querySelector('#menu-fg-color').value = fgColor;
      
      if (changes.deadZoneMode) {
        const r = menuShadow.querySelector(`input[name="menu-layout-mode"][value="${layoutMode}"]`);
        if (r) r.checked = true;
      }
      if (changes.deadZoneDisplayMode) {
        const r = menuShadow.querySelector(`input[name="menu-display-mode"][value="${displayMode}"]`);
        if (r) r.checked = true;
        menuShadow.querySelector('#menu-url-wrapper').style.display = displayMode === 'iframe' ? 'flex' : 'none';
      }
      if (changes.deadZoneEmbedUrl) {
        menuShadow.querySelector('#menu-embed-url').value = embedUrl;
      }
      if (changes.deadZonePresets) {
        renderMenuPresets();
      }
    }
  };

  // Cargar configuraciones globales e inicializar estado de la ventana
  const init = () => {
    chrome.storage.local.get([
      'deadZoneHeight', 
      'deadZoneMode', 
      'deadZoneBgColor', 
      'deadZoneFgColor',
      'deadZoneDisplayMode',
      'deadZoneEmbedUrl',
      'deadZonePresets'
    ], (res) => {
      if (res.deadZoneHeight !== undefined) currentHeight = res.deadZoneHeight;
      if (res.deadZoneMode !== undefined) layoutMode = res.deadZoneMode;
      if (res.deadZoneBgColor !== undefined) bgColor = res.deadZoneBgColor;
      if (res.deadZoneFgColor !== undefined) fgColor = res.deadZoneFgColor;
      if (res.deadZoneDisplayMode !== undefined) displayMode = res.deadZoneDisplayMode;
      if (res.deadZoneEmbedUrl !== undefined) embedUrl = res.deadZoneEmbedUrl;
      if (res.deadZonePresets !== undefined) savedPresets = res.deadZonePresets;

      // Consultar el estado activo específico de esta ventana al background script
      chrome.runtime.sendMessage({ type: "GET_TAB_STATE" }, (state) => {
        if (chrome.runtime.lastError) {
          isEnabled = false;
        } else if (state) {
          isEnabled = state.isEnabled;
          if (state.shortcut) {
            shortcutText = formatShortcut(state.shortcut);
          }
        }

        // Ejecutar inicialización según la disponibilidad del body
        if (document.body) {
          updateLayout();
        } else {
          const observer = new MutationObserver((mutations, obs) => {
            if (document.body) {
              updateLayout();
              obs.disconnect();
            }
          });
          observer.observe(document.documentElement, { childList: true });
        }
      });
    });
  };

  init();

  // Escuchar cambios de almacenamiento
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local') {
      let changed = false;
      
      if (changes.deadZoneHeight || changes.deadZoneMode || changes.deadZoneBgColor || 
          changes.deadZoneFgColor || changes.deadZoneDisplayMode || changes.deadZoneEmbedUrl || 
          changes.deadZonePresets) {
        syncSettingsOnStorageChange(changes);
        changed = true;
      }

      if (changed) {
        updateLayout();
      }
    }
  });

  // Escuchar mensajes (atajos del background o clics del popup)
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "TAB_STATE_CHANGED") {
      isEnabled = message.state.isEnabled;
      
      // Actualizar toggles si el menú está abierto
      if (menuShadow) {
        const toggle = menuShadow.querySelector('#menu-enable-toggle');
        if (toggle) toggle.checked = isEnabled;

        const indicator = menuShadow.querySelector('.active-window-indicator');
        const indicatorText = menuShadow.querySelector('.indicator-text');
        if (isEnabled) {
          indicator.classList.remove('disabled');
          indicatorText.textContent = 'Zona Muerta Activa en esta Ventana';
        } else {
          indicator.classList.add('disabled');
          indicatorText.textContent = 'Zona Muerta Desactivada';
        }
      }
      
      updateLayout();
    }
    
    else if (message.type === "OPEN_FULLSCREEN_MENU") {
      toggleFullscreenMenu();
      if (sendResponse) sendResponse({ success: true });
    }
    
    return true;
  });

  // Capturar atajo de teclado: Cmd derecho + Shift + 0 para abrir el menú fullscreen
  let rightMetaPressed = false;

  window.addEventListener('keydown', (e) => {
    if (e.code === 'MetaRight') {
      rightMetaPressed = true;
    }

    // Comprobar atajo: Cmd Derecho + Shift + 0
    if (e.code === 'Digit0' && rightMetaPressed && e.shiftKey) {
      e.preventDefault();
      toggleFullscreenMenu();
    }
  }, true);

  window.addEventListener('keyup', (e) => {
    if (e.code === 'MetaRight') {
      rightMetaPressed = false;
    }
  }, true);

  window.addEventListener('blur', () => {
    rightMetaPressed = false;
  });

  // Escuchar resize de pantalla para recalcular altura de forma reactiva
  window.addEventListener('resize', () => {
    updateLayout();
  });

  // Ocultar barra en modo pantalla completa HTML5
  document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
      stopClock();
      if (host) host.style.setProperty('display', 'none', 'important');
      if (spacer) spacer.style.setProperty('display', 'none', 'important');
      document.documentElement.classList.remove('sdz-active', 'sdz-mode-resize', 'sdz-mode-spacer');
      document.body?.classList.remove('sdz-active', 'sdz-mode-resize', 'sdz-mode-spacer');
    } else {
      if (host) host.style.setProperty('display', 'block', 'important');
      if (spacer) spacer.style.setProperty('display', 'block', 'important');
      if (isEnabled && currentHeight > 0) {
        document.documentElement.classList.add('sdz-active', `sdz-mode-${layoutMode}`);
        document.body?.classList.add('sdz-active', `sdz-mode-${layoutMode}`);
        if (shadow && (displayMode !== 'iframe' || !embedUrl) && !isMinimized) startClock(shadow.querySelector('.container'));
      }
    }
  });
})();
