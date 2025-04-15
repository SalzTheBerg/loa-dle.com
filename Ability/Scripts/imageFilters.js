import { today } from "/LOA-dle/Modules/utilConsts.js";
import { fnv1aHash } from "/LOA-dle/Modules/utilFunc.js";

const hash = fnv1aHash(today);
const rotationAngles = [90, 180, 270];
const dailyRotation = rotationAngles[hash % rotationAngles.length]

const toggleGrayscale = document.getElementById("toggleGrayscale")
const toggleRotation = document.getElementById("toggleRotation")

document.addEventListener("DOMContentLoaded", () => {
    const imageFilterOverlay = document.getElementById("imageFilterOverlay");
    const closeButton = document.querySelector(".closeButton");
    const button = document.querySelector("button");
  
    button.addEventListener("click", () => {
        imageFilterOverlay.style.display = "flex";
    });
  
    closeButton.addEventListener("click", () => {
        imageFilterOverlay.style.display = "none";
    });

    imageFilterOverlay.addEventListener("click", (e) => {
        if (e.target === imageFilterOverlay) {
            imageFilterOverlay.style.display = "none";
        }
    });
});

window.addEventListener("dailySkillImageReady", (e) => {
    const dailyImage = e.detail.img;

    if (toggleGrayscale.checked) {
        dailyImage.style.filter = "grayscale(100%)";
    }
    
    if (toggleRotation.checked) {
        dailyImage.style.transform = "rotate(" + dailyRotation + "deg)";
    }

    toggleGrayscale.addEventListener("change", (ev) => {
        dailyImage.style.filter = ev.target.checked ? "grayscale(100%)" : "none";
    });
    
    toggleRotation.addEventListener("change", (ev) => {
        dailyImage.style.transform = ev.target.checked ? "rotate(" + dailyRotation + "deg)" : "none";
    });
});
  