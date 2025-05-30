// create a base path for the api
const bPath = 'http://localhost:8080/billing-system/backend';

// const bPath = 'http://208.115.219.90/~premisre/backend';

async function fetchDemandNotice() {
    // Step 1: Get the ID from the URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        document.getElementById('notice-details').innerText = "No ID provided.";
        return;
    }
 
    try {
        // Step 2: Fetch the demand notice using async/await
        const response = await fetch(`${bPath}/demand-notice/view/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        }); 

        if (!response.ok) {
            throw new Error("Failed to fetch demand notice");
        }
 
        const result = await response.json();
        const notice = result.data[0]; // Access the first object in the data array

        if (notice) {
            console.log(notice); // Check the response in the console
        
            // Step 3: Set the fields using the data
            document.getElementById("demand-notice-ref-number").textContent = notice.demand_notice_number || 'N/A';
        
            // Format the due date
            const dueDate = new Date(notice.created_at);
            const formattedDueDate = dueDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
            document.getElementById("due-date").textContent = formattedDueDate || 'N/A';
        
            // Calculate and format the expiry date (14 days after the due date)
            const expiryDate = new Date(dueDate);
            expiryDate.setDate(dueDate.getDate() + 14); // Add 14 days
            const formattedExpiryDate = expiryDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
            document.getElementById("expiry-date").textContent = formattedExpiryDate || 'N/A';
        
            // Assuming you have IDs for business name and address too
            document.getElementById("business-name").textContent = notice.business_name || 'N/A';
            document.getElementById("business-address").textContent = notice.address || 'N/A';
        
            // Set the amount value, using either amount or renewal_amount (which was handled in the SQL query)
            document.getElementById("amount").textContent = notice.amount || 'N/A'; // This will already be either amount or renewal_amount based on the query
        
            document.getElementById("revenue-head").textContent = notice.revenue_head || 'N/A';
        } else {
            document.getElementById('notice-details').innerText = "No demand notice found.";
        }

    } catch (error) {
        console.error(error);
        document.getElementById('notice-details').innerText = "Error loading demand notice.";
    }
}

// Call the function when the page loads
fetchDemandNotice();



