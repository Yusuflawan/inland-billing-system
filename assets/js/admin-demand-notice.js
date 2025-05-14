// create a base path for the api
// const basePath = 'http://localhost:8080/billing-system/backend';
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch(`${basePath}/admin/demand-notices`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch payment history");
        }

        const result = await response.json();
        const demandNotice = result.data || []; // Ensure 'data' exists

        console.log(demandNotice);

        // Initialize DataTable
        const dataTable = $(".display").DataTable();

        // Check if data exists
        if (demandNotice.length === 0) {
            console.warn("No demand notices found.");
            return;
        } 

        // Populate the table with the payment history data
        demandNotice.forEach((notice, index) => {

            const dueDate = new Date(notice.created_at);
            const formattedDueDate = dueDate.toISOString().split('T')[0];

            dataTable.row.add([
                index + 1, // Add the index (row number), starting from 1
                notice.business_name || "N/A",
                notice.tin || "N/A",
                notice.demand_notice_number || "N/A",
                notice.revenue_head || "N/A",
                notice.amount || "N/A",
                // notice.created_at || "N/A",
                formattedDueDate || "N/A",
                `${notice.agent_first_name || ""} ${notice.agent_last_name || ""}`,
                notice.status || "N/A",
                `<button class="view-btn btn btn-outline-success" data-id="${notice.demand_notice_number}">View</button>`
            ]).draw(false); // Add the row and redraw the table
        });

        console.log("Notice loaded successfully");
    } catch (error) {
        console.error("Error fetching notice:", error);
    }

    $(document).on('click', '.view-btn', function() {
        const id = $(this).data('id'); // get the ID
        // const url = `${basePath}/demand-notice/view/${id}`;
        const url = `../shared/view-demand-notice.html?id=${id}`;
    
        window.open(url, '_blank');
    });

    
});