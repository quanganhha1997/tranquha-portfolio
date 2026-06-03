// (function () {
//   [...document.querySelectorAll(".control")].forEach((button) => {
//     button.addEventListener("click", function () {
//       document.querySelector(".active-btn").classList.remove("active-btn");
//       this.classList.add("active-btn");
//       document.querySelector(".active").classList.remove("active");
//       document.getElementById(button.dataset.id).classList.add("active");
//     });
//   });
// })();

// function submitEmail() {
//   document.getElementById("contact-form").submit();
// }

const sections = document.querySelectorAll("section");
const navItems = document.querySelectorAll("nav .nav-links li");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (window.scrollY >= sectionTop - sectionHeight / 3) {
      current = section.getAttribute("id");
    }
  });

  navItems.forEach((li) => {
    li.classList.remove("active");

    if (li.classList.contains(current)) {
      li.classList.add("active");
    }
  });
});
