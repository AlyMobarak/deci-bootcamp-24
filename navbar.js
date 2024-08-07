document.addEventListener("DOMContentLoaded", function () {
  const navbarToggle = document.getElementById("navbarToggle");
  const navbarLinks = document.getElementById("navbarLinks");

  navbarToggle.addEventListener("click", function () {
    navbarLinks.classList.toggle("active");
  });
});
