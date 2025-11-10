// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

// Animate the Footer — plays every time it's in view
const footerTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: "footer",          // targets the footer element
    start: "top 90%",           // when the top of footer hits 90% of viewport height
    end: "bottom 60%",          // when bottom moves up
    toggleActions: "restart none reverse none", // 👈 key line
    scrub: false,
    markers: false,             // set to true for debugging
  },
});

// Footer enters from bottom (y = 100) and fades in
footerTimeline.fromTo(
  "footer",
  { y: 100, opacity: 0 },
  {
    y: 0,
    opacity: 1,
    duration: 1.2,
    ease: "power3.out",
  }
);
