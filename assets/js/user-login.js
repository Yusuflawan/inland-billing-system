  
  // create a base path for the api
const basePath = 'http://localhost:8080/billing-system/backend';
// const basePath = 'http://208.115.219.90/~premisre/backend';
  
// Function to display messages
function displayMessage(message, color) {
    const messageElement = document.getElementById("message");
    messageElement.innerText = message;
    messageElement.style.color = color;
    messageElement.style.display = "block";
}

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('loginForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        // Get input values
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        // Validate inputs
        if (!email || !password) {
            // document.getElementById('message').innerText = 'Please enter both email and password.';
            displayMessage('Please enter both email and password.', "red");
            return;
        }

        try {
            // Send login request
            const response = await fetch(`${basePath}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const result = await response.json();
            
                if (result.status === 'error') {
                    displayMessage(result.message, "red");
                    return;
                }
            
                // Save token in localStorage
                localStorage.setItem('token', result.token);
                displayMessage(result.message, "green");
            
                // Redirect to the agent dashboard
                window.location.href = '../business-owner/dashboard.html';
            } else {
                // Handle specific HTTP status codes
                let errorMessage;
                switch (response.status) {
                    case 400:
                        errorMessage = 'Invalid request. Please check your input and try again.';
                        break;
                    case 401:
                        errorMessage = 'Unauthorized: Please check your credentials.';
                        break;
                    // case 403:
                    //     errorMessage = 'Access denied. You do not have permission to perform this action.';
                    //     break;
                    // case 404:
                    //     errorMessage = 'The requested resource was not found. Please try again later.';
                    //     break;
                    case 429:
                        errorMessage = 'You have made too many requests. Please wait and try again later.';
                        break;
                    case 500:
                        errorMessage = 'An error occurred on the server. Please try again later.';
                        break;
                    case 503:
                        errorMessage = 'The service is currently unavailable. Please try again later.';
                        break;
                    default:
                        errorMessage = `Request failed with status: ${response.status}`;
                }
                document.getElementById('message').innerText = errorMessage;
            }
        } catch (error) {
            // Handle network or unexpected errors
            console.error('An error occurred:', error);
            document.getElementById('message').innerText = 'An unexpected error occurred. Please try again later.';
        }

    });

});
