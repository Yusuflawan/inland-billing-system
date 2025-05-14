// create a base path for the api
// const basePath = 'http://localhost:8080/billing-system/backend';
// const basePath = 'http://208.115.219.90/~premisre/backend';

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".needs-validation");

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent the default form submission
        event.stopPropagation(); // Stop propagation of the event

        // Check if the form is valid
        if (!form.checkValidity()) {
            form.classList.add("was-validated");
            return;
        }

        const agentId = localStorage.getItem("agentId");

        // Collect form values
        const fullName = document.getElementById("fullName").value.trim();
        const businessName = document.getElementById("businessName").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const email = document.getElementById("email").value.trim();
        const address = document.getElementById("address").value.trim();
        const reason = document.getElementById("reason").value.trim();

        const reportButton = document.getElementById("reportBtn");
        // Add loader and disable the button
        reportButton.disabled = true; // Disable the button
        const originalText = reportButton.innerHTML; // Save the original button text
        reportButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Reporting...`;

        // Prepare the payload
        const payload = {
            business_owner: fullName,
            reported_by: agentId,
            business_name: businessName,
            phone: phone,
            email: email,
            address: address,
            reason: reason,
        };

        try {
            // Make the POST request
            const response = await fetch(`${basePath}/agent/blacklist-business`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Failed to submit the blacklist report");
            }

            const result = await response.json();
            // console.log("Blacklist report submitted successfully:", result);

            // Optionally, show a success message or redirect
            alert("Blacklist report submitted successfully!");
            form.reset(); // Reset the form
            form.classList.remove("was-validated");
        } catch (error) {
            console.error("Error submitting blacklist report:", error);
            alert("An error occurred while submitting the report. Please try again.");
        }
        finally {
            // Re-enable the button and reset its text
            reportButton.disabled = false; // Re-enable the button
            reportButton.innerHTML = originalText; // Reset the button text
        }
    });
});