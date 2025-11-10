// loadSection.js
export async function loadSection(htmlPath, containerSelector, jsModulePath) {
  try {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    // Load HTML
    const res = await fetch(htmlPath);
    const html = await res.text();
    container.innerHTML = html;

    // Optionally load JS
    if (jsModulePath) {
      const module = await import(jsModulePath);

      // Call exported init functions if available
      if (module.initSection) module.initSection();
      else if (module.initContactSection) module.initContactSection();
      else if (window.initManifestoSection) window.initManifestoSection();
    }
  } catch (err) {
    console.error("Error loading section:", err);
  }
}
