const $formSteps = document.querySelectorAll(".form-step");
const $nextBtn = document.querySelector(".btn.next");
const $prevBtn = document.querySelector(".back");
const $plans = document.querySelectorAll(".plan");
const $toggle = document.querySelector("#toggle");
const $addOns = document.querySelectorAll(".service");
const $steps = document.querySelectorAll(".step");
const $changePlanBtn = document.querySelector(".change-plan");
const $summary = document.querySelector(".summary");
const $selectedAddOns = document.querySelector(".add-ons");

const $onlinePrice = document.querySelectorAll(".service .service-price")[0];
const $storagePrice = document.querySelectorAll(".service .service-price")[1];
const $profilePrice = document.querySelectorAll(".service .service-price")[2];

const $totalType = document.querySelector(".total p");
const $totalPrice = document.querySelector(".total .total-price");

let currentStep = 0;

const formData = {
  personalInfo: { name: "", email: "", phone: "" },
  plan: { type: "arcade", duration: "monthly" },
  addOns: [],
};

const PRICES = {
  monthly: {
    arcade: 9,
    advanced: 12,
    pro: 15,
    "online-service": 1,
    "larger-storage": 2,
    "customizable-profile": 2,
  },
  yearly: {
    arcade: 90,
    advanced: 120,
    pro: 150,
    "online-service": 10,
    "larger-storage": 20,
    "customizable-profile": 20,
  },
};

const updateSteps = () => {
  $steps.forEach((step, index) => {
    if (index === currentStep) {
      step.classList.add("active");
    } else {
      step.classList.remove("active");
    }
  });
};

const showStep = (currentStep) => {
  $formSteps.forEach((step, index) => {
    step.style.display = index === currentStep ? "block" : "none";
  });
  if (currentStep === 3) {
    $nextBtn.textContent = "Confirm";
  } else {
    $nextBtn.textContent = "Next Step";
  }
  if (currentStep > 0 && currentStep < 5) {
    $prevBtn.style.display = "block";
  } else {
    $prevBtn.style.display = "none";
  }
  if (currentStep === 4) {
    $nextBtn.style.display = "none";
    $prevBtn.style.display = "none";
    document.querySelector(".steps").style = "pointer-events: none";
  }
  updateSteps();
};

const saveStep = () => {
  // step 1
  const $name = document.getElementById("name").value;
  const $email = document.getElementById("email").value;
  const $phone = document.getElementById("phone").value;
  // step 2
  const $planSelected = document.querySelector(".plan.active").dataset.value;
  const $toggleChecked = document.querySelector("#toggle").checked;
  // step 3
  const $servicesSelected = document.querySelectorAll(".service input:checked");

  formData.personalInfo.name = $name;
  formData.personalInfo.email = $email;
  formData.personalInfo.phone = $phone;

  formData.plan.type = $planSelected;
  formData.plan.duration = $toggleChecked ? "yearly" : "monthly";

  formData.addOns = Array.from($servicesSelected).map((inp) => {
    const key = inp.value;
    // returns object with dynamic key with price depending on toggle monthly or yearly
    return { type: key, price: PRICES[formData.plan.duration][key] };
  });
};

const getPlanPrice = (selectedPlan) => {
  if (selectedPlan === "arcade") {
    return formData.plan.duration === "monthly"
      ? PRICES.monthly.arcade
      : PRICES.yearly.arcade;
  } else if (selectedPlan === "advanced") {
    return formData.plan.duration === "monthly"
      ? PRICES.monthly.advanced
      : PRICES.yearly.advanced;
  } else if (selectedPlan === "pro") {
    return formData.plan.duration === "monthly"
      ? PRICES.monthly.pro
      : PRICES.yearly.pro;
  }
};

// update plan values inside summary step
const updatePlan = () => {
  const $planType = $summary.querySelector(".summary-plan h4");
  const $planPrice = $summary.querySelector(".summary-plan .plan-price");

  $planType.textContent = `${formData.plan.type} (${formData.plan.duration})`;
  // get prices by passing current selected plan
  $planPrice.textContent = `$${getPlanPrice(
    formData.plan.type
  )}/${formData.plan.duration.slice(0, 2)}`;
};

