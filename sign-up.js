document.querySelector("#sign-up").addEventListener("click", async (e) => {
  // email, password, bio, country, zip, name, comstyle, phone
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  if (!validateEmail(email)) {
    giveAlert("Please Enter a Valid Email.");
    return;
  }

  if (password.length < 8) {
    giveAlert("Please enter a password with 8 or more characters.");
    return;
  }

  const fullName = document.getElementById("name").value;
  const age = document.getElementById("age").value;
  const bio = document.getElementById("bio").value;
  const comstyle = document.querySelector('input[name="comstyle"]:checked');
  const phone = document.getElementById("phone").value;
  const country = document.getElementById("country").value;
  const zipcode = document.getElementById("zip").value;

  if (isNaN(age)) {
    giveAlert("Revise your Age.");
    return;
  }
  if (zipcode == "") {
    giveAlert("Revise your Zip Code.");
    return;
  }
  if (fullName == "") {
    giveAlert("Revise your Full Name.");
    return;
  }
  if (country == "") {
    giveAlert("Revise your Country.");
    return;
  }
  if (comstyle == null) {
    giveAlert("Revise your Communication Style.");
    return;
  }
  if (phone == "") {
    giveAlert("Revise your Phone Number.");
    return;
  }

  let uid = "";
  try {
    let cred = await auth.createUserWithEmailAndPassword(email, password);
    uid = cred.user.uid;
    console.log("logged in: " + uid);
  } catch (e) {
    giveAlert(
      "An Error has occured when creating your Account. Please try again."
    );
    console.log(e);
    return;
  }

  try {
    await db.collection("users").doc(uid).set({
      name: fullName,
      age,
      bio,
      comstyle: comstyle.value,
      email,
      favorites: [],
      phone,
      zipcode,
      country,
    });

    window.location = "index.html";
  } catch (e) {
    console.log(e);
  }
});

window.addEventListener("DOMContentLoaded", async function () {
  if (auth.currentUser != null) {
    window.location = "index.html";
  }
});
