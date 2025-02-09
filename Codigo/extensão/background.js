--- START OF FILE background.js ---
```javascript
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "scrape") {
        chrome.scripting.executeScript({
            target: { tabId: sender.tab.id },
            files: ['content.js']
        }).then(() => {
            chrome.tabs.sendMessage(sender.tab.id, { action: "scrapeData", selector: request.selector }, (response) => {
                if (chrome.runtime?.id) { // Verificação antes de sendResponse
                    if (response && response.data) {
                        sendResponse({ data: response.data });
                    } else if (response && response.error) {
                        sendResponse({ error: response.error });
                    } else {
                        sendResponse({ error: "Resposta vazia do content script." });
                    }
                }
            });
        }).catch(error => {
            if (chrome.runtime?.id) { //Verificação.
                sendResponse({ error: "Erro ao injetar script: " + error });
            }
        });
        return true; // Resposta assíncrona
    } else if (request.selector) {
        //Se tiver outra lógica relacionada ao seletor que deva ir no background.
        // sendResponse, return true, etc.

    }
});


chrome.runtime.onInstalled.addListener(() => {
    chrome.scripting.insertCSS({
        target: { allFrames: true, tabId: -1 }, // -1 significa todas as abas
        css: `.my-highlight-class {
                border: 2px solid red !important;
                background-color: yellow !important;
            }`
    });
});