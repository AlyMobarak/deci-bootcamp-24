// scripts.js

document.addEventListener("DOMContentLoaded", () =>
  setTimeout(async function () {
    const mainMoodSelect = document.getElementById("mainMood");
    const subMoodSelect = document.getElementById("subMood");

    h2 = document.querySelector("h2");
    a = await db.collection("users").doc(auth.currentUser.uid).get();
    h2.innerText = `Hello, ${a.data().name}`;

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

    mainMoodSelect.addEventListener("change", function () {
      const selectedMood = mainMoodSelect.value;
      subMoodSelect.innerHTML =
        '<option value="">--Select a Specific Mood--</option>';

      if (selectedMood) {
        const subMoods = moods[selectedMood];
        subMoods.forEach((mood) => {
          const option = document.createElement("option");
          option.value = mood;
          option.textContent = mood;
          subMoodSelect.appendChild(option);
        });
        subMoodSelect.disabled = false;
      } else {
        subMoodSelect.disabled = true;
      }
    });
  }, 400)
);
