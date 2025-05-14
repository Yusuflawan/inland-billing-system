// create a base path for the api
// const basePath = 'http://localhost:8080/billing-system/backend';
// const agentId = localStorage.getItem("agentId");
agentId = parseInt(localStorage.getItem("agentId"), 10);

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
            const isDisabled = notice.status === "unpaid" ? "disabled" : "";
            const isPayDisabled = notice.status === "paid" ? "disabled" : "";

            // Prefer `amount`, but use `renewal_amount` if `amount` is null or undefined
            const amount = notice.amount != null ? notice.amount : notice.renewal_amount;
            const dueDate = new Date(notice.created_at);
            const formattedDueDate = dueDate.toISOString().split('T')[0];
 
            dataTable.row.add([
                index + 1, // Row number
                notice.business_name || "N/A",
                notice.tin || "N/A",
                notice.demand_notice_number || "N/A",
                notice.revenue_head || "N/A",
                amount || "N/A", // Use the selected amount value
                // notice.created_at || "N/A",
                formattedDueDate || "N/A", // Use the formatted due date
                notice.status || "N/A",
                `<div>
                    <button class="view-btn btn btn-outline-success" data-id="${notice.demand_notice_number}">View</button>
                    <button class="pay-btn btn btn-outline-primary" data-notice="${notice.demand_notice_number}" ${isPayDisabled}>Pay Now</button>
                    <button class="certificate-btn btn btn-outline-primary" data-certificate="${notice.business_owner_id}" ${isDisabled}>Certificate</button>
                </div>
                `
            ]).draw(false);
        });
        
        
        // revenueHead
        // console.log("notice loaded successfully");

        setInterval(async () => {
            // Filter unpaid notices from the local database
            const unpaidNotices = demandNotice.filter(notice => notice.status === "unpaid");
        
            for (const notice of unpaidNotices) {
                try {
                    // Send a POST request to verify the payment status
                    const verifyResponse = await fetch(`http://plateauigr.com/php/pipe/index.php`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            "merchantId": "2011LASU01",
                            "requestId": "1323244255",
                            "invoiceNumber": notice.demand_notice_number,
                            "event": "invoice verification"
                        }),
                    });
        
                    if (!verifyResponse.ok) {
                        throw new Error(`Failed to verify payment for ${notice.demand_notice_number}`);
                    }
        
                    const verifyResult = await verifyResponse.json();
                    // console.log(`Payment verification result for ${notice.demand_notice_number}:`, verifyResult);
        
                    // Check if the response indicates success and contains the payment status
                    if (verifyResult.status === 1 && verifyResult.message.length > 0) {
                        const externalNotice = verifyResult.message[0]; // Get the external notice details
                        const paymentStatus = externalNotice.payment_status; // Extract payment status
        
                        // Update the status if payment is verified as "paid"
                        if (paymentStatus === "paid" && externalNotice.invoice_number === notice.demand_notice_number) {

                            console.log("Payment verified successfully:", externalNotice.invoice_number + " " + notice.demand_notice_number);
                            // Call the function to update the status in the local database
                            const success = await updateStatus(notice.demand_notice_number, paymentStatus);
        
                            if (success) {
                                // create payment history
                                await setPaymentHistory(
                                    externalNotice.invoice_number,
                                    externalNotice.amount_paid,
                                    externalNotice.date_created,
                                    externalNotice.payment_status,
                                    externalNotice.tin,
                                    externalNotice.revenue_item
                                    );
                                // Update the status in the local array
                                notice.status = "paid";
        
                                // Update the DataTable row
                                const rowIndex = demandNotice.indexOf(notice);
                                const row = dataTable.row(rowIndex);
                                const rowData = row.data();
                                rowData[7] = "paid"; // Update the status column
                                row.data(rowData).draw(false);
                            }
                        }
                    } else {
                        console.warn(`Payment verification failed or invalid response for ${notice.demand_notice_number}`);
                    }
                } catch (error) {
                    console.error(`Error verifying payment for ${notice.demand_notice_number}:`, error);
                }
            }
        }, 5000); // 5 seconds interval

    } catch (error) {
        console.error("Error fetching notice:", error);
        // Optionally, display an error message to the user
    }

    $(document).on('click', '.view-btn', function() {
        const id = $(this).data('id'); // get the ID
        // const url = `${basePath}/demand-notice/view/${id}`;
        const url = `../shared/view-demand-notice.html?id=${id}`;
    
        window.open(url, '_blank');
    });

    $(document).on('click', '.pay-btn', function() {
        const demandNoticeNumber = $(this).data('notice'); // Get the demand notice number
        // Open a new page with an iframe
        window.open(`../shared/payment.html?invnumber=${demandNoticeNumber}`, '_blank');
    });

    $(document).on('click', '.certificate-btn', function() {
        const businessOwnerId = $(this).data('certificate'); // get the ID
        const url = `../shared/certificate.html?id=${businessOwnerId}`;
    
        window.open(url, '_blank');
    });
    
});


async function updateStatus(demandNoticeNumber, status) {
    try {
        const response = await fetch(`${basePath}/demand-notices/${demandNoticeNumber}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            throw new Error("Failed to update payment status");
        }

        const result = await response.json();

        if (result.status !== "success") {
            throw new Error("Failed to update payment status in the database");     
        }

        return true;
        console.log("Payment status updated successfully:", result);
    } catch (error) {
        console.error("Error updating payment status:", error);
        return false;
    }
}

async function setPaymentHistory(invoiceNumber, amountPaid, paymentDate, paymentStatus, tin, revenueItem) {
    try {
        const payload = {
            invoice_number: invoiceNumber,
            amount_paid: amountPaid,
            payment_date: paymentDate,
            payment_status: paymentStatus,
            tin: tin,
            revenue_item: revenueItem,
            agent_id: agentId
        };

        const response = await fetch(`${basePath}/payment-history`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error("Failed to update payment history");
        }

        const result = await response.json();

        if (result.status !== "success") {
            throw new Error("Failed to update payment history in the database");
        }

        console.log("Payment history updated successfully:", result);
        return true;
    } catch (error) {
        console.error("Error updating payment history:", error);
        return false;
    }
}