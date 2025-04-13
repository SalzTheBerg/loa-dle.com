import { handleInput, handleKeydown, handleMouseover } from './input.js';

// Sets up the event listeners click, keydown, input and mouseover events
export function setupInput({
    inputField,
    submitButton = false,
    suggestionsContainer,
    readFunction,
    getAvailableAnswers,
    includesQuery = false,
    path = '',
    focusState,
    suggestAlways = false
}) {
    // Submit button listener
    if (submitButton !== false) {
        submitButton.addEventListener("click", readFunction);
    }

    // Enter and arrow keys listener
    inputField.addEventListener("keydown", handleKeydown({
        inputFunction: readFunction,
        focusState: focusState
    }));

    // Normal Input listener + suggestions
    inputField.addEventListener("input", handleInput({
        availableAnswers: getAvailableAnswers,
        includesQuery,
        suggestionsContainer,
        inputContent: inputField,
        callback: readFunction,
        path,
        suggestAlways: suggestAlways
    }));

    // Mouseover for disabling focus state
    suggestionsContainer.addEventListener("mouseover", handleMouseover({
        focusState: focusState
    }));
    
}
