export const correctColor = "rgb(96, 220, 0)";
export const partialMatchColor = "rgb(221, 199, 0)";
export const wrongColor = "rgb(238, 42, 0)";

export const suggestionsBorder = "2px solid rgb(255, 202, 87)";

const todayMEZ = new Date().toLocaleDateString('de-DE', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
export const today = todayMEZ.split('.').reverse().join('-');

export const focusState = {
    focusActive: false,
    currentFocus: 0
}

export const arrowUp = `
<svg class="arrowIcon" fill="#000000" width="800px" height="800px" viewBox="0 0 20 20">
  <path d="M10 2.5l7.5 7.5H14v7H6v-7H2.5L10 2.5z"/>
</svg>`;

export const arrowDown = `
<svg class="arrowIcon" fill="#000000" width="800px" height="800px" viewBox="0 0 20 20">
<path d="M2.5 10H6V3h8v7h3.5L10 17.5 2.5 10z"/>
</svg>`;