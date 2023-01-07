const measurementBtn = document.querySelector("#meassubmit");
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
    measurementBtn.addEventListener(
      "submit",
      this.submitMeasurement.bind(this)
    );
  }

  //event listeners
  submitMeasurement(e) {
    e.preventDefault();
    console.log(e);

    //get inputs data
  }
}

const test = new Measurement();
console.log(test);
const app = new App();
