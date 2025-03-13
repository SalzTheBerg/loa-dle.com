var abilityList = [];
var availableClasses = [];
var classList = [];
const rotationAngles = [90, 180, 270];
const dailyRotation = rotationAngles[Math.floor(Math.random()*rotationAngles.length)];

fetch("abilityList.json")
    .then(response => response.json())
    .then(data => {
        abilityList = data;
        availableClasses = Object.keys(data);
        classList = Object.keys(data);
        availableClasses.sort();
        console.log(abilityList);
        console.log(classList);

        loadImg();
    })
    .catch(error => console.error("Error loading character data:", error));

function loadImg() {
    const dailyClass = classList[Math.floor(Math.random()*classList.length)];
    const dailySkill = abilityList[dailyClass].abilities[Math.floor(Math.random()*abilityList[dailyClass].abilities.length)];

    var guessImage = document.getElementById("guess_image");
    guessImage.innerHTML = '<img src="Abilities/' + dailyClass + '/' + dailySkill + '.webp">';
    guessImage.style.filter = "grayscale(100%)"
    guessImage.style.transform = "rotate(" + dailyRotation + "deg)";
};

document.getElementById("grayscale_checkbox").addEventListener("change", function() {
    const grayscaleCheckbox = document.getElementById("grayscale_checkbox");
    var guessImage = document.getElementById("guess_image");

    if (grayscaleCheckbox.checked) {
        guessImage.style.filter = "grayscale(100%)"
    } else {
        guessImage.style.filter = "grayscale(0%)"
    }
});

document.getElementById("rotation_checkbox").addEventListener("change", function() {
    const grayscaleCheckbox = document.getElementById("rotation_checkbox");
    var guessImage = document.getElementById("guess_image");

    if (grayscaleCheckbox.checked) {
        guessImage.style.transform = "rotate(" + dailyRotation + "deg)";
    } else {
        guessImage.style.transform = "rotate(" + 0 + "deg)";
    }
});