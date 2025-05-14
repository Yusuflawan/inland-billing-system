
// Get User Details
const token = localStorage.getItem("token");
const businessOwnerId = localStorage.getItem("userId");

const getBusinessOwnerProfile = async () => {
  
    if (!token) {
      window.location.href = "../index.html";
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



      document.querySelector("#b-name").innerText = businessOwner.business_name || "Business Name";
      document.querySelector("#sect-name").innerText = businessOwner.business_type || "Sector";
      const websLink = document.querySelector("#webs-name")
      websLink.innerText = businessOwner.website || "website";
      websLink.href = businessOwner.website || "#";
      document.querySelector(".info-list ul #email").innerText = businessOwner.email || "Email";
      document.querySelector(".info-list ul #phone").innerText = businessOwner.phone || "Phone";
      document.querySelector(".info-list ul #address").innerText = businessOwner.address || "Address";
      document.querySelector(".info-list ul #state").innerText = businessOwner.state || "State";
      document.querySelector(".info-list ul #lga").innerText = businessOwner.lga + " LGA" || "LGA";
      document.querySelector(".info-list ul #tin").innerText = businessOwner.tin || "TIN";
      document.querySelector(".info-list ul #cac").innerText = businessOwner.cac_number || "CAC Number";
      document.querySelector(".info-list ul #id-type").innerText = businessOwner.id_type || "IID Type";
      document.querySelector(".info-list ul #id-number").innerText = businessOwner.id_number || "ID Number";
      document.querySelector(".info-list ul #staff-quota").innerText = businessOwner.staff_quota || "Staff Quota";
      document.querySelector(".info-list ul #date").innerText = businessOwner.created_at || "Date Created";
      
      document.querySelector(".card-footer #status span").innerText = businessOwner.status || "Status";
      document.querySelector(".card-footer #status span").classList.add(businessOwner.status === "Active" ? "text-success" : "text-danger");
  


        document.querySelector(".profile-form #edit-business-name").value = businessOwner.business_name || "Business Name";
        document.querySelector(".profile-form #edit-website").value = businessOwner.website || "Website";
        document.querySelector(".profile-form #edit-email").value = businessOwner.email || "Email";
        document.querySelector(".profile-form #edit-phone").value = businessOwner.phone || "Phone";
        document.querySelector(".profile-form #edit-address").value = businessOwner.address || "Address";
        document.querySelector(".profile-form #edit-cac-number").value = businessOwner.cac_number || "CAC Number";
    
        // populate the state and lga dropdowns
        const stateSelect = document.querySelector(".profile-form #edit-states");
        const lgaSelect = document.querySelector(".profile-form #edit-lga");

        const states = await getStates();
        // console.log(states);
        states.forEach(state => {
          const option = document.createElement("option");
          option.value = state.id;
          option.textContent = state.state;
          stateSelect.appendChild(option);
        });

        // Set the selected state and lga based on the business owner's data
        if (businessOwner.state_id) {
            stateSelect.value = businessOwner.state_id;

            // Fetch and populate LGAs for the selected state
            const lgas = await getLgas(businessOwner.state_id);
            lgas.forEach(lga => {
                const option = document.createElement("option");
                option.value = lga.id;
                option.textContent = lga.lga;
                lgaSelect.appendChild(option);
            });

            // Set the default LGA based on the business owner's data
            if (businessOwner.lga_id) {
                // console.log("LGA ID: ", businessOwner.lga_id)
                lgaSelect.value = businessOwner.lga_id;
            }

        }

        stateSelect.addEventListener("change", async (event) => {
            const selectedStateId = event.target.value;
            lgaSelect.innerHTML = ""; // Clear previous options

            const lgas = await getLgas(selectedStateId);
            // console.log(lgas);
            lgas.forEach(lga => {
                const option = document.createElement("option");
                option.value = lga.id;
                option.textContent = lga.lga;
                lgaSelect.appendChild(option);
            });
            }
        );

        
        if (businessOwner.lga_id) {
            lgaSelect.value = businessOwner.lga_id;
        }

        const businessTypeSelect = document.querySelector(".profile-form #edit-business-type");

        // Populate business types
        const businessTypes = await getBusinessType();
        // console.log(businessTypes);
        businessTypes.forEach(type => {
          const option = document.createElement("option");
          option.value = type.id;
          option.textContent = type.business_type;
          businessTypeSelect.appendChild(option);
        });
        
        if (businessOwner.business_type_id) {
            businessTypeSelect.value = businessOwner.business_type_id;
          }

          const staffQuotaSelect = document.querySelector(".profile-form #edit-staff-quota");

          if (businessOwner.staff_quota) {
            console.log(businessOwner.staff_quota);
              staffQuotaSelect.value = businessOwner.staff_quota;
          }

        const sector = document.querySelector(".profile-form #edit-sector");
        if (businessOwner.sector) {
            console.log(businessOwner.sector);
              sector.value = businessOwner.sector;
          }
  
    } catch (error) {
      console.error("Error fetching businesss owners:", error);
    }
  };
  
  // Call it when page loads
  window.addEventListener("DOMContentLoaded", getBusinessOwnerProfile);


  const getStates = async () => {
    try {
      const response = await fetch(`${basePath}/states`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to fetch states:", errorText);
        throw new Error("Failed to fetch states");
      }
  
      const result = await response.json();
      return result;
    }
    catch (error) {
      console.error("Error fetching states:", error);
    }
  }
//   console.log("States: ", getStates())

  const getLgas = async (stateId) => {
    try {
      const response = await fetch(`${basePath}/state/lgas/${stateId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch LGAs");
      }
  
      const result = await response.json();
      return result.data;
    }
    catch (error) {
      console.error("Error fetching LGAs:", error);
    }
  }
  
  const getBusinessType = async () =>{

    try {
        const response = await fetch(`${basePath}/business-types`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
    
        if (!response.ok) {
          throw new Error("Failed to fetch Business Types");
        }
    
        const result = await response.json();
        return result.data;
      }
      catch (error) {
        console.error("Error fetching LGAs:", error);
      }

  }

  document.getElementById("edit-profile-form").addEventListener("submit", async (e) => {
    e.preventDefault();
   
    // Collect form data
    const formData = {
        business_name: document.querySelector(".profile-form #edit-business-name").value,
        email: document.querySelector(".profile-form #edit-email").value,
        phone: document.querySelector(".profile-form #edit-phone").value,
        website: document.querySelector(".profile-form #edit-website").value,
        address: document.querySelector(".profile-form #edit-address").value,
        cac_number: document.querySelector(".profile-form #edit-cac-number").value,
        sector: document.querySelector(".profile-form #edit-sector").value,
        business_type: document.querySelector(".profile-form #edit-business-type").value,
        state: document.querySelector(".profile-form #edit-states").value,
        lga: document.querySelector(".profile-form #edit-lga").value,
        staff_quota: document.querySelector(".profile-form #edit-staff-quota").value,
    };

    // console.log(formData);
    
  const updateButton = document.getElementById("updateBtn");
  // Add loader and disable the button
  updateButton.disabled = true; // Disable the button
  const originalText = updateButton.innerHTML; // Save the original button text
  updateButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Updating...`;

  
    try {
      const response = await fetch(`${basePath}/business-owner/${businessOwnerId}/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData) // <== Send the data
      });
  
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
  
      const result = await response.json();

      if (result.status == "success") {
        alert("Profile updated successfully");
      }

      if (result.status == "error") {
        alert(result.message);
      }

      console.log("Profile updated successfully:", result);
  
    } catch (error) {
      console.error("Error editing business owner:", error);
    }
    finally {
      // Re-enable the button and reset its text
      updateButton.disabled = false;
      updateButton.innerHTML = originalText; // Reset to original text
    }

  });
  





