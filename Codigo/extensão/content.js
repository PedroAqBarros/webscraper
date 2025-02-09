--- START OF FILE content.js ---
```javascript
let selectedElement = null;
let originalBorder = null;
let originalBackgroundColor = null;

function getSelector(element) {
    if (!element) {
        return null;
    }

    let selector = '';
    if (element.nodeType === Node.ELEMENT_NODE) {
        selector = element.tagName.toLowerCase();
    } else {
        return null; // Or ''
    }

    if (element.id) {
        return '#' + element.id;
    }

    if (element.classList.length > 0) {
        selector += '.' + Array.from(element.classList).join('.');
    }

    let siblings = Array.from(element.parentNode.children);
    if (siblings.filter(el => el.tagName.toLowerCase() === selector).length > 1) {
        let index = siblings.indexOf(element) + 1;
        selector += ':nth-child(' + index + ')';
    }


    if (element.parentNode && element.parentNode !== document.body) {
        return getSelector(element.parentNode) + " > " + selector;
    }

    return selector;
}

function highlightElement(element) {
    if (element) {
        originalBorder = element.style.border;
        originalBackgroundColor = element.style.backgroundColor;
        element.classList.add('my-highlight-class');
    }
}

function removeHighlight(element) {
    if (element) {
        element.classList.remove('my-highlight-class');
        element.style.border = originalBorder || '';
        element.style.backgroundColor = originalBackgroundColor || '';
        originalBorder = null;
        originalBackgroundColor = null;
    }
}


function handleClick(event) {
    event.preventDefault();
    event.stopPropagation();

    if (selectedElement) {
        removeHighlight(selectedElement);
    }

    selectedElement = event.target;
    highlightElement(selectedElement);

    const selector = getSelector(selectedElement);
    chrome.runtime.sendMessage({ action: "selectorUpdated", selector: selector });
    document.removeEventListener('click', handleClick, true); // Remove listener after selection
    return false;
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "startSelection") {
        document.addEventListener('click', handleClick, true); // Capture phase to intercept clicks early
        sendResponse({ message: "Seleção iniciada" });
    } else if (request.action === "clearSelection") {
        if (selectedElement) {
            removeHighlight(selectedElement);
            selectedElement = null;
            chrome.runtime.sendMessage({ action: "selectorUpdated", selector: "" });
        }
        sendResponse({ message: "Seleção limpa" });
    } else if (request.action === "scrapeData") {
        let data = [];
        try {
            const elements = document.querySelectorAll(request.selector);
            if (elements.length > 0) {
                elements.forEach(el => {
                    data.push(el.textContent.trim()); //textContent to get text, trim to remove extra spaces
                });
                sendResponse({ data: data });
            } else {
                sendResponse({ error: "Nenhum elemento encontrado com o seletor: " + request.selector });
            }

        } catch (e) {
            sendResponse({ error: "Erro ao executar querySelectorAll: " + e.message });
        }
    }
    return true; // Keep the messaging channel open for sendResponse
});