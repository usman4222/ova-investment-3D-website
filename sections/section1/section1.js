export function initSection() {
  const animatedTexts = document.querySelectorAll(".animatedText");

  if (!animatedTexts.length) {
    console.warn("No animatedText elements found in section1");
    return;
  }

  animatedTexts.forEach((animated) => {
    const section = animated.closest("section");
    const lines = animated.querySelectorAll(".line");

    // Function to play animation
    const playAnimation = () => {
      // Reset before playing again
      gsap.set(lines, { opacity: 0, y: 60 });

      gsap.to(lines, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.18,
      });
    };

    // Create ScrollTrigger
    ScrollTrigger.create({
      trigger: section,
      start: "top center+=100",
      end: "bottom center",
      onEnter: playAnimation,      // when scrolling down
      onEnterBack: playAnimation,  // when scrolling up
    });
  });
}
