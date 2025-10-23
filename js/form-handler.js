document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('form[data-form-type]');

  forms.forEach(form => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (form.classList.contains('is-submitting')) return;

      const submitButton = form.querySelector('button[type="submit"]');
      const submitText = submitButton.querySelector('.submit-text');
      const spinner = submitButton.querySelector('.spinner-border');
      let messageContainer = form.querySelector('.form-message-container');

      if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.className = 'form-message-container';
        submitButton.parentNode.appendChild(messageContainer);
      }

      // Reset previous messages
      messageContainer.innerHTML = '';
      messageContainer.className = 'form-message-container';

      // Basic validation
      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
      }

      // Start submission
      form.classList.add('is-submitting');
      submitButton.disabled = true;
      if (submitText) submitText.textContent = 'Sending...';
      if (spinner) spinner.classList.remove('d-none');

      try {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const formType = form.dataset.formType;
        const endpoint = getEndpoint(formType);

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'An unknown error occurred.');
        }

        displayMessage(messageContainer, result.message || 'Your message has been sent successfully!', 'success');
        form.reset();
        form.classList.remove('was-validated');

      } catch (error) {
        displayMessage(messageContainer, error.message || 'Failed to send message. Please try again later.', 'error');
      } finally {
        // End submission
        form.classList.remove('is-submitting');
        submitButton.disabled = false;
        if (submitText) submitText.textContent = getOriginalButtonText(form.dataset.formType);
        if (spinner) spinner.classList.add('d-none');
      }
    });
  });

  function displayMessage(container, message, type) {
    container.className = `form-message-container message-${type} show`;
    const iconClass = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    container.innerHTML = `<i class="fas ${iconClass} form-message-icon"></i><span class="form-message-text">${message}</span>`;
  }

  function getEndpoint(formType) {
    const baseUrl = 'https://heatflow-server.onrender.com/api';
    const endpoints = {
      contact: `${baseUrl}/contact`,
      quote: `${baseUrl}/quotes`,
      newsletter: `${baseUrl}/newsletter/subscribe`
    };
    return endpoints[formType] || endpoints.contact;
  }

  function getOriginalButtonText(formType) {
    switch (formType) {
      case 'contact':
        return 'Send Message';
      case 'quote':
        return 'Request Free Quote';
      case 'newsletter':
        return 'Sign Up';
      default:
        return 'Submit';
    }
  }
});
