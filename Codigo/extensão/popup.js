chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.selector) {
        document.getElementById('selector').value = request.selector;
    }
});

document.getElementById('clearSelection').addEventListener('click', () => {
   chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
       chrome.scripting.executeScript({
           target: {tabId: tabs[0].id},
           func: () => {
              //Remover todos os elementos com a classe do hightlight
              const highlighted = document.querySelectorAll('.my-highlight-class');
              highlighted.forEach(el => el.classList.remove('my-highlight-class'));
           }
       });

   });
    document.getElementById('selector').value = "";
});


// Injeta o script ao abrir o popup (opcional, outra forma de injeção).
chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['content.js']
    });
});