// loadMultipleSections.js
export async function loadMultipleSections(sections, jsModulePath) {
  try {
    const module = await import(jsModulePath);

    // Load all HTML sections sequentially
    for (const { htmlPath, containerSelector } of sections) {
      const container = document.querySelector(containerSelector);
      if (!container) continue;

      const resp = await fetch(htmlPath);
      const html = await resp.text();
      container.innerHTML = html;
    }

    // Run shared JS once
    if (module.initSection) module.initSection();
  } catch (err) {
    console.error("Error loading shared section group:", err);
  }
}
