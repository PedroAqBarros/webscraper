// No início do content.js
const style = document.createElement('style');
style.textContent = `
  .my-highlight-class {
    border: 2px solid red !important;
    background-color: yellow !important;
    /* Adicione outros estilos de realce aqui */
  }
`;
document.head.appendChild(style);

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