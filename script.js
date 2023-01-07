const measuSubmit = document.querySelector("#meassubmit");

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

class app {}

const test = new Measurement();
console.log(test);
