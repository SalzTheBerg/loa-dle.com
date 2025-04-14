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