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
const section2form = document.querySelector(".form2");
const section2FormCloseBtn = document.querySelector("#Form2CloseBtn");
const section2Systolic = document.querySelector("#form2Systolic");
const section2Diastolic = document.querySelector("#form2Diastolic");
const section2FormDeleteBtn = document.querySelector("#Form2DeteteBtn");
const selectMenu = document.querySelector(".section2__select");

console.log(moment);
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

    this.htmlMeasurement = document.querySelector(
      `.measurement[data-id="${this.id}"]`
    );
  }

  createDataString() {
    return `${this.date}, ${this.time} | ${this.puls} bpm`;
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
    // const htmlMeasurement = document.querySelector(
    //   `.measurement[data-id="${this.id}"]`
    // );
    this.htmlMeasurement.querySelector(".measurement__sys").textContent =
      this.systolic;
    this.htmlMeasurement.querySelector(".measurement__diat").textContent =
      this.diastolic;
    this.htmlMeasurement.querySelector(".measurement__type").textContent =
      this.type;
    this.htmlMeasurement
      .querySelector(".measurement__pres")
      .classList.add(this.cssClass);
  }

  _deleteMeasurement() {
    this.htmlMeasurement.remove();
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

  hideMeasurement() {
    this.htmlMeasurement.classList.add("measurement--hidden");
  }

  showMeasurement() {
    this.htmlMeasurement.classList.remove("measurement--hidden");
  }
}

class App {
  measurements = [];
  curentMeasurementDataSet = 1;
  clicked;

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
    this._eventListenersInit();
  }

  _setLocalStorage() {
    localStorage.setItem("measurements", JSON.stringify(this.measurements));
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
      this.measurements.push(meas);
    });
  }

  _eventListenersInit() {
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
        `span[data-pre="${this.curentMeasurementDataSet}"]`
      ),
      "pressure-name--active"
    );

    removeClassesFrom(
      document.querySelectorAll(".chart__part"),
      "chart__part--active"
    );
    addClassToElem(
      document.querySelector(`.chart__part--${this.curentMeasurementDataSet}`),
      "chart__part--active"
    );

    //set active text to explain  measumerent

    removeClassesFrom(
      document.querySelectorAll(".chart__text"),
      "chart__text--active"
    );
    addClassToElem(
      document.querySelector(
        `div[data-text="${this.curentMeasurementDataSet}"]`
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
    const type = this.sysRanges[this.curentMeasurementDataSet][2];
    const cssClass = this.sysRanges[this.curentMeasurementDataSet][3];
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
    this.measurements.push(measurement);

    //save measument in local storage
    this._setLocalStorage();

    this._clearInputs();

    //active and deactive popup 'Add!'
    formPopup.classList.add("form__popup--active");
    setTimeout(() => formPopup.classList.remove("form__popup--active"), 1500);

    this.curentMeasurementDataSet = 1;
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
    this.curentMeasurementDataSet = sysIndex > diasIndex ? sysIndex : diasIndex;
  }

  // set  type of measurement in table and graph
  _setPressure() {
    const sys = +inputSystolic.value;
    const dia = +inputDiastolic.value;
    this._checkPressure(sys, dia);
    this._setTableAndGraph();
  }

  _renderAll() {
    this.measurements.forEach((obj) => {
      obj.showMeasurement();
    });
  }
}

class History extends App {
  chartType;
  activeObjIndex;
  constructor() {
    super();
    this._eventHistoryListenersInit();
    this._createGraph();
    this._calcAverage();
    this._initDatePicker();
  }

