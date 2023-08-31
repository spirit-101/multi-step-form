"use strict";

const stepNumber = document.querySelectorAll(".sidebar__step-number");

const btnNext = document.querySelectorAll(".step__btn-next");
const btnBack = document.querySelectorAll(".step__btn-back");

const planContainer = document.querySelector(".step__plans");
const plans = document.querySelectorAll(".step__plans-plan");

const toggle = document.querySelector("#toggle");

const checkbox = document.querySelectorAll(".check");

const addonsContainer = document.querySelector(".step__addons");
const addon = document.querySelectorAll(".step__addons-box");

const planPrice = document.querySelectorAll(".steps__plans-plan-price");
const planBonus = document.querySelectorAll(".steps__plans-plan-bonus");
const planName = document.querySelector(".step__total-plan__name");

const stepForm = document.querySelector(".step__form");

const addonPrice = document.querySelectorAll(".step__addons-price");

const totalPrice = document.querySelector(".step__total-total__price");
const totalPlanPrice = document.querySelector(".step__total-plan__price");

const btnChange = document.querySelector(".btn__change");

const extrasBox = document.querySelectorAll(".step__total-extras__extra");
const extrasAddonPrice = document.querySelectorAll(
  ".step__total-extras__extra-price"
);

const btnConfirm = document.querySelector(".step__total-btn");

/////////////////////////////////////
// BUTTONS
let planChecked = false;
let planTotal;

document
  .querySelector(".step-number--0")
  .classList.add("sidebar__step--active");

// NEXT BUTTON
btnNext.forEach((btn) => {
  btn.addEventListener("click", function (e) {
    const btnNum = btn.dataset.btn;
    if (!btnNum || !stepForm.checkValidity()) return;
    if (btn.classList.contains("step__btn--plans") & !planChecked) return;

    document.querySelector(`.step--${btnNum}`).style.display = "none";
    document.querySelector(`.step--${+btnNum + 1}`).style.display = "block";

    stepNumber.forEach((step) =>
      step.classList.remove("sidebar__step--active")
    );

    document
      .querySelector(`.step-number--${btnNum}`)
      .classList.add("sidebar__step--active");
  });
});

// BACK BUTTON
btnBack.forEach((btn) => {
  btn.addEventListener("click", function () {
    const btnNum = btn.dataset.btn;
    if (!btnNum) return;
    document.querySelector(`.step--${btnNum}`).style.display = "none";
    document.querySelector(`.step--${+btnNum - 1}`).style.display = "block";

    stepNumber.forEach((step) =>
      step.classList.remove("sidebar__step--active")
    );

    document
      .querySelector(`.step-number--${btnNum - 2}`)
      .classList.add("sidebar__step--active");
  });
});

/////////////////////////////////////
// PLANS

let selectedPlanPrice;
let isYearly;

function updateTotal() {
  let total = parseFloat(selectedPlanPrice);

  if (isYearly) total *= 10;

  addonPrice.forEach((el) => {
    if (el.closest(".step__addons-box").classList.contains("addon--active")) {
      total += parseFloat(el.dataset.month) * (isYearly ? 10 : 1);
    }
  });

  totalPrice.textContent = `+$${total}/${isYearly ? "yr" : "mo"}`;
}

// TOGGLE
toggle.addEventListener("change", function () {
  if (this.checked) {
    this.value = "yearly";
    isYearly = true;
    planPrice.forEach((el) => {
      el.textContent = `$${+el.dataset.month * 10}/yr`;
    });

    planBonus.forEach((el) => (el.style.display = "block"));

    addonPrice.forEach((el, index) => {
      const addonPriceValue = el.dataset.month * 10;
      el.textContent = `+$${addonPriceValue}/yr`;
      extrasAddonPrice[index].textContent = `+$${addonPriceValue}/yr`;
    });
  }

  if (!this.checked) {
    this.value = "monthly";
    isYearly = false;
    planPrice.forEach((el) => {
      el.textContent = `$${(+el.dataset.month * 10) / 10}/mo`;
    });

    planBonus.forEach((el) => (el.style.display = "none"));

    addonPrice.forEach((el, index) => {
      const addonPriceValue = el.dataset.month;
      el.textContent = `+$${addonPriceValue}/mo`;
      extrasAddonPrice[index].textContent = `+$${addonPriceValue}/mo`;
    });
  }

  updateTotal();
});

// PLAN ACTIVE
planContainer.addEventListener("click", function (e) {
  const plan = e.target.closest(".step__plans-plan");
  if (!plan) return;

  plans.forEach((plan) => {
    plan.classList.remove("plan--active");
  });

  plan.classList.add("plan--active");
  planName.textContent = plan.querySelector("h2").textContent;
  planChecked = true;

  selectedPlanPrice = plan.dataset.price;

  totalPlanPrice.textContent = `$${
    isYearly ? selectedPlanPrice * 10 : selectedPlanPrice
  }/${isYearly ? "yr" : "mo"}`;

  updateTotal();
});

/////////////////////////////////////
// ADDONS
addonsContainer.addEventListener("click", function (e) {
  const addonBox = e.target.closest(".step__addons-box");
  if (!addonBox) return;
  const checkbox = addonBox.querySelector("#check");

  if (e.target === checkbox) {
    addonBox.classList.toggle("addon--active");
  } else {
    checkbox.checked = !checkbox.checked;
    addonBox.classList.toggle("addon--active");
    checkbox.dispatchEvent(new Event("change"));
  }

  updateTotal();
});

/////////////////////////////////////
// FORM
stepForm.addEventListener("submit", function (e) {
  e.preventDefault();
});

btnChange.addEventListener("click", function () {
  document.querySelector(`.step--2`).style.display = "block";
  document.querySelector(`.step--4`).style.display = "none";
});

checkbox.forEach((checkbox) => {
  checkbox.addEventListener("change", function (e) {
    updateTotal();
    const addonType = checkbox.closest(".step__addons-box").dataset.addon;
    if (this.checked) {
      console.log("Checked");
      document.querySelector(`.step__extra--${addonType}`).style.display =
        "flex";
    } else {
      document.querySelector(`.step__extra--${addonType}`).style.display =
        "none";
    }
  });
});

/////////////////////////////////////
// CONFIRM BUTTON
btnConfirm.addEventListener("click", function () {
  document.querySelector(".step--4").style.display = "none";
  document.querySelector(".step--complete").style.display = "grid";
});
