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

const typingPhrases = [
  "Web Developer | Freelancer | Problem Solver",
  "I build responsive websites.",
  "I turn ideas into polished interfaces."
];

let phraseIndex = 0;
let characterIndex = 0;
let isDeleting = false;
let testimonialIndex = 0;

window.addEventListener("load", () => {
  setTimeout(() => {
    loader.classList.add("hide");
  }, 600);
});

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

function applySavedTheme() {
  const savedTheme = localStorage.getItem("portfolioTheme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.querySelector(".theme-icon").textContent = "Light";
  }
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("portfolioTheme", isDark ? "dark" : "light");
  themeToggle.querySelector(".theme-icon").textContent = isDark ? "Light" : "Dark";
});

// Lightweight typing effect for the hero tagline.
function typeLoop() {
  const currentPhrase = typingPhrases[phraseIndex];

  if (isDeleting) {
    characterIndex -= 1;
  } else {
    characterIndex += 1;
  }

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

// Portfolio category filtering.
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

// Reveal sections when they enter the viewport.
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

revealItems.forEach((item) => revealObserver.observe(item));

function buildSliderDots() {
  testimonialCards.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Show testimonial ${index + 1}`);
    dot.addEventListener("click", () => {
      testimonialIndex = index;
      updateTestimonials();
    });
    sliderDots.appendChild(dot);
  });
}

function updateTestimonials() {
  testimonialTrack.style.transform = `translateX(-${testimonialIndex * 100}%)`;

  sliderDots.querySelectorAll("button").forEach((dot, index) => {
    dot.classList.toggle("active", index === testimonialIndex);
  });
}

function autoSlideTestimonials() {
  testimonialIndex = (testimonialIndex + 1) % testimonialCards.length;
  updateTestimonials();
}

// Contact form validation: required fields, name, email, mobile, and message length.
function validateForm(event) {
  event.preventDefault();

  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const mobile = document.getElementById("mobile");
  const subject = document.getElementById("subject");
  const message = document.getElementById("message");
  const successMessage = document.getElementById("successMessage");

  const errors = {
    nameError: "",
    emailError: "",
    mobileError: "",
    subjectError: "",
    messageError: ""
  };

  let isValid = true;

  if (!name.value.trim()) {
    errors.nameError = "Name is required.";
    isValid = false;
  } else if (!/^[A-Za-z ]+$/.test(name.value.trim())) {
    errors.nameError = "Name must contain only letters.";
    isValid = false;
  }

  if (!email.value.trim()) {
    errors.emailError = "Email is required.";
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    errors.emailError = "Enter a valid email address.";
    isValid = false;
  }

  if (!mobile.value.trim()) {
    errors.mobileError = "Mobile number is required.";
    isValid = false;
  } else if (!/^\d{10}$/.test(mobile.value.trim())) {
    errors.mobileError = "Mobile number must contain exactly 10 digits.";
    isValid = false;
  }

  if (!subject.value.trim()) {
    errors.subjectError = "Project subject is required.";
    isValid = false;
  }

  if (!message.value.trim()) {
    errors.messageError = "Message is required.";
    isValid = false;
  } else if (message.value.trim().length < 20) {
    errors.messageError = "Message must contain at least 20 characters.";
    isValid = false;
  }

  Object.keys(errors).forEach((key) => {
    document.getElementById(key).textContent = errors[key];
  });

  successMessage.textContent = "";

  if (isValid) {
    successMessage.textContent = "Thank you. Your message is ready to be sent.";
    contactForm.reset();
  }
}

function handleScrollState() {
  const scrolled = window.scrollY > 420;
  backToTop.classList.toggle("show", scrolled);

  document.querySelectorAll("section[id]").forEach((section) => {
    const sectionTop = section.offsetTop - 120;
    const sectionBottom = sectionTop + section.offsetHeight;
    const matchingLink = document.querySelector(`.nav-links a[href="#${section.id}"]`);

    if (matchingLink) {
      matchingLink.classList.toggle(
        "active",
        window.scrollY >= sectionTop && window.scrollY < sectionBottom
      );
    }
  });
}

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

contactForm.addEventListener("submit", validateForm);
window.addEventListener("scroll", handleScrollState);
document.getElementById("year").textContent = new Date().getFullYear();

applySavedTheme();
typeLoop();
buildSliderDots();
updateTestimonials();
setInterval(autoSlideTestimonials, 4500);
handleScrollState();
