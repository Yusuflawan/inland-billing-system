async function getAgent() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        document.getElementById('agent-details').innerText = "No ID provided.";
        return;
    }

    try {
        const response = await fetch(`${basePath}/agent/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch agent");
        }

        const result = await response.json();
        const data = result.data;

        console.log("Agent:", data);

        // Populate your page with the data here (example)
        document.getElementById('name').textContent = data.first_name + " " + data.last_name || "N/A";
        document.getElementById('email').textContent = data.email || "N/A";
        document.getElementById('address').textContent = data.address || "N/A";
        document.getElementById('status').textContent = data.status || "N/A";
        document.getElementById('state').textContent = data.state_name || "N/A";
        document.getElementById('lga').textContent = data.lga_name || "N/A";
        document.getElementById('phone').textContent = data.phone || "N/A";
        document.getElementById('created-at').textContent = data.created_at || "N/A";

    } catch (error) {
        console.error("Error fetching agent:", error);
    }
}

getAgent();
