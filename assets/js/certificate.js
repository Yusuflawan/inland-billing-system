
// const basePath = 'http://208.115.219.90/~premisre/backend';
const basePath = 'http://localhost:8080/billing-system/backend';

document.addEventListener("DOMContentLoaded", async function() {
    const params = new URLSearchParams(window.location.search);
    const busisnessOwnerId = params.get('id'); // Correctly fetch the ID from the query parameter

    if (!busisnessOwnerId) {
        alert("ID is required");
        return;
    }

    // Fetch business owner details
    try {
        const response = await fetch(`${basePath}/business-owner/${busisnessOwnerId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch business owner details.");
        }

        const result = await response.json();
        const businessOwnerData = result.data; // Rename this variable to avoid conflict

        // console.log(businessOwnerData);

        document.getElementById('business-name').innerText = businessOwnerData.business_name;
        document.getElementById('lga').innerText = businessOwnerData.lga;

    } catch (error) {
        console.error(error);
        document.getElementById('notice-details').innerText = "Error loading demand notice.";
    }
});