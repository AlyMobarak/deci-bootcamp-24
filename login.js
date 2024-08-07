document
  .getElementById("login-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    // Here you can add logic to handle form submission, such as sending data to a server
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    if (!validateEmail(email)) {
      giveAlert("Please Enter a Valid Email.");
      return;
    }

    try {
      await auth.signInWithEmailAndPassword(email, password);
      window.location = "index.html";
    } catch (e) {
      console.log(e);
    }
  });

window.addEventListener("DOMContentLoaded", async function () {
  this.setTimeout(() => {
    if (auth.currentUser != null) {
      window.location = "index.html";
    }
  }, 400);
});
