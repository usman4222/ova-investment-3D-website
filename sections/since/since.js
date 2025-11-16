export function initSection() {
  gsap.registerPlugin(ScrollTrigger);
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#since-sunrise-wrapper",
      start: "top top",
      end: "bottom+=100% top",
      scrub: true,
      pin: true,
    },
  });
  // Animate circular reveal from bottom
  tl.to("#circleRevealContainer", {
    clipPath: "circle(120% at 50% 100%)",
    webkitClipPath: "circle(120% at 50% 100%)",
    ease: "power2.inOut",
    duration: 1,
  }); // Fade out the front section while circle expands
  tl.to(
    "#sinceSection",
    { opacity: 0, scale: 1.05, duration: 1, ease: "power1.out" },
    "<"
  ); // Fade in the text of the back section
  tl.to(
    "#circleText",
    { opacity: 1, duration: 0.8, ease: "power1.inOut" },
    "-=0.5"
  );
}
