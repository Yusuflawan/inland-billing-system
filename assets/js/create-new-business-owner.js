// create a base path for the api
// const basePath = 'http://localhost:8080/billing-system/backend';

const agentId = localStorage.getItem("agentId");

let sId;
let lgaId;


// Function to display messages
function displayMessage(message, color) {
    const messageElement = document.getElementById("message");
    messageElement.innerText = message;
    messageElement.style.color = color;
    messageElement.style.display = "block";
}

function displayMsg(message, color) {
    const messageElement = document.getElementById("msg");
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
        // search-tin
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

    

});

// Function to get the selected radio input value
function getSelectedIdType() {
    const selectedRadio = document.querySelector('input[name="identityType"]:checked');
    // console.log(selectedRadio.value);
    return selectedRadio ? selectedRadio.value : null;
}

// no-tin
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



document.getElementById("search-tin").addEventListener("click", async (event) => {
    event.preventDefault();

    const tinNum = document.getElementById("tin-num").value;
    
    if (tinNum === "") {
        alert("Please enter a TIN number to search.");
        return;
    }

    const searchTin = document.getElementById("search-tin");
    const searchTinText = searchTin.innerHTML;
    searchTin.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Searching...`;
    searchTin.disabled = true; // Disable the button


    try {
        // Step 1: Check if the user exists in the external database (IGR DB)
        const response = await fetch(`https://plateauigr.com/testBack/tinGeneration/customerValidation.php?input=${tinNum}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch business owner details from IGR DB");
        }

        const data = await response.json();
        console.log("Business owner data from IGR DB:", data);

        if (data.success === false) {
            // User does not exist in the external database
            alert(data.message + ". Creating user on both databases...");

            // display the signup form
            document.getElementById("signupForm").style.display = "block";
            document.getElementById("auto-fill-form").style.display = "none";
            return;
        }

        // Step 2: User exists in the external database
        const result = data.details;
        console.log("Business owner details from IGR DB:", result);

        // Step 3: Check if the user exists in the local database
        if (await businessOwnerExist(tinNum)) {
            // User exists in both databases
            alert("This Business Owner Already Exists in Both Databases.");
            return;
        } else {
            // User exists in the external database but not in the local database
            // preview user datails
            document.getElementById("preview-busi-name").value = result.first_name;
            document.getElementById("preview-phone").value = result.phone;
            document.getElementById("preview-email").value = result.email;

            const previewBusiName = document.getElementById("preview-busi-name").value.trim();
            const previewPhone = document.getElementById("preview-phone").value.trim();
            const previewEmail = document.getElementById("preview-email").value.trim();
            
            toggleModal("preview-form", true); // Show modal

            if (previewBusiName === "" || previewPhone === "" || previewEmail === "") {
                displayMsg("Please fill in all required fields.", "red");
                // alert("Please fill in all required fields.");
                // return;
            }
            

            // if (previewBusiName && previewPhone && previewEmail) {
            //     await submitPreview(previewBusiName, previewEmail, previewPhone, result.tin, agentId);
            //     // await createBusinessOwner1(previewBusiName, previewEmail, previewPhone, result.tin, agentId); // Create user in local DB
            // }
            
        }
    } catch (error) {
        console.error("Error fetching business owner details:", error);
        alert("An error occurred while processing the TIN.");
    }
    finally {
        searchTin.innerHTML = searchTinText; // Reset button text
        searchTin.disabled = false; // Enable the button
    }
});

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



// async function submitPreview(previewBusiName, previewEmail, previewPhone, tin, agentId) {
//     document.getElementById("preview-btn").addEventListener("click", function (e) {
//         e.preventDefault(); // Prevent form submission
//         // const prevBtn = document.getElementById("preview-btn");
//         // prevBtn.innerHTML =  `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Creating...`;
//         // prevBtn.disabled = true; // Disable the button
//         createBusinessOwner1(previewBusiName, previewEmail, previewPhone, tin, agentId); // Create user in local DB
//     });
// }

// async function submitPreview(previewBusiName, previewEmail, previewPhone, tin, agentId) {
//     // createBusinessOwner1(previewBusiName, previewEmail, previewPhone, tin, agentId); 
// }

document.getElementById("preview-form").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent form submission

    const preBuName = document.getElementById("preview-busi-name").value.trim();
    const prePh = document.getElementById("preview-phone").value.trim();
    const preEm = document.getElementById("preview-email").value.trim();
    const t = document.getElementById("tin-num").value.trim();

    createBusinessOwner1(preBuName, preEm, prePh, t, agentId)

    // submitPreview(previewBusiName, previewEmail, previewPhone, tin, agentId);
    const prevBtn = document.getElementById("preview-btn");
    prevBtn.innerHTML =  `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Creating...`;
    prevBtn.disabled = true; // Disable the button
   
});


