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

    let suggestions = filterSuggestions({
        query: query,
        availableAnswers: availableAnswers,
        includesQuery: includesQuery
    })

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


//returnes filtered suggestions based on input by starts with or includes filter
export function filterSuggestions ({
    query,
    availableAnswers,
    includesQuery = false
}) {
    let lowerQuery = query.toLowerCase();

    let filterMethod = includesQuery ? (name) => name.toLowerCase().includes(lowerQuery) : (name) => name.toLowerCase().startsWith(lowerQuery);
    return availableAnswers.filter(filterMethod);
}

//void function to remove an item out of an array input(array, itemToRemove)
export function removeItem(array, itemToRemove) {
    const index = array.indexOf(itemToRemove);

    if (index !== -1) {
        array.splice(index, 1);
    }
}