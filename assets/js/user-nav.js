let headerTitle = "";

function displayHeaderTitile(title) {
  document.getElementById("header-titl").innerText = title;
}


$("#theFullNav").html(`
  <div class="nav-header">
        <a href="../index.html" class="brand-logo">
        <img style="width: 4rem; height: 4rem; border-radius: 50%;" src="../assets/images/ministry-logo.JPG" alt="">
        <div class="brand-title">
          <h3 class="mb-0" style="color: #fff;">TaX System</h3>
        </div>
        </a>
      <div class="nav-control">
        <div class="hamburger">
          <span class="line"></span><span class="line"></span><span class="line"></span>
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="22" y="11" width="4" height="4" rx="2" fill="#2A353A" />
            <rect x="11" width="4" height="4" rx="2" fill="#2A353A" />
            <rect x="22" width="4" height="4" rx="2" fill="#2A353A" />
            <rect x="11" y="11" width="4" height="4" rx="2" fill="#2A353A" />
            <rect x="11" y="22" width="4" height="4" rx="2" fill="#2A353A" />
            <rect width="4" height="4" rx="2" fill="#2A353A" />
            <rect y="11" width="4" height="4" rx="2" fill="#2A353A" />
            <rect x="22" y="22" width="4" height="4" rx="2" fill="#2A353A" />
            <rect y="22" width="4" height="4" rx="2" fill="#2A353A" />
          </svg>
        </div>
      </div>
    </div>
    <!--**********************************
            Nav header end
        ***********************************-->

    <!--**********************************
            Header start
        ***********************************-->
    <div class="header">
      <div class="header-content">
        <nav class="navbar navbar-expand">
          <div class="collapse navbar-collapse justify-content-between">
            <div class="header-left">
              <div class="header-title">
                <h3 id="header-titl" class="mb-0"></h3>
              </div>
            </div>
            <ul class="navbar-nav header-right">
              <li class="nav-item">
                <div class="dropdown header-profile2">
                  <a class="nav-link" href="javascript:void(0);" role="button" data-bs-toggle="dropdown"
                    aria-expanded="false">
                    <div class="header-info2 d-flex align-items-center">
                      <div class="d-flex align-items-center sidebar-info">
                        <div>
                          <h4 class="mb-0"></h4>
                          <span class="d-block text-end">Business Owner</span>
                        </div>
                      </div>
                      <img src="../assets/images/avatar/1.jpg" alt="">
                    </div>
                  </a>
                  <div class="dropdown-menu dropdown-menu-end" style="">
                    <a href="profile.html" class="dropdown-item ai-icon ">
                      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px"
                        height="24px" viewBox="0 0 24 24" version="1.1" class="svg-main-icon">
                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                          <polygon points="0 0 24 0 24 24 0 24" />
                          <path
                            d="M12,11 C9.790861,11 8,9.209139 8,7 C8,4.790861 9.790861,3 12,3 C14.209139,3 16,4.790861 16,7 C16,9.209139 14.209139,11 12,11 Z"
                            fill="#000000" fill-rule="nonzero" opacity="0.3" />
                          <path
                            d="M3.00065168,20.1992055 C3.38825852,15.4265159 7.26191235,13 11.9833413,13 C16.7712164,13 20.7048837,15.2931929 20.9979143,20.2 C21.0095879,20.3954741 20.9979143,21 20.2466999,21 C16.541124,21 11.0347247,21 3.72750223,21 C3.47671215,21 2.97953825,20.45918 3.00065168,20.1992055 Z"
                            fill="var(--primary)" fill-rule="nonzero" />
                        </g>
                      </svg>
                      <span class="ms-2">Profile </span>
                    </a>
                    <button id="logoutBtn" class="dropdown-item ai-icon">
                      <svg class="ms-2" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                        fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      <span class="ms-2">Logout</span>
                    </button>
                  </div>
                </div>
              </li>
              <li class="nav-item dropdown notification_dropdown">
                <a class="nav-link  menu-wallet wallet-arrow  ms-3 me-0" href="javascript:void(0);">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                    style="transform: rotate(180deg);">
                    <path
                      d="M14.4301 18.8201C14.2401 18.8201 14.0501 18.7501 13.9001 18.6001C13.6101 18.3101 13.6101 17.8301 13.9001 17.5401L19.4401 12.0001L13.9001 6.46012C13.6101 6.17012 13.6101 5.69012 13.9001 5.40012C14.1901 5.11012 14.6701 5.11012 14.9601 5.40012L21.0301 11.4701C21.3201 11.7601 21.3201 12.2401 21.0301 12.5301L14.9601 18.6001C14.8101 18.7501 14.6201 18.8201 14.4301 18.8201Z"
                      fill="white" />
                    <path
                      d="M20.33 12.75H3.5C3.09 12.75 2.75 12.41 2.75 12C2.75 11.59 3.09 11.25 3.5 11.25H20.33C20.74 11.25 21.08 11.59 21.08 12C21.08 12.41 20.74 12.75 20.33 12.75Z"
                      fill="white" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

    </div>  
`)

$(".sidebarMenuuu").html(`
  <li>
    <a href="dashboard.html" aria-expanded="false">
      <div class="menu-icon">
        <svg id="icon-home" width="22" height="22" viewBox="0 0 22 22" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M16.3077 20.8538H5.69266C3.181 20.8538 1.146 18.8097 1.146 16.298V9.50548C1.146 8.25882 1.916 6.69132 2.906 5.92132L7.84683 2.07132C9.33183 0.916317 11.706 0.861317 13.246 1.94298L18.911 5.91215C20.0018 6.67298 20.8543 8.30465 20.8543 9.63382V16.3072C20.8543 18.8097 18.8193 20.8538 16.3077 20.8538ZM8.69016 3.15298L3.74933 7.00298C3.0985 7.51632 2.521 8.68048 2.521 9.50548V16.298C2.521 18.0488 3.94183 19.4788 5.69266 19.4788H16.3077C18.0585 19.4788 19.4793 18.058 19.4793 16.3072V9.63382C19.4793 8.75382 18.8468 7.53465 18.1227 7.03965L12.4577 3.07048C11.4127 2.33715 9.68933 2.37382 8.69016 3.15298Z"
            fill="#9C99FF" />
          <path
            d="M11 17.1875C10.6242 17.1875 10.3125 16.8758 10.3125 16.5V13.75C10.3125 13.3742 10.6242 13.0625 11 13.0625C11.3758 13.0625 11.6875 13.3742 11.6875 13.75V16.5C11.6875 16.8758 11.3758 17.1875 11 17.1875Z"
            fill="#9C99FF" />
        </svg>
      </div>
      <span class="nav-text">Dashboard</span>
    </a>

  </li>  

   <li>
    <a href="demand-notices.html" aria-expanded="false">
      <div class="menu-icon">
        <svg id="icon-demand-notice" width="22" height="22" viewBox="0 0 24 24" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#9C99FF"/>
          <path d="M14 2V8H20" fill="#9C99FF"/>
          <path d="M16 13H8V11H16V13ZM16 17H8V15H16V17Z" fill="#9C99FF"/>
        </svg>
      </div>
      <span class="nav-text">Demand Notices</span>
    </a>
  </li> 

  <li>

  <li>
    <a href="payment-history.html" aria-expanded="false">
      <div class="menu-icon">
        <svg id="icon-payment" width="22" height="22" viewBox="0 0 24 24" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path d="M20 4H4C2.897 4 2 4.897 2 6V18C2 19.103 2.897 20 4 20H20C21.103 20 22 19.103 22 18V6C22 4.897 21.103 4 20 4ZM20 18H4V10H20V18ZM20 8H4V6H20V8Z" fill="#9C99FF"/>
          <path d="M6 14H8V16H6V14Z" fill="#9C99FF"/>
          <path d="M10 14H14V16H10V14Z" fill="#9C99FF"/>
        </svg>
      </div>
      <span class="nav-text">Payment History</span>
    </a>
  </li> 


`)

$("#footer").html(`
  <div class="copyright">
    <p>
        Copyrights <a href="../index.html">© 2025 WWJD Nig ltd
        </a> All Rights
        Reserved.
    </p>
  </div>
`)




// create a base path for the api
const basePath = 'http://localhost:8080/billing-system/backend';

// const basePath = 'http://208.115.219.90/~premisre/backend';


// Get User Details
const getUserDetails = async () => {

}

document.addEventListener("DOMContentLoaded", async () =>{
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "index.html";
    return;
  }

  try {
    const response = await fetch(`${basePath}/business-owner/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Unauthorized or failed to fetch");
    }

    const result = await response.json();
    const businessOwner = result.data;

    document.querySelector(".header-info2 h4").innerText = businessOwner.business_name || "Business Name";
  
    localStorage.setItem("userId", businessOwner.id);
    // localStorage.setItem("userTin", businessOwner.tin);
    // const businessOwn = localStorage.getItem("userId");

  } catch (error) {
    console.error("Error fetching user:", error);
  }

});

// Call it when page loads
// window.addEventListener("DOMContentLoaded", getUserDetails);





// User logout
document.getElementById("logoutBtn").addEventListener("click", function () {
  // localStorage.removeItem("token");
  // localStorage.removeItem("userId");
  localStorage.clear();

  // Redirect the user to the login page
  window.location.href = "../auth/login.html";
});