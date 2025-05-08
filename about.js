document.getElementById("info").addEventListener("click", () => {
    let infoDiv = document.getElementById("infoDiv");

    if (!infoDiv) {
        // Erstellt das Info-Fenster nur einmal
        infoDiv = document.createElement("div");
        infoDiv.id = "infoDiv";

        // Inhalt inkl. Close-Button
        infoDiv.innerHTML = `
            <button class="closeButton" style="position: absolute; top: 5px; right: 5px;">✖</button>
            <h2>About</h2>
            Guess a new Lost Ark character every day – across three unique game modes: <strong>Classic</strong>, <strong>Ability</strong>, and <strong>Location</strong>.<br>
            This site is not affiliated with or endorsed by Amazon Games or Smilegate RPG. It was created under Amazon’s 
            <a href="https://www.amazon.com/gp/help/customer/display.html?nodeId=GNX7GA7HXVL9V8XZ&pop-up=1&ref=d6k_applink_bb_dls&dplnkId=918af686-541f-4591-86b1-8274ec899788&dplnkId=ca5876ce-64a6-4bdc-a374-f2501c47bfbc" 
               target="_blank" rel="noopener noreferrer">Content Usage Policy</a>.<br><br>
            <h2>Privacy Policy</h2>
            This website does not collect, store, or transmit any personal data. No information is sent to the server apart from what is technically required to load the page.<br><br>
            <h2>Contact</h2>
            For questions, bug reports, or anything else, you can reach me via Discord – just add @salztheberg.
        `;

        document.body.appendChild(infoDiv);

        // Event Listener für Close-Button
        infoDiv.querySelector(".closeButton").addEventListener("click", () => {
            infoDiv.style.display = "none";
        });
    }

    // Element einblenden
    infoDiv.style.display = "block";
});