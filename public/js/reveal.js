class Reveal {
  constructor(revealPoint) {
    this.revealPoint = revealPoint;

    this.reveal();
  }

  reveal() {
    const reveals = document.querySelectorAll(".reveal");

    reveals.forEach((reveal) => {
      let windowheight = window.innerHeight;
      let revealtop = reveal.getBoundingClientRect().top;
      let revealPoint = this.revealPoint;

      if (revealtop < windowheight - revealPoint) {
        reveal.classList.add("reveal-active");
      } else {
        reveal.classList.remove("reveal-active");
      }
    });
  }
}

export default Reveal;
