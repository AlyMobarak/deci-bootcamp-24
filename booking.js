async function s() {
  if (auth.currentUser == null) {
    window.location = "login.html";
    return;
  }
  // Example list of all therapists
  userData = await db.collection("users").doc(auth.currentUser.uid).get();
  userData = userData.data();
  window.favorites = userData.favorites;
  let favorites = userData.favorites;
  selectedTherapistId = null;

  therapists = await db.collection("therapists").get();
  therapists = therapists.docs.map((doc) => {
    return { id: doc.id, ...doc.data(), favorite: favorites.includes(doc.id) };
  });

  outgoing = await db
    .collection("appointments")
    .where("initiator", "==", auth.currentUser.uid)
    .get();
  incoming = await db
    .collection("appointments")
    .where("to", "==", auth.currentUser.uid)
    .get(); // need to press a button to verify the appointment.
  outgoing = outgoing.docs.map((doc) => {
    return { id: doc.id, data: doc.data() };
  });
  incoming = incoming.docs.map((doc) => {
    return { id: doc.id, data: doc.data() };
  });

  // Function to populate therapist dropdown
  function populateTherapistDropdown() {
    // const therapistSelect = document.getElementById("therapist");
    const dropdownOptions = document.getElementById("dropdown-options");
    therapists.forEach((therapist) => {
      const option = document.createElement("div");
      option.dataset.id = therapist.id;
      option.textContent = therapist.name;

      // Highlight favorites
      if (therapist.favorite) {
        option.classList.add("favorite");
      }

      option.addEventListener("click", () => {
        selectTherapist(option);
      });

      dropdownOptions.appendChild(option);
    });
    document.getElementById("loading").style.display = "none";
    document.getElementById("booking-form").style.display = "";
  }

  // Function to handle form submission
  async function handleFormSubmit(event) {
    event.preventDefault(); // Prevent the form from submitting

    const therapistId = selectedTherapistId;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const topic = document.getElementById("topic").value;

    if (!therapistId || !date || !time || !topic) {
      alert("Please fill in all fields before booking.");
      return;
    }

    try {
      await db.collection("appointments").add({
        to: therapistId,
        verified: false,
        date,
        time,
        topic,
        initiator: auth.currentUser.uid,
      });
    } catch (e) {
      alert("Error While Booking.");
      console.log(e);
      return;
    }

    // Show confirmation message
    const confirmation = document.getElementById("confirmation");
    const therapistName = therapists.find((t) => t.id == therapistId).name;
    confirmation.textContent = `A request was sent to ${therapistName} for an appointment on ${date} at ${time}.`;

    // Clear form fields
    document.getElementById("booking-form").reset();
    document.getElementById("selected-option").textContent =
      "-- Select a Therapist --";
    selectedTherapistId = null;
    document.getElementById("dropdown-options").classList.remove("active");
    document.getElementById("selected-option").classList.remove("favorite");
  }

  // Function to select therapist
  function selectTherapist(option) {
    const selectedOption = document.getElementById("selected-option");
    selectedOption.textContent = option.textContent;
    selectedTherapistId = option.dataset.id;
    if (favorites.includes(selectedTherapistId)) {
      selectedOption.classList.add("favorite");
    } else {
      selectedOption.classList.remove("favorite");
    }

    // Hide dropdown options
    document.getElementById("dropdown-options").classList.remove("active");
  }

  // Function to toggle dropdown visibility
  function toggleDropdown(e) {
    e.stopPropagation();
    const dropdownOptions = document.getElementById("dropdown-options");
    dropdownOptions.classList.toggle("active");
  }

  // Initialize the page
  populateTherapistDropdown();
  document
    .getElementById("booking-form")
    .addEventListener("submit", handleFormSubmit);
  document
    .getElementById("selected-option")
    .addEventListener("click", toggleDropdown);
  document.addEventListener("click", function (event) {
    const customSelect = document.getElementById("custom-select");
    if (!customSelect.contains(event.target)) {
      document.getElementById("dropdown-options").classList.remove("active");
    }
  });

  // Function to update the appointment badge and list
  function updateAppointmentsDisplay() {
    const appointmentCount = document.getElementById("appointment-count");
    const appointmentsList = document.getElementById("appointments-list");

    // Update badge
    appointmentCount.textContent = outgoing.length + incoming.length;

    // Populate appointments list
    appointmentsList.innerHTML = "";
    outgoing.forEach((appointment) => {
      const therapistName = therapists.find(
        (t) => t.id === appointment.data.to
      ).name;
      const appointmentItem = document.createElement("div");
      appointmentItem.className = "appointment-item";
      appointmentItem.dataset.id = appointment.id;
      //   appointmentItem.textContent = `Appointment with ${therapistName} at ${appointment.data.date}, ${appointment.data.time}`;
      icon = document.createElement("img");
      icon.src = `./therapist-photos/${appointment.data.to}.png`;
      icon.style.width = "96px";
      icon.style.height = "96px";
      icon.style.borderRadius = "16px";

      info = document.createElement("div");
      info.style.display = "flex";
      info.style.flexDirection = "column";
      info.style.justifyContent = "center";
      info.style.alignItems = "start";
      info.style.marginLeft = "12px";
      //   info.style.gap = "8px";
      aName = document.createElement("p");
      aName.innerText = therapistName;
      aName.style.margin = "4px 0px";
      aName.style.fontWeight = "bold";
      if (favorites.includes(appointment.data.to)) {
        icon.style.border = "2px solid goldenrod";
        aName.style.color = "goldenrod";
      }
      aGood = document.createElement("p");
      aGood.innerText = `${appointment.data.topic}`;
      aGood.style.margin = "4px 0px";
      aDate = document.createElement("p");
      aDate.innerText = `${appointment.data.date} @ ${appointment.data.time}`;
      aDate.style.margin = "4px 0px";

      info.appendChild(aName);
      info.appendChild(aGood);
      info.appendChild(aDate);
      appointmentItem.appendChild(icon);
      appointmentItem.appendChild(info);
      delIcon = document.createElement("i");
      delIcon.className = "bx bxs-trash";
      // delIcon.style.marginLeft = "8px";
      delIcon.style.cursor = "pointer";
      delIcon.addEventListener("click", async () => {
        await db.collection("appointments").doc(appointment.id).delete();
        refreshAppointments();
      });
      delIcon.style.color = "red";
      appointmentItem.appendChild(delIcon);
      appointmentsList.appendChild(appointmentItem);
    });
    incoming.forEach((appointment) => {
      const therapistName = therapists.find(
        (t) => t.id === appointment.data.initiator
      ).name;
      const appointmentItem = document.createElement("div");
      appointmentItem.className = "appointment-item";
      appointmentItem.dataset.id = appointment.id;
      //   appointmentItem.textContent = `${therapistName}: ${appointment.data.date} at ${appointment.data.time}`;
      appointmentsList.appendChild(appointmentItem);
    });
  }

  // Toggle appointments list on icon click
  document.getElementById("appointments-icon").addEventListener("click", () => {
    const appointmentsList = document.getElementById("appointments-list");
    appointmentsList.classList.toggle("active");
  });

  // Refresh appointments on button click
  document
    .getElementById("refresh-button")
    .addEventListener("click", refreshAppointments);

  async function refreshAppointments() {
    // Simulate fetching new appointments by appending a dummy appointment
    outgoing = await db
      .collection("appointments")
      .where("initiator", "==", auth.currentUser.uid)
      .get();
    incoming = await db
      .collection("appointments")
      .where("to", "==", auth.currentUser.uid)
      .get(); // need to press a button to verify the appointment.
    outgoing = outgoing.docs.map((doc) => {
      return { id: doc.id, data: doc.data() };
    });
    incoming = incoming.docs.map((doc) => {
      return { id: doc.id, data: doc.data() };
    });

    updateAppointmentsDisplay();
  }

  updateAppointmentsDisplay();
}

window.addEventListener("DOMContentLoaded", async function () {
  setTimeout(s, 1000);
});
