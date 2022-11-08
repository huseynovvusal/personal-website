import Reveal from "./reveal.js";

const reveal = new Reveal(70);

window.addEventListener("scroll", () => {
  reveal.reveal();
});
