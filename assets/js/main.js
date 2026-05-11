document.addEventListener('DOMContentLoaded', () => {
  const quiz = document.querySelector('[data-quiz]');
  const buildMessengerLinks = (message, tgLink, waLink) => {
    if (tgLink) tgLink.href = `https://t.me/beschetnova-msk?text=${encodeURIComponent(message)}`;
    if (waLink) waLink.href = `https://wa.me/79276088385?text=${encodeURIComponent(message)}`;
  };

  if (quiz) {
    const steps = Array.from(quiz.querySelectorAll('[data-step]'));
    const prevBtn = quiz.querySelector('[data-prev]');
    const nextBtn = quiz.querySelector('[data-next]');
    const progressBar = quiz.querySelector('[data-progress-bar]');
    const progressText = quiz.querySelector('[data-progress-text]');
    const resultBox = quiz.querySelector('[data-quiz-result]');
    const resultText = quiz.querySelector('[data-result-text]');
    const tgLink = quiz.querySelector('[data-result-tg]');
    const waLink = quiz.querySelector('[data-result-wa]');
    let currentStep = 0;

    const updateView = () => {
      steps.forEach((step, index) => {
        step.hidden = index !== currentStep;
      });

      const percent = ((currentStep + 1) / steps.length) * 100;
      if (progressBar) progressBar.style.width = `${percent}%`;
      if (progressText) progressText.textContent = `Шаг ${currentStep + 1} из ${steps.length}`;

      prevBtn.hidden = currentStep === 0;
      nextBtn.textContent = currentStep === steps.length - 1 ? 'Получить рекомендации' : 'Дальше';
    };

    const collectAnswers = () => {
      const data = {};
      quiz.querySelectorAll('input, textarea').forEach((field) => {
        if ((field.type === 'radio' || field.type === 'checkbox') && !field.checked) return;
        if (!field.name) return;
        if (data[field.name]) {
          data[field.name] += `, ${field.value}`;
        } else {
          data[field.name] = field.value.trim();
        }
      });
      return data;
    };

    const validateStep = () => {
      const step = steps[currentStep];
      const requiredFields = Array.from(step.querySelectorAll('[required]'));
      for (const field of requiredFields) {
        if ((field.type === 'radio' || field.type === 'checkbox')) {
          const group = step.querySelectorAll(`[name="${field.name}"]`);
          const checked = Array.from(group).some((item) => item.checked);
          if (!checked) return false;
        } else if (!field.value.trim()) {
          return false;
        }
      }
      return true;
    };

    const buildMessage = () => {
      const answers = collectAnswers();
      const message = [
        'Здравствуйте! Хочу получить разбор ситуации.',
        `1. Направление: ${answers.category || 'не указано'}`,
        `2. Срочность: ${answers.urgency || 'не указано'}`,
        `3. Что нужно: ${answers.goal || 'не указано'}`,
        `4. Суть ситуации: ${answers.details || 'не указано'}`,
        `5. Контакт: ${answers.contact || 'не указано'}`
      ].join('\n');

      if (resultText) resultText.textContent = message;
      buildMessengerLinks(message, tgLink, waLink);
      if (resultBox) resultBox.hidden = false;
    };

    nextBtn?.addEventListener('click', () => {
      if (!validateStep()) {
        alert('Пожалуйста, заполните обязательные поля этого шага.');
        return;
      }

      if (currentStep < steps.length - 1) {
        currentStep += 1;
        updateView();
        return;
      }

      buildMessage();
    });

    prevBtn?.addEventListener('click', () => {
      if (currentStep > 0) {
        currentStep -= 1;
        updateView();
      }
    });

    updateView();
  }

  document.querySelectorAll('[data-message-form]').forEach((form) => {
    const textarea = form.querySelector('[data-message-input]');
    const contactInput = form.querySelector('[data-contact-input]');
    const topic = form.dataset.topic || 'юридический вопрос';
    const resultBox = form.querySelector('[data-message-result]');
    const resultText = form.querySelector('[data-message-preview]');
    const tgLink = form.querySelector('[data-message-tg]');
    const waLink = form.querySelector('[data-message-wa]');
    const submitBtn = form.querySelector('[data-message-submit]');

    submitBtn?.addEventListener('click', () => {
      const details = textarea?.value.trim();
      const contact = contactInput?.value.trim();

      if (!details) {
        alert('Пожалуйста, кратко опишите ситуацию.');
        return;
      }

      const message = [
        `Здравствуйте! Нужна консультация по направлению: ${topic}.`,
        `Суть вопроса: ${details}`,
        `Контакт для связи: ${contact || 'предпочту уточнить в переписке'}`
      ].join('\n');

      if (resultText) resultText.textContent = message;
      buildMessengerLinks(message, tgLink, waLink);
      if (resultBox) resultBox.hidden = false;
    });
  });
});