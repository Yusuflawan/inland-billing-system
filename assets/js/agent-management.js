// make a get request to the server to get the agent list when the page loads
document.addEventListener("DOMContentLoaded", async () => {

    try {
        // Make GET request to fetch payment history
        const response = await fetch(`${basePath}/agents`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Agents");
        }

        const result = await response.json();
        const agents = result.data; // Access the 'data' array from the response

        console.log(agents);

        // Initialize DataTable
        const dataTable = $(".display").DataTable();

        // Populate the table with the payment history data
        agents.forEach((agent, index) => {
            dataTable.row.add([
                index + 1,
                `${agent.first_name} ${agent.last_name || "N/A"}`,
                agent.phone || "N/A",
                agent.email || "N/A",
                agent.created_at || "N/A",
                `<td>
                    <span class="btn light btn-${agent.status === "Active" ? "success" : "danger"} btn-sm">
                        ${agent.status || "N/A"}
                    </span>
                </td>`,

                `<td class="">
                    <div class="d-flex align-items-center justify-content-center">
                        <div class="dropdown custom-dropdown">
                            <div class="btn sharp btn-secondary light icon-box  border-0 me-0 " data-bs-toggle="dropdown">
                                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.47908 4.58333C8.47908 3.19 9.60659 2.0625 10.9999 2.0625C12.3933 2.0625 13.5208 3.19 13.5208 4.58333C13.5208 5.97667 12.3933 7.10417 10.9999 7.10417C9.60658 7.10417 8.47908 5.97667 8.47908 4.58333ZM12.1458 4.58333C12.1458 3.95083 11.6324 3.4375 10.9999 3.4375C10.3674 3.4375 9.85408 3.95083 9.85408 4.58333C9.85408 5.21583 10.3674 5.72917 10.9999 5.72917C11.6324 5.72917 12.1458 5.21583 12.1458 4.58333Z" fill="#252289"/>
                                    <path d="M8.47908 17.4163C8.47908 16.023 9.60659 14.8955 10.9999 14.8955C12.3933 14.8955 13.5208 16.023 13.5208 17.4163C13.5208 18.8097 12.3933 19.9372 10.9999 19.9372C9.60658 19.9372 8.47908 18.8097 8.47908 17.4163ZM12.1458 17.4163C12.1458 16.7838 11.6324 16.2705 10.9999 16.2705C10.3674 16.2705 9.85408 16.7838 9.85408 17.4163C9.85408 18.0488 10.3674 18.5622 10.9999 18.5622C11.6324 18.5622 12.1458 18.0488 12.1458 17.4163Z" fill="#252289"/>
                                    <path d="M8.47908 11.0003C8.47908 9.60699 9.60659 8.47949 10.9999 8.47949C12.3933 8.47949 13.5208 9.60699 13.5208 11.0003C13.5208 12.3937 12.3933 13.5212 10.9999 13.5212C9.60658 13.5212 8.47908 12.3937 8.47908 11.0003ZM12.1458 11.0003C12.1458 10.3678 11.6324 9.85449 10.9999 9.85449C10.3674 9.85449 9.85408 10.3678 9.85408 11.0003C9.85408 11.6328 10.3674 12.1462 10.9999 12.1462C11.6324 12.1462 12.1458 11.6328 12.1458 11.0003Z" fill="#252289"/>
                                </svg>
                            </div>
                            <div class="dropdown-menu dropdown-menu-end">
                            <button type="button" class="dropdown-item view-btn" data-id="${agent.id}">View Account</button>
                            <button type="button" class="dropdown-item delete-btn" data-id="${agent.id}">Deactivate Account</button>
                            </div>
                        </div>
                    </div>
                </td>`
            ]).draw(false); // Add the row and redraw the table
        });
        // revenueHead
        console.log("Agents loaded successfully");
    } catch (error) {
        console.error("Error fetching notice:", error);
        // Optionally, display an error message to the user
    }
});

// Use event delegation in case the table is dynamic
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("view-btn")) {
        const id = e.target.getAttribute("data-id");
        if (id) {
            window.location.href = `view-agent.html?id=${id}`;
        }
    }
});

document.addEventListener("click", function (e) {
    if (e.target.classList.contains("delete-btn")) {
        const id = e.target.getAttribute("data-id");
        if (id) {
            alert(id)
            // window.location.href = `view-agent.html?id=${id}`;
        }
    }
});
