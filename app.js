(() => {
  const form = document.getElementById("donorForm");
  if (!form) return;

  const message = document.getElementById("formMessage");
  const submitText = document.getElementById("submitText");
  const progress = document.getElementById("progressBar");
  const endpoint = APP_CONFIG.GAS_WEB_APP_URL;

  if (!endpoint || endpoint.includes("PASTE_YOUR")) {
    message.textContent = "Setup required: add your Google Apps Script Web App URL to config.js.";
    message.className = "form-message error";
    form.addEventListener("submit", e => e.preventDefault());
    return;
  }

  form.action = endpoint;

  const requiredFields = [...form.querySelectorAll("[required]")];
  function updateProgress() {
    const filled = requiredFields.filter(el => el.value.trim()).length;
    progress.style.width = `${Math.round((filled / requiredFields.length) * 100)}%`;
  }
  form.addEventListener("input", updateProgress);
  form.addEventListener("change", updateProgress);

  let submitting = false;
  form.addEventListener("submit", () => {
    if (submitting) return;
    if (form.website.value) return;
    submitting = true;
    submitText.textContent = "Submitting…";
    message.textContent = "Saving your registration…";
    message.className = "form-message";
    form.querySelector(".submit-btn").disabled = true;

    // The form targets a hidden iframe because GitHub Pages is a different origin.
    // The backend writes to Google Sheets, then this timeout provides a friendly result.
    setTimeout(() => {
      message.textContent = "Registration submitted. Thank you for supporting blood donation!";
      message.className = "form-message success";
      form.reset();
      updateProgress();
      submitting = false;
      submitText.textContent = "Submit registration";
      form.querySelector(".submit-btn").disabled = false;
      document.getElementById("register").scrollIntoView({behavior: "smooth", block: "start"});
    }, 1400);
  });
})();