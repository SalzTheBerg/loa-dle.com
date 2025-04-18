// Creates a paragraph and appends it to the appendTo value
export function createParagraph(text, appendTo, className = '') {
    const p = document.createElement('p');
    p.textContent = text;
    if (className) p.className = className;
    appendTo.appendChild(p);
}

// Creates a header of the desired level and appends it to the appendTo value
export function createHeader(text, level = 1, appendTo, className = '') {
    const header = document.createElement(`h${level}`);
    header.textContent = text;
    if (className) header.className = className;
    appendTo.appendChild(header);
}