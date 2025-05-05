function fetchTaxpayer() {
    const identifier = document.getElementById('identifier').value;
    // Fake fetch simulation
    if (identifier === '') {
      alert('Please enter a TIN or BVN.');
    } else {
      const found = false; // Simulate not found
      if (!found) {
        document.getElementById('manualFields').classList.remove('d-none');
        alert("Taxpayer not found. Please fill in details manually.");
      } else {
        // Autofill logic goes here
      }
    }
  }

  function goToStep(step) {
    for (let i = 1; i <= 3; i++) {
      document.getElementById('step' + i).classList.add('d-none');
      document.getElementById('step' + i + '-indicator').classList.remove('active');
    }
    document.getElementById('step' + step).classList.remove('d-none');
    document.getElementById('step' + step + '-indicator').classList.add('active');
  }

//   let currentStep = 0;
// const steps = document.querySelectorAll(".step");
// const indicators = document.querySelectorAll(".step-indicator");
// const ticks = document.querySelectorAll(".tick");

// function showStep(step) {
//   steps.forEach((el, idx) => el.classList.toggle("active", idx === step));
//   indicators.forEach((el, idx) => el.classList.toggle("active", idx === step));
//   ticks.forEach((el, idx) => {
//     if (idx <= step) {
//       el.classList.remove("inactive");
//     } else {
//       el.classList.add("inactive");
//     }
//   });
// }

// function nextStep() {
//   if (currentStep < steps.length - 1) {
//     currentStep++;
//     showStep(currentStep);
//   }
// }

// function prevStep() {
//   if (currentStep > 0) {
//     currentStep--;
//     showStep(currentStep);
//   }
// }