// Declare variables

// Sidebar

const sidebarStep1 = document.getElementById("sidebar-step-1");
const sidebarStep2 = document.getElementById("sidebar-step-2");
const sidebarStep3 = document.getElementById("sidebar-step-3");
const sidebarStep4 = document.getElementById("sidebar-step-4");
const sidebarSteps = [1, 2, 3, 4];
let currentSidebarStep = 0;

// Form Steps

const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const step3 = document.getElementById("step3");
const step4 = document.getElementById("step4");
const step5 = document.getElementById("step5");
const steps = [1, 2, 3, 4, 5];
let currentStep = 0;

// Buttons

const nextBtn = document.getElementById("button-next");
const backBtn = document.getElementById("button-back");

// Step 1
// input validation

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const nameWarning = document.getElementById("warning-name");
const emailWarning = document.getElementById("warning-email");
const phoneWarning = document.getElementById("warning-phone");

// Step 2

const billingToggle = document.getElementById("billing-toggle");
const priceArcade = document.getElementById("price-arcade");
const priceAdvanced = document.getElementById("price-advanced");
const pricePro = document.getElementById("price-pro");
const switchMonthly = document.getElementById("switch-monthly");
const switchYearly = document.getElementById("switch-yearly");
const planOffer = document.querySelectorAll(".plan-offer");

// Step 3

const addOnlinePrice = document.getElementById("add-price-os");
const addStoragePrice = document.getElementById("add-price-ls");
const addProfilePrice = document.getElementById("add-price-cp");
const addItems = document.querySelectorAll(".add-item");

// Step 4

const selectionAddOnline = document.getElementById("selections-os");
const selectionAddStorage = document.getElementById("selections-ls");
const selectionAddProfile = document.getElementById("selections-cp");
const selectionOnlineEl = document.getElementById("selections-os-price");
const selectionStorageEl = document.getElementById("selections-ls-price");
const selectionProfileEl = document.getElementById("selections-cp-price");

// Functions

// update class assignments to steps

function updateStepClasses() {
  for (let i = 0; i < steps.length; i++) {
    const stepElement = document.getElementById(`step${steps[i]}`);
    stepElement.classList.remove("form-step-active");
  }

  if (currentSidebarStep <= 4) {
    for (let i = 0; i < sidebarSteps.length; i++) {
      const sidebarStepElement = document.getElementById(
        `sidebar-step-${sidebarSteps[i]}`
      );
      sidebarStepElement.classList.remove("sidebar-active");
    }
  }

  const currentStepElement = document.getElementById(`step${currentStep}`);
  currentStepElement.classList.add("form-step-active");

  const currentSidebarStepElement = document.getElementById(
    `sidebar-step-${currentSidebarStep}`
  );
  if (currentSidebarStep <= 4) {
    currentSidebarStepElement.classList.add("sidebar-active");
  }
  if (currentStep > 1 && currentStep < 4) {
    nextBtn.textContent = "Next Step";
    backBtn.classList.add("button-clear-active");
  } else if (currentStep === 4) {
    nextBtn.textContent = "Confirm";
  } else if (currentStep === 5) {
    nextBtn.textContent = "Close";
    backBtn.classList.remove("button-clear-active");
  } else {
    backBtn.classList.remove("button-clear-active");
  }
}

// Validate Step 1

function validateInputStep1() {
  // Clear previous error styles and messages
  nameWarning.style.display = "none";
  nameInput.classList.remove("input-invalid");
  emailWarning.style.display = "none";
  emailInput.classList.remove("input-invalid");
  phoneWarning.style.display = "none";
  phoneInput.classList.remove("input-invalid");

  //Setting form as valid for baseline
  let step1Valid = true;

  // checking name, email and phone individually - resulting in error messages where neccesary
  if (nameInput.value.trim() === "") {
    nameWarning.style.display = "block";
    nameInput.classList.add("input-invalid");
    step1Valid = false;
  }

  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!emailPattern.test(emailInput.value)) {
    emailWarning.style.display = "block";
    emailInput.classList.add("input-invalid");
    step1Valid = false;
  }

  const phonePattern = /^\d{9,15}$/;
  if (!phonePattern.test(phoneInput.value)) {
    phoneWarning.style.display = "block";
    phoneInput.classList.add("input-invalid");
    step1Valid = false;
  }

  // returning validity of the form to continue to next step if applicable

  return step1Valid;
}

