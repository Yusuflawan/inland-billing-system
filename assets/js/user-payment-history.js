// create a base path for the api
// const basePath = 'http://localhost:8080/billing-system/backend';
// const basePath = 'http://208.115.219.90/~premisre/backend';

const tin = localStorage.getItem("userTin");

document.addEventListener("DOMContentLoaded", async () => {
    const userId = localStorage.getItem("userId"); // Get user ID from localStorage

    if (!userId) {
        console.error("User ID not found in localStorage");
        return;
    }

    try {
        // Make GET request to fetch payment history
        const response = await fetch(`${basePath}/business-owners/payment-history/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch payment history");
        }

        const result = await response.json();
        const paymentHistory = result.data; // Access the 'data' array from the response

        console.log(paymentHistory);

        // Initialize DataTable
        const dataTable = $(".display").DataTable();

        // Populate the table with the payment history data
        paymentHistory.forEach((payment, index) => {
            dataTable.row.add([
                index + 1,
                // payment.id || "N/A",
                payment.payment_date || "N/A",
                payment.notice_number || "N/A",
                payment.amount || "N/A",
                payment.status || "N/A"
            ]).draw(false); // Add the row and redraw the table
        });

        console.log("Payment history loaded successfully");
    } catch (error) {
        console.error("Error fetching payment history:", error);
        // Optionally, display an error message to the user
    }
});