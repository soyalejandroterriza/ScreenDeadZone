// Enviar mensaje a todas las pestañas de una ventana específica
const broadcastToWindow = (windowId, state) => {
  chrome.tabs.query({ windowId: windowId }, (tabs) => {
    if (chrome.runtime.lastError || !tabs) return;
    
    tabs.forEach((tab) => {
      chrome.tabs.sendMessage(tab.id, { type: "TAB_STATE_CHANGED", state: state }, () => {
        // Ignorar errores de pestañas sin content script inyectado (ej. chrome://)
        const err = chrome.runtime.lastError;
      });
    });
  });
};

// Obtener el estado de una ventana desde storage.session (para sobrevivir a la suspensión del service worker)
const getWindowState = (windowId, callback) => {
  chrome.storage.session.get([`win_${windowId}`], (res) => {
    const state = res[`win_${windowId}`] || { isEnabled: false };
    callback(state);
  });
};

// Guardar el estado de una ventana en storage.session
const setWindowState = (windowId, state, callback) => {
  const data = {};
  data[`win_${windowId}`] = state;
  chrome.storage.session.set(data, () => {
    if (callback) callback();
  });
};

// Limpiar el estado cuando se cierra una ventana
chrome.windows.onRemoved.addListener((windowId) => {
  chrome.storage.session.remove([`win_${windowId}`]);
});



// Escuchar mensajes de los scripts de contenido y del popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Resolver el ID de ventana del emisor de forma segura y asíncrona
  const resolveWindow = (callback) => {
    if (sender.tab) {
      // A veces sender.tab.windowId es -1 durante la carga inicial del tab (document_start)
      if (sender.tab.windowId && sender.tab.windowId !== -1) {
        callback(sender.tab.windowId);
      } else {
        // Buscar el windowId real de la pestaña usando su ID
        chrome.tabs.get(sender.tab.id, (tab) => {
          if (chrome.runtime.lastError || !tab) {
            callback(-1);
          } else {
            callback(tab.windowId);
          }
        });
      }
    } else {
      callback(message.windowId || -1);
    }
  };

  resolveWindow((windowId) => {
    if (windowId === -1) {
      sendResponse({ error: "No window ID found" });
      return;
    }

    if (message.type === "GET_TAB_STATE") {
      getWindowState(windowId, (state) => {
        sendResponse(state);
      });
    } 
    
    else if (message.type === "TOGGLE_TAB_STATE") {
      getWindowState(windowId, (currentState) => {
        const newState = { ...currentState, isEnabled: !currentState.isEnabled };
        setWindowState(windowId, newState, () => {
          broadcastToWindow(windowId, newState);
          sendResponse(newState);
        });
      });
    } 
    
    else if (message.type === "SET_TAB_STATE") {
      const newState = { isEnabled: message.isEnabled };
      setWindowState(windowId, newState, () => {
        broadcastToWindow(windowId, newState);
        sendResponse(newState);
      });
    }
  });

  return true; // Mantiene el canal de respuesta abierto de forma asíncrona
});
