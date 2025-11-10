export function initSection() {
  const manifestoContent = [
    {
      headline: "Invests",
      para: 'In the most valuable, promising, and resilient assets.<br>The concept of "value" at OVA is fundamentally multidimensional.',
      subhead: "OVA",
    },
    {
      headline: "Elevates",
      para: "Redefining progress by nurturing innovation,<br>OVA creates opportunity beyond traditional boundaries.",
      subhead: "OVA",
    },
    {
      headline: "Transforms",
      para: "Committed to building a sustainable and<br>remarkable legacy for generations to come.",
      subhead: "OVA",
    },
  ];

  // Pin section while scrolling
  ScrollTrigger.create({
    trigger: "#manifesto",
    start: "top top",
    end: "+=300%",
    pin: true,
    pinSpacing: true,
  });

  // Background animation
  gsap.to("#manifestoBg", {
    scale: 1.22,
    filter: "brightness(0.85) blur(2px)",
    scrollTrigger: {
      trigger: "#manifesto",
      start: "top top",
      end: "+=300%",
      scrub: 1,
    },
  });

  // Text cycling
  const headline = document.getElementById("manifestoHeadline");
  const para = document.getElementById("manifestoPara");
  const sub = document.getElementById("manifestoSubhead");
  const total = manifestoContent.length;

  ScrollTrigger.create({
    trigger: "#manifesto",
    start: "top top",
    end: "+=300%",
    scrub: 0.2,
    onUpdate: (self) => {
      const p = self.progress;
      let i = Math.floor(p * total);
      if (i >= total) i = total - 1;
      if (headline.dataset.state != i || para.dataset.state != i) {
        gsap.to([headline, para], {
          opacity: 0,
          y: 40,
          duration: 0.28,
          onComplete: () => {
            headline.innerText = manifestoContent[i].headline;
            para.innerHTML = manifestoContent[i].para;
            sub.textContent = manifestoContent[i].subhead;
            headline.dataset.state = para.dataset.state = i;
            gsap.fromTo(
              [headline, para],
              { y: 40, opacity: 0 },
              { opacity: 1, y: 0, duration: 0.4 }
            );
          },
        });
      }
    },
  });

  console.log("[Manifesto] initialized successfully ✅");
}
