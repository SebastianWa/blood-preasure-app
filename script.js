const measurementBtn = document.querySelector("#meassubmit");
const measumentForm = document.querySelector("#measument-form");
const inputSystolic = document.querySelector("#input-systolic");
const inputDiastolic = document.querySelector("#input-diastolic");
const inputPuls = document.querySelector("#input-puls");
const inputData = document.querySelector("#input-date");
const inputTime = document.querySelector("#input-time");

const navBtnCnt = document.querySelector(".nav");
let clicked;
navBtnCnt.addEventListener("click", (e) => {
  e.preventDefault();
  clicked = e.target.closest(".btn--nav");
  if (!clicked) return;
  console.log(clicked);

  document
    .querySelectorAll(".section")
    .forEach((btn) => btn.classList.remove("section--active"));

  document
    .querySelector(`.section--${clicked.dataset.tab}`)
    .classList.add("section--active");
});

class Measurement {
  id = (Date.now() + "").slice(-10);

  constructor(systolic, diastolic, puls, date, time) {
    this.systolic = systolic;
    this.diastolic = diastolic;
    this.puls = puls;
    this.date = date;
    this.time = time;
  }
}

class App {
  #measurements = [];
  constructor() {
    measumentForm.addEventListener("submit", (e) => {
      this.submitMeasurement(e);
    });
  }

  //event listeners
  submitMeasurement(e) {
    e.preventDefault();

    //get inputs data
    const systolic = +inputSystolic.value;
    const diastolic = +inputDiastolic.value;
    const puls = +inputPuls.value;
    const data = inputData.value;
    const time = inputTime.value;

    const measurement = new Measurement(systolic, diastolic, puls, data, time);

    //save  measument in array
    this.#measurements.push(measurement);
    console.log(this.#measurements);
  }
}

//  test = new Measurement();
// console.log(test);
const app = new App();
