// scripts.js

document.addEventListener("DOMContentLoaded", () =>
  setTimeout(async function () {
    if (auth.currentUser == null) {
      window.location = "login.html";
    }
    h2 = document.querySelector("h2");
    a = await db.collection("users").doc(auth.currentUser.uid).get();
    h2.innerText = `Hello, ${a.data().name}`;
  }, 800)
);

document.getElementById("sign-out").onclick = function (){
  auth.signOut();
  window.location = "login.html";
}
