document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.querySelector("#example6 tbody"); // Select the table body

    try {
        // Make GET request to fetch business owners
        const response = await fetch(`${basePath}/admin/business-owners`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch business owners");
        }

        const result = await response.json();
        const businessOwners = result.data; // Access the 'data' array from the response

        // console.log(businessOwners);

        // Populate the table with the business owners data
        businessOwners.forEach((businessOwner, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${index + 1}</td>
                <td class="whitesp-no p-0">
                    <h6 class="font-w500 fs-15 mb-0">${businessOwner.business_name}</h6>
                </td>
                <td class="whitesp-no p-0">
                    <span class="fs-14 font-w400">${businessOwner.email || "N/A"}</span>
                </td>
                <td>${businessOwner.tin || "N/A"}</td> <!-- TIN -->
                <td>${businessOwner.created_at || "N/A"}</td>
                <td>
                    <span class="btn light btn-${businessOwner.status === "Active" ? "success" : "danger"} btn-sm">
                        ${businessOwner.status || "N/A"}
                    </span>
                </td> <!-- Status -->
                <td>${businessOwner.agent_first_name || "None"} ${businessOwner.agent_last_name || "None"}</td>
                <td>
                    <button type="button" data-id="${businessOwner.id}" class="btn btn-outline-success btn-sm view-btn">
                        View
                    </button>

                </td>
            `;

            tableBody.appendChild(row);
        });

        console.log("Business owners loaded successfully");
    } catch (error) {
        console.error("Error fetching business owners:", error);
        // Optionally, display an error message to the user
    }

    
    try {
        
        const response = await fetch(`${basePath}/admin/business-owners/count`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch business owners count");
        }

        const result = await response.json();
        const data = result.data;

        console.log(data);
        document.getElementById("busines-owners-count").innerText = data.count;
        console.log("Business Owners count loaded successfully");
    } catch (error) {
        console.error("Error fetching business owner count:", error);
    }

    try {
        
        const response = await fetch(`${basePath}/admin/business-owners/active/count`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch business owners count");
        }

        const result = await response.json();
        const data = result.data;

        console.log(data);
        document.getElementById("active-busines-owners-count").innerText = data.count;
        console.log("Business Owners count loaded successfully");
    } catch (error) {
        console.error("Error fetching business owner count:", error);
    }

    try {
        
        const response = await fetch(`${basePath}/admin/business-owners/inactive/count`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch business owners count");
        }

        const result = await response.json();
        const data = result.data;
  
        console.log(data);
        document.getElementById("inactive-busines-owners-count").innerText = data.count;
        console.log("Business Owners count loaded successfully");
    } catch (error) {
        console.error("Error fetching business owner count:", error);
    }


});



// $(document).on('click', '#view-btn', function() {
//     const id = $(this).data('id'); // get the ID
//     // const url = `${basePath}/demand-notice/view/${id}`;
//     const url = `view-business-owner.html?id=${id}`;

//     // window.location.href = url;
// });

// Use event delegation in case the table is dynamic
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("view-btn")) {
        const id = e.target.getAttribute("data-id");
        if (id) {
            window.location.href = `view-business-owner.html?id=${id}`;
        }
    }
});


