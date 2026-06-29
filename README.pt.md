# Screen Dead Zone 🖥️🛡️

<table border="0">
  <tr>
    <td valign="top" width="340">
      <img src="thumbnail/thumbnail.png" alt="Screen Dead Zone" width="320" style="border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.35);">
    </td>
    <td valign="top">
      <h2 style="margin-top: 0; border-bottom: none;">Idiomas / Languages</h2>
      <p style="font-size: 13px; line-height: 1.5; margin-bottom: 15px;">
        Esta extensão está disponível em múltiplos idiomas. Selecione seu idioma para ler a documentação:
      </p>
      <ul style="line-height: 1.6; font-size: 14px;">
        <li><a href="README.md">Español 🇪🇸</a></li>
        <li><a href="README.en.md">English 🇬🇧</a></li>
        <li><strong>Português 🇵🇹 (Atual)</strong></li>
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
*   [✨ Principais Recursos](#-principais-recursos)
*   [📸 Capturas de Tela e Demonstração](#-capturas-de-tela-e-demonstração)
*   [🛡️ Permissões Requeridas](#-permissões-requeridas)
*   [🚀 Instalação](#-instalação)
*   [🔌 Compatibilidade com Iframes](#-compatibilidade-com-iframes)
*   [📁 Estrutura do Projeto](#-estrutura-do-projeto)
*   [🛡️ Licença](#-licença)

---

**Screen Dead Zone** é uma extensão de código aberto para o Chrome baseada no **Manifest V3**, projetada para reservar, isolar e limitar uma porção física da tela (zona morta), evitando que o navegador renderize ou exiba conteúdo abaixo dela e limitando a rolagem da página da web para a área selecionada.

É a ferramenta ideal para telas com pixels mortos nas bordas, monitores com molduras grossas ou para quem quer integrar widgets fixos (como relógios digitais) e dashboards em tempo real diretamente na navegação.

### 🌐 Suporte Multilíngue Nativo
A extensão está totalmente localizada e suporta **8 idiomas nativos** (inglês, espanhol, português, chinês simplificado, hindi, alemão, francês e japonês). A interface se adapta automaticamente ao idioma do navegador.

---

## ✨ Principais Recursos

*   **📐 Dimensões Dinâmicas:** Ajuste a área reservada de `0%` a `70%` da tela.
*   **📍 Âncora Multidirecional:** Fixe a zona morta em qualquer borda: **Topo**, **Base**, **Esquerda** ou **Direita**.
*   **🛠️ Dois Modos de Layout:**
    *   **Modo Redimensionar [Recomendado]:** Redimensiona o viewport (`html`) e impede a sobreposição de elementos fixos (`position: fixed;`).
    *   **Modo Espaçador:** Adiciona padding dinâmico na borda da página para permitir a rolagem.
*   **🔌 Compatibilidade com Iframes:** Embuta qualquer painel do Home Assistant ou feeds usando iframes.
*   **⚡ Carregamento Inteligente (Lazy Load & Destroy):** Abas inativas destroem os nós de iframe para reduzir o consumo de CPU, rede e RAM a 0%.
*   **⏳ Relógio Integrado:** Relógio digital de alta visibilidade e data.
*   **🎨 Personalização:** Ajuste cores de fundo/texto e salve presets.
*   **🍃 Minimizado Ágil:** Esconda a barra com um clique e restaure-a via botão flutuante.

---

## 📸 Capturas de Tela e Demonstração

Para ver a extensão em ação, aqui estão algumas capturas de tela e um caso de uso real:

<table border="0" width="100%">
  <tr>
    <td align="center" valign="top" width="50%">
      <b>1. Widget de Relógio Integrado</b><br><br>
      <img src="Screenshots/screenshot_clock.png" alt="Widget de Relógio" style="border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); max-width: 95%;">
    </td>
    <td align="center" valign="top" width="50%">
      <b>2. Integração com Iframe/Dashboard</b><br><br>
      <img src="Screenshots/screenshot_iframe.png" alt="Iframe" style="border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); max-width: 95%;">
    </td>
  </tr>
</table>

<br>
<p align="center">
  <b>3. Resultado no Mundo Real (IRL)</b><br>
  <img src="Screenshots/this.png" alt="Resultado IRL" width="600" style="border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
</p>

---

## 🛡️ Permissões Requeridas

Para funcionar de forma otimizada e segura sob o padrão **Manifest V3**, a extensão solicita:

1.  **`storage`:** Salvar e sincronizar seus presets, cores e anclagem locais.
2.  **`declarativeNetRequest` e `declarativeNetRequestWithHostAccess`:** Ignorar cabeçalhos de segurança restritivos (como `X-Frame-Options` ou `CSP`) nos iframes.
3.  **`host_permissions: ["<all_urls>"]`:** Injetar a barra nas abas desejadas e aplicar modificação de cabeçalhos.

---

## 🚀 Instalação

1.  Clone o repositório ou descompacte o `.zip`.
2.  Abra `chrome://extensions/` e ative o **"Modo de desenvolvedor"** no canto superior direito.
3.  Clique em **"Carregar descompactada"** e selecione a pasta raiz.

---

## 🔌 Compatibilidade com Iframes

O Screen Dead Zone permite carregar qualquer página diretamente dentro da zona morta usando iframes. Muito útil para:
*   Dashboards de domótica (como Home Assistant).
*   Calendários compartilhados e ferramentas de produtividade.
*   Câmeras locais e outros feeds.

---

## 🛡️ Licença

MIT License. Copyright (c) 2026.
