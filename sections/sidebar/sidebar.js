export function initSection() {
  const sidebar = document.getElementById("mainSidebar");

  // Hide sidebar initially
  gsap.set(sidebar, { autoAlpha: 0, pointerEvents: "none" });

  // ✅ Sections where the sidebar should be visible
  const showSections = [
    "#section1",
    "#section2",
    "#section3",
    "#section4",
    "#section5",
    "#section6",
    "#section7",
    "#section8",
  ];

  // ✅ Sections where the sidebar should be hidden
  const hideSections = [
    "#heroSection",
    "#manifesto",
    "#sinceContainer",
    "#circleRevealContainer",
    "#contactContainer",
    "#footerContainer",
  ];

  // --- SHOW TRIGGERS ---
  showSections.forEach((sel) => {
    ScrollTrigger.create({
      trigger: sel,
      start: "top center",
      end: "bottom center",
      onEnter: () =>
        gsap.to(sidebar, {
          autoAlpha: 1,
          duration: 0.3,
          pointerEvents: "auto",
        }),
      onEnterBack: () =>
        gsap.to(sidebar, {
          autoAlpha: 1,
          duration: 0.3,
          pointerEvents: "auto",
        }),
    });
  });

  // --- HIDE TRIGGERS ---
  hideSections.forEach((sel) => {
    ScrollTrigger.create({
      trigger: sel,
      start: "top top",
      end: "bottom bottom",
      onEnter: () =>
        gsap.to(sidebar, {
          autoAlpha: 0,
          duration: 0.3,
          pointerEvents: "none",
        }),
      onEnterBack: () =>
        gsap.to(sidebar, {
          autoAlpha: 0,
          duration: 0.3,
          pointerEvents: "none",
        }),
    });
  });

  // --- Sidebar dot highlight ---
  const sectionIds = showSections.map((s) => s.replace("#", ""));
  const dots = document.querySelectorAll(".sidebar-dot");

  sectionIds.forEach((id, idx) => {
    ScrollTrigger.create({
      trigger: "#" + id,
      start: "top center",
      end: "bottom center",
      onEnter: () => setActive(idx),
      onEnterBack: () => setActive(idx),
    });
  });

  function setActive(i) {
    dots.forEach((d, di) => {
      if (di === i) {
        d.classList.add("font-bold", "text-indigo-400");
      } else {
        d.classList.remove("font-bold", "text-indigo-400");
      }
    });
  }

  // Apply Tailwind styles for hover and default
  dots.forEach((dot) => {
    dot.classList.add(
      "text-white",
      "text-sm",
      "transition",
      "duration-200",
      "hover:text-indigo-300", // lighter hover effect even for active
      "pr-3",
      "border-r",
      "border-white",
      "border-opacity-50",
      "py-1",
      "cursor-pointer"
    );
  });
}
