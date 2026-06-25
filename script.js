const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const themeToggle = document.getElementById("themeToggle");
const contactForm = document.getElementById("contactForm");
const projectType = document.getElementById("projectType");
const otherProjectGroup = document.getElementById("otherProjectGroup");
const otherProject = document.getElementById("otherProject");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

function applySavedTheme() {
  if (!themeToggle) return;
  const savedTheme = localStorage.getItem("portfolioTheme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.querySelector(".theme-icon").textContent = "Light";
  }
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("portfolioTheme", isDark ? "dark" : "light");
    themeToggle.querySelector(".theme-icon").textContent = isDark ? "Light" : "Dark";
  });
}

function toggleOtherProjectField() {
  if (!projectType || !otherProjectGroup || !otherProject) return;
  const isOther = projectType.value === "Other";
  otherProjectGroup.style.display = isOther ? "block" : "none";
  otherProject.required = isOther;
}

if (projectType) {
  projectType.addEventListener("change", toggleOtherProjectField);
}

if (contactForm) {
  contactForm.addEventListener("submit", function(event) {
    event.preventDefault(); // Kisi bhi haal mein page reload hone se rokna hai

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const mobile = document.getElementById("mobile");
    const message = document.getElementById("message");
    const successMessage = document.getElementById("successMessage");

    // Clean error displays before checking
    document.getElementById("nameError").textContent = "";
    document.getElementById("emailError").textContent = "";
    document.getElementById("mobileError").textContent = "";
    document.getElementById("projectTypeError").textContent = "";
    document.getElementById("messageError").textContent = "";
    if (successMessage) successMessage.textContent = "";

    let isValid = true;

    if (!name || !name.value.trim()) { document.getElementById("nameError").textContent = "Name is required."; isValid = false; }
    if (!email || !email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { document.getElementById("emailError").textContent = "Enter a valid email."; isValid = false; }
    
    // Strict Input Filter for Indian standard numbers starting ONLY with 6,7,8,9
    const mobileValue = mobile ? mobile.value.trim() : "";
    if (!mobileValue || !/^[6-9]\d{9}$/.test(mobileValue)) { 
      document.getElementById("mobileError").textContent = "Mobile number must be 10 digits and start with 6, 7, 8, or 9."; 
      isValid = false; 
    }
    
    if (projectType && !projectType.value) { document.getElementById("projectTypeError").textContent = "Select your project type."; isValid = false; }
    if (!message || !message.value.trim()) { document.getElementById("messageError").textContent = "Message is required."; isValid = false; }

    if (isValid) {
      if (successMessage) {
        successMessage.style.color = "#6366f1";
        successMessage.textContent = "Sending message... Please wait.";
      }

      // Live Execution to trigger verification layer
      emailjs.sendForm('service_4f2ilve', 'contact_us', this)
        .then(() => {
            alert("✔ Thank you! Your message has been sent successfully.");
            if (successMessage) {
              successMessage.style.color = "#00ff88";
              successMessage.textContent = "✔ Message sent successfully!";
            }
            contactForm.reset();
            toggleOtherProjectField();
        })
        .catch((error) => {
            alert("❌ Failed to send message. Please try again.");
            if (successMessage) {
              successMessage.style.color = "#ff3333";
              successMessage.textContent = "❌ Failed to send message.";
            }
            console.log('EmailJS Error:', error);
        });
    }
  });
}

applySavedTheme();
emailjs.init("3nhYzXLZN4Ljnj6Hm"); // EmailJS initialization with your public key

// ==========================================
// ⚡ TYPEWRITER ENGINE WITH VISIBILITY FIX
// ==========================================

// Ye function typewriter animation ko handle karta hai
function initTypewriter() {
  // HTML se typingText element ko dhoond raha hai
  const typingSpan = document.getElementById("typingText");
  if (!typingSpan) return; // Agar element nahi mila (jaise dusre pages par) toh ruk jayega

  // Purane chalte hue timeout ko clear karega taaki code double na chale
  if (window.typewriterTimeout) clearTimeout(window.typewriterTimeout);

  // Aapki dono lines jo bari-bari se type hongi
  const lines = [
    "Full Stack Developer | Freelancer | Problem Solver",
    "Software Engineer | Web Developer"
  ];

  let lineIndex = 0; // Kaun si line chal rahi hai
  let charIndex = 0; // Kaun sa akshar type ho raha hai
  let isDeleting = false; // Mita raha hai ya type kar raha hai

  // Ye loop har ek akshar ko type aur delete karta hai
  function typeCycle() {
    const liveSpan = document.getElementById("typingText");
    if (!liveSpan) return;

    const currentLine = lines[lineIndex];

    // Agar mita raha hai toh ek akshar kam karega, nahi toh ek badhayega
    if (isDeleting) {
      liveSpan.textContent = currentLine.substring(0, charIndex - 1);
      charIndex--;
    } else {
      liveSpan.textContent = currentLine.substring(0, charIndex + 1);
      charIndex++;
    }

    // Mitane ki speed fast (40ms) aur likhne ki normal (80ms) hogi
    let nextSpeed = isDeleting ? 40 : 80;

    // Agar poori line likh gayi toh 2 second rukega aur mitana shuru karega
    if (!isDeleting && charIndex === currentLine.length) {
      nextSpeed = 2000;
      isDeleting = true;
    } 
    // Agar poori line mit gayi toh dusri line par switch karega
    else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      lineIndex = (lineIndex + 1) % lines.length;
      nextSpeed = 400; // Nayi line shuru hone se pehle chota pause
    }

    window.typewriterTimeout = setTimeout(typeCycle, nextSpeed);
  }

  typeCycle();
}

// ==========================================
// 🔄 REVIEWS SLIDER INITIALIZATION ENGINE
// ==========================================

// Ye function reviews ko auto-slide aur dots ko handle karta hai
function initReviewsSlider() {
  const track = document.getElementById("testimonialTrack");
  const dotsContainer = document.getElementById("sliderDots");
  if (!track || !dotsContainer) return; // Agar elements nahi hain toh ruk jayega

  const cards = Array.from(track.children);
  if (cards.length === 0) return;

  dotsContainer.innerHTML = ""; // Purane dots saaf karega taaki duplicate na hon
  let currentIndex = 0;

  // Har ek review card ke liye ek niche dot button banayega
  cards.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.classList.add("slider-dot");
    if (index === 0) dot.classList.add("active");
    dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
    dotsContainer.appendChild(dot);

    // Dot click karne par usi slide par le jayega
    dot.addEventListener("click", () => {
      goToSlide(index);
    });
  });

  const dots = Array.from(dotsContainer.children);

  // Slide ko move karne ka function
  function goToSlide(index) {
    currentIndex = index;
    const amountToMove = -currentIndex * 100;
    track.style.transform = `translateX(${amountToMove}%)`;
    
    dots.forEach(d => d.classList.remove("active"));
    if (dots[currentIndex]) dots[currentIndex].classList.add("active");
  }

  // Har 5 second mein reviews automatic badal jayenge
  if (window.reviewInterval) clearInterval(window.reviewInterval);
  window.reviewInterval = setInterval(() => {
    let nextIndex = (currentIndex + 1) % cards.length;
    goToSlide(nextIndex);
  }, 5000);
}

function runPortfolioFeatures() {
  initTypewriter();
  initReviewsSlider();
}

// ==========================================
// 🌐 FAIL-SAFE GLOBAL EVENT LISTENERS
// ==========================================

// 1. Jab poora HTML page load ho tab chalao
document.addEventListener("DOMContentLoaded", runPortfolioFeatures);

// 2. Jab section hash badle (#home, #about) tab chalao
window.addEventListener("hashchange", runPortfolioFeatures);

// 3. Jab dusre page se wapas back/forward karke aayein tab chalao
window.addEventListener("pageshow", runPortfolioFeatures);

// 4. FIX: Jab kisi bhi link par click ho (jaise dusre page se index.html pe aane ke liye), toh typewriter ko check karega
window.addEventListener("click", () => {
  // Chote se delay ke baad run kareim taaki naya DOM element mil sake
  setTimeout(initTypewriter, 100);
});

// ⚡ SCROLL ENGINE FOR BACK TO TOP BUTTON
const backToTopBtn = document.getElementById("backToTop");

if (backToTopBtn) {
  // Jab user 300px niche scroll karega toh button dikhega, nahi toh chhup jayega
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopBtn.style.display = "flex";
    } else {
      backToTopBtn.style.display = "none";
    }
  });

  // Click karne par smoothly sabse upar scroll karne ke liye
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}