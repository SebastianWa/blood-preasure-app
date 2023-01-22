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
const section2FormDeleteBtn = document.querySelector("#sectio2FormDeteteBtn");

class Measurement {
  id;
  constructor(systolic, diastolic, puls, date, time, type, cssClass, id) {
    this.systolic = systolic;
    this.diastolic = diastolic;
    this.puls = puls;
    this.date = date;
    this.time = time;
    // this.id = id ? id : (Date.now() + "").slice(-10);
    this.type = type;
    this.cssClass = cssClass;
    this.id = id;

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

  setColor(color) {
    this.color = color;
    return this;
  }

  setType(type) {
    this.type = type;
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
    htmlMeasurement
      .querySelector(".measurement__pres")
      .classList.add(this.cssClass);
  }

  _deleteMeasurement() {
    const htmlMeasurement = document.querySelector(
      `.measurement[data-id="${this.id}"]`
    );

    htmlMeasurement.remove();
  }

  _renderMeasurement() {
    const html = `
        <li class="measurement" data-id="${this.id}">
            <div class="measurement__pres ${this.cssClass}">
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
  activeObjIndex;
  sysRanges = [
    [0, 90, "Niedociśnienie", "measurement--0"],
    [91, 120, "Normalne", "measurement--1"],
    [121, 140, "Wysokie Prawidłowe", "measurement--2"],
    [141, 160, "Nadciśnienie tętnicze 1", "measurement--3"],
    [161, 220, "Nadciśnienie tętnicze 2", "measurement--4"],
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
        obj.type,
        obj.cssClass,
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

    navBtnCnt.addEventListener("click", (e) => {
      this._changeTab(e);
    });

    measurementsCnt.addEventListener(
      "click",
      this._activeEditMeasurement.bind(this)
    );

    // section2FormClose action (move to another method)
    section2FormCloseBtn.addEventListener("click", (e) => {
      this._closeForm2(e);
    });

    section2form.addEventListener("submit", (e) => {
      this._editMeasurement(e);
    });

    section2FormDeleteBtn.addEventListener("click", (e) => {
      this._deleteMeasurementFromArray(e);
    });
  }

  _changeTab(e) {
    e.preventDefault();
    this.clicked = e.target.closest(".btn--nav");
    if (!this.clicked) return;

    document
      .querySelectorAll(".btn--nav")
      .forEach((btn) => btn.classList.remove("btn--nav--active"));

    this.clicked.classList.add("btn--nav--active");

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
    const type = this.sysRanges[this.#curentMeasurementDataSet][2];
    const cssClass = this.sysRanges[this.#curentMeasurementDataSet][3];
    const id = (Date.now() + "").slice(-10);

    const measurement = new Measurement(
      systolic,
      diastolic,
      puls,
      data,
      time,
      type,
      cssClass,
      id
    );

    //save  measument in array
    this.#measurements.push(measurement);

    //save measument in local storage
    this._setLocalStorage();

    this._clearInputs();

    //active and deactive popup 'Add!'
    formPopup.classList.add("form__popup--active");
    setTimeout(() => formPopup.classList.remove("form__popup--active"), 1500);

    this.#curentMeasurementDataSet = 1;
    this._setTableAndGraph();
  }

  // check what type of pressure type user
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

  // set  type of measurement in table and graph
  _setPressure() {
    const sys = +inputSystolic.value;
    const dia = +inputDiastolic.value;
    this._checkPressure(sys, dia);
    this._setTableAndGraph();
  }

  _closeForm2() {
    document
      .querySelector(".section2__form")
      .classList.remove("section2__form--active");
  }

  _findMeasurementInArray(id) {
    return this.#measurements.findIndex((e) => e.id === id);
  }

  _updateMeasurementInArray(activeObj) {
    this.#measurements[this.activeObjIndex] = activeObj;
    this._setLocalStorage();
  }

  _editMeasurement(e) {
    e.preventDefault();
    const activeObj = this.#measurements[this.activeObjIndex];
    this._checkPressure(
      section2Systolic.valueAsNumber,
      section2Diastolic.valueAsNumber
    );

    activeObj
      .setCurentMeasurementDataSet(this.#curentMeasurementDataSet)
      .setSys(section2Systolic.valueAsNumber)
      .setDia(section2Diastolic.valueAsNumber)
      .setType(this.sysRanges[this.#curentMeasurementDataSet][2])
      .setColor(this.sysRanges[this.#curentMeasurementDataSet][3])
      .updateMeasurement();

    this._updateMeasurementInArray(activeObj);

    this._closeForm2(e);
  }

  _deleteMeasurementFromArray(e) {
    e.preventDefault();

    const activeObj = this.#measurements[this.activeObjIndex];
    activeObj._deleteMeasurement();
    this.#measurements.splice(this.activeObjIndex, 1);
    this._setLocalStorage();
    this._closeForm2();
  }

  _activeEditMeasurement(e) {
    this.activeObjIndex = this._findMeasurementInArray(
      e.target.closest(".measurement").dataset.id
    );

    const activeObj = this.#measurements[this.activeObjIndex];
    if (!activeObj) return;

    const section2Form = document.querySelector(".section2__form");
    section2Form.classList.add("section2__form--active");

    section2Systolic.value = activeObj.systolic;
    section2Diastolic.value = activeObj.diastolic;
  }
}

const app = new App();
