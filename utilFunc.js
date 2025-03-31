//expects the input field, the array of answers, the correct answer as parameter
export function manageInput (inputContent, availableAnswers, correctAnswer, focusActive, currentFocus, includesQuery, callback) {
    const guessTable = document.getElementById("guess_table");
    const suggestionsContainer = document.getElementById("suggestions");
    suggestionsContainer.innerHTML = '';

    let query = inputContent.value.toLowerCase();

    let suggestions = availableAnswers.filter(name => name.toLowerCase().startsWith(query));
    if (includesQuery) {
        suggestions = availableAnswers.filter(name => name.toLowerCase().includes(query));
    }

    alert(availableAnswers);

    if (suggestions.length > 0) {
        if (focusActive) {
            inputContent.value = suggestions[currentFocus];
        } else {
            inputContent.value = suggestions[0];
        }
    }

    for (let i = 0; i < availableAnswers.length; i++) {
        let answer = availableAnswers[i];
        if (inputContent.value.toLowerCase() === answer.toLowerCase()) {
            if (guessTable.style.display === "none") {
                guessTable.style.display = "table";
            }
            callback(i);
            break;
        }
    }

    if (focusActive) {
        removeItem(availableAnswers, suggestions[currentFocus]);
        focusActive = false;    //maybe this doesnt work
    }else {
        removeItem(availableAnswers, suggestions[0]);
    }

    inputContent.value = "";
    inputContent.focus();
}

//function to remove an item out of an array input(array, itemToRemove) output nothing
export function removeItem(array, itemToRemove) {
    const index = array.indexOf(itemToRemove);

    if (index !== -1) {
        array.splice(index, 1);
    }
}