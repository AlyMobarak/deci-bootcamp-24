// Example list of therapists
async function displayTherapists() {
  const listContainer = document.getElementById("therapist-list");

  userData = await db.collection("users").doc(auth.currentUser.uid).get();
  userData = userData.data();
  let favorites = userData.favorites;

  therapists = await db.collection("therapists").get();
  therapists = therapists.docs.map((doc) => {
    return { ...doc.data(), id: doc.id, fav: favorites.includes(doc.id) };
  });

  therapists.forEach((therapist) => {
    const therapistCard = document.createElement("div");
    therapistCard.className = "therapist-card" + (therapist.fav ? " fav" : "");
    therapistCard.onclick = () => {
      favres = pickFav(therapist.id);
      therapistCard.classList.toggle("fav");

      //   alert(therapist.id);
    };

    therapistCard.innerHTML = `
            <img src="${therapist.photoURL}" alt="${therapist.name}">
            <h2>${therapist.name}, ${therapist.age}</h2>
            <p>${therapist.bio}</p>
            <p>Location: ${therapist.country.toUpperCase()}, ${
      therapist.zipcode
    }</p>
            <p>Phone: ${therapist.phone}</p>
            <p>Email: <a href="mailto:${therapist.email}">${
      therapist.email
    }</a></p>
            <h3>Education</h3>
            <ul>${therapist.education}</ul>
        `;

    listContainer.appendChild(therapistCard);
  });
}

window.addEventListener("DOMContentLoaded", async function () {
  this.setTimeout(() => {
    if (auth.currentUser == null) {
      window.location = "login.html";
    }
    displayTherapists();
  }, 1000);
});
