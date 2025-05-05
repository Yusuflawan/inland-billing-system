// Data for the chart
const invoiceData = {
    labels: ['Paid Invoices', 'Unpaid Invoices'], // Labels for the chart
    datasets: [{
        label: 'Invoices',
        data: [9, 9], // Replace with dynamic data if needed
        backgroundColor: ['#4caf50', '#f44336'], // Colors for paid and unpaid invoices
        hoverOffset: 4
    }]
};

// Configuration for the chart
const invoiceConfig = {
    type: 'doughnut', // Doughnut chart type
    data: invoiceData,
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top', // Position of the legend
            },
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        return tooltipItem.label + ': ' + tooltipItem.raw + ' invoices';
                    }
                }
            }
        }
    }
};

// Render the chart
const ctx = document.getElementById('invoiceDoughnutChart').getContext('2d');
new Chart(ctx, invoiceConfig);



// Data for the chart
const data = {
    labels: ['Paid Invoices', 'Unpaid Invoices'],
    datasets: [{
        label: 'Invoice Distribution',
        data: [34000000, 12000000], // Replace with dynamic data if needed
        backgroundColor: ['#4caf50', '#f44336'], // Colors for the chart
        hoverOffset: 4
    }]
};

// Configuration for the chart
const config = {
    type: 'pie', // Change to 'bar' for a bar chart
    data: data,
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        return tooltipItem.label + ': NGN ' + tooltipItem.raw.toLocaleString();
                    }
                }
            }
        }
    }
};

// Render the chart
const ctx1 = document.getElementById('invoiceChart').getContext('2d');
new Chart(ctx1, config);





// Data for the chart
const defaultersData = {
    labels: ['John Doe', 'Jane Smith', 'Michael Brown', 'Emily Davis', 'Chris Wilson'], // Replace with defaulters' names
    datasets: [{
        label: 'Unpaid Amount (NGN)',
        data: [5000000, 4000000, 3000000, 2000000, 1000000], // Replace with unpaid amounts
        backgroundColor: ['#f44336', '#ff9800', '#ffc107', '#4caf50', '#2196f3'], // Colors for the bars
        borderWidth: 1
    }]
};

// Configuration for the chart
const defaultersConfig = {
    type: 'bar', // Use 'bar' for vertical bars or 'horizontalBar' for horizontal bars
    data: defaultersData,
    options: {
        indexAxis: 'y', // Makes the bar chart horizontal
        responsive: true,
        plugins: {
            legend: {
                display: false // Hides the legend for simplicity
            },
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        return 'NGN ' + tooltipItem.raw.toLocaleString(); // Format the tooltip
                    }
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Unpaid Amount (NGN)'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Defaulters'
                }
            }
        }
    }
};

// Render the chart
const ctx2 = document.getElementById('topDefaultersChart').getContext('2d');
new Chart(ctx2, defaultersConfig);