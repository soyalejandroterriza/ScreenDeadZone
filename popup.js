document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  const warning = document.getElementById('warning');

  // 1. Obtener la pestaña activa actual en la ventana actual
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    
    if (!activeTab || !activeTab.id) {
      showWarning();
      return;
    }

    // Intentar comunicar con el content script de la pestaña para abrir el panel fullscreen
    chrome.tabs.sendMessage(activeTab.id, { type: "OPEN_FULLSCREEN_MENU" }, (response) => {
      // Si se recibe respuesta exitosa del content script, cerramos el popup de inmediato
      if (chrome.runtime.lastError || !response || !response.success) {
        showWarning();
      } else {
        window.close();
      }
    });
  });

  function showWarning() {
    loader.style.display = 'none';
    warning.style.display = 'flex';
  }
});
