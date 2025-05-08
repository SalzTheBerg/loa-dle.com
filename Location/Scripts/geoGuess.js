import { getLocationSpecifications } from "./location.js";
import { createHeader, createParagraph } from "../../Modules/utilDOM.js";

const geoGuessMap = document.getElementById("geoGuessMap");
const geoGuessResponseMessage = document.getElementById("geoGuessResponseMessage");

let correctX;
let correctY;
let distanceConversion
let guessed = false;

geoGuessMap.addEventListener("mousedown", (e) => {
    if (guessed) {
        return;
    }
    const x = e.offsetX;
    const y = e.offsetY;

    let distance = Math.sqrt(Math.pow(correctX - x, 2) + Math.pow(correctY - y, 2));

    const marker = document.createElement("img");
    marker.src = "MapMarker.png";
    marker.style.position = "absolute";
    marker.style.width = "30px";
    marker.style.height = "30px";
    marker.style.objectFit = "contain";
    marker.style.left = `${correctX - 15}px`;
    marker.style.top = `${correctY - 28}px`;
    marker.classList.add("borderless");

    const click = document.createElement("img");
    click.src = "XMarker.png";
    click.style.position = "absolute";
    click.style.width = "30px";
    click.style.height = "30px"; 
    click.style.left = `${x - 15}px`;
    click.style.top = `${y - 15}px`;
    click.style.objectFit = "contain";
    click.classList.add("borderless");

    const canvas = document.createElement("canvas");
    canvas.width = geoGuessMap.offsetWidth;
    canvas.height = geoGuessMap.offsetHeight;
    canvas.style.position = "absolute";
    canvas.style.left = "0";
    canvas.style.top = "0";
    canvas.style.pointerEvents = "none";
    geoGuessMap.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    ctx.setLineDash([15, 8]);
    ctx.beginPath();
    ctx.moveTo(correctX, correctY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();

    geoGuessMap.appendChild(marker);
    geoGuessMap.appendChild(click);

    // Distance Conversion depending on Azena 16 kmh
    let distanceM = (distance * distanceConversion).toFixed(2);
    
    let disclaimer = "(Distance was approximated by an estimated character speed of 16 km/h (for 1400 swift) on each map so it might be a bit off)";
    let h2;
    let p;


    if (distance < 30) {
        h2 = 'Congratulations';
        p =  'You absolutely smurfed it with a distance of ' + distanceM + ' m !';
    } else if (distance < 100) {
        h2 = 'Nice';
        p = 'That counts, you were ' + distanceM + ' m away!';
    } else if (distance < 200) {
        h2 = 'Close';
        p = 'You were ' + distanceM + ' m away !';
    } else if (distance < 350) {
        h2 = 'Unlucky'
        p = 'You were ' + distanceM + ' m away, come back tomorrow for another chance!';
    } else {
        h2 = 'Whoops D:';
        p = 'You were ' + distanceM + ' m away, just pretend this never happened and try again tomorrow!';
    } 

    createHeader(h2, 2, geoGuessResponseMessage);
    createParagraph(p, geoGuessResponseMessage);
    createParagraph(disclaimer, geoGuessResponseMessage);

    //alert(x);
    //alert(y);
    //alert(distance);
    guessed = true;
});

export function geoGuessInitializer(dailyContinent, dailyArea, dailyLocationImage) {
    correctX = getLocationSpecifications()[dailyContinent][dailyArea][dailyLocationImage].correctX;
    correctY = getLocationSpecifications()[dailyContinent][dailyArea][dailyLocationImage].correctY;
    distanceConversion = getLocationSpecifications()[dailyContinent][dailyArea][dailyLocationImage].distanceConversion;
}