// Step 2

// Billing time toggle

let isMonthly = true;
updateBilling();
setAddOnPrice();

billingToggle.addEventListener("change", function () {
  isMonthly = !isMonthly;
  updateBilling();
  getPriceAndPlan();
  setAddOnPrice();
  updateTotalPrice();
  // show offer on toggle
  planOffer.forEach(function (offer) {
    if (isMonthly) {
      offer.style.visibility = "hidden";
    } else {
      offer.style.visibility = "visible";
    }
  });
});

function updateBilling() {
  if (isMonthly) {
    priceArcade.textContent = "$9/mo";
    priceAdvanced.textContent = "$12/mo";
    pricePro.textContent = "$15/mo";
    switchMonthly.classList.add("plan-time-active");
    switchYearly.classList.remove("plan-time-active");
  } else {
    priceArcade.textContent = "$90/yr";
    priceAdvanced.textContent = "$120/yr";
    pricePro.textContent = "$150/yr";
    switchMonthly.classList.remove("plan-time-active");
    switchYearly.classList.add("plan-time-active");
  }
}

// Validation

let userPickPlan = "advanced";
let userPickPrice = 12;

const planItems = document.querySelectorAll(".plan-item");

planItems.forEach(function (planItem) {
  planItem.addEventListener("click", function () {
    planItems.forEach(function (item) {
      item.classList.remove("plan-item-active");
    });

    userPickPlan = planItem.getAttribute("data-plan-value");
    planItem.classList.add("plan-item-active");

    getPriceAndPlan();

    console.log(userPickPlan);
  });
});

function getMonthlyPrice(selectedPlan) {
  if (selectedPlan === "arcade") {
    return 9;
  } else if (selectedPlan === "advanced") {
    return 12;
  } else if (selectedPlan === "pro") {
    return 15;
  } else {
    console.log("There has been an error retrieving the monthly price");
    return 0;
  }
}
function getYearlyPrice(selectedPlan) {
  if (selectedPlan === "arcade") {
    return 90;
  } else if (selectedPlan === "advanced") {
    return 120;
  } else if (selectedPlan === "pro") {
    return 150;
  } else {
    console.log("There has been an error retrieving the yearly price");
    return 0;
  }
}

function getPriceAndPlan() {
  userPickPrice = isMonthly
    ? getMonthlyPrice(userPickPlan)
    : getYearlyPrice(userPickPlan);
  console.log(userPickPrice);
}

// Step 3: Add ons

// Set yearly or monthly price for add ons

function setAddOnPrice() {
  if (isMonthly) {
    addOnlinePrice.textContent = "+$1/mo";
    addStoragePrice.textContent = "+$2/mo";
    addProfilePrice.textContent = "+$2/mo";
  } else {
    addOnlinePrice.textContent = "+$10/yr";
    addStoragePrice.textContent = "+$20/yr";
    addProfilePrice.textContent = "+$20/yr";
  }
}

// Change styling and activate checkbox on item click
// Add addon item to summary step 4

addItems.forEach((item) => {
  item.addEventListener("click", function () {
    item.classList.toggle("add-item-active");
    const checkbox = item.querySelector('input[type="checkbox"]');
    if (checkbox) {
      checkbox.checked = !checkbox.checked;
    }
    updateTotalPrice();
  });
});

// Calculate total price on activation of add on selection

let totalAddOnPrice = 0;

const onlineServiceCheckbox = document.getElementById("online-service");
const largerStorageCheckbox = document.getElementById("larger-storage");
const customThemeCheckbox = document.getElementById("custom-theme");

