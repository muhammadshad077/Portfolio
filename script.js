const loader = document.getElementById("loader");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const themeToggle = document.getElementById("themeToggle");
const typingText = document.getElementById("typingText");
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
const revealItems = document.querySelectorAll(".reveal");
const backToTop = document.getElementById("backToTop");
const testimonialTrack = document.getElementById("testimonialTrack");
const sliderDots = document.getElementById("sliderDots");
const testimonialCards = document.querySelectorAll(".testimonial-card");
const contactForm = document.getElementById("contactForm");
const projectType = document.getElementById("projectType");
const otherProjectGroup = document.getElementById("otherProjectGroup");
const otherProject = document.getElementById("otherProject");

const typingPhrases = [
  "Full Stack Developer | Freelancer | Problem Solver",
  "I build responsive web applications.",
  "I turn ideas into polished digital products."
];

let phraseIndex = 0;
let characterIndex = 0;
let isDeleting = false;
let testimonialIndex = 0;

window.addEventListener("load", () => {
  if (!loader) return;
  setTimeout(() => { loader.classList.add("hide"); }, 600);
});

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

function typeLoop() {
  if (!typingText) return;
  const currentPhrase = typingPhrases[phraseIndex];
  characterIndex += isDeleting ? -1 : 1;
  typingText.textContent = currentPhrase.slice(0, characterIndex);
  if (!isDeleting && characterIndex === currentPhrase.length) {
    isDeleting = true;
    setTimeout(typeLoop, 1300);
    return;
  }
  if (isDeleting && characterIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % typingPhrases.length;
  }
  setTimeout(typeLoop, isDeleting ? 45 : 78);
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filterValue = button.dataset.filter;
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    projectCards.forEach((card) => {
      const shouldShow = filterValue === "all" || card.dataset.category === filterValue;
      card.classList.toggle("hide", !shouldShow);
    });
  });
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });
  revealItems.forEach((item) => revealObserver.observe(item));
}

function toggleOtherProjectField() {
  if (!projectType || !otherProjectGroup || !otherProject) return;
  const isOther = projectType.value === "Other";
  otherProjectGroup.classList.toggle("show", isOther);
  otherProject.required = isOther;
}

function validateForm(event) {
  event.preventDefault();

  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const mobile = document.getElementById("mobile");
  const message = document.getElementById("message");
  const successMessage = document.getElementById("successMessage");

  const errors = { nameError: "", emailError: "", mobileError: "", projectTypeError: "", otherProjectError: "", messageError: "" };
  let isValid = true;

  if (!name.value.trim()) { errors.nameError = "Name is required."; isValid = false; }
  if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { errors.emailError = "Enter a valid email."; isValid = false; }
  if (!mobile.value.trim() || !/^\d{10}$/.test(mobile.value.trim())) { errors.mobileError = "Enter 10 digit mobile number."; isValid = false; }
  if (projectType && !projectType.value) { errors.projectTypeError = "Select your project type."; isValid = false; }
  if (!message.value.trim()) { errors.messageError = "Message is required."; isValid = false; }

  Object.keys(errors).forEach((key) => {
    const errorElement = document.getElementById(key);
    if (errorElement) errorElement.textContent = errors[key];
  });

  if (isValid) {
    successMessage.style.color = "#6366f1";
    successMessage.textContent = "Sending message... Please wait.";

    // LIVE EMAILJS ENGINE EXECUTION WITH YOUR ACTIVE SERVICE ID
    emailjs.sendForm('service_4f2ilve', 'contact_us', contactForm)
      .then(() => {
          successMessage.style.color = "#00ff88";
          successMessage.textContent = "✔ Message sent successfully! I will contact you soon.";
          contactForm.reset();
          toggleOtherProjectField();
      }, (error) => {
          successMessage.style.color = "#ff3333";
          successMessage.textContent = "❌ Failed to send message. Please try again.";
          console.log('EmailJS Error:', error);
      });
  }
}

if (projectType) { projectType.addEventListener("change", toggleOtherProjectField); }
if (contactForm) { contactForm.addEventListener("submit", validateForm); }

applySavedTheme();
typeLoop();