// set add ons if user have selected any
const updateAddOns = () => {
  if (formData.addOns.length > 0) {
    $selectedAddOns.innerHTML = ""; // Clear previous add-ons
    let html = "<hr />";
    // loop through all selected add ons
    formData.addOns.forEach((ao) => {
      html += `<div class="add-on">
                <p>${ao.type.replace("-", " ")}</p>
                <div class="add-on-price">+$${
                  ao.price
                }/${formData.plan.duration.slice(0, 2)}</div>
              </div>`;
    });
    $selectedAddOns.insertAdjacentHTML("beforeend", html);
  } else {
    $selectedAddOns.innerHTML = "";
  }
};

// set total in summary step
const updateTotal = () => {
  const planFee = PRICES[formData.plan.duration][formData.plan.type];
  const addOnFee = formData.addOns.reduce(
    (total, addOn) => total + addOn.price,
    0
  );

  const per = formData.plan.duration === "monthly" ? "per month" : "per year";

  $totalType.textContent = `Total(${per})`;
  $totalPrice.textContent = `$${
    planFee + addOnFee
  }/${formData.plan.duration.slice(0, 2)}`;
};

const nextStep = () => {
  if (currentStep < $formSteps.length - 1) {
    currentStep++;
    showStep(currentStep);
    saveStep();
    updatePlan();
    updateAddOns();
    updateTotal();
  }
};

const prevStep = () => {
  if (currentStep > 0) {
    currentStep--;
    showStep(currentStep);
  }
};

const changePlan = () => {
  currentStep = 1;
  showStep(currentStep);
};

const handleToggle = (e) => {
  const checked = e.currentTarget.checked;
  // update form data
  formData.plan.duration = checked ? "yearly" : "monthly";
  // update price on DOM
  const $arcadePrice = document.querySelectorAll(`.plan-details p`)[0];
  const $advancePrice = document.querySelectorAll(`.plan-details p`)[1];
  const $proPrice = document.querySelectorAll(`.plan-details p`)[2];

  $arcadePrice.textContent = `$${
    PRICES[formData.plan.duration]["arcade"]
  }/${formData.plan.duration.slice(0, 2)}`;
  $advancePrice.textContent = `$${
    PRICES[formData.plan.duration]["advanced"]
  }/${formData.plan.duration.slice(0, 2)}`;
  $proPrice.textContent = `$${
    PRICES[formData.plan.duration]["pro"]
  }/${formData.plan.duration.slice(0, 2)}`;

  // update step 3 prices too
  $onlinePrice.textContent = `+$${
    PRICES[formData.plan.duration]["online-service"]
  }/${formData.plan.duration.slice(0, 2)}`;
  $storagePrice.textContent = `+$${
    PRICES[formData.plan.duration]["larger-storage"]
  }/${formData.plan.duration.slice(0, 2)}`;
  $profilePrice.textContent = `+$${
    PRICES[formData.plan.duration]["customizable-profile"]
  }/${formData.plan.duration.slice(0, 2)}`;
};

// Next button
$nextBtn.addEventListener("click", nextStep);
// Prev button
$prevBtn.addEventListener("click", prevStep);
// Change plan
$changePlanBtn.addEventListener("click", changePlan);
// On toggle change
$toggle.addEventListener("change", handleToggle);

// Select plan
$plans.forEach((plan) => {
  plan.addEventListener("click", () => {
    $plans.forEach((p) => p.classList.remove("active"));
    plan.classList.add("active");
  });
});

// Add ons
$addOns.forEach((addOn) => {
  addOn.addEventListener("click", () => {
    addOn.classList.toggle("active");
    addOn.querySelector("input").checked =
      !addOn.querySelector("input").checked;
  });
});

// Side steps
$steps.forEach((step, index) => {
  step.addEventListener("click", () => {
    if (currentStep !== index) {
      $steps[currentStep].classList.remove("active");
      step.classList.add("active");
      currentStep = index;
      showStep(currentStep);
      saveStep();
      updatePlan();
      updateAddOns();
      updateTotal();
    }
  });
});
