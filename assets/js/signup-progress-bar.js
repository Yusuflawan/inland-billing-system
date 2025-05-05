let currentStep = 0;
const steps = document.querySelectorAll(".step");
const indicators = document.querySelectorAll(".step-indicator");
const ticks = document.querySelectorAll(".tick");

function showStep(step) {
  steps.forEach((el, idx) => el.classList.toggle("active", idx === step));
  indicators.forEach((el, idx) => el.classList.toggle("active", idx === step));
  ticks.forEach((el, idx) => {
    if (idx <= step) {
      el.classList.remove("inactive");
    } else {
      el.classList.add("inactive");
    }
  });
}

function nextStep() {
  if (currentStep < steps.length - 1) {
    currentStep++;
    showStep(currentStep);
  }
}

function prevStep() {
  if (currentStep > 0) {
    currentStep--;
    showStep(currentStep);
  }
}