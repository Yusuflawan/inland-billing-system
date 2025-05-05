 // const basePath = 'http://208.115.219.90/~premisre/backend';
// const basePath = 'http://localhost:8080/billing-system/backend';

let businessOwnerId = localStorage.getItem("userId");

console.log("Business owner ID is: " + businessOwnerId)

document.addEventListener("DOMContentLoaded", async () => {

    try {
        const response = await fetch(`${basePath}/business-owner/${businessOwnerId}/demand-notices/count`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache"
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
        const response = await fetch(`${basePath}/business-owner/${businessOwnerId}/demand-notices/paid/count`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache"
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
        
        const response = await fetch(`${basePath}/business-owner/${businessOwnerId}/demand-notices/unpaid/count`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache"
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
        
        const response = await fetch(`${basePath}/business-owner/${businessOwnerId}/total-amount/paid`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache"
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
        
        const response = await fetch(`${basePath}/business-owner/${businessOwnerId}/total-amount/unpaid`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache"
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