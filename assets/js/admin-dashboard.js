 // const basePath = 'http://208.115.219.90/~premisre/backend';
// const basePath = 'http://localhost:8080/billing-system/backend';

// const a = localStorage.getItem("adminId");
// console.log("Admin id: " + a)
document.addEventListener("DOMContentLoaded", async () => {

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
        const response = await fetch(`${basePath}/admin/agent/count`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch agents count");
        }

        const result = await response.json();
        const data = result.data;

        console.log(data);
        document.getElementById("agent-count").innerText = data.count;
        console.log("Agent count loaded successfully");
    } catch (error) {
        console.error("Error fetching agent count:", error);
    }

    try {
        const response = await fetch(`${basePath}/admin/demand-notices/count`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch demand notices count");
        }

        const result = await response.json();
        const data = result.data;

        console.log(data);
        document.getElementById("demand-notice-count").innerText = data.count;
        console.log("Demand Notices count loaded successfully");
    } catch (error) {
        console.error("Error fetching demand notice count:", error);
    }

    try {
        const response = await fetch(`${basePath}/admin/demand-notices/paid/count`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch paid demand notices count");
        }

        const result = await response.json();
        const data = result.data;

        console.log(data);
        document.getElementById("paid-demand-notice-count").innerText = data.count;
        console.log("Demand Notices count loaded successfully");
    } catch (error) {
        console.error("Error fetching demand notice count:", error);
    }

    try {
        const response = await fetch(`${basePath}/admin/demand-notices/unpaid/count`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch paid demand notices count");
        }

        const result = await response.json();
        const data = result.data;

        console.log(data);
        document.getElementById("unpaid-demand-notice-count").innerText = data.count;
        console.log("Demand Notices count loaded successfully");
    } catch (error) {
        console.error("Error fetching demand notice count:", error);
    }

    try {
        const response = await fetch(`${basePath}/admin/total-amount/paid`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch paid demand notices count");
        }

        const result = await response.json();
        const data = result.data;

        console.log(data);
        document.getElementById("total-amount-paid").innerText = data.total_amount;
        console.log("Demand Notices count loaded successfully");
    } catch (error) {
        console.error("Error fetching demand notice count:", error);
    }

    try {
        const response = await fetch(`${basePath}/admin/total-amount/unpaid`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch paid demand notices count");
        }

        const result = await response.json();
        const data = result.data;

        console.log(data);
        document.getElementById("total-amount-unpaid").innerText = data.total_amount;
        console.log("Demand Notices count loaded successfully");
    } catch (error) {
        console.error("Error fetching demand notice count:", error);
    }

});