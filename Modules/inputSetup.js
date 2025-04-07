import { handleInput, handleKeydown, handleMouseover } from './input.js';

// Sets up the event listeners click, keydown, input and mouseover events
export function setupInput({
    inputField,
    submitButton,
    suggestionsContainer,
    readFunction,
    getAvailableAnswers,
    includesQuery = false,
    path = '',
    focusState
}) {
    // Submit button listener
    submitButton.addEventListener("click", readFunction);

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
        path
    }));

    // Mouseover for disabling focus state
    suggestionsContainer.addEventListener("mouseover", handleMouseover({
        focusState: focusState
    }));
    
}
