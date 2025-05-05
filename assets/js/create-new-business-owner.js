// create a base path for the api
// const basePath = 'http://localhost:8080/billing-system/backend';

const agentId = localStorage.getItem("agentId");

// Function to display messages
function displayMessage(message, color) {
    const messageElement = document.getElementById("message");
    messageElement.innerText = message;
    messageElement.style.color = color;
    messageElement.style.display = "block";
}

document.addEventListener("DOMContentLoaded", async () => {
    
    // Populate States Dropdown
    const stateSelect = document.getElementById("states");

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

            // if (state.stateId === "32") {
            //     option.selected = true;
            // }

            stateSelect.appendChild(option);
        });

        stateSelect.dispatchEvent(new Event("change")); // Trigger change event to load LGAs for the default selected state

        // console.log(stateSelect.innerHTML);

    } catch (error) {
        console.error("Error fetching states:", error);
        stateSelect.innerHTML = '<option value="">Failed to load states</option>';
    }

    let sId;
    let lgaId;

    const lgaSelect = document.getElementById("lga");

    // Handle State Change to Populate LGAs
    stateSelect.addEventListener("change", async (e) => {
    const stateId = e.target.value; // Get the selected state ID
    console.log("Selected State ID:", stateId); // Debugging

    sId = stateId;
    // console.log( e.target.value); // Get the selected state ID
    lgaSelect.innerHTML = '<option value="">Loading...</option>'; // Show loading message

    if (!stateId) {
        lgaSelect.innerHTML = '<option value="">All LGA</option>'; // Reset LGA dropdown if no state is selected
        return;
    }

    try {
        // Fetch LGAs for the selected state
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
        lgaSelect.innerHTML = '<option value="">Select LGA</option>';

        // Populate the LGA dropdown with the fetched LGAs
        lgas.forEach((lga) => {
            const option = document.createElement("option");
            option.value = lga.id;
            option.textContent = lga.lga;
            lgaSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading LGAs:", error);
        lgaSelect.innerHTML = '<option value="">Failed to load LGAs</option>'; // Show error message in dropdown
    }
});


lgaSelect.addEventListener("change", async (e) => {
    const lgId = e.target.value; // Get the selected state ID

    lgaId = lgId;
});

    // Populate Business Types Dropdown
    const businessTypeSelect = document.getElementById("businessType");

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

    // Handle Form Submission
    document.getElementById("signupForm").addEventListener("submit", async function (e) {
        e.preventDefault();

        // Get input values
        const businessName = document.getElementById("businessName").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const address = document.getElementById("address").value.trim();
        const idType = getSelectedIdType();
        const idNumber = document.getElementById("idNumber").value.trim();
        const businessTypeId = document.getElementById("businessType").value.trim();
        const sector = document.getElementById("sector").value.trim();
        const staffQuota = document.getElementById("staffQuota").value.trim();
        const cacNumber = document.getElementById("cacNumber").value.trim();
        const website = document.getElementById("website").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();

        // Validate inputs
        if (!businessName || !email || !phone || !address || !idType || !idNumber || !businessTypeId || !staffQuota) {
            displayMessage("Please fill in all required fields.", "red");
            return;
        }

        if (password !== confirmPassword) {
            displayMessage("Passwords do not match.", "red");
            return;
        }

        try {
            const stateName = await getStateName(sId);
            const lgaName = await getLgaName(lgaId);
            const businessType = await getBusinessType(businessTypeId);

            // Send registration request
                const response = await fetch("https://plateauigr.com/testBack/tinGeneration/index.php", {
                
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                        type: "corporate",
                        organization_name : businessName,
                        email : email,
                        phone_number : phone,
                        industry: businessType,
                        sector: sector,
                        cac_number : cacNumber,
                        num_employees : staffQuota,
                        address : address,
                        state : stateName,
                        lga : lgaName,
                        website : website,
                        created_by : ""
                }),
            });

            if (response.ok) {

                const result = await response.json();

                if (result.status === "error") {
                    displayMessage(result.error || "Registration failed!", "red");
                    return;
                }

                console.log(result); // Log the result for debugging

                const tin = result.tin;
                if (!tin) {
                    displayMessage(result.error, "red");
                    document.getElementById("step-4").style.display = "none";
                    document.getElementById("addNewBO").style.display = "block";
                }
                await createBusinessOwner(businessName, email, phone, address, idType, idNumber, businessTypeId, staffQuota, cacNumber, tin, password, sId, lgaId, sector, website, agentId);

                // console.log(tin); // Log the TIN for debugging

            } else {
                throw new Error("Failed to register");
            }
        } catch (error) {
            console.error("An error occurred:", error);
            displayMessage("An unexpected error occurred. Please try again later.", "red");
        }
    });

    // Function to get the selected radio input value
    function getSelectedIdType() {
        const selectedRadio = document.querySelector('input[name="identityType"]:checked');
        return selectedRadio ? selectedRadio.value : null;
    }

});



// Function to fetch state name by state ID
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

// Function to create a user
async function createBusinessOwner(businessName, email, phone, address, idType, idNumber, businessTypeId, staffQuota, cacNumber, tin, password, sId, lgaId,sector, website, agentId) {
    try {
        const response = await fetch(`${basePath}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                business_name : businessName,
                email : email,
                phone : phone,
                address : address,
                id_type : idType,
                id_number : idNumber,
                business_type_id : businessTypeId,
                sector : sector,
                staff_quota : staffQuota,
                cac_number : cacNumber,
                tin : tin,
                website : website,
                agent_id : agentId,
                password : password,
                state_id : sId,
                lga_id : lgaId,
            }),
        });

        if (response.ok) {
            const result = await response.json();
            // console.log(result); // Log the result for debugging
            if (result.status == "success") {
                displayMessage(result.message, "green");
                document.getElementById("addNewBO").style.display = "block";
                document.getElementById("step-4").style.display = "none";
               
            } else if (result.status == "error") {
                displayMessage(result.message, "red");
                document.getElementById("step-4").style.display = "block";
            } else {
                displayMessage("Failed to register business", "red");
                document.getElementById("addNewBO").style.display = "block";
                document.getElementById("step-4").style.display = "none";
            }
            // return result.status;
        } else {
            throw new Error("Failed to create user");
        }
    } catch (error) {
        console.error("Error creating user:", error);
        return "error"; // Return "error" on failure
    }
}



document.getElementById("no-tin").addEventListener("click", async (event) => {
    event.preventDefault();

    document.getElementById("signupForm").style.display = "block";
    document.getElementById("auto-fill-form").style.display = "none";
});


document.getElementById("search-tin").addEventListener("click", async (event) => {
    event.preventDefault();
  
    const tinNum = document.getElementById("tin-num").value;
  
    try {
      const response = await fetch(`https://plateauigr.com/testBack/tinGeneration/customerValidation.php?input=${tinNum}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch business owner details");
      }
  
      const data = await response.json();
      console.log("Business owner data:", data);

      if (data.success == false) {
        alert(data.message + ". Please create new TIN");
        document.getElementById("signupForm").style.display = "block";
        document.getElementById("auto-fill-form").style.display = "none";
      }
      
      if (await businessOwnerExist(tinNum)) {
        alert("This Business Owner Already Exist.");
      }
      else{
        const result = data.details;
        document.getElementById("businessName").value = result.first_name;
        document.getElementById("phone").value = result.phone;
        document.getElementById("email").value = result.email;

        await createBusinessOwner(businessName, email, phone, tinNum, agentId);
      }
  
    } catch (error) {
      console.error("Error fetching business owner details:", error);
    //   alert("An error occurred while fetching business owner details.");
    }
  });
  

  async function businessOwnerExist(tinNum) {
    try {
      const response = await fetch(`${basePath}/business-owner/tin/${tinNum}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        return false;
      }
  
      const result = await response.json();
  
      return result.status === "success" && result.data ? true : false;
      
    } catch (error) {
      console.error("Error checking business owner:", error);
      return false;
    }
  }


  async function  createBusinessOwner(businessName, email, phone, tin, agentId) {
    try {
        const response = await fetch(`${basePath}/auth/auto/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                business_name : businessName,
                email : email,
                phone : phone,
                tin : tin,
                agent_id : agentId,
            }),
        });

        if (response.ok) {
            const result = await response.json();
            alert(result.message);
        }
    } catch (error) {
        console.error("Error checking business owner:", error);
        // return false;
      }

  }

  
  