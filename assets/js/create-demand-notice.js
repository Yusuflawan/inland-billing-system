// create a base path for the api
// const basePath = 'http://localhost:8080/billing-system/backend';
// new-demand-notice-form automatic-filling-form getTinBtn manual-filling-form
function setTin() {
  const params = new URLSearchParams(window.location.search);
  const tin = params.get("tin");

  if (tin) {
    console.log(tin);
    const tinField = document.getElementById("tin");
    tinField.value = tin;
  }
}

function displayMsg(message, color) {
  const messageElement = document.getElementById("msg");
  messageElement.innerText = message;
  messageElement.style.color = color;
  messageElement.style.display = "block";
}

let userId = 0;

let sId;
let lgaId;

let tinNum;
let newBusiName;

const lgaSelect = document.getElementById("manual-lga");

document.addEventListener("DOMContentLoaded", async () => {
  setTin();

  const stateSelect = document.getElementById("manual-states");

  const revenueHeadSelect = document.getElementById("revenue-head");
  const amountField = document.getElementById("amount");

  const newRevenueHeadSelect = document.getElementById("new-revenue-head");
  const newAmountField = document.getElementById("new-amount");

  try {
    const response = await fetch(`${basePath}/states`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch states");
    }

    const states = await response.json();

    // Clear existing options
    stateSelect.innerHTML = '<option value="">Select State</option>';

    // Populate the dropdown with the fetched states
    states.forEach((state) => {
      const option = document.createElement("option");
      option.value = state.id;
      option.textContent = state.state;

      stateSelect.appendChild(option);
    });

    stateSelect.dispatchEvent(new Event("change")); // Trigger change event to load LGAs for the default selected state

    // console.log(stateSelect.innerHTML);
  } catch (error) {
    console.error("Error fetching states:", error);
    stateSelect.innerHTML = '<option value="">Failed to load states</option>';
  }

  // Handle State Change to Populate LGAs
  stateSelect.addEventListener("change", async (e) => {
    const stateId = e.target.value; // Get the selected state ID
    // console.log("Selected State ID:", stateId); // Debugging

    sId = stateId;
    // console.log( e.target.value); // Get the selected state ID
    lgaSelect.innerHTML = '<option value="">Loading...</option>'; // Show loading message

    if (!stateId) {
      lgaSelect.innerHTML = '<option value="">All LGA</option>'; // Reset LGA dropdown if no state is selected
      return;
    }

    try {
      const response = await fetch(`${basePath}/state/lgas/${stateId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch LGAs");
      }

      const result = await response.json();
      const lgas = result.data;
      // console.log(lgas)
      lgaSelect.innerHTML = '<option value="">Select LGA</option>';

      // Populate the LGA dropdown with the fetched LGAs
      lgas.forEach((lga) => {
        const option = document.createElement("option");
        option.value = lga.id;
        option.textContent = lga.lga;
        lgaSelect.appendChild(option);
      });

      console.log(lgaSelect);
    } catch (error) {
      console.error("Error loading LGAs:", error);
      lgaSelect.innerHTML = '<option value="">Failed to load LGAs</option>'; // Show error message in dropdown
    }
  });

  try {
    const response = await fetch(`${basePath}/revenue-head-items`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch revenue head items");
    }

    const result = await response.json();

    // Populate the dropdown with the fetched data
    result.data.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id; // Use the appropriate field for the value
      option.textContent = item.revenue_head; // Use the appropriate field for the display text
 
      // Add a custom data attribute for the amount
      option.setAttribute("data-amount", item.amount);
      option.setAttribute("data-revenueHeadId", item.revenue_head_id);

      revenueHeadSelect.appendChild(option);
    });

    // Add event listener to update the amount field when a revenue head is selected
    revenueHeadSelect.addEventListener("change", async function () {
      const selectedOption = this.options[this.selectedIndex];
      // /revenue-head/amount/{business_owner_id}/{revenue_head_id}
      // alert(selectedOption);

      const business_owner_id = userId;
      const revenue_head_id = selectedOption.getAttribute("data-revenueHeadId");

      const amountValue = await checkRenewal(business_owner_id, revenue_head_id);

      console.log(amountValue)

      if (amountValue == null) {
        const amountValue = selectedOption.getAttribute("data-amount");
        amountField.value = amountValue || "";
      }
      selectedOption.getAttribute("data-revenueHeadId").value = amountValue.revenue_head_id;
      amountField.value = amountValue.amount;
      selectedOption.value = amountValue.revenue_head_id;

      selectedOption.getAttribute("data-amount").value = amountValue.amount;

    });
  } catch (error) {
    console.error("Error fetching revenue head items:", error);
    alert("An error occurred while loading revenue head items.");
  }

  try {
    const response = await fetch(`${basePath}/revenue-head-items`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch revenue head items");
    }

    const result = await response.json();

    // Populate the dropdown with the fetched data
    result.data.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id; // Use the appropriate field for the value
      option.textContent = item.revenue_head; // Use the appropriate field for the display text

      // Add a custom data attribute for the amount
      option.setAttribute("data-amount", item.amount);
      option.setAttribute("data-revHeadId", item.revenue_head_id);

      newRevenueHeadSelect.appendChild(option);
    });

    newRevenueHeadSelect.addEventListener("change", function () {
      const selectedOption = this.options[this.selectedIndex];
      const amountValue = selectedOption.getAttribute("data-amount");

      // Update the amount field with the selected revenue head's amount
      newAmountField.value = amountValue || ""; // Set to empty if no amount is found
    });
  } catch (error) {
    console.error("Error fetching revenue head items:", error);
    alert("An error occurred while loading revenue head items.");
  }

  // Populate Business Types Dropdown
  const businessTypeSelect = document.getElementById("manual-business-type");

  try {
    const response = await fetch(`${basePath}/business-types`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch business types");
    }

    const result = await response.json();
    const businessTypes = result.data;

    // Populate the dropdown with the fetched business types
    businessTypes.forEach((type) => {
      const option = document.createElement("option");
      option.value = type.id;
      option.textContent = type.business_type;
      businessTypeSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching business types:", error);
    businessTypeSelect.innerHTML = '<option value="">Failed to load business types</option>';
  }
});

lgaSelect.addEventListener("change", async (e) => {
  const lgId = e.target.value; // Get the selected state ID
  lgaId = lgId;
});

let agentId = localStorage.getItem("agentId");

const searchBt = document.getElementById("search-button");

searchBt.addEventListener("click", async function () {
  // e.preventDefault();
  document.hasFocus
  const tin = document.getElementById("tin").value.trim(); // Get the TIN value

  if (!tin) {
    alert("Please enter a valid TIN.");
    return;
  }

  searchBt.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Searching...`;
  searchBt.disabled = true; // Disable the button
  
  try {
    // Make a GET request to fetch business owner details
    const response = await fetch(`https://plateauigr.com/testBack/tinGeneration/customerValidation.php?input=${tin}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch business owner details");
    }

    const result = await response.json();

    // console.log(result)
    console.log("API Response:", result);


    if (result.success == false) {
          alert(result.message + ". Please proceed to the manual filling");
      // Activate the "Manual Filling" tab using Bootstrap API
      const triggerTab = document.querySelector("#manual-fill");
      const tab = new bootstrap.Tab(triggerTab);
      tab.show();

    }
    else{

      const data = result.details;

      createBOwnerPayload = {
        tin : data.tin,
        email : data.email,
        phone : data.phone,
        password : "123"
      }

      try {
        // Make a GET request to fetch business owner details
        const response = await fetch(`${basePath}/business-owner/tin/${tin}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
    
        if (!response.ok) {
          throw new Error("Failed to fetch business owner details");
        }
    
        const result = await response.json();

        console.log(result);
        const user = result.data;
    
        if (!user) {

          document.getElementById("preview-busi-name").value = data.first_name;
          document.getElementById("preview-phone").value = data.phone;
          document.getElementById("preview-email").value = data.email;

          const previewBusiName = document.getElementById("preview-busi-name").value.trim();
          const previewPhone = document.getElementById("preview-phone").value.trim();
          const previewEmail = document.getElementById("preview-email").value.trim();
          
          toggleModal("preview-form", true); // Show modal

          if (previewBusiName === "" || previewPhone === "" || previewEmail === "") {
            displayMsg("Please fill in all required fields.", "red");
            // alert("Please fill in all required fields.");
            // return;
          }
          
          if (previewBusiName && previewPhone && previewEmail) {
              submitPreview(previewBusiName, previewEmail, previewPhone, data.tin, agentId);
          }

        }
    
        // Populate the input fields with the fetched data
        document.getElementById("business-owner").value = user.business_name || "";
        // document.getElementById("new-business-owner").value = user.business_name || "";
        document.getElementById("email").value = user.email;
        document.getElementById("phone").value = user.phone;
        document.getElementById("address").value = user.address;
      
        userId = user.id;
    
        // Show the auto-filled details section
        document.getElementById("auto-details").classList.remove("d-none");
        document.getElementById("search-button").classList.add("d-none");
        document.getElementById("createBtn").classList.remove("d-none");
    
        // console.log("Business owner details fetched successfully:", user);
      } catch (error) {
        console.error("Error fetching business owner details:", error);
        // alert("An error occurred while fetching business owner details.");
      }
    }

  } catch (error) {
    console.error("Error fetching business owner details:", error);
    // alert("An error occurred while fetching business owner details.");
  }
  finally {
    searchBt.innerHTML = "Search";
    searchBt.disabled = false; // Enable the button
  }

});


// async function fetchBusinessOwner() {
 

 
// }

document.getElementById("automatic-filling-form").addEventListener("submit", async function (event) {
  // console.log("Form submission prevented"); // Debugging log
  event.preventDefault(); // Prevent the default form submission behavior

  // Collect input values from the form
  const formData = new FormData(this);
  const data = Object.fromEntries(formData.entries());

  // Add additional fields if needed
  const selectedOption = document.querySelector("#revenue-head option:checked");
  data.revenueHead = selectedOption.value;
  // data.amount = selectedOption.getAttribute("data-amount");
  data.amount = document.getElementById("amount").value;
  // data.agentId = localStorage.getItem("agentId") || agentId; // Use localStorage or fallback to agentId variable
  data.userId = userId;
  data.tin = document.getElementById("tin").value.trim();
  data.description = document.getElementById("description").value.trim();
  data.revenueHeadId = selectedOption.getAttribute("data-revenueHeadId");

  console.log("Form data to be submitted:", data);

  const creatBt = document.getElementById("createBtn");
  creatBt.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Creating...`;
  creatBt.disabled = true; // Disable the button

  const payload = {
    merchantId: "2011LASU01",
    requestId: "1323244255",
    tax_number: data.tin,
    event: "invoice creation",
    revenue_head_item: data.revenueHead,
    price: data.amount,
    description: data.description,
  };

  // make the POST request to the demand-notice API
  try {
    const response = await fetch("https://plateauigr.com/php/pipe/index.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to create demand notice");
    }

    const result = await response.json();

    console.log("Response from the server:", result);

    if (result.status === 1) {
      // const demandNoticeNumber = "123";
      const demandNoticeNumber = result.invoice_number;
      const businessownerId = data.userId;
      const revenueHeadId = data.revenueHead;
      const amount = result.price[0];

      await createDemandNotice(businessownerId, agentId, revenueHeadId, demandNoticeNumber, amount);
      console.log(businessownerId, agentId, revenueHeadId, demandNoticeNumber);
      // alert("Demand notice created successfully!");
      // console.log("Demand notice created on IBS successfully!");
      // window.location.href = "demand-notice.html";
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error("Error creating demand notice:", error);
    alert("An error occurred while creating the demand notice.");
  }
  finally{
    creatBt.innerHTML = "Submit";
    creatBt.disabled = false; // Enable the button
  }
});

async function createDemandNotice(businessownerId, agentId, revenueHeadId, demandNoticeNumber, amount) {
  const payload = {
    business_owner_id: businessownerId,
    revenue_head_item: revenueHeadId,
    demand_notice_number: demandNoticeNumber,
    agent_id: agentId,
    amount: amount,
  };

  try {
    // Send the payload to the backend
    const response = await fetch(`${basePath}/demand-notice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to create demand notice");
    }

    const result = await response.json();

    if (result.status === "success") {
      alert("Demand notice created successfully!");
      window.location.href = "demand-notice.html"; // Redirect on success
    } else {
      alert(result.message || "An error occurred while creating the demand notice.");
    }
  } catch (error) {
    console.error("Error creating demand notice:", error);
    alert("An error occurred while creating the demand notice. Please try again.");
  }
}

// Function to get the selected radio input value
function getSelectedIdType() {
  const selectedRadio = document.querySelector('input[name="identityType"]:checked');
  return selectedRadio ? selectedRadio.value : null;
}

document.getElementById("manual-filling-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const manualBusinessName = document.getElementById("manual-business-name").value.trim();
  const manualEmail = document.getElementById("manual-email").value.trim();
  const manualPhone = document.getElementById("manual-phone").value.trim();
  const manualAddress = document.getElementById("manual-address").value.trim();
  const manualState = document.getElementById("manual-states").value.trim();
  const manualLga = document.getElementById("manual-lga").value.trim();
  const manualIdType = getSelectedIdType();
  const manualIdNumber = document.getElementById("manual-id-number").value.trim();
  const manualWebsite = document.getElementById("manual-website").value.trim();
  const manualBusinessTypeId = document.getElementById("manual-business-type").value.trim();
  const manualSector = document.getElementById("manual-sector").value.trim();
  const manualStaffQuota = document.getElementById("manual-staff-quota").value.trim();
  const manualCacNumber = document.getElementById("manual-cac-number").value.trim();
  const manualPassword = document.getElementById("manual-password").value.trim();

  const getTinBtn = document.getElementById("getTinBtn");
  getTinBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Creating...`;
  getTinBtn.disabled = true; // Disable the button

  try {
    const stateName = await getStateName(sId);
    const lgaName = await getLgaName(lgaId);
    const businessType = await getBusinessType(manualBusinessTypeId);

    // Send registration request
    const response = await fetch("https://plateauigr.com/testBack/tinGeneration/index.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "corporate",
        organization_name: manualBusinessName,
        email: manualEmail,
        phone_number: manualPhone,
        industry: businessType,
        sector: manualSector,
        cac_number: manualCacNumber,
        num_employees: manualStaffQuota,
        address: manualAddress,
        state: stateName,
        lga: lgaName,
        website: manualWebsite,
        created_by: "",
      }),
    });

    if (response.ok) {
      const result = await response.json();

      if (result.error) {
        alert(result.error);
      }

      console.log(result);

      const tin = result.tin;

      newBusiName = manualBusinessName;
      tinNum = tin;

      if (!tin) {
        // displayMessage(result.error, "red");
        // document.getElementById("step-4").style.display = "none";
        // document.getElementById("addNewBO").style.display = "block";
      }
      await createBusinessOwner(
        manualBusinessName,
        manualEmail,
        manualPhone,
        manualAddress,
        manualIdType,
        manualIdNumber,
        manualBusinessTypeId,
        manualStaffQuota,
        manualCacNumber,
        tin,
        manualPassword,
        sId,
        lgaId,
        manualSector,
        manualWebsite,
        agentId
      );

      // console.log(tin); // Log the TIN for debugging
    } else {
      throw new Error("Failed to register");
    }
  } catch (error) {
    console.error("An error occurred:", error);
    // displayMessage("An unexpected error occurred. Please try again later.", "red");
  }
  finally {
    getTinBtn.innerHTML = "Get TIN";
    getTinBtn.disabled = false; // Enable the button
  }
});

// Function to create a user
async function createBusinessOwner(businessName, email, phone, address, idType, idNumber, businessTypeId, staffQuota, cacNumber, tin, password, sId, lgaId, sector, website, agentId) {
  try {
    const response = await fetch(`${basePath}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        business_name: businessName,
        email: email,
        phone: phone,
        address: address,
        id_type: idType,
        id_number: idNumber,
        business_type_id: businessTypeId,
        sector: sector,
        staff_quota: staffQuota,
        cac_number: cacNumber,
        tin: tin,
        website: website,
        agent_id: agentId,
        password: password,
        state_id: sId,
        lga_id: lgaId,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(result); // Log the result for debugging
      if (result.status == "success") {
        alert("Business Owner Registered Successfully. Now Please Proceed to Creating Demand Notice");
        document.querySelector(".create-manual-demand-notice").style.display = "block";
        document.getElementById("manual-filling-form").style.display = "none";

        document.getElementById("new-business-name").value = newBusiName;
        document.getElementById("new-tin").value = tinNum;
      }
      // return result.status;
    } else {
      throw new Error("Failed to create user");
    }
  } catch (error) {
    console.error("Error creating bussiness owner:", error);
    return "error"; // Return "error" on failure
  }
}

async function getBusinessType(businessTypeId) {
  try {
    const response = await fetch(`${basePath}/business-type/${businessTypeId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch LGA name");
    }

    const result = await response.json();
    return result.data.business_type;
  } catch (error) {
    console.error("Error fetching LGA name:", error);
    return null; // Return null if an error occurs
  }
}

// Function to fetch LGA name by LGA ID
async function getLgaName(lgaId) {
  try {
    const response = await fetch(`${basePath}/lga/${lgaId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch LGA name");
    }

    const result = await response.json();
    return result.data.lga; // Assuming the API returns the LGA name in `result.data.lga`
  } catch (error) {
    console.error("Error fetching LGA name:", error);
    return null; // Return null if an error occurs
  }
}

async function getStateName(stateId) {
  try {
    const response = await fetch(`${basePath}/state/${stateId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch state name");
    }

    const result = await response.json();
    return result.data.state; // Assuming the API returns the state name in `result.data.state`
  } catch (error) {
    console.error("Error fetching state name:", error);
    return null; // Return null if an error occurs
  }
}


document.getElementById("new-demand-notice-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  let bOwnerId;

  const manualSubmitBtn = document.getElementById("manualsubmitBtn");
  manualSubmitBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Creating...`;
  manualSubmitBtn.disabled = true; // Disable the button

  try {
    // Make a GET request to fetch business owner details
    const response = await fetch(`${basePath}/business-owner/tin/${tinNum}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch business owner details");
    }

    const result = await response.json();
    const businessOwner = result.data;

    if (!businessOwner) {
    //   alert(result.message);

    }
  
    bOwnerId = businessOwner.id;

    // console.log("Business owner details fetched successfully:", businessOwner);
  } catch (error) {
    console.error("Error fetching business owner details:", error);
    // alert("An error occurred while fetching business owner details.");
  }
  finally{
    manualSubmitBtn.innerHTML = "Create";
    manualSubmitBtn.disabled = false; // Enable the button
  }
  
  const seleOption = document.querySelector("#new-revenue-head option:checked");
  revenueHeadId = seleOption.getAttribute("data-revHeadId");
//   const revenueHeadId = document.getElementById("new-revenue-head").getAttribute("data-revHeadId");
  
//   const revHead = document.getElementById("new-revenue-head").value.trim();
  const revAmount = document.getElementById("new-amount").value.trim();
  const descrip = document.getElementById("new-description").value.trim();

  
//   console.log(tinNum)
//   console.log(newBusiName)

  const payload = {
    merchantId: "2011LASU01",
    requestId: "1323244255",
    tax_number: tinNum,
    event: "invoice creation",
    revenue_head_item: revenueHeadId,
    price: revAmount,
    description: descrip,
  };

  console.log(payload)

  // make the POST request to the demand-notice API
  try {
    const response = await fetch("https://plateauigr.com/php/pipe/index.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to create demand notice");
    }

    const result = await response.json();

    // console.log("Response from the server:", result);

    if (result.status === 1) {
    //   const demandNoticeNumber = "123";
      const demandNoticeNumber = result.invoice_number;
    //   const businessownerId = data.userId;

      await createDemandNotice(bOwnerId, agentId, revenueHeadId, demandNoticeNumber, revAmount);
    //   console.log(businessownerId, agentId, revenueHeadId, demandNoticeNumber);
      alert("Demand notice created successfully!");
      console.log("Demand notice created on IBS successfully!");
      window.location.href = "demand-notice.html";
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error("Error creating demand notice:", error);
    alert("An error occurred while creating the demand notice.");
  }
  
});



async function checkRenewal(business_owner_id, revenue_head_id){
  try {
    const response = await fetch(`${basePath}/revenue-head/amount/${business_owner_id}/${revenue_head_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch revenue head items");
    }
    console.log(business_owner_id)
    console.log(revenue_head_id)

    const result = await response.json();

    return result;
    // console.log(result)
  
} catch (error) {
  console.error("Error fetching revenue head items:", error);
  // alert("An error occurred while loading revenue head items.");
}
}



function toggleModal(modalId, isVisible) {
  const modal = document.getElementById(modalId);
  const body = document.body;

  if (isVisible) {
      modal.style.display = "block";
      modal.style.opacity = "1";
      modal.style.transition = "opacity 0.5s ease-in-out";
      body.classList.add("modal-open"); // Add the class to change body color
  } else {
      modal.style.display = "none";
      modal.style.opacity = "0";
      modal.style.transition = "opacity 0.5s ease-in-out";
      body.classList.remove("modal-open"); // Remove the class to revert body color
  }
}


document.getElementById("preview-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const previewBusiName = document.getElementById("preview-busi-name").value;
  const previewEmail = document.getElementById("preview-email").value;
  const previewPhone = document.getElementById("preview-phone").value;

  const tin = document.getElementById("tin").value; // Set the TIN value in the input field
  console.log(previewBusiName, previewEmail, previewPhone, tin, agentId);
  
  await createBusinessOwner1(previewBusiName, previewEmail, previewPhone, tin, agentId);
});


async function createBusinessOwner1(firstName, email, phone, tin, agentId) {
  try {
      const response = await fetch(`${basePath}/auth/auto/register`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              business_name: firstName, // Assuming `first_name` is used as the business name
              email: email,
              phone: phone,
              tin: tin,
              agent_id: agentId,
          }),
      });

      if (response.ok) {
          const result = await response.json();
          alert(result.message + ". Please proceed to creating demand notice");
          // close the modal
          toggleModal("preview-form", false); // Hide the modal
          
          document.getElementById("tin").value = tin; // Set the TIN value in the input field
          // console.log(tin); // Log the TIN for debugging
          document.getElementById("search-button").click(); // Trigger the search button click event

          // window.location.reload(); // Reload the page after successful registration
          // alert("User created successfully in local DB.");    
          console.log(result); // Log the result for debugging
          // return; // Return true if the user is created successfully
      } else {
          alert(result.message)
          throw new Error("Failed to create user in local DB");
      }
  } catch (error) {
      console.error("Error creating user in local DB:", error);
  }
}

