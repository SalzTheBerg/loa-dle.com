document.getElementById("classicGuide").addEventListener("click", () => {
    let overlay = document.getElementById("classicOverlay");
    let classicGuideDiv = document.getElementById("classicGuideDiv");

    if (!overlay) {
        overlay = document.createElement("div");
        overlay.classList.add("overlay");
        overlay.setAttribute("id", "classicOverlay");
        document.body.appendChild(overlay);
    }

    if (!classicGuideDiv) {
        classicGuideDiv = document.createElement("div");
        classicGuideDiv.classList.add("infoDiv");
        classicGuideDiv.setAttribute("id", "classicGuideDiv");
        classicGuideDiv.style.textAlign = "left";

        classicGuideDiv.innerHTML = `
            <h2>How to play - Classic</h2>
            <button class="closeButton">✖</button>
            <hr class="underline">
            <p>Enter any Lost Ark character you know to begin.</p>
            <p>With every guess, you'll unlock more hints that help narrow it down.</p>
            <br>
            <p>A correct background means the attribute matches exactly.</p>
            <p>A partially correct background means it's partially correct (e.g. if the size is Giant but yellow the daily character is also a Giant but has another size attribute aswell).</p>
            <p>A wrong background means the guess was incorrect for that category.</p>
            <br>
            <p>The fewer guesses you need, the higher your score!</p>
            <p>You can also hover over the table category names for additional info about what they represent.</p>
        `;

        document.body.appendChild(classicGuideDiv);

        classicGuideDiv.querySelector(".closeButton").addEventListener("click", () => {
            classicGuideDiv.style.display = "none";
            overlay.style.display = "none";
        });

        overlay.addEventListener("click", () => {
            classicGuideDiv.style.display = "none";
            overlay.style.display = "none";
        });
    }

    classicGuideDiv.style.display = "block";
    overlay.style.display = "block";
});

document.getElementById("closeGuide").addEventListener("click", () => {
    document.getElementById("guide").style.display = "none";
    let guideButton = document.getElementById("guideButton");
    if (!guideButton) {
        guideButton = document.createElement("div");
        guideButton.classList.add("icon");
        guideButton.setAttribute("id", "guideButton")
        guideButton.style.position = "absolute";
        guideButton.style.bottom = "-35px";
        guideButton.style.right = "-30px";
        guideButton.innerHTML = '<img id="openClassicGuide" class="icon" src="../questionmark.webp" width="32px"  height="32px">'
        let gameContainer = document.getElementById("gameContainer");
        gameContainer.appendChild(guideButton);
        guideButton.addEventListener("click", () => {
            document.getElementById("guide").style.display = "block";
            guideButton.style.display = "none";
        });
    } else guideButton.style.display = "block";
});