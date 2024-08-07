document.addEventListener("DOMContentLoaded", () => {
  const mainMoodSelect = document.getElementById("mainMood");
  const mainMoodOptions = document.getElementById("mainMoodOptions");
  const subMoodSelect = document.getElementById("subMood");
  const subMoodOptions = document.getElementById("subMoodOptions");
  const moodForm = document.getElementById("mood-form");
  const reasonInput = document.getElementById("reason");
  const moodLogsContainer = document.getElementById("mood-logs");
  const loadingIndicator = document.getElementById("loading");

  // Mood categories and subcategories
  const moods = {
    Happy: [
      "Joyful",
      "Ecstatic",
      "Elated",
      "Content",
      "Proud",
      "Grateful",
      "Playful",
      "Inspired",
    ],
    Sad: [
      "Disappointed",
      "Melancholic",
      "Nostalgic",
      "Despondent",
      "Lonely",
      "Guilty",
      "Devastated",
    ],
    Angry: ["Frustrated", "Irritated", "Enraged", "Furious"],
    Anxious: ["Nervous", "Worried", "Apprehensive", "Overwhelmed"],
    Curious: ["Inquisitive", "Interested", "Confused"],
    Neutral: ["Apathetic", "Indifferent", "Bored", "Detached", "Tired"],
    Fearful: ["Afraid", "Terrified", "Panic-stricken", "Vulnerable"],
    Proud: ["Confident", "Self-satisfied", "Triumphant"],
    Complex: ["Ambivalent", "Pensive", "Resentful"],
  };

  // Load existing logs from localStorage
  let moodLogs = JSON.parse(localStorage.getItem("moodLogs")) || [];

  // Function to update mood logs display
  function updateMoodLogsDisplay() {
    moodLogsContainer.innerHTML = "";
    moodLogs.forEach((log, index) => {
      const logElement = document.createElement("div");
      logElement.className = "appointment-item";
      logElement.textContent = `You felt ${log.mainMood} (${log.subMood}) on ${log.date}`;
      if (log.reason != "") {
        logElement.textContent += ` with the reason: ${log.reason}`;
      }
      icon = document.createElement("i");
      icon.className = "bx bxs-trash";
      icon.style.marginLeft = "8px";
      icon.style.cursor = "pointer";
      icon.style.color = "red";
      icon.addEventListener("click", () => {
        moodLogs.splice(index, 1);
        localStorage.setItem("moodLogs", JSON.stringify(moodLogs));
        updateMoodLogsDisplay();
      });

      logElement.appendChild(icon);
      logElement.appendChild(document.createTextNode("."));
      moodLogsContainer.appendChild(logElement);
    });
  }

  // Function to populate main mood options
  function populateMainMoodOptions() {
    Object.keys(moods).forEach((mood) => {
      const option = document.createElement("div");
      option.textContent = mood;
      option.className = "dropdown-option";
      option.addEventListener("click", () => selectMainMood(mood));
      mainMoodOptions.appendChild(option);
    });
  }

  // Function to handle main mood selection
  function selectMainMood(mood) {
    mainMoodSelect.textContent = mood;
    mainMoodOptions.classList.remove("active");
    subMoodOptions.innerHTML =
      '<div class="dropdown-option">-- Select a Specific Mood --</div>';
    subMoodSelect.textContent = "-- Select a Specific Mood --";

    moods[mood].forEach((subMood) => {
      const option = document.createElement("div");
      option.textContent = subMood;
      option.className = "dropdown-option";
      option.addEventListener("click", () => selectSubMood(subMood));
      subMoodOptions.appendChild(option);
    });

    subMoodOptions.parentNode.style.pointerEvents = "auto";
  }

  // Function to handle sub mood selection
  function selectSubMood(subMood) {
    subMoodSelect.textContent = subMood;
    subMoodOptions.classList.remove("active");
  }

  // Initialize the mood tracker
  setTimeout(() => {
    loadingIndicator.style.display = "none";
    moodForm.style.display = "block";

    populateMainMoodOptions();
    updateMoodLogsDisplay();

    mainMoodSelect.addEventListener("click", () => {
      mainMoodOptions.classList.toggle("active");
      subMoodOptions.classList.remove("active");
    });

    subMoodSelect.addEventListener("click", () => {
      if (!mainMood.textContent.includes("Select a Main Mood")) {
        subMoodOptions.classList.toggle("active");
      } else {
        alert("Please select a main mood first.");
        subMoodOptions.classList.remove("active");
      }
      mainMoodOptions.classList.remove("active");
    });

    moodForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const mainMood = mainMoodSelect.textContent;
      const subMood = subMoodSelect.textContent;
      const date = new Date().toLocaleDateString();
      const reason = reasonInput.value.trim();

      if (mainMood.includes("Select") || subMood.includes("Select")) {
        alert("Please select both main and specific mood.");
        return;
      }

      const moodLog = {
        mainMood: mainMood,
        subMood: subMood,
        date: date,
        reason,
      };

      moodLogs.push(moodLog);
      localStorage.setItem("moodLogs", JSON.stringify(moodLogs));

      updateMoodLogsDisplay();
      moodForm.reset();
      mainMoodSelect.textContent = "-- Select a Main Mood --";
      subMoodSelect.textContent = "-- Select a Specific Mood --";
      subMoodOptions.innerHTML =
        '<div class="dropdown-option">-- Select a Specific Mood --</div>';
      subMoodOptions.parentNode.style.pointerEvents = "none";
    });

    document.addEventListener("click", function (event) {
      if (!mainMoodSelect.contains(event.target)) {
        mainMoodOptions.classList.remove("active");
      }
      if (!subMoodSelect.contains(event.target)) {
        subMoodOptions.classList.remove("active");
      }
    });
  }, 400);
});
