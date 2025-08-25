const sliderValue = document.querySelector("#slider-value");
const slider = document.querySelector("#slider");
sliderValue.textContent = slider.value;
slider.addEventListener("input", (event) => {
    sliderValue.textContent = event.target.value;
});