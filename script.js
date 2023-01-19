const measurementBtn = document.querySelector("#meassubmit");
const measumentForm = document.querySelector("#measument-form");
const measurementsCnt = document.querySelector("#measurements-cnt");
const inputSystolic = document.querySelector("#input-systolic");
const inputDiastolic = document.querySelector("#input-diastolic");
const inputPuls = document.querySelector("#input-puls");
const inputData = document.querySelector("#input-date");
const inputTime = document.querySelector("#input-time");
const formPopup = document.querySelector(".form__popup");
const navBtnCnt = document.querySelector(".nav");
const section2form = document.querySelector(".section2__form");
const section2FormCloseBtn = document.querySelector("#sectio2FormCloseBtn");
const section2Systolic = document.querySelector("#section2Systolic");
const section2Diastolic = document.querySelector("#section2Diastolic");

class Measurement {
  id;
  constructor(
    systolic,
    diastolic,
    puls,
    date,
    time,
    curentMeasurementDataSet,
    id
  ) {
    this.systolic = systolic;
    this.diastolic = diastolic;
    this.puls = puls;
    this.date = date;
    this.time = time;
    // this.id = id ? id : (Date.now() + "").slice(-10);
    this.curentMeasurementDataSet = curentMeasurementDataSet;
    this.id = id;

    this._setmeasurementType();
    this._renderMeasurement();
  }

  setCurentMeasurementDataSet(curentMeasurementDataSet) {
    this.curentMeasurementDataSet = curentMeasurementDataSet;
    return this;
  }

  setSys(systolic) {
    this.systolic = systolic;
    return this;
  }

  setDia(diastolic) {
    this.diastolic = diastolic;
    return this;
  }

  _setmeasurementType() {
    switch (this.curentMeasurementDataSet) {
      case 0:
        this.type = "Niedociśnienie";
        break;
      case 1:
        this.type = "Normalne";
        break;
      case 2:
        this.type = "Wysokie Prawidłowe";
        break;
      case 3:
        this.type = "Nadciśnienie tętnicze 1";
        break;
      case 4:
        this.type = "Nadciśnienie tętnicze 2";
        break;

      default:
        break;
    }
    return this;
  }

  updateMeasurement() {
    const htmlMeasurement = document.querySelector(
      `.measurement[data-id="${this.id}"]`
    );

    htmlMeasurement.querySelector(".measurement__sys").textContent =
      this.systolic;
    htmlMeasurement.querySelector(".measurement__diat").textContent =
      this.diastolic;
    htmlMeasurement.querySelector(".measurement__type").textContent = this.type;
  }

  _renderMeasurement() {
    let html = `
        <li class="measurement" data-id="${this.id}">
            <div class="measurement__pres">
              <p class="measurement__sys">${this.systolic}</p>
              <p class="measurement__diat">${this.diastolic}</p>
            </div>
            <div class="measurement__desc">
              <p class="measurement__type">${this.type}</p>
              <span class="measurement__date">${this.date}</span
              ><span class="measurement__time">${this.time}</span
              ><span class="measurement__puls">${this.puls}</span>
            </div>
          </li>
      `;
    measurementsCnt.insertAdjacentHTML("afterbegin", html);
  }
}

class App {
  #measurements = [];
  #curentMeasurementDataSet = 1;
  clicked;
  sysRanges = [
    [0, 90],
    [91, 120],
    [121, 140],
    [141, 160],
    [161, 220],
  ];
  diasRanges = [
    [0, 60],
    [61, 80],
    [81, 90],
    [91, 100],
    [101, 160],
  ];

  constructor() {
    this._getLocalStorage();
    this._setInputsDateParams();
    this._evenListenersInit();
    //event listeners
  }

  _setLocalStorage() {
    localStorage.setItem("measurements", JSON.stringify(this.#measurements));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("measurements"));

    if (!data) return;

    data.forEach((obj) => {
      const meas = new Measurement(
        obj.systolic,
        obj.diastolic,
        obj.puls,
        obj.date,
        obj.time,
        obj.curentMeasurementDataSet,
        obj.id
      );
      this.#measurements.push(meas);
    });
  }

  _evenListenersInit() {
    measumentForm.addEventListener("submit", (e) => {
      this._submitMeasurement(e);
    });

    inputSystolic.addEventListener("input", (e) => {
      this._setPressure();
    });
    inputDiastolic.addEventListener("input", (e) => {
      this._setPressure();
    });

    measurementsCnt.addEventListener("click", (e) => {
      this._activeEditMeasurement(e);
    });

    // section2FormClose action (move to another method)
    section2FormCloseBtn.addEventListener("click", (e) => {
      this._closeForm2(e);
    });

    navBtnCnt.addEventListener("click", (e) => {
      this._changeTab(e);
    });
  }

  _changeTab(e) {
    e.preventDefault();
    this.clicked = e.target.closest(".btn--nav");
    if (!this.clicked) return;

    document
      .querySelectorAll(".section")
      .forEach((btn) => btn.classList.remove("section--active"));

    document
      .querySelector(`.section--${this.clicked.dataset.tab}`)
      .classList.add("section--active");
  }

  //aps INIT
  _setInputsDateParams() {
    const date = new Intl.DateTimeFormat("pl-PL", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .format(Date.now())
      .split(".")
      .reverse()
      .join("-");

    const time = new Intl.DateTimeFormat("pl-PL", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(Date.now());

    inputData.setAttribute("value", date);
    inputData.setAttribute("max", date);
    inputTime.setAttribute("value", time);

    // set graph to default postion
    document
      .querySelector(".chart__part--1 ")
      .classList.add("chart__part--active");
  }

  _setTableAndGraph() {
    const removeClassesFrom = (elem, cssClass) => {
      elem.forEach((e) => e.classList.remove(cssClass));
    };

    const addClassToElem = (elem, cssClass) => {
      elem.classList.add(cssClass);
    };

    //set active pressure type in table
    removeClassesFrom(
      document.querySelectorAll(".pressure-name"),
      "pressure-name--active"
    );
    addClassToElem(
      document.querySelector(
        `span[data-pre="${this.#curentMeasurementDataSet}"]`
      ),
      "pressure-name--active"
    );

    removeClassesFrom(
      document.querySelectorAll(".chart__part"),
      "chart__part--active"
    );
    addClassToElem(
      document.querySelector(`.chart__part--${this.#curentMeasurementDataSet}`),
      "chart__part--active"
    );

    //set active text to explain  measumerent

    removeClassesFrom(
      document.querySelectorAll(".chart__text"),
      "chart__text--active"
    );
    addClassToElem(
      document.querySelector(
        `div[data-text="${this.#curentMeasurementDataSet}"]`
      ),
      "chart__text--active"
    );
  }

  _clearInputs() {
    this._setInputsDateParams();

    inputSystolic.value = "120";
    inputDiastolic.value = "80";
    inputPuls.value = "60";
    this._setTableAndGraph();
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
    const id = (Date.now() + "").slice(-10);

    const measurement = new Measurement(
      systolic,
      diastolic,
      puls,
      data,
      time,
      this.#curentMeasurementDataSet,
      id
    );

    //save  measument in array
    this.#measurements.push(measurement);

    //save measument in local storage
    this._setLocalStorage();

    // //render measument in list
    // this._renderMeasurement(measurement);

    this._clearInputs();

    //active and deactive popup 'Add!'
    formPopup.classList.add("form__popup--active");
    setTimeout(() => formPopup.classList.remove("form__popup--active"), 1500);

    this.#curentMeasurementDataSet = 2;
    this._setTableAndGraph();
  }

  _checkPressure(sys, dia) {
    if (sys > 220 || sys < 0 || dia < 0 || dia > 160) return;

    const findIndexHelper = (elem, type) => {
      if (type >= elem[0] && type <= elem[1]) return true;
    };

    const sysIndex = this.sysRanges.findIndex((elem) =>
      findIndexHelper(elem, sys)
    );
    const diasIndex = this.diasRanges.findIndex((elem) =>
      findIndexHelper(elem, dia)
    );
    this.#curentMeasurementDataSet =
      sysIndex > diasIndex ? sysIndex : diasIndex;
  }

  _setPressure() {
    const sys = +inputSystolic.value;
    const dia = +inputDiastolic.value;
    this._checkPressure(sys, dia);
    this._setTableAndGraph();
  }

  _closeForm2(e) {
    e.preventDefault();
    document
      .querySelector(".section2__form")
      .classList.remove("section2__form--active");
  }

  _updateMeasurementInArray(activeObj) {
    // const indexOfObj = this.#measurements.findIndex(
    //   (e) => e.id === activeObj.id
    // );
    this.#measurements[
      this.#measurements.findIndex((e) => e.id === activeObj.id)
    ] = activeObj;
    this._setLocalStorage();
  }

  _activeEditMeasurement(e) {
    const activeObj = this.#measurements.find(
      (el) => el.id === e.target.closest(".measurement").dataset.id
    );
    if (!activeObj) return;

    const section2Form = document.querySelector(".section2__form");
    section2Form.classList.add("section2__form--active");

    section2Systolic.value = activeObj.systolic;
    section2Diastolic.value = activeObj.diastolic;

    section2form.addEventListener("submit", (e) => {
      this._editMeasurement(e, activeObj);
    });
  }

  _editMeasurement(e, activeObj) {
    e.preventDefault();
    this._checkPressure(
      section2Systolic.valueAsNumber,
      section2Diastolic.valueAsNumber
    );

    activeObj
      .setCurentMeasurementDataSet(this.#curentMeasurementDataSet)
      ._setmeasurementType()
      .setSys(section2Systolic.valueAsNumber)
      .setDia(section2Diastolic.valueAsNumber)
      .updateMeasurement();

    this._updateMeasurementInArray(activeObj);

    this._closeForm2(e);
  }
}

const app = new App();