  _eventHistoryListenersInit() {
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

    selectMenu.addEventListener("change", (e) => {
      this._sortMeasurements(e.target.value);
    });

    measumentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this._updateGraph();
    });

    $("#reportrange").on("show.daterangepicker", () => {});

    $("#reportrange").on("apply.daterangepicker", (ev, picker) => {
      if (picker.chosenLabel === "Cały zakres") {
        this._renderAll();
        this._resetDataPicker();
        return;
      }
      this._sortMeasurementsByDate(
        picker.startDate.format("YYYY-MM-DD"),
        picker.endDate.format("YYYY-MM-DD")
      );
    });
  }

  _closeForm2() {
    document.querySelector(".modal").close();
  }

  _findMeasurementInArray(id) {
    return this.measurements.findIndex((e) => e.id === id);
  }

  _updateMeasurementInArray(activeObj) {
    this.measurements[this.activeObjIndex] = activeObj;
    this._setLocalStorage();
  }

  _editMeasurement(e) {
    e.preventDefault();
    const activeObj = this.measurements[this.activeObjIndex];
    this._checkPressure(
      section2Systolic.valueAsNumber,
      section2Diastolic.valueAsNumber
    );

    activeObj
      .setCurentMeasurementDataSet(this.curentMeasurementDataSet)
      .setSys(section2Systolic.valueAsNumber)
      .setDia(section2Diastolic.valueAsNumber)
      .setType(this.sysRanges[this.curentMeasurementDataSet][2])
      .setColor(this.sysRanges[this.curentMeasurementDataSet][3])
      .updateMeasurement();

    this._updateMeasurementInArray(activeObj);

    this._closeForm2(e);
    this._updateGraph();
  }

  _deleteMeasurementFromArray(e) {
    e.preventDefault();

    const activeObj = this.measurements[this.activeObjIndex];
    activeObj._deleteMeasurement();
    this.measurements.splice(this.activeObjIndex, 1);
    this._setLocalStorage();
    this._closeForm2();
    this._updateGraph();
  }

  _activeEditMeasurement(e) {
    this.activeObjIndex = this._findMeasurementInArray(
      e.target.closest(".measurement").dataset.id
    );

    const activeObj = this.measurements[this.activeObjIndex];
    if (!activeObj) return;

    document.querySelector("#modal").showModal();

    document.querySelector(".form2_details").textContent =
      activeObj.createDataString();
    //console.log(querySelector(".form2_details").textContent);
    section2Systolic.value = activeObj.systolic;
    section2Diastolic.value = activeObj.diastolic;
  }
  //graph
  _createDataForGraph() {
    const reduceHelper = (type) => {
      return (pre, curr) => (pre += 1 ? curr.type === type : 0);
    };

    return [
      this.measurements.reduce(reduceHelper("Niedociśnienie"), 0),
      this.measurements.reduce(reduceHelper("Normalne"), 0),
      this.measurements.reduce(reduceHelper("Wysokie Prawidłowe"), 0),
      this.measurements.reduce(reduceHelper("Nadciśnienie tętnicze 1"), 0),
      this.measurements.reduce(reduceHelper("Nadciśnienie tętnicze 2"), 0),
    ];
  }

  _updateGraph() {
    const newData = this._createDataForGraph();
    this.chartType.data.datasets[0].data = newData;
    this.chartType.update();
  }

  _createGraph() {
    const yValues = this._createDataForGraph();

    const ctx = document.getElementById("chartsOfMeaTypes");

    const data = {
      labels: [
        "Niedociśnienie",
        "Normalne",
        "Wysokie",
        "Nadciśnienie 1",
        "Nadciśnienie 2",
      ],
      datasets: [
        {
          label: "Pomiary",
          data: yValues,
          backgroundColor: [
            "#00b9cf",
            "#00c567",
            "#86c328",
            "#f59f02",
            "#e24200",
          ],
        },
      ],
    };

    const config = {
      type: "bar",
      data,
      options: {
        maintainAspectRatio: false,
        responsive: true,
        animation: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
          x: {
            display: true,
            ticks: {
              font: {
                size: 12,
              },
            },
          },
        },
        title: {
          display: true,
          text: "Pomiary",
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
        },
      },
    };
    this.chartType = new Chart(ctx, config);
  }
  //average
  _calcAverage() {
    if (!this.measurements) return;

    const length = this.measurements.length;

    const sysAverage =
      this.measurements.reduce((pre, curr) => (pre += curr.systolic), 0) /
      length;

    const diaAverage =
      this.measurements.reduce((pre, curr) => (pre += curr.diastolic), 0) /
      length;

    const pulsAverage =
      this.measurements.reduce((pre, curr) => (pre += curr.puls), 0) / length;

    console.log(sysAverage, diaAverage, pulsAverage);
  }
  _renderAverage() {}

  _resetTypeInput() {
    document.querySelector(".section2__select").value = "Cały zakres";
  }

  _resetDataPicker() {
    $("#reportrange span").text("Cały zakres");
  }
  //sort
  _sortMeasurements(typeOfMeas) {
    console.log("wyzwlacz");
    this._renderAll();
    this._resetDataPicker();
    if (typeOfMeas === "Cały zakres") {
      this._renderAll();
      return;
    }

    const arrayToHide = this.measurements.filter(
      (mea) => mea.type !== typeOfMeas
    );

    if (arrayToHide.length === this.measurements.length) return;

    arrayToHide.forEach((obj) => {
      obj.hideMeasurement();
    });
  }

  _sortMeasurementsByDate(startDate, endDate) {
    this._resetTypeInput();
    this._renderAll();
    const arrayToHide = this.measurements.filter((obj) => {
      return !(
        new Date(startDate).getTime() <= new Date(obj.date).getTime() &&
        new Date(endDate).getTime() >= new Date(obj.date).getTime()
      );
    });

    arrayToHide.forEach((obj) => {
      obj.hideMeasurement();
    });
    console.log(arrayToHide);
  }
  //date range picker

  _initDatePicker() {
    $("#reportrange").daterangepicker(
      {
        ranges: {
          Dzisiaj: [moment(), moment()],
          Wczoraj: [moment().subtract(1, "days"), moment().subtract(1, "days")],
          "Ostatnie 7 dni": [moment().subtract(6, "days"), moment()],
          "Ostatnie 30 dni": [moment().subtract(29, "days"), moment()],
          "Ten miesiąc": [moment().startOf("month"), moment().endOf("month")],
          "Poprzedni miesiąc": [
            moment().subtract(1, "month").startOf("month"),
            moment().subtract(1, "month").endOf("month"),
          ],
          "Cały zakres": [moment().subtract(6, "days"), moment()],
        },
        locale: {
          format: "MM/DD/YYYY",
          separator: " - ",
          applyLabel: "Zatwierdź",
          cancelLabel: "Anuluj",
          fromLabel: "Od",
          toLabel: "Do",
          customRangeLabel: "Własny",
          weekLabel: "w",
          daysOfWeek: ["Nie", "Po", "Wt", "Sr", "Czw", "Pia", "Sob"],
          monthNames: [
            "Styczeń",
            "Luty",
            "Marzec",
            "Kwiecień",
            "Maj",
            "Czerwiec",
            "Lipiec",
            "Sierpień",
            "Wrzesień",
            "Październik",
            "Listopad",
            "Grudzień",
          ],
          firstDay: 1,
        },
        startDate: `${new Intl.DateTimeFormat("en-US").format(
          Date.now() - 172800000 // two days in mil seconds
        )}`,
        maxDate: `${new Intl.DateTimeFormat("en-US").format(Date.now())}`,
      },
      function (start, end, label) {
        $("#reportrange span").html(
          start.format("DD/MM/YYYY") + " - " + end.format("DD/MM/YYYY")
        );
      }
    );
  }
}

const app = new History();
