
// create a base path for the api
// const basePath = 'http://localhost:8080/billing-system/backend';
// const basePath = 'http://208.115.219.90/~premisre/backend';

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

        // console.log(states); // Log the states for debugging

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
    console.log("Selected LGA ID:", lgId); // Debugging
    });

    // Handle Form Submission
    document.getElementById("signupForm").addEventListener("submit", async function (e) {
        e.preventDefault();

        // Get input values
        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const address = document.getElementById("address").value.trim();
        const state = document.getElementById("states").value.trim();
        const lga = document.getElementById("lga").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();

        // Validate inputs
        if (!firstName || !lastName || !email || !phone || !state || !lga || !address) {
            displayMessage("Please fill in all required fields.", "red");
            return;
        }

        if (password !== confirmPassword) {
            displayMessage("Passwords do not match.", "red");
            return;
        }

        try {
            const payload = {
                first_name: firstName,
                last_name : lastName,
                email : email,
                phone: phone,
                address :address,
                state: sId,
                lga: lgaId,
                role : "agent",
                password : password  
            }

            // make a post request to the api to create a new agent
            const response = await fetch(`${basePath}/agent/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            console.log(result); // Log the result for debugging

            if (!response.ok) {
                throw new Error("Failed to fetch LGAs");
                alert(result.message);
                return;
            }

            alert(result.message); // Show success message

        } catch (error) {
            console.error("Error Creating Agent:", error);
        }

    });

});


