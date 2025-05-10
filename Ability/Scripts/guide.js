document.getElementById("openAbilityGuide").addEventListener("click", () => {
    let overlay = document.getElementById("abilityOverlay")
    let abilityGuideDiv = document.getElementById("abilityGuideDiv");

    if (!overlay) {
        overlay = document.createElement("div");
        overlay.classList.add("overlay");
        overlay.setAttribute("id", "abilityOverlay");
        document.body.appendChild(overlay);
    }

    if (!abilityGuideDiv) {
        abilityGuideDiv = document.createElement("div");
        abilityGuideDiv.classList.add("infoDiv");
        abilityGuideDiv.setAttribute("id", "abilityGuideDiv");
        abilityGuideDiv.style.textAlign = "left";
        abilityGuideDiv.style.maxWidth = "600px";

        abilityGuideDiv.innerHTML = `
            <h2>How to play - Ability</h2>
            <button class="closeButton">✖</button>
            <hr class="underline">
            <p>In Ability Mode, you need to guess the class and skill name based on the provided image.</p>
            <p>Use the Difficulty Button to adjust the image settings. You can toggle between:</p>
            <ul>
                <li>Grayscale: Switch off the grayscale to see the image in full color.</li>
                <li>Rotation: Turn off rotation to keep the image still, making it easier to guess.</li>
            </ul>
            <p><strong>Good luck!</strong></p>
        `;

        document.body.appendChild(abilityGuideDiv);

        abilityGuideDiv.querySelector(".closeButton").addEventListener("click", () => {
            abilityGuideDiv.style.display = "none";
            overlay.style.display = "none";
        });

        overlay.addEventListener("click", () => {
            abilityGuideDiv.style.display = "none";
            overlay.style.display = "none";
        });
    }

    abilityGuideDiv.style.display = "block";
    overlay.style.display = "block";
});