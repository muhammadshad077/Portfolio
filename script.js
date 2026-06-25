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

// =====================================================================
// ⚡ FIX ENGINE: MULTI-PAGE LOOPS + VERIFIED DATA MATRIX INJECTION ONLY
// =====================================================================

// 📝 1. TYPEWRITER ANIMATION LOGIC (For Home Header Text)
function initTypewriter() {
  const typingSpan = document.getElementById("typingText");
  if (!typingSpan) return; // Agar index page nahi hai toh crash block karega

  if (window.typewriterTimeout) clearTimeout(window.typewriterTimeout);

  const lines = [
    "Full Stack Developer | Freelancer | Problem Solver",
    "Software Engineer | Web Developer"
  ];

  let lineIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeCycle() {
    const liveSpan = document.getElementById("typingText");
    if (!liveSpan) return;

    const currentLine = lines[lineIndex];

    if (isDeleting) {
      liveSpan.textContent = currentLine.substring(0, charIndex - 1);
      charIndex--;
    } else {
      liveSpan.textContent = currentLine.substring(0, charIndex + 1);
      charIndex++;
    }

    let nextSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentLine.length) {
      nextSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      lineIndex = (lineIndex + 1) % lines.length;
      nextSpeed = 400;
    }

    window.typewriterTimeout = setTimeout(typeCycle, nextSpeed);
  }

  typeCycle();
}

// 📝 2. AUTO-SLIDE REVIEWS SLIDER LOGIC (With Your Verified 3 Reviews Data)
function initReviewsSlider() {
  const track = document.getElementById("testimonialTrack");
  const dotsContainer = document.getElementById("sliderDots");
  if (!track || !dotsContainer) return;

  const cards = Array.from(track.children);
  if (cards.length === 0) return;

  dotsContainer.innerHTML = ""; // Duplicate dots hone se rokega
  let currentIndex = 0;

  // Aapke teeno validated reviews ka data matrix engine
  const reviewsData = [
    {
      text: '"The website looked professional, loaded fast, and helped us present our business with confidence."',
      name: "Priya Sharma",
      role: "Startup Founder"
    },
    {
      text: '"Clear communication, clean design, and excellent attention to responsive details across devices."',
      name: "Arjun Mehta",
      role: "Marketing Consultant"
    },
    {
      text: '"Delivered exactly what we needed for our freelance project and made the process easy."',
      name: "Neha Rao",
      role: "Small Business Owner"
    }
  ];

  // Niche active dots buttons generate karne ke liye loop
  cards.forEach((card, index) => {
    // Agar HTML elements safe hain toh dynamic text injection apply karega
    if (reviewsData[index]) {
      const textEl = card.querySelector("p");
      const nameEl = card.querySelector("strong");
      const roleEl = card.querySelector("span");
      
      if (textEl) textEl.textContent = reviewsData[index].text;
      if (nameEl) nameEl.textContent = reviewsData[index].name;
      if (roleEl) roleEl.textContent = reviewsData[index].role;
    }

    const dot = document.createElement("button");
    dot.type = "button";
    dot.classList.add("slider-dot");
    if (index === 0) dot.classList.add("active");
    dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
    dotsContainer.appendChild(dot);

    dot.addEventListener("click", () => {
      goToSlide(index);
    });
  });

  const dots = Array.from(dotsContainer.children);

  // Layout translate engine review panel ko right-left transform karne ke liye
  function goToSlide(index) {
    currentIndex = index;
    const amountToMove = -currentIndex * 100;
    track.style.transform = `translateX(${amountToMove}%)`;
    
    dots.forEach(d => d.classList.remove("active"));
    if (dots[currentIndex]) dots[currentIndex].classList.add("active");
  }

  // CONTINUOUS LOOP ENGINE: Har 5 second mein apne aap image lines switch hoti rahengi
  if (window.reviewInterval) clearInterval(window.reviewInterval);
  window.reviewInterval = setInterval(() => {
    let nextIndex = (currentIndex + 1) % cards.length;
    goToSlide(nextIndex);
  }, 5000);
}

// Dono features ko ek sath parallel sync par run karne wala common trigger
function runPortfolioFeatures() {
  initTypewriter();
  initReviewsSlider();
}

// =====================================================================
// 🌐 GLOBAL EVENTS: JAB BHI PAGE SWITCH HOGA YE FOREVER CHALTA RAHEGA
// =====================================================================
document.addEventListener("DOMContentLoaded", runPortfolioFeatures);
window.addEventListener("hashchange", runPortfolioFeatures);
window.addEventListener("pageshow", runPortfolioFeatures);

// CROSS-PAGE REDIRECT GUARD: Jab koi link daba kar wapas index/home context par load hoga
window.addEventListener("click", () => {
  setTimeout(() => {
    const track = document.getElementById("testimonialTrack");
    if (track && !window.reviewInterval) {
      runPortfolioFeatures();
    }
  }, 100);
});