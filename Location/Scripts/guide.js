document.getElementById("openLocationGuide").addEventListener("click", () => {
    let overlay = document.getElementById("locationOverlay")
    let locationGuideDiv = document.getElementById("locationGuideDiv");

    if (!overlay) {
        overlay = document.createElement("div");
        overlay.classList.add("overlay");
        overlay.setAttribute("id", "locationOverlay");
        document.body.appendChild(overlay);
    }

    if (!locationGuideDiv) {
        locationGuideDiv = document.createElement("div");
        locationGuideDiv.classList.add("infoDiv");
        locationGuideDiv.setAttribute("id", "locationGuideDiv");
        locationGuideDiv.style.textAlign = "left";

        locationGuideDiv.innerHTML = `
            <h2>How to play - Location</h2>
            <button class="closeButton">✖</button>
            <hr class="underline">
            <p>In Location Mode, your first goal is to guess the continent shown in the screenshot.</p>
            <p>It might seem difficult at first, but with each guess, the image will zoom out to help you!</p>
            <p>Once you've guessed the continent, the full image will be revealed, and you will need to guess the area where the screenshot was taken.</p>
            <p>Finally, you can click on the map to indicate where you think the image was taken (see the example image below).</p>
            <img src="exampleGuess.png" style="border: 1px solid rgb(255, 202, 87); border-radius: 5px;">
            <p><strong>Good luck!</strong></p>
        `;

        document.body.appendChild(locationGuideDiv);

        locationGuideDiv.querySelector(".closeButton").addEventListener("click", () => {
            locationGuideDiv.style.display = "none";
            overlay.style.display = "none";
        });

        overlay.addEventListener("click", () => {
            locationGuideDiv.style.display = "none";
            overlay.style.display = "none";
        });
    }

    locationGuideDiv.style.display = "block";
    overlay.style.display = "block";
});

window.addEventListener("load", () => {
  if (!localStorage.getItem("geoguessGuide")) {
    let geoguessGuide = document.getElementById("geoguessGuide");
    geoguessGuide.style.display = "flex";
    geoguessGuide.querySelector(".closeButton").addEventListener("click", () => {
            geoguessGuide.style.display = "none";
            localStorage.setItem("geoguessGuide", "true");
    });
  }
});