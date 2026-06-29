(function() {
  // Evitar inyecciones duplicadas
  if (window.hasScreenDeadZoneInjected) return;
  window.hasScreenDeadZoneInjected = true;

  // Configuraciones globales por defecto
  let currentHeight = 15; // tamaño en %
  let isEnabled = false;  // estado activo de la ventana actual
  let layoutMode = 'resize';
  let anchorPos = 'bottom'; // 'top', 'bottom', 'left', 'right'
  let bgColor = '#000000'; // color de fondo por defecto
  let fgColor = '#ffffff'; // color de texto por defecto
  let embedUrls = []; // Lista de URLs
  let activeTabId = 'clock'; 
  let savedPresets = [];

  let host = null;
  let shadow = null;
  let globalStyleEl = null;
  let clockInterval = null;
  let isMinimized = false;

  let menuHost = null;
  let menuShadow = null;

  const initStyles = () => {
    if (globalStyleEl) return;
    globalStyleEl = document.createElement('style');
    globalStyleEl.id = 'screen-dead-zone-global-styles';
    globalStyleEl.textContent = `
      :root {
        --sdz-size: 0px;
        --sdz-size-percent: 0%;
      }
      
      /* MODO RESIZE */
      html.sdz-active.sdz-mode-resize {
        overflow: hidden !important; 
        box-sizing: border-box !important;
        transform: translate3d(0, 0, 0) !important;
      }
      html.sdz-active.sdz-mode-resize.sdz-anchor-bottom,
      html.sdz-active.sdz-mode-resize.sdz-anchor-top {
        height: calc(100% - var(--sdz-size)) !important;
      }
      html.sdz-active.sdz-mode-resize.sdz-anchor-left,
      html.sdz-active.sdz-mode-resize.sdz-anchor-right {
        width: calc(100% - var(--sdz-size)) !important;
      }
      html.sdz-active.sdz-mode-resize.sdz-anchor-top {
        transform: translateY(var(--sdz-size)) !important;
      }
      html.sdz-active.sdz-mode-resize.sdz-anchor-left {
        transform: translateX(var(--sdz-size)) !important;
      }

      html.sdz-active.sdz-mode-resize body {
        height: 100% !important;
        overflow-y: auto !important; 
        overflow-x: auto !important;
        box-sizing: border-box !important;
        position: relative !important;
      }

      /* MODO SPACER */
      html.sdz-active.sdz-mode-spacer {
        box-sizing: border-box !important;
      }
      html.sdz-active.sdz-mode-spacer body {
        box-sizing: border-box !important;
      }
      html.sdz-active.sdz-mode-spacer.sdz-anchor-bottom body {
        padding-bottom: var(--sdz-size) !important;
      }
      html.sdz-active.sdz-mode-spacer.sdz-anchor-top body {
        padding-top: var(--sdz-size) !important;
      }
      html.sdz-active.sdz-mode-spacer.sdz-anchor-left body {
        padding-left: var(--sdz-size) !important;
      }
      html.sdz-active.sdz-mode-spacer.sdz-anchor-right body {
        padding-right: var(--sdz-size) !important;
      }
    `;
    document.documentElement.appendChild(globalStyleEl);
  };
  initStyles();

  const getPxSize = (percent) => {
    if (!isEnabled) return 0;
    if (anchorPos === 'left' || anchorPos === 'right') {
      return (window.innerWidth * percent) / 100;
    }
    return (window.innerHeight * percent) / 100;
  };

  const stopClock = () => {
    if (clockInterval) {
      clearInterval(clockInterval);
      clockInterval = null;
    }
  };

  const startClock = (containerEl) => {
    stopClock();
    const timeEl = containerEl.querySelector('.clock-time');
    const dateEl = containerEl.querySelector('.clock-date');
    if (!timeEl || !dateEl) return;
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      timeEl.textContent = `${hours}:${minutes}:${seconds}`;
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      dateEl.textContent = `${day}/${month}/${year}`;
    };
    updateTime();
    clockInterval = setInterval(updateTime, 1000);
  };

  const removeElements = () => {
    stopClock();
    if (host && host.parentNode) {
      host.parentNode.removeChild(host);
    }
    host = null;
    shadow = null;
  };


  const updateMenuBounds = () => {
    if (!menuHost) return;
    
    setTimeout(() => {
      if (!menuHost) return;
      if (!isEnabled || currentHeight === 0) {
        menuHost.style.setProperty('top', '0', 'important');
        menuHost.style.setProperty('left', '0', 'important');
        menuHost.style.setProperty('width', '100vw', 'important');
        menuHost.style.setProperty('height', '100vh', 'important');
        return;
      }
      
      if (layoutMode === 'resize') {
        // En modo Resize, el elemento HTML está transformado y recortado. 
        // Actúa como el 'containing block' para fixed, así que 0,0,100%,100% es la zona segura.
        menuHost.style.setProperty('top', '0', 'important');
        menuHost.style.setProperty('left', '0', 'important');
        menuHost.style.setProperty('width', '100%', 'important');
        menuHost.style.setProperty('height', '100%', 'important');
      } else {
        // En modo Spacer, calculamos el desplazamiento físico respecto a la ventana
        const pxSize = getPxSize(currentHeight);
        let top = 0, left = 0, width = window.innerWidth, height = window.innerHeight;
        
        if (anchorPos === 'left') {
           left = pxSize;
           width = window.innerWidth - pxSize;
        } else if (anchorPos === 'right') {
           width = window.innerWidth - pxSize;
        } else if (anchorPos === 'top') {
           top = pxSize;
           height = window.innerHeight - pxSize;
        } else if (anchorPos === 'bottom') {
           height = window.innerHeight - pxSize;
        }
        
        menuHost.style.setProperty('top', top + 'px', 'important');
        menuHost.style.setProperty('left', left + 'px', 'important');
        menuHost.style.setProperty('width', width + 'px', 'important');
        menuHost.style.setProperty('height', height + 'px', 'important');
      }
    }, 60);
  };

  const updateActiveIframe = () => {
    if (!shadow) return;
    const container = shadow.querySelector('.container');
    if (!container) return;

    // Eliminar iframe existente si lo hay
    container.querySelectorAll('.dz-iframe').forEach(iframe => iframe.remove());

    // Solo inyectar si la pestaña actual es visible, hay una URL activa y la barra está habilitada y no minimizada
    const isVisible = !document.hidden;
    const isUrlTab = activeTabId && activeTabId.startsWith('url-');

    if (isVisible && isUrlTab && isEnabled && currentHeight > 0 && !isMinimized) {
      const idx = parseInt(activeTabId.replace('url-', ''), 10);
      if (embedUrls && embedUrls[idx]) {
        const urlObj = embedUrls[idx];
        const iframe = document.createElement('iframe');
        iframe.className = 'dz-iframe';
        iframe.id = `iframe-${activeTabId}`;
        iframe.src = urlObj.url;
        iframe.style.setProperty('width', '100%', 'important');
        iframe.style.setProperty('height', '100%', 'important');
        iframe.style.setProperty('border', 'none', 'important');
        iframe.style.setProperty('background', 'transparent', 'important');
        iframe.style.setProperty('overflow', 'auto', 'important');
        
        const tabsContainer = container.querySelector('.dz-tabs-container');
        if (tabsContainer) {
          container.insertBefore(iframe, tabsContainer);
        } else {
          container.appendChild(iframe);
        }
      }
    }
  };

  const updateLayout = () => {
    isMinimized = false;

    const pxSize = getPxSize(currentHeight);
    const percentSize = isEnabled ? currentHeight : 0;

    document.documentElement.style.setProperty('--sdz-size', `${pxSize}px`);
    document.documentElement.style.setProperty('--sdz-size-percent', `${percentSize}%`);

    const anchorClasses = ['sdz-anchor-top', 'sdz-anchor-bottom', 'sdz-anchor-left', 'sdz-anchor-right'];

    if (isEnabled && currentHeight > 0) {
      document.documentElement.classList.remove('sdz-mode-resize', 'sdz-mode-spacer', ...anchorClasses);
      document.body?.classList.remove('sdz-mode-resize', 'sdz-mode-spacer');

      document.documentElement.classList.add('sdz-active', `sdz-mode-${layoutMode}`, `sdz-anchor-${anchorPos}`);
      document.body?.classList.add('sdz-active', `sdz-mode-${layoutMode}`);

      updateMenuBounds();

      createDeadZoneElement();

      if (host) {
        host.style.setProperty('display', 'block', 'important');
        
        host.style.removeProperty('top');
        host.style.removeProperty('bottom');
        host.style.removeProperty('left');
        host.style.removeProperty('right');
        host.style.removeProperty('width');
        host.style.removeProperty('height');

        const offset = layoutMode === 'resize' ? `calc(-1 * var(--sdz-size))` : '0';

        if (anchorPos === 'left' || anchorPos === 'right') {
          host.style.setProperty('width', `${pxSize}px`, 'important');
          host.style.setProperty('height', '100%', 'important');
          host.style.setProperty('top', '0', 'important');
          host.style.setProperty(anchorPos, offset, 'important');
        } else {
          host.style.setProperty('height', `${pxSize}px`, 'important');
          host.style.setProperty('width', '100%', 'important');
          host.style.setProperty('left', '0', 'important');
          host.style.setProperty(anchorPos, offset, 'important');
        }
        
        if (activeTabId !== 'clock') {
          host.style.setProperty('pointer-events', 'auto', 'important');
        } else {
          host.style.setProperty('pointer-events', 'none', 'important');
        }

        const container = shadow?.querySelector('.container');
        if (container) {
          container.classList.remove('minimized');
          container.setAttribute('data-anchor', anchorPos);
          container.style.setProperty('--sdz-bg-color', bgColor);
          container.style.setProperty('--sdz-fg-color', fgColor);
          
          if (pxSize < 45) {
            container.classList.add('mini-mode');
          } else {
            container.classList.remove('mini-mode');
          }
        }

        const showBtn = shadow?.querySelector('.show-btn');
        if (showBtn) {
           showBtn.style.display = 'none';
           showBtn.className = 'toggle-btn show-btn pos-' + anchorPos;
        }
      }
    } else {
      document.documentElement.classList.remove('sdz-active', 'sdz-mode-resize', 'sdz-mode-spacer', ...anchorClasses);
      document.body?.classList.remove('sdz-active', 'sdz-mode-resize', 'sdz-mode-spacer');
      updateMenuBounds();
      removeElements();
    }
    updateActiveIframe();
  };

  const setMinimizedState = (minimized) => {
    isMinimized = minimized;
    if (!shadow) return;

    const container = shadow.querySelector('.container');
    const showBtn = shadow.querySelector('.show-btn');
    const anchorClasses = ['sdz-anchor-top', 'sdz-anchor-bottom', 'sdz-anchor-left', 'sdz-anchor-right'];

    if (isMinimized) {
      document.documentElement.style.setProperty('--sdz-size', '0px');
      document.documentElement.style.setProperty('--sdz-size-percent', '0%');
      
      document.documentElement.classList.remove('sdz-active', 'sdz-mode-resize', 'sdz-mode-spacer', ...anchorClasses);
      document.body?.classList.remove('sdz-active', 'sdz-mode-resize', 'sdz-mode-spacer');

      if (host) {
        if (anchorPos === 'left' || anchorPos === 'right') {
           host.style.setProperty('width', '0px', 'important');
           host.style.setProperty(anchorPos, '0', 'important');
        } else {
           host.style.setProperty('height', '0px', 'important');
           host.style.setProperty(anchorPos, '0', 'important');
        }
        host.style.setProperty('pointer-events', 'auto', 'important');
      }
      
      if (container) container.classList.add('minimized');
      if (showBtn) {
         showBtn.style.display = 'flex';
         showBtn.className = 'toggle-btn show-btn pos-' + anchorPos;
      }
      
      stopClock();
    } else {
      const pxSize = getPxSize(currentHeight);
      document.documentElement.style.setProperty('--sdz-size', `${pxSize}px`);
      document.documentElement.style.setProperty('--sdz-size-percent', `${currentHeight}%`);
      
      if (isEnabled && currentHeight > 0) {
        document.documentElement.classList.add('sdz-active', `sdz-mode-${layoutMode}`, `sdz-anchor-${anchorPos}`);
        document.body?.classList.add('sdz-active', `sdz-mode-${layoutMode}`);
      }

      if (host) {
        const offset = layoutMode === 'resize' ? `calc(-1 * var(--sdz-size))` : '0';
        if (anchorPos === 'left' || anchorPos === 'right') {
          host.style.setProperty('width', `${pxSize}px`, 'important');
          host.style.setProperty(anchorPos, offset, 'important');
        } else {
          host.style.setProperty('height', `${pxSize}px`, 'important');
          host.style.setProperty(anchorPos, offset, 'important');
        }
        
        if (activeTabId !== 'clock') {
          host.style.setProperty('pointer-events', 'auto', 'important');
        } else {
          host.style.setProperty('pointer-events', 'none', 'important');
        }
      }
      
      if (container) container.classList.remove('minimized');
      if (showBtn) showBtn.style.display = 'none';
      
      if (activeTabId === 'clock') startClock(container);
      else stopClock();
    }
    updateMenuBounds();
    updateActiveIframe();
  };
  // Crear la barra de la zona muerta
  const createDeadZoneElement = () => {
    if (!document.body) return;

    if (host) {
      const currentUrlsStr = host.getAttribute('data-urls') || '[]';
      const newUrlsStr = JSON.stringify(embedUrls);
      if (currentUrlsStr !== newUrlsStr) {
        removeElements();
      }
    }

    if (!host) {
      host = document.createElement('div');
      host.id = 'screen-dead-zone-host';
      host.setAttribute('data-urls', JSON.stringify(embedUrls));
      host.style.setProperty('position', 'fixed', 'important');
      host.style.setProperty('bottom', '0', 'important');
      host.style.setProperty('left', '0', 'important');
      host.style.setProperty('width', '100%', 'important');
      host.style.setProperty('z-index', '2147483647', 'important');

      shadow = host.attachShadow({ mode: 'open' });
      
      let tabsHtml = '';
      
      if (embedUrls && embedUrls.length > 0) {
        const clockActive = activeTabId === 'clock';
        tabsHtml += `<button class="toggle-btn dz-tab ${clockActive ? 'active' : ''}" data-target="clock">${chrome.i18n.getMessage("contentTabClock")}</button>`;
        embedUrls.forEach((urlObj, idx) => {
          const tabId = 'url-' + idx;
          const isActive = activeTabId === tabId;
          const title = urlObj.title || urlObj.url;
          tabsHtml += `<button class="toggle-btn dz-tab ${isActive ? 'active' : ''}" data-target="${tabId}">${title}</button>`;
        });
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
          .clock-container {
            display: ${activeTabId === 'clock' ? 'flex' : 'none'};
            width: 100%;
            height: 100%;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          .clock-widget {
            text-align: center;
            user-select: none;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
          }
          .clock-time {
            font-size: min(20vw, calc(var(--sdz-size) * 0.6)) !important;
            font-weight: 700;
            letter-spacing: 0.01em;
            line-height: 1;
            margin-bottom: 4px;
            font-variant-numeric: tabular-nums;
            text-shadow: 0 4px 10px rgba(0,0,0,0.5);
          }
          .container[data-anchor="left"] .clock-time,
          .container[data-anchor="right"] .clock-time {
            font-size: min(20vh, calc(var(--sdz-size) * 0.4)) !important;
          }
          .clock-date {
            font-size: min(6vw, calc(var(--sdz-size) * 0.2)) !important;
            font-weight: 500;
            opacity: 0.8;
            letter-spacing: 0.05em;
            line-height: 1;
            margin-top: 4px;
            text-transform: uppercase;
            text-shadow: 0 2px 5px rgba(0,0,0,0.5);
          }
          .container[data-anchor="left"] .clock-date,
          .container[data-anchor="right"] .clock-date {
            font-size: min(6vh, calc(var(--sdz-size) * 0.15)) !important;
          }
          .container.mini-mode .clock-date {
            display: none;
          }
          .container.mini-mode .clock-time {
            font-size: 20px;
            margin-bottom: 0;
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
          
          /* Contenedor de pestañas */
          .dz-tabs-container {
            position: absolute;
            bottom: 8px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 8px;
            align-items: center;
            z-index: 2147483647;
            opacity: 0.35;
            transition: opacity 0.2s ease;
          }
          .container[data-anchor="top"] .dz-tabs-container {
            bottom: auto;
            top: 8px;
          }
          .container[data-anchor="left"] .dz-tabs-container,
          .container[data-anchor="right"] .dz-tabs-container {
            flex-direction: column;
            left: auto;
            right: auto;
            transform: translateY(-50%);
            top: 50%;
            bottom: auto;
          }
          .container[data-anchor="left"] .dz-tabs-container { right: 8px; }
          .container[data-anchor="right"] .dz-tabs-container { left: 8px; }
          
          .container[data-anchor="left"] .toggle-btn,
          .container[data-anchor="right"] .toggle-btn {
            flex-direction: column;
            padding: 8px;
          }
          .container[data-anchor="left"] .toggle-btn span,
          .container[data-anchor="right"] .toggle-btn span {
            display: none; /* Oculta texto en la barra vertical por falta de espacio */
          }
          .container[data-anchor="left"] .dz-tab.active span,
          .container[data-anchor="right"] .dz-tab.active span {
            display: none;
          }

          .container:hover .dz-tabs-container {
            opacity: 1;
          }
          
          .dz-tab.active {
            color: white;
            background: rgba(30, 41, 59, 0.95);
            border-color: #ffffff !important;
          }

          .hide-btn {
            opacity: 1;
            position: static;
            transform: none;
          }

          .show-btn {
            position: fixed;
            z-index: 2147483647;
            opacity: 0.65;
            display: none;
            transition: opacity 0.2s ease;
          }
          .show-btn.pos-bottom { bottom: 12px; left: 50%; transform: translateX(-50%); }
          .show-btn.pos-top { top: 12px; left: 50%; transform: translateX(-50%); }
          .show-btn.pos-left { left: 12px; top: 50%; transform: translateY(-50%); flex-direction: column; }
          .show-btn.pos-right { right: 12px; top: 50%; transform: translateY(-50%); flex-direction: column; }
          .show-btn.pos-left span, .show-btn.pos-right span { display: none; }
          .show-btn:hover { opacity: 1 !important; }

          .container.minimized {
            display: none !important;
          }
        </style>
        <div class="container">
          <div class="clock-container">
            <div class="clock-widget">
              <div class="clock-time">00:00:00</div>
              <div class="clock-date">01/01/2026</div>
            </div>
          </div>

          
          <div class="dz-tabs-container">
            <button class="toggle-btn hide-btn" title="${chrome.i18n.getMessage("contentBtnHide")}">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
              <span>${chrome.i18n.getMessage("contentBtnHide")}</span>
            </button>
            ${tabsHtml}
          </div>
        </div>
        
        <button class="toggle-btn show-btn" title="${chrome.i18n.getMessage("contentBtnShow")}">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
          <span>${chrome.i18n.getMessage("contentBtnShow")}</span>
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
      
      // Eventos para pestañas
      const tabs = shadow.querySelectorAll('.dz-tab');
      tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
          e.stopPropagation();
          const target = tab.getAttribute('data-target');
          activeTabId = target;
          
          // Actualizar UI
          shadow.querySelectorAll('.dz-tab').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          
          // Ocultar todo
          shadow.querySelector('.clock-container').style.display = 'none';
          stopClock();
          
          // Mostrar lo correspondiente
          if (target === 'clock') {
            shadow.querySelector('.clock-container').style.display = 'flex';
            startClock(shadow.querySelector('.container'));
          }
          
          // Guardar estado
          chrome.storage.local.set({ deadZoneActiveTab: activeTabId });
          
          updateActiveIframe();
          
          // Forzar layout update (para clics de pointer-events)
          updateLayout();
        });
      });

      if (activeTabId === 'clock') {
        startClock(shadow.querySelector('.container'));
      } else {
        stopClock();
      }
      updateActiveIframe();
    }

    if (host.parentNode !== document.body) {
      document.body.appendChild(host);
    }
  };

  // ==========================================
  // MENÚ DE CONFIGURACIÓN A PANTALLA COMPLETA

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

    loadSettingsAndShowMenu();
  };

  const loadSettingsAndShowMenu = () => {
    chrome.runtime.sendMessage({ type: "GET_TAB_STATE" }, (state) => {
      if (state) {
        isEnabled = state.isEnabled || false;
      }
      buildAndShowMenu();
    });
  };

  const buildAndShowMenu = () => {
    if (menuHost) return;

    menuHost = document.createElement('div');
    menuHost.id = 'screen-dead-zone-menu-host';
    menuHost.style.setProperty('position', 'fixed', 'important');
    menuHost.style.setProperty('z-index', '2147483646', 'important');
    
    // Posición por defecto
    menuHost.style.setProperty('top', '0', 'important');
    menuHost.style.setProperty('left', '0', 'important');
    menuHost.style.setProperty('width', '100vw', 'important');
    menuHost.style.setProperty('height', '100vh', 'important');

    menuShadow = menuHost.attachShadow({ mode: 'open' });
    menuShadow.innerHTML = `
      <style>
        :host {
          all: initial;
        }
        .backdrop {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
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
        
        .card {
          background: rgba(17, 24, 39, 0.85); /* Slate 900 */
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          width: 90%;
          max-width: 800px;
          height: 90%;
          max-height: 850px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transform: scale(0.94);
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .backdrop.active .card {
          transform: scale(1);
        }
        
        /* HEADER (Top) */
        .menu-header {
          background: linear-gradient(145deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%);
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          flex-shrink: 0;
        }
        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .header-title-box {
          display: flex;
          flex-direction: column;
        }
        .logo-title {
          font-size: 18px;
          font-weight: 800;
          background: linear-gradient(135deg, #ffffff 40%, #94a3b8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.02em;
        }
        .info-p {
          font-size: 11px;
          color: #94a3b8;
          margin: 0;
          margin-top: 2px;
        }
        .close-btn {
          background: rgba(255, 255, 255, 0.05);
          border: none;
          color: #94a3b8;
          border-radius: 50%;
          width: 28px;
          height: 28px;
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

        .active-window-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(34, 197, 94, 0.08);
          border: 1px solid rgba(34, 197, 94, 0.15);
          border-radius: 12px;
          padding: 6px 12px;
          font-size: 11px;
          font-weight: 600;
          color: #4ade80;
          white-space: nowrap;
        }
        .indicator-dot {
          width: 6px;
          height: 6px;
          background-color: #22c55e;
          border-radius: 50%;
          box-shadow: 0 0 6px #22c55e;
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

        /* BODY (Bottom) */
        .menu-body {
          padding: 16px 24px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
          box-sizing: border-box;
        }
        .menu-body::-webkit-scrollbar {
          width: 5px;
        }
        .menu-body::-webkit-scrollbar-track {
          background: transparent;
        }
        .menu-body::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 3px;
        }

        /* Grupos de ajuste */
        .control-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .control-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .control-label {
          font-size: 12px;
          font-weight: 700;
          color: #e2e8f0;
        }
        .control-desc {
          font-size: 11px;
          color: #64748b;
          line-height: 1.3;
          margin: 0;
        }

        /* Switch global de activación */
        .activation-row {
          background: rgba(34, 197, 94, 0.03);
          border: 1px solid rgba(34, 197, 94, 0.12);
          border-radius: 12px;
          padding: 12px 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .switch {
          position: relative;
          display: inline-block;
          width: 40px;
          height: 20px;
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
          position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 2px;
          background-color: white;
          transition: .25s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 50%;
          box-shadow: 0 1px 3px rgba(0,0,0,0.4);
        }
        input:checked + .slider { background-color: #22c55e; }
        input:checked + .slider:before { transform: translateX(18px); }

        /* Valor de altura display */
        .height-display {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 2px 6px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          color: #4ade80;
        }

        /* Slider Range */
        input[type=range] {
          -webkit-appearance: none;
          width: 100%;
          background: transparent;
          margin: 6px 0;
        }
        input[type=range]:focus {
          outline: none;
        }
        input[type=range]::-webkit-slider-runnable-track {
          width: 100%;
          height: 6px;
          cursor: pointer;
          background: #334155;
          border-radius: 3px;
          border: 1px solid rgba(255,255,255,0.05);
        }
        input[type=range]::-webkit-slider-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #4ade80;
          cursor: pointer;
          -webkit-appearance: none;
          margin-top: -6px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.5);
          transition: transform 0.1s;
        }
        input[type=range]::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }
        .ticks {
          display: flex;
          justify-content: space-between;
          font-size: 9px;
          color: #64748b;
          font-weight: 600;
        }

        /* Colores */
        .color-row {
          display: flex;
          gap: 12px;
        }
        .color-field {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 6px;
          border-radius: 8px;
        }
        .color-field input[type="color"] {
          -webkit-appearance: none;
          border: none;
          width: 24px;
          height: 24px;
          border-radius: 4px;
          cursor: pointer;
          padding: 0;
          background: none;
        }
        .color-field input[type="color"]::-webkit-color-swatch-wrapper {
          padding: 0;
        }
        .color-field input[type="color"]::-webkit-color-swatch {
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
        .color-label {
          font-size: 11px;
          font-weight: 500;
          color: #cbd5e1;
        }

        /* Modos Layout */
        .modes-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .mode-card {
          position: relative;
          cursor: pointer;
          padding: 8px;
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          transition: all 0.2s;
        }
        .mode-card input {
          position: absolute;
          opacity: 0;
        }
        .mode-card:hover {
          background: rgba(30, 41, 59, 0.8);
        }
        .mode-card:has(input:checked) {
          background: rgba(30, 41, 59, 0.9);
          border-color: #4ade80;
        }
        .mode-card-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .mode-card-title {
          font-size: 12px;
          font-weight: 600;
          color: #e2e8f0;
        }
        .mode-card:has(input:checked) .mode-card-title {
          color: #4ade80;
        }

        /* Grid horizontal/vertical responsivo según proporción de pantalla */
        .settings-row {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        @media (min-aspect-ratio: 1/1) {
          .settings-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
          }
        }

        .section-separator {
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          margin: 6px 0;
          flex-shrink: 0;
        }

        /* Inputs de texto / URLs */
        .input-url, .preset-input {
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          padding: 6px 10px;
          border-radius: 8px;
          font-size: 11px;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s;
        }
        .input-url:focus, .preset-input:focus {
          border-color: #4ade80;
        }
        
        .preset-form {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
        }
        .preset-input {
          flex: 1;
        }

        .preset-btn {
          background: rgba(34, 197, 94, 0.15);
          border: 1px solid rgba(34, 197, 94, 0.2);
          color: #4ade80;
          border-radius: 8px;
          padding: 6px 14px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .preset-btn:hover { background: #15803d; color: white; }
        
        .presets-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          max-height: 90px;
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
        .load-action:hover { background: #22c55e; color: white; }
        .delete-action {
          background: rgba(239, 68, 68, 0.1);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.15);
        }
        .delete-action:hover { background: #ef4444; color: white; }
        .empty-presets {
          font-size: 11px;
          color: #64748b;
          text-align: center;
          padding: 8px 0;
          font-style: italic;
        }

        /* GitHub Link */
        .presets-block {
          background: rgba(15, 23, 42, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 12px;
        }
        .github-link {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #94a3b8;
          text-decoration: none;
          font-size: 11px;
          font-weight: 500;
          transition: color 0.2s ease, transform 0.2s ease;
          justify-content: center;
        }
        .github-link:hover {
          color: #ffffff;
          transform: scale(1.02);
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
      </style>
      
      <div class="backdrop">
        <div class="card">
          <!-- CABECERA -->
          <div class="menu-header">
            <div class="header-left">
              <div class="header-title-box">
                <span class="logo-title">ScreenDeadZone</span>
                <p class="info-p">${chrome.i18n.getMessage("contentDesc") || "Determina una zona de tu pantalla en la que no se muestre el navegador."}</p>
              </div>
            </div>
            
            <div style="display: flex; align-items: center; gap: 12px;">
              <div class="active-window-indicator ${isEnabled ? '' : 'disabled'}">
                <div class="indicator-dot"></div>
                <span class="indicator-text">${isEnabled ? chrome.i18n.getMessage("contentActiveIndicator") : chrome.i18n.getMessage("contentInactiveIndicator")}</span>
              </div>
              <button class="close-btn" title="Cerrar Ajustes">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
          
          <!-- CUERPO DE AJUSTES -->
          <div class="menu-body">

            <!-- Switch Activación -->
            <div class="activation-row">
              <div>
                <span class="control-label" style="font-size: 14px;">${chrome.i18n.getMessage("contentEnableTitle")}</span>
                <p class="control-desc">${chrome.i18n.getMessage("contentEnableDesc")}</p>
              </div>
              <label class="switch">
                <input type="checkbox" id="menu-enable-toggle" ${isEnabled ? 'checked' : ''}>
                <span class="slider"></span>
              </label>
            </div>

            <div class="section-separator"></div>

            <!-- Posición de Anclaje -->
            <div class="control-group">
              <label class="control-label">${chrome.i18n.getMessage("contentAnchorTitle")}</label>
              <div class="modes-row" style="grid-template-columns: 1fr 1fr 1fr 1fr;">
                <label class="mode-card" style="padding: 8px;">
                  <input type="radio" name="menu-anchor-pos" value="top" ${anchorPos === 'top' ? 'checked' : ''}>
                  <div class="mode-card-content" style="text-align: center;">
                    <span class="mode-card-title">⬆️ ${chrome.i18n.getMessage("contentAnchorTop")}</span>
                  </div>
                </label>
                <label class="mode-card" style="padding: 8px;">
                  <input type="radio" name="menu-anchor-pos" value="bottom" ${anchorPos === 'bottom' ? 'checked' : ''}>
                  <div class="mode-card-content" style="text-align: center;">
                    <span class="mode-card-title">⬇️ ${chrome.i18n.getMessage("contentAnchorBottom")}</span>
                  </div>
                </label>
                <label class="mode-card" style="padding: 8px;">
                  <input type="radio" name="menu-anchor-pos" value="left" ${anchorPos === 'left' ? 'checked' : ''}>
                  <div class="mode-card-content" style="text-align: center;">
                    <span class="mode-card-title">⬅️ ${chrome.i18n.getMessage("contentAnchorLeft")}</span>
                  </div>
                </label>
                <label class="mode-card" style="padding: 8px;">
                  <input type="radio" name="menu-anchor-pos" value="right" ${anchorPos === 'right' ? 'checked' : ''}>
                  <div class="mode-card-content" style="text-align: center;">
                    <span class="mode-card-title">➡️ ${chrome.i18n.getMessage("contentAnchorRight")}</span>
                  </div>
                </label>
              </div>
            </div>

            <div class="section-separator"></div>

            <!-- Control Altura -->
            <div class="control-group">
              <div class="control-header">
                <label class="control-label">${chrome.i18n.getMessage("contentBarHeight")}</label>
                <span class="height-display"><span id="menu-height-val">${currentHeight}</span>%</span>
              </div>
              <input type="range" id="menu-height-range" min="0" max="70" value="${currentHeight}" step="1">
              <div class="ticks">
                <span>0%</span>
                <span>35%</span>
                <span>70%</span>
              </div>
            </div>

            <div class="section-separator"></div>

            <div class="settings-row">
              <!-- Personalización de Colores -->
              <div class="control-group">
                <label class="control-label">${chrome.i18n.getMessage("contentColorTitle")}</label>
                <div class="color-row">
                  <div class="color-field">
                    <input type="color" id="menu-bg-color" value="${bgColor}">
                    <span class="color-label">${chrome.i18n.getMessage("contentBgColor")}</span>
                  </div>
                  <div class="color-field">
                    <input type="color" id="menu-fg-color" value="${fgColor}">
                    <span class="color-label">${chrome.i18n.getMessage("contentFgColor")}</span>
                  </div>
                </div>
              </div>

              <!-- Modo Redimensionamiento -->
              <div class="control-group">
                <label class="control-label">${chrome.i18n.getMessage("contentLayoutMode")}</label>
                <div class="modes-row">
                  <label class="mode-card">
                    <input type="radio" name="menu-layout-mode" value="resize" ${layoutMode === 'resize' ? 'checked' : ''}>
                    <div class="mode-card-content">
                      <span class="mode-card-title">${chrome.i18n.getMessage("contentResize")}</span>
                      <span style="font-size: 10px; color: #4ade80; opacity: 0.9; margin-top: -2px;">${chrome.i18n.getMessage("contentRecommended")}</span>
                    </div>
                  </label>
                  <label class="mode-card">
                    <input type="radio" name="menu-layout-mode" value="spacer" ${layoutMode === 'spacer' ? 'checked' : ''}>
                    <div class="mode-card-content">
                      <span class="mode-card-title">${chrome.i18n.getMessage("contentSpacer")}</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div class="section-separator"></div>

            <div class="settings-row">
              <!-- Webs Guardadas (Pestañas) -->
              <div class="control-group">
                <label class="control-label">${chrome.i18n.getMessage("contentTabManager")}</label>
                <div class="input-url-wrapper" id="menu-url-wrapper" style="display: flex; flex-direction: column; gap: 8px;">
                  <div style="display: flex; gap: 8px; width: 100%;">
                    <input type="url" id="menu-embed-url" class="input-url" style="flex: 1;" placeholder="https://ejemplo.com/camara">
                    <button id="menu-add-url-btn" class="preset-btn">${chrome.i18n.getMessage("contentBtnAdd")}</button>
                  </div>
                  <p class="control-desc">${chrome.i18n.getMessage("contentTabDesc")}</p>
                </div>
                <div class="presets-list" id="menu-urls-list">
                  <!-- Renderizados por JS -->
                </div>
              </div>

              <!-- Presets -->
              <div class="presets-block" style="margin: 0; padding: 0; background: none; border: none;">
                <label class="control-label">${chrome.i18n.getMessage("contentPresetsTitle")}</label>
                <div class="preset-form">
                  <input type="text" id="menu-preset-name" class="preset-input" placeholder="${chrome.i18n.getMessage("contentPresetInput")}" maxlength="20">
                  <button id="menu-save-preset-btn" class="preset-btn">${chrome.i18n.getMessage("contentPresetSave")}</button>
                </div>
                <div class="presets-list" id="menu-presets-list">
                  <!-- Renderizados por JS -->
                </div>
              </div>
            </div>
            
            <div class="section-separator"></div>

            <div class="warning-block" style="display: flex; gap: 10px; background: rgba(239, 68, 68, 0.04); border: 1px solid rgba(239, 68, 68, 0.15); border-radius: 10px; padding: 12px; font-size: 11px; line-height: 1.5; color: #f87171; align-items: flex-start; box-sizing: border-box; flex-shrink: 0;">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; margin-top: 1px;">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <span>${chrome.i18n.getMessage("contentWarningDesc")}</span>
            </div>

            <div style="margin-top: 8px;">
              <!-- Enlace a GitHub -->
              <a href="https://github.com/soyalejandroterriza/ScreenDeadZone" target="_blank" class="github-link" title="Ver código fuente en GitHub">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
            </div>

          </div>
        </div>
      </div>
    `;

    setupMenuListeners();

    if (menuHost.parentNode !== document.body) {
      document.body.appendChild(menuHost);
    }
    
    updateMenuBounds();

    setTimeout(() => {
      const backdrop = menuShadow.querySelector('.backdrop');
      if (backdrop) backdrop.classList.add('active');
    }, 10);

    renderMenuPresets();
    renderMenuUrls();
  };
  // Configurar listeners del menú de pantalla completa
  const setupMenuListeners = () => {
    if (!menuShadow) return;

    const backdrop = menuShadow.querySelector('.backdrop');
    const closeBtn = menuShadow.querySelector('.close-btn');
    const enableToggle = menuShadow.querySelector('#menu-enable-toggle');
    const anchorRadios = menuShadow.querySelectorAll('input[name="menu-anchor-pos"]');
    anchorRadios.forEach(r => r.addEventListener('change', (e) => {
      anchorPos = e.target.value;
      updateLayout();
      updateMenuBounds();
      chrome.storage.local.set({ deadZoneAnchor: anchorPos });
    }));

    const heightRange = menuShadow.querySelector('#menu-height-range');
    const heightValSpan = menuShadow.querySelector('#menu-height-val');
    const bgColorInp = menuShadow.querySelector('#menu-bg-color');
    const fgColorInp = menuShadow.querySelector('#menu-fg-color');
    // const radioDisplayModes = menuShadow.querySelectorAll('input[name="menu-display-mode"]');
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

    enableToggle.addEventListener('change', () => {
      isEnabled = enableToggle.checked;
      updateLayout();
      updateMenuBounds();

      chrome.runtime.sendMessage({
        type: "SET_TAB_STATE",
        windowId: true,
        isEnabled: enableToggle.checked
      });
      
      const indicator = menuShadow.querySelector('.active-window-indicator');
      const indicatorText = menuShadow.querySelector('.indicator-text');
      if (enableToggle.checked) {
        indicator.classList.remove('disabled');
        indicatorText.textContent = chrome.i18n.getMessage("contentActiveIndicator");
      } else {
        indicator.classList.add('disabled');
        indicatorText.textContent = chrome.i18n.getMessage("contentInactiveIndicator");
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

    // URLs / Pestañas
    const addUrlBtn = menuShadow.querySelector('#menu-add-url-btn');
    addUrlBtn.addEventListener('click', () => {
      const url = urlInp.value.trim();
      if (!url) return;
      try {
        new URL(url); // Validar formato
      } catch (e) {
        alert(chrome.i18n.getMessage("contentUrlInvalid"));
        return;
      }
      embedUrls.push({ url, title: new URL(url).hostname });
      chrome.storage.local.set({ deadZoneEmbedUrls: embedUrls }, () => {
        urlInp.value = '';
        renderMenuUrls();
        updateLayout(); // Refresh host tabs
      });
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
        embedUrls: JSON.parse(JSON.stringify(embedUrls))
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

  // Renderizar la lista de URLs
  const renderMenuUrls = () => {
    if (!menuShadow) return;
    const listContainer = menuShadow.querySelector('#menu-urls-list');
    listContainer.innerHTML = '';
    
    if (embedUrls.length === 0) {
      listContainer.innerHTML = `<div class="empty-presets">${chrome.i18n.getMessage("contentEmptyTabs")}</div>`;
      return;
    }

    embedUrls.forEach((obj, index) => {
      const item = document.createElement('div');
      item.className = 'preset-item';
      item.innerHTML = `
        <span class="preset-name">${obj.title || obj.url}</span>
        <div class="preset-item-actions">
          <button class="action-btn delete-action" data-index="${index}">${chrome.i18n.getMessage("contentBtnDelete")}</button>
        </div>
      `;

      item.querySelector('.delete-action').addEventListener('click', () => {
        if (confirm(chrome.i18n.getMessage("contentConfirmDelete").replace('[TITLE]', obj.title || obj.url))) {
          embedUrls.splice(index, 1);
          if (activeTabId === 'url-' + index) {
             activeTabId = 'clock';
             chrome.storage.local.set({ deadZoneActiveTab: 'clock' });
          } else if (activeTabId.startsWith('url-')) {
             const currentIdx = parseInt(activeTabId.split('-')[1]);
             if (currentIdx > index) {
                activeTabId = 'url-' + (currentIdx - 1);
                chrome.storage.local.set({ deadZoneActiveTab: activeTabId });
             }
          }
          chrome.storage.local.set({ deadZoneEmbedUrls: embedUrls }, () => {
            renderMenuUrls();
            updateLayout();
          });
        }
      });

      listContainer.appendChild(item);
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
      deadZoneEmbedUrls: preset.embedUrls || []
    }, () => {
      // Sincronizar los inputs visuales del menú si está abierto
      if (menuShadow) {
        menuShadow.querySelector('#menu-height-range').value = preset.height;
        menuShadow.querySelector('#menu-height-val').textContent = preset.height;
        menuShadow.querySelector('#menu-bg-color').value = preset.bgColor;
        menuShadow.querySelector('#menu-fg-color').value = preset.fgColor;
        
        const rLayout = menuShadow.querySelector(`input[name="menu-layout-mode"][value="${preset.mode}"]`);
        if (rLayout) rLayout.checked = true;

        embedUrls = preset.embedUrls || [];
        renderMenuUrls();
      }
    });
  };

  // Sincronizar estados locales desde cambios externos de almacenamiento (ej: de presets)
  const syncSettingsOnStorageChange = (changes) => {
    if (changes.deadZoneHeight) currentHeight = changes.deadZoneHeight.newValue;
    if (changes.deadZoneMode) layoutMode = changes.deadZoneMode.newValue;
    if (changes.deadZoneBgColor) bgColor = changes.deadZoneBgColor.newValue;
    if (changes.deadZoneFgColor) fgColor = changes.deadZoneFgColor.newValue;
    if (changes.deadZoneActiveTab) activeTabId = changes.deadZoneActiveTab.newValue;
    if (changes.deadZoneEmbedUrls) embedUrls = changes.deadZoneEmbedUrls.newValue;
    if (changes.deadZonePresets) savedPresets = changes.deadZonePresets.newValue || [];
    if (changes.deadZoneAnchor) anchorPos = changes.deadZoneAnchor.newValue;
    if (changes.deadZoneActiveTab) {
      activeTabId = changes.deadZoneActiveTab.newValue;
      if (shadow) {
        shadow.querySelectorAll('.dz-tab').forEach(t => {
          if (t.getAttribute('data-target') === activeTabId) {
            t.classList.add('active');
          } else {
            t.classList.remove('active');
          }
        });
        const clockContainer = shadow.querySelector('.clock-container');
        if (activeTabId === 'clock') {
          if (clockContainer) clockContainer.style.display = 'flex';
          startClock(shadow.querySelector('.container'));
        } else {
          if (clockContainer) clockContainer.style.display = 'none';
          stopClock();
        }
        updateActiveIframe();
      }
    }

    // Sincronizar menú si estuviera abierto
    if (menuShadow) {
      if (changes.deadZoneAnchor) {
        const rAnchor = menuShadow.querySelector(`input[name="menu-anchor-pos"][value="${anchorPos}"]`);
        if (rAnchor) rAnchor.checked = true;
      }
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
      if (changes.deadZoneEmbedUrls) {
        renderMenuUrls();
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
      'deadZoneActiveTab',
      'deadZoneEmbedUrls',
      'deadZoneEmbedUrl',
      'deadZonePresets',
      'deadZoneAnchor'
    ], (res) => {
      if (res.deadZoneHeight !== undefined) currentHeight = res.deadZoneHeight;
      if (res.deadZoneMode !== undefined) layoutMode = res.deadZoneMode;
      if (res.deadZoneBgColor !== undefined) bgColor = res.deadZoneBgColor;
      if (res.deadZoneFgColor !== undefined) fgColor = res.deadZoneFgColor;
      if (res.deadZoneActiveTab !== undefined) activeTabId = res.deadZoneActiveTab;
      if (res.deadZoneAnchor !== undefined) anchorPos = res.deadZoneAnchor;
      
      // Migration from old deadZoneEmbedUrl
      if (res.deadZoneEmbedUrls !== undefined) {
        embedUrls = res.deadZoneEmbedUrls;
      } else if (res.deadZoneEmbedUrl) {
        embedUrls = [{ url: res.deadZoneEmbedUrl, title: new URL(res.deadZoneEmbedUrl).hostname }];
        chrome.storage.local.set({ deadZoneEmbedUrls: embedUrls, deadZoneActiveTab: res.deadZoneDisplayMode === 'iframe' ? 'url-0' : 'clock' });
      }
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
          changes.deadZonePresets || changes.deadZoneAnchor || changes.deadZoneActiveTab) {
        syncSettingsOnStorageChange(changes);
        changed = true;
      }

      if (changed) {
        updateLayout();
        updateMenuBounds();
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
      updateMenuBounds();
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
        if (shadow && activeTabId === 'clock' && !isMinimized) startClock(shadow.querySelector('.container'));
      }
    }
  });
})();