function updateTotalPrice() {
  totalAddOnPrice = 0;
  selectionAddOnline.classList.remove("selections-add-item-active");
  selectionAddStorage.classList.remove("selections-add-item-active");
  selectionAddProfile.classList.remove("selections-add-item-active");

  if (onlineServiceCheckbox.checked) {
    totalAddOnPrice += isMonthly ? 1 : 10;
    selectionAddOnline.classList.add("selections-add-item-active");
    setAddOnTotal();
  } else {
    selectionAddOnline.classList.remove("selections-add-item-active");
  }
  if (largerStorageCheckbox.checked) {
    totalAddOnPrice += isMonthly ? 2 : 20;
    selectionAddStorage.classList.add("selections-add-item-active");
    setAddOnTotal();
  } else {
    selectionAddStorage.classList.remove("selections-add-item-active");
  }
  if (customThemeCheckbox.checked) {
    totalAddOnPrice += isMonthly ? 2 : 20;
    selectionAddProfile.classList.add("selections-add-item-active");
    setAddOnTotal();
  } else {
    selectionAddProfile.classList.remove("selections-add-item-active");
  }
}

// Reset add on selections for button back
function resetAddOnSelections() {
  totalAddOnPrice = 0;
  onlineServiceCheckbox.checked = false;
  largerStorageCheckbox.checked = false;
  customThemeCheckbox.checked = false;
  addItems.forEach((item) => {
    item.classList.remove("add-item-active");
  });
}

// Step 4
function setPlanTitle() {
  const planTitleEl = document.getElementById("selections-plan-title");
  let billingPeriod = isMonthly ? "monthly" : "yearly";
  userPickPlanCap = userPickPlan[0].toUpperCase() + userPickPlan.slice(1);
  planTitleEl.textContent = `${userPickPlanCap} (${billingPeriod})`;
}
function setPlanTotal() {
  const planTotalEl = document.getElementById("selections-plan-price");

  planTotalEl.textContent = `$${userPickPrice}`;
  console.log(userPickPrice);
}

function setAddOnTotal() {
  if (isMonthly) {
    selectionOnlineEl.textContent = "+$1/mo";
  } else {
    selectionOnlineEl.textContent = "+$10/yr";
  }

  if (isMonthly) {
    selectionStorageEl.textContent = "+$2/mo";
  } else {
    selectionStorageEl.textContent = "+$20/yr";
  }

  if (isMonthly) {
    selectionProfileEl.textContent = "+$2/mo";
  } else {
    selectionProfileEl.textContent = "+$20/yr";
  }
}

function setTotalPrice() {
  const totalPriceEl = document.getElementById("selections-total-price");
  let totalPrice = userPickPrice + totalAddOnPrice;

  if (isMonthly) {
    totalPriceEl.textContent = `$${totalPrice}/mo`;
  } else {
    totalPriceEl.textContent = `$${totalPrice}/yr`;
  }
}

// Button Events
function goToNextStep() {
  if (currentStep === 1) {
    if (validateInputStep1()) {
      currentStep++;
      currentSidebarStep++;
      updateStepClasses();
    }
  } else if (currentStep === 3) {
    currentStep++;
    currentSidebarStep++;
    updateStepClasses();
    setTotalPrice();
    setPlanTotal();
    setPlanTitle();
  } else if (currentStep === 5) {
    formInit();
  } else if (currentStep < steps.length) {
    currentStep++;
    currentSidebarStep++;
    updateStepClasses();
  }
}

function goToPreviousStep() {
  if (currentStep === 4) {
    currentStep--;
    currentSidebarStep--;

    updateStepClasses();
  } else if (currentStep > 1) {
    currentStep--;
    currentSidebarStep--;
    resetAddOnSelections();
    updateBilling();
    getPriceAndPlan();
    setAddOnPrice();
    updateTotalPrice();
    updateStepClasses();
  }
}

const changeBtn = document.getElementById("change");

function changePlan() {
  goToPreviousStep();
  goToPreviousStep();
}
changeBtn.addEventListener("click", changePlan);

nextBtn.addEventListener("click", goToNextStep);
backBtn.addEventListener("click", goToPreviousStep);

// initialize form

function formInit() {
  currentStep = 1;
  currentSidebarStep = 1;
  nameInput.value = "";
  emailInput.value = "";
  phoneInput.value = "";
  updateStepClasses();
}

formInit();
