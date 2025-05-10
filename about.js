document.getElementById("info").addEventListener("click", () => {
    let overlay = document.querySelector(".overlay");
    let infoDiv = document.getElementById("aboutDiv");

    if (!overlay) {
        overlay = document.createElement("div");
        overlay.classList.add("overlay");
        document.body.appendChild(overlay);
    }

    if (!infoDiv) {
        infoDiv = document.createElement("div");
        infoDiv.classList.add("infoDiv");
        infoDiv.setAttribute("id", "aboutDiv");
        infoDiv.innerHTML = `
            <h2>About</h2>
            <button class="closeButton">✖</button>
            <hr class="underline">
            <p>Guess a new Lost Ark character every day – across three unique game modes: <strong>Classic</strong>, <strong>Ability</strong>, and <strong>Location</strong>. This site is not affiliated with or endorsed by Amazon Games or Smilegate RPG. It was created under Amazon’s 
                <a href="https://www.amazon.com/gp/help/customer/display.html?nodeId=GNX7GA7HXVL9V8XZ&pop-up=1&ref=d6k_applink_bb_dls&dplnkId=918af686-541f-4591-86b1-8274ec899788&dplnkId=ca5876ce-64a6-4bdc-a374-f2501c47bfbc" target="_blank" rel="noopener noreferrer">Content Usage Policy</a></p>
            <br>
            <h2>Privacy Policy</h2>
            <hr class="underline">
            <p>This website does not collect, store, or transmit any personal data. No information is sent to the server apart from what is technically required to load the page.</p>
            <br>
            <h2>Contact</h2>
            <hr class="underline">
            <p>For questions, bug reports, or anything else, you can reach me via Discord – just add @salztheberg.</p>
        `;

        document.body.appendChild(infoDiv);

        infoDiv.querySelector(".closeButton").addEventListener("click", () => {
            infoDiv.style.display = "none";
            overlay.style.display = "none";
        });

        overlay.addEventListener("click", () => {
            infoDiv.style.display = "none";
            overlay.style.display = "none";
        });
    }

    infoDiv.style.display = "block";
    overlay.style.display = "block";
});