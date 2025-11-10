// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Animate the Contact Section — plays every time section is in view
const contactTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: "#contact",
    start: "top 80%",
    end: "bottom 60%",
    toggleActions: "restart none reverse none", // 👈 key change
    scrub: false,
    markers: false,
  },
});

contactTimeline
  .fromTo(
    ".contact-title",
    { y: 100, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power3.out",
    }
  )
  .fromTo(
    ".contact-desc",
    { y: 100, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power3.out",
    },
    "-=0.6"
  );
