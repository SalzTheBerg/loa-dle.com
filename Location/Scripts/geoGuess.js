import { getLocationSpecifications } from "./location.js";

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

    //alert(x);
    //alert(y);

    let distance = Math.floor(Math.sqrt(Math.pow(correctX - x, 2) + Math.pow(correctY - y, 2)));

    const marker = document.createElement("img");
    marker.src = "MapMarker.png";
    marker.style.position = "absolute";
    marker.style.width = "30px";
    marker.style.height = "30px";
    marker.style.objectFit = "contain";
    marker.style.left = `${correctX - 15}px`;
    marker.style.top = `${correctY - 28}px`;

    const click = document.createElement("img");
    click.src = "XMarker.png";
    click.style.position = "absolute";
    click.style.width = "30px";
    click.style.height = "30px"; 
    click.style.left = `${x - 15}px`;
    click.style.top = `${y - 15}px`;
    click.style.objectFit = "contain";

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

    // Distance Conversion depending on Azena 12 kmh
    let distanceM = Math.floor(distance * distanceConversion);

    //alert(distance);
    
    let disclaimer = "<br><p>Distance was approximated by an estimated character speed of 12 km/h on each map so it might be a bit off</p>";
    
    if (distance < 30) {
        geoGuessResponseMessage.innerHTML = '<h2>Congratulations</h2><p>You absolutely smurfed it with a distance of ' + distanceM + ' m !</p>' + disclaimer;
    } else if (distance < 200) {
        geoGuessResponseMessage.innerHTML = '<h2>Close</h2><p>You were ' + distanceM + ' m away !</p>' + disclaimer;
    } else if (distance < 400) {
        geoGuessResponseMessage.innerHTML = '<h2>Unlucky</h2><p>You were ' + distanceM + ' m away !</p><br><p>Come back tomorrow for another chance</p>' + disclaimer;
    } else geoGuessResponseMessage.innerHTML = '<h2>Whoops D:</h2><p>You were ' + distanceM + ' m away !</p><br><p>Lets pretend this never happened and try again tomorrow!</p>' + disclaimer;

    guessed = true;
});

export function geoGuessInitializer(dailyContinent, dailyArea, dailyLocationImage) {
    correctX = getLocationSpecifications()[dailyContinent][dailyArea][dailyLocationImage].correctX;
    correctY = getLocationSpecifications()[dailyContinent][dailyArea][dailyLocationImage].correctY;
    distanceConversion = getLocationSpecifications()[dailyContinent][dailyArea][dailyLocationImage].distanceConversion;
}