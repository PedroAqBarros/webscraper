console.log("Background script iniciado!");

function injectHighlightCSS(tabId, tabUrl) { // Agora a função também recebe tabUrl
    if (tabUrl && tabUrl.startsWith('chrome://')) { // Verificação de URL chrome://
        console.log(`Ignorando injeção de CSS na aba ${tabId} porque é uma URL chrome://.`);
        return; // Não injeta CSS em URLs chrome://
    }

    console.log(`Injetando CSS de destaque na aba ${tabId}...`);
    chrome.scripting.insertCSS({
        target: { tabId: tabId, allFrames: true },
        css: `.my-highlight-class {
                border: 2px solid red !important;
                background-color: yellow !important;
            }`
    }).then(() => {
        console.log(`CSS de destaque injetado com sucesso na aba ${tabId}.`);
    }).catch(error => {
        console.error(`Erro ao injetar CSS na aba ${tabId}:`, error);
    });
}

// Injetar CSS quando a extensão for instalada ou atualizada (pela primeira vez em abas existentes)
chrome.runtime.onInstalled.addListener(() => {
    console.log("Extensão instalada ou atualizada. Injetando CSS em abas existentes...");
    chrome.tabs.query({}, tabs => { // Obtém todas as abas existentes
        tabs.forEach(tab => {
            injectHighlightCSS(tab.id, tab.url); // Passa tab.url para a função
        });
    });
});

// Injetar CSS sempre que uma aba for atualizada para 'completo' (incluindo novas abas)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        console.log(`Aba ${tabId} atualizada para 'completo'. Injetando CSS...`);
        injectHighlightCSS(tabId, tab.url); // Passa tab.url para a função
    }
});