
  const agentId = localStorage.getItem("agentId");
  const token = localStorage.getItem("token");


document.addEventListener("DOMContentLoaded", async () => {

  if (!token) {
    window.location.href = "index.html";
    return;
  }

  try {
    const response = await fetch(`${basePath}/agent/profile`, {
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
    const agent = result.data;
    // console.log(agent);

    document.querySelector("#name").innerText = agent.first_name + " " + agent.last_name || "Agent Name";
    document.querySelector("#role").innerText = agent.role || "Role";
    document.querySelector(".info-list ul #email").innerText = agent.email || "Email";
    document.querySelector(".info-list ul #phone").innerText = agent.phone || "Phone";
    document.querySelector(".info-list ul #address").innerText = agent.address || "Address";
    document.querySelector(".info-list ul #state").innerText = agent.state_name || "State";
    document.querySelector(".info-list ul #lga").innerText = agent.lga_name + " LGA" || "LGA";
    document.querySelector(".info-list ul #date").innerText = agent.created_at || "Date Created";
    document.querySelector(".card-footer #status span").innerText = agent.status || "Status";
    document.querySelector(".card-footer #status span").classList.add(agent.status === "Active" ? "text-success" : "text-danger");


    document.querySelector(".profile-form #edit-first-name").value = agent.first_name || "First Name";
    document.querySelector(".profile-form #edit-last-name").value = agent.last_name || "Last Name";
    document.querySelector(".profile-form #edit-email").value = agent.email || "Email";
    document.querySelector(".profile-form #edit-phone").value = agent.phone || "Phone";
    document.querySelector(".profile-form #edit-address").value = agent.address || "Address";


    const stateSelect = document.querySelector(".profile-form #edit-states");
    const lgaSelect = document.querySelector(".profile-form #edit-lga");

    const states = await getStates();
    console.log(states);

    states.forEach(state => {
      const option = document.createElement("option");
      option.value = state.id;
      option.textContent = state.state;
      stateSelect.appendChild(option);
    });

    // console.log(stateSelect)
    
    if (agent.state) {
        stateSelect.value = agent.state;

        const lgas = await getLgas(agent.state);
        lgas.forEach(lga => {
            const option = document.createElement("option");
            option.value = lga.id;
            option.textContent = lga.lga;
            lgaSelect.appendChild(option);
        });

        if (agent.lga) {
            lgaSelect.value = agent.lga;
        }

    }

    stateSelect.addEventListener("change", async (event) => {
      const selectedStateId = event.target.value;
      lgaSelect.innerHTML = ""; // Clear previous options

      const lgas = await getLgas(selectedStateId);
      lgas.forEach(lga => {
          const option = document.createElement("option");
          option.value = lga.id;
          option.textContent = lga.lga;
          lgaSelect.appendChild(option);
      });
      }
  );

  } catch (error) {
    console.error("Error fetching agent:", error);
  }

});


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
  } catch (error) {
    console.error("Error fetching states:", error);
    return null; // or {} depending on what you want
  }
}

// console.log("States: ", getStates());

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

document.getElementById("edit-profile-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Collect form data
  const formData = {
    first_name: document.querySelector(".profile-form #edit-first-name").value,
    last_name: document.querySelector(".profile-form #edit-last-name").value,
    email: document.querySelector(".profile-form #edit-email").value,
    phone: document.querySelector(".profile-form #edit-phone").value,
    address: document.querySelector(".profile-form #edit-address").value,
    state: document.querySelector(".profile-form #edit-states").value,
    lga: document.querySelector(".profile-form #edit-lga").value,
  };

  const updateBtn = document.getElementById("updateBtn");
  const originalText = updateBtn.innerHTML; // Save the original button text
  updateBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Updating...`;
  
  try {

    const response = await fetch(`${basePath}/agent/${agentId}/update-profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(formData)
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
    updateBtn.innerHTML = originalText; // Restore the original button text
    updateBtn.disabled = false; // Re-enable the button
  }
});

