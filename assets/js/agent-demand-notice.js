// create a base path for the api
// const basePath = 'http://localhost:8080/billing-system/backend';
const agentId = localStorage.getItem("agentId");

document.addEventListener("DOMContentLoaded", async () => {

    if (!agentId) {
        console.error("Agent ID not found in localStorage");
        return;
    }

    try {
        // Make GET request to fetch payment history
        const response = await fetch(`${basePath}/agent/${agentId}/demand-notices`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch payment history");
        }

        const result = await response.json();
        const demandNotice = result.data; // Access the 'data' array from the response

        console.log(demandNotice);

        // Initialize DataTable
        const dataTable = $(".display").DataTable();

        // Populate the table with the payment history data
        demandNotice.forEach((notice, index) => {
            // Prefer `amount`, but use `renewal_amount` if `amount` is null or undefined
            const amount = notice.amount != null ? notice.amount : notice.renewal_amount;
        
            dataTable.row.add([
                index + 1, // Row number
                notice.business_name || "N/A",
                notice.tin || "N/A",
                notice.demand_notice_number || "N/A",
                notice.revenue_head || "N/A",
                amount || "N/A", // Use the selected amount value
                notice.created_at || "N/A",
                notice.status || "N/A",
                `<button class="view-btn btn btn-outline-success" data-id="${notice.demand_notice_number}">View</button>`
            ]).draw(false);
        });
        
        
        // revenueHead
        console.log("notice loaded successfully");
    } catch (error) {
        console.error("Error fetching notice:", error);
        // Optionally, display an error message to the user
    }

    $(document).on('click', '.view-btn', function() {
        const id = $(this).data('id'); // get the ID
        // const url = `${basePath}/demand-notice/view/${id}`;
        const url = `view-demand-notice.html?id=${id}`;
    
        window.open(url, '_blank');
    });
    
});