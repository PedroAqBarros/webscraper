--- START OF FILE popup.js ---
```javascript
document.addEventListener('DOMContentLoaded', () => {
    // Solicita o seletor atual ao content script quando o popup é aberto
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "getSelector" }, function(response) {
            if (response && response.selector) {
                document.getElementById('selector').value = response.selector;
            }
        });
    });

    document.getElementById('clearSelection').addEventListener('click', () => {
        document.getElementById('selector').value = '';
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "clearSelection" });
        });
    });

    document.getElementById('startSelection').addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "startSelection" });
        });
    });
});


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "selectorUpdated") {
        document.getElementById('selector').value = request.selector;
    }
});