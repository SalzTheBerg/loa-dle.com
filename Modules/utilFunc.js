//returns the autocompleted input as a string
export function autocompleteInput ({
    inputContent,
    availableAnswers,
    focusState,
    includesQuery = false,
    suggestionsContainer
}) {
    suggestionsContainer.innerHTML = '';

    let query = inputContent.value.toLowerCase();

    let suggestions = filterSuggestions({
        query: query,
        availableAnswers: availableAnswers,
        includesQuery: includesQuery
    })

    if (suggestions.length > 0) {
        if (focusState.focusActive) {
            return suggestions[focusState.currentFocus];
        } else {
            return suggestions[0];
        }
    }
    return query;
}

//calls the callback if the autocomplete is part of availableAnswers
export function checkInput ({
    availableAnswers,
    input,
    guessTable,
    callback,
    focusState
}) {
    for (let i = 0; i < availableAnswers.length; i++) {
        let answer = availableAnswers[i];
        if (input.toLowerCase() === answer.toLowerCase()) {
            if (guessTable.style.display === "none") {
                guessTable.style.display = "table";
            }
            callback(i);
            if (focusState.focusActive) {
                removeItem(availableAnswers, input);
                focusState.focusActive = false;
            }else {
                removeItem(availableAnswers, input);
            }
        }
    }
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

//void function to disable input and enable response after correct input
export function correctGuess (inputContainer, responseContainer) {
    inputContainer.style.display = "none";
    responseContainer.style.display = "block";

    responseContainer.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

//hashes the input by fnv1a hashing
export function fnv1aHash(input) {
    let hash = 0x811c9dc5;
    for (let i = 0; i < input.length; i++) {
        hash ^= input.charCodeAt(i);
        hash = Math.imul(hash, 0x01000193);
    }
    return hash >>> 0;
}