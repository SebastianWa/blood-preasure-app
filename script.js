const measurementBtn = document.querySelector("#meassubmit");
const measumentForm = document.querySelector("#measument-form");
const measurementsCnt = document.querySelector("#measurements-cnt");
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
    this._getLocalStorage();

    measumentForm.addEventListener("submit", (e) => {
      this._submitMeasurement(e);
    });
  }

  _setLocalStorage() {
    localStorage.setItem("measurements", JSON.stringify(this.#measurements));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("measurements"));

    if (!data) return;

    this.#measurements = data;

    this.#measurements.forEach((me) => this._renderMeasurement(me));
  }

  _renderMeasurement(measument) {
    let html = `
        <li class="measurement" data-id="">
            <div class="measurement__pres">
              <p class="measurement__sys">${measument.systolic}</p>
              <p class="measurement__diat">${measument.diastolic}</p>
            </div>
            <div class="measurement__desc">
              <p class="measurement__type">prehystension</p>
              <span class="measurement__date">${measument.date}</span
              ><span class="measurement__time">${measument.time}</span
              ><span class="measurement__puls">${measument.puls}</span>
            </div>
          </li>
      `;
    measurementsCnt.insertAdjacentHTML("afterbegin", html);
  }

  //event listeners
  _submitMeasurement(e) {
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

    //save measument in local storage
    this._setLocalStorage();

    //render measument in list
    this._renderMeasurement(measurement);
  }
}

//  test = new Measurement();
// console.log(test);
const app = new App();
