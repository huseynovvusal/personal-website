const nav = document.querySelector("nav");
const hamburger = document.querySelector(".hamburger");
const ulList = document.querySelector("nav ul");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  nav.classList.toggle("active");
  ulList.classList.toggle("active");
});

window.addEventListener("scroll", () => {
  if (window.scrollY > 0) nav.classList.add("scrolled");
  else nav.classList.remove("scrolled");
});

window.addEventListener("load", () => {
  hamburger.classList.remove("active");
  ulList.classList.remove("active");
});
