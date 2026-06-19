const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const biodataForm = document.querySelector("#biodata-form");
const sendButton = document.querySelector("#send-biodata");
const formStatus = document.querySelector("#form-status");
const currentYear = document.querySelector("#current-year");
const whatsappNumber = "919780667363";

const requiredFields = [
  "fullName",
  "age",
  "gender",
  "maritalStatus",
  "location",
  "education",
  "profession",
  "contactNumber",
];

// Keep the footer date current without requiring manual edits.
currentYear.textContent = new Date().getFullYear();

// Mobile navigation toggle with accessible expanded state.
menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.classList.toggle("is-open");
  navLinks.classList.toggle("is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

// Close the mobile menu after a navigation link is selected.
navLinks.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    menuToggle.classList.remove("is-open");
    navLinks.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

// Validate required fields, format biodata, and redirect the user to WhatsApp.
biodataForm.addEventListener("submit", (event) => {
  event.preventDefault();
  clearFormStatus();

  if (!validateForm()) {
    focusFirstInvalidField();
    return;
  }

  const message = buildWhatsAppMessage(getFormValues());
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

  sendButton.disabled = true;
  sendButton.textContent = "Sending...";
  formStatus.textContent = "Redirecting to WhatsApp...";

  window.setTimeout(() => {
    window.location.href = whatsappUrl;
  }, 650);
});

// Clear an individual field error as soon as the user starts correcting it.
requiredFields.forEach((fieldName) => {
  const field = biodataForm.elements[fieldName];

  field.addEventListener("input", () => validateField(field));
  field.addEventListener("change", () => validateField(field));
});

function getFormValues() {
  const formData = new FormData(biodataForm);
  const values = {};

  for (const [key, value] of formData.entries()) {
    values[key] = value.trim();
  }

  return values;
}

function validateForm() {
  return requiredFields
    .map((fieldName) => validateField(biodataForm.elements[fieldName]))
    .every(Boolean);
}

function validateField(field) {
  const formField = field.closest(".form-field");
  const errorMessage = formField.querySelector(".error-message");
  const value = field.value.trim();
  let message = "";

  if (!value) {
    message = "This field is required.";
  } else if (field.id === "age" && Number(value) < 18) {
    message = "Age must be 18 or above.";
  }

  formField.classList.toggle("is-invalid", Boolean(message));
  field.setAttribute("aria-invalid", String(Boolean(message)));

  if (errorMessage) {
    errorMessage.textContent = message;
  }

  return !message;
}

function focusFirstInvalidField() {
  const firstInvalidField = biodataForm.querySelector(".is-invalid input, .is-invalid select");

  if (firstInvalidField) {
    firstInvalidField.focus();
  }
}

function clearFormStatus() {
  sendButton.disabled = false;
  sendButton.textContent = "Send Biodata";
  formStatus.textContent = "";
}

function valueOrFallback(value) {
  return value || "Not provided";
}

function buildWhatsAppMessage(values) {
  return `Assalamu Alaikum

*Muslim Nikah Matrimony Biodata*

Name: ${values.fullName}
Age: ${values.age}
Gender: ${values.gender}
Marital Status: ${values.maritalStatus}
Location: ${values.location}

Education: ${values.education}
Profession: ${values.profession}

Deeni/Dunyawi Balance: ${valueOrFallback(values.deeniBalance)}
Religious Practice: ${valueOrFallback(values.religiousPractice)}

Family Details:
${valueOrFallback(values.familyDetails)}

Expectations:
${valueOrFallback(values.expectations)}

Contact Number: ${values.contactNumber}
Guardian Contact: ${valueOrFallback(values.guardianContact)}

Additional Notes:
${valueOrFallback(values.additionalNotes)}`;
}