async function createBusinessOwner1(firstName, email, phone, tin, agentId) {
    try {
        const response = await fetch(`${basePath}/auth/auto/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                business_name: firstName,
                email: email,
                phone: phone,
                tin: tin,
                agent_id: agentId,
            }),
        });

        if (response.ok) {
            const result = await response.json();
            alert(result.message);
            window.location.reload(); // Reload the page after successful registration
            // alert("User created successfully in local DB.");    
            console.log(result); // Log the result for debugging
            // return; // Return true if the user is created successfully
        } else {
            alert(result.message);
            throw new Error("Failed to create user in local DB");
        }
    } catch (error) {
        console.error("Error creating user in local DB:", error);
        
    }
    finally{
        document.getElementById("preview-btn").innerHTML = "Confirm";
        document.getElementById("preview-btn").disabled = false;
    }
}


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
        console.log("Business owner existence check result:", result); // Log the result for debugging
        return result.status === "success" && result.data ? true : false;
    } catch (error) {
        console.error("Error checking business owner in local DB:", error);
        return false;
    }
}



document.getElementById("signupForm").addEventListener("submit", async (event) => {
    event.preventDefault();

        const tinNum = document.getElementById("tin-num").value;
        const businessName = document.getElementById("businessName").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const address = document.getElementById("address").value.trim();
        const idType = getSelectedIdType();
        const idNumber = document.getElementById("idNumber").value.trim();
        const businessType = document.getElementById("businessType").value.trim();
        const sector = document.getElementById("sector").value.trim();
        const staffQuota = document.getElementById("staffQuota").value.trim();
        const cacNumber = document.getElementById("cacNumber").value.trim();
        const website = document.getElementById("website").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();

        const stateName = await getStateName(sId);
        const lgaName = await getLgaName(lgaId);
        const businessTypeId = await getBusinessType(businessType);

        const submitBtn = document.getElementById("submitBtn1");
        // const submitBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true; // Disable the button
        // const originalText = submitBtn.innerHTML; // Save the original button text
        submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Logging in...`;

        // call the function to create a business owner on IGR
        const res = await createBusinessOwnerOnIgr(businessName, email, phone, address, businessType, sector, cacNumber, staffQuota, stateName, lgaName, website);
        if (res.success) {
            // User created successfully on IGR DB
            console.log("User created successfully on IGR DB:", res.data);
            // await createBusinessOwner1(result.first_name, result.email, result.phone, tinNum, agentId); // Create user in local DB
        } else {
            // User creation failed on IGR DB
            console.error("Failed to create user on IGR DB:", res.error);
            return;
        }
        // await createBusinessOwnerOnIgr(businessName, email, phone, address, businessTypeId, sector, cacNumber, staffQuota, stateName, lgaName, website); // Create user on IGR DB
        // console.log(tin); // Log the TIN for debugging

        // call the function to create a business owner on local DB
        await createBusinessOwner(businessName, email, phone, address, idType, idNumber, businessTypeId, staffQuota, cacNumber, tinNum, password, sId, lgaId, sector, website, agentId); // Create user in local DB
        // console.log(tin); // Log the TIN for debugging

    
    });

// // Function to create a user
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
    finally {
        // Reset the button text and enable it
        const submitBtn = document.getElementById("submitBtn1");
        submitBtn.innerHTML = "submit";
        submitBtn.disabled = false; // Enable the button
    }
}



document.getElementById("no-tin").addEventListener("click", async (event) => {
    event.preventDefault();

    document.getElementById("signupForm").style.display = "block";
    document.getElementById("auto-fill-form").style.display = "none";
});



async function createBusinessOwnerOnIgr(businessName, email, phone, address, businessType, sector, cacNumber, staffQuota, stateName, lgaName, website) {
    try {

        const payload = {
            type: "corporate",
            organization_name: businessName,
            email: email,
            phone_number: phone,
            industry: businessType,
            sector: sector,
            cac_number: cacNumber,
            num_employees: staffQuota,
            address: address,
            state: stateName,
            lga: lgaName,
            website: website,
            created_by: "",
        };
        console.log(payload); // Log the payload for debugging
        // Send registration request
        const response = await fetch("https://plateauigr.com/testBack/tinGeneration/index.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            const result = await response.json();

            if (result.status === "error") {
                displayMessage(result.error || "Registration failed!", "red");
                return {success : false}; // Return false if there is an error in the response
            }

            console.log(result); // Log the result for debugging

            const tin = result.tin;
            if (!tin) {
                displayMessage("TIN generation failed. Please try again.", "red");
                return false; // Return false if TIN is not generated
            }

            return { success: true, data: result }; // Return true and the result data if successful
        } else {
            alert("Failed to register business owner on IGR.");
            return {success : false}; // Return false if the response is not OK
        }
    } catch (error) {
        console.error("An error occurred:", error);
        displayMessage("An unexpected error occurred. Please try again later.", "red");
        return {success : false}; // Return false if an exception occurs
    }
    finally {
        const submitBtn = document.getElementById("submitBtn1");
        submitBtn.innerHTML = "submit";
        submitBtn.disabled = false; // Enable the button
    }
}

