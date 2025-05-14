// create a base path for the api
// const basePath = 'http://localhost:8080/billing-system/backend';

document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.querySelector("#example tbody");

    const agentId = localStorage.getItem("agentId");

    try {
        // Make GET request to fetch business owners
        const response = await fetch(`${basePath}/agent/${agentId}/blacklist-businesses`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch business owners");
        }

        const result = await response.json();
        const businesses = result.data; // Access the 'data' array from the response

        // console.log(businesses);

        const dataTable = $(".display").DataTable();

        businesses.forEach((business, index) => {

            const dueDate = new Date(business.created_at);
            const formattedDueDate = dueDate.toISOString().split('T')[0];

            dataTable.row.add([
                index + 1,
                business.business_owner || "N/A",
                business.business_name || "N/A",
                business.phone || "N/A",
                business.email || "N/A",
                business.address || "N/A",
                // business.created_at || "N/A",
                formattedDueDate || "N/A",
                business.reason || "N/A"
            ]).draw(false); // Add the row and redraw the table
        });

        console.log("Business owners loaded successfully");
    } catch (error) {
        console.error("Error fetching business owners:", error);
        // Optionally, display an error message to the user
    }
});