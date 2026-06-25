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

document.addEventListener("DOMContentLoaded", () => {
  const typingSpan = document.getElementById("typingText");
  if (!typingSpan) return;

  const roles = ["Full Stack Developer", "Freelancer", "Problem Solver"];
  
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;

  function type() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      typingSpan.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 40;
    } else {
      typingSpan.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 100;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typeSpeed = 400;
    }

    setTimeout(type, typeSpeed);
  }

  setTimeout(type, 500);
});