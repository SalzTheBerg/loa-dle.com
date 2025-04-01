//returns the autocompleted input as a string
export function autocompleteInput ({
    inputContent,
    availableAnswers,
    focusActive,
    currentFocus = 0,
    includesQuery = false
}) {

    /*const suggestionsContainer = document.getElementById("suggestions");
    suggestionsContainer.innerHTML = '';*/

    let query = inputContent.value.toLowerCase();

    let suggestions = availableAnswers.filter(name => name.toLowerCase().startsWith(query));
    if (includesQuery) {
        suggestions = availableAnswers.filter(name => name.toLowerCase().includes(query));
    }

    alert(availableAnswers);

    if (suggestions.length > 0) {
        if (focusActive) {
            return suggestions[currentFocus];
        } else {
            return suggestions[0];
        }
    }
    return query;
}

//calls the callback and returns true if the autocomplete is part of availableAnswers - returns false elsewise
export function checkInput ({
    availableAnswers,
    input,
    guessTable,
    callback
}) {
    for (let i = 0; i < availableAnswers.length; i++) {
        let answer = availableAnswers[i];
        if (input.toLowerCase() === answer.toLowerCase()) {
            if (guessTable.style.display === "none") {
                guessTable.style.display = "table";
            }
            callback(i);
            return true;
        }
    }
    return false;
}

//void function to remove an item out of an array input(array, itemToRemove)
export function removeItem(array, itemToRemove) {
    const index = array.indexOf(itemToRemove);

    if (index !== -1) {
        array.splice(index, 1);
    }
}