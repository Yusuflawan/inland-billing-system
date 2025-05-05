async function getBusinessOwner() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        document.getElementById('business-owner-details').innerText = "No ID provided.";
        return;
    }

    try {
        const response = await fetch(`${basePath}/admin/business-owner/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch business owner");
        }

        const result = await response.json();
        const data = result.data;

        console.log("Business owner:", data);

        // Populate your page with the data here (example)
        document.getElementById('business-name').textContent = data.business_name || "N/A";
        document.getElementById('email').textContent = data.email || "N/A";
        document.getElementById('status').textContent = data.status || "N/A";
        document.getElementById('state').textContent = data.state || "N/A";
        document.getElementById('lga').textContent = data.lga || "N/A";
        document.getElementById('tin').textContent = data.tin || "N/A";
        document.getElementById('id-type').textContent = data.id_type || "N/A";
        document.getElementById('id-number').textContent = data.id_number || "N/A";
        document.getElementById('phone').textContent = data.phone || "N/A";
        document.getElementById('business-type').textContent = data.business_type || "N/A";
        // document.getElementById('email').textContent = data.email || "N/A";

    } catch (error) {
        console.error("Error fetching business owner:", error);
    }
}

getBusinessOwner();
