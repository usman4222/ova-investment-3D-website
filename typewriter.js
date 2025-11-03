 
 const words = ["future", "portfolio", "collaboration"];
  const typewriter = document.getElementById("typewriter");
  let wordIndex = 0;
  let letterIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    const currentWord = words[wordIndex];
    const visible = currentWord.substring(0, letterIndex);
    typewriter.textContent = visible;

    if (!isDeleting && letterIndex < currentWord.length) {
      letterIndex++;
      setTimeout(typeEffect, 150); // typing speed
    } else if (isDeleting && letterIndex > 0) {
      letterIndex--;
      setTimeout(typeEffect, 80); // deleting speed
    } else {
      if (!isDeleting) {
        isDeleting = true;
        setTimeout(typeEffect, 1000); // pause before deleting
      } else {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(typeEffect, 300); // small pause before typing next word
      }
    }
  }

  typeEffect();