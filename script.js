/* ============================================
   Diet Care with Samatha — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ---- Initialize AOS ----
  AOS.init({
    duration: 700,
    easing: 'ease-out-cubic',
    once: true,
    offset: 80,
    disable: 'mobile' === false // always enabled
  });

  // ---- Loading Screen ----
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    const dismissLoader = () => {
      loadingScreen.classList.add('hidden');
      document.body.style.overflow = '';
    };

    // Prevent scrolling during load
    document.body.style.overflow = 'hidden';

    // Dismiss after 2s or on window load, whichever comes last
    window.addEventListener('load', () => {
      setTimeout(dismissLoader, 1200);
    });

    // Fallback: dismiss after 3s max
    setTimeout(dismissLoader, 3000);
  }

  // ---- Sticky Navbar ----
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  const handleScroll = () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // ---- Mobile Menu Toggle ----
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu on link click
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on CTA click too
    const navCta = navMenu.querySelector('.nav-cta a');
    if (navCta) {
      navCta.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    }

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        navToggle.focus();
      }
    });
  }

  // ---- Active Nav Link on Scroll ----
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -70% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));

  // ---- BMI Calculator ----
  const bmiForm = document.getElementById('bmi-form');
  const bmiResult = document.getElementById('bmi-result');

  if (bmiForm) {
    bmiForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const height = parseFloat(document.getElementById('bmi-height').value);
      const weight = parseFloat(document.getElementById('bmi-weight').value);

      if (!height || !weight || height <= 0 || weight <= 0) {
        return;
      }

      // BMI = weight(kg) / height(m)²
      const heightM = height / 100;
      const bmi = weight / (heightM * heightM);
      const bmiRounded = bmi.toFixed(1);

      // Determine category
      let category, categoryClass, recommendation;

      if (bmi < 18.5) {
        category = 'Underweight';
        categoryClass = 'underweight';
        recommendation = 'Your BMI indicates you may be underweight. A personalized nutrition plan can help you gain healthy weight with balanced meals rich in nutrients and proteins.';
      } else if (bmi < 25) {
        category = 'Normal Weight';
        categoryClass = 'normal';
        recommendation = 'Great! Your BMI is within the healthy range. Maintain this with balanced nutrition, regular activity, and healthy lifestyle choices.';
      } else if (bmi < 30) {
        category = 'Overweight';
        categoryClass = 'overweight';
        recommendation = 'Your BMI suggests you may be slightly overweight. A personalized diet plan focused on sustainable weight management can help you reach a healthier range.';
      } else {
        category = 'Obese';
        categoryClass = 'obese';
        recommendation = 'Your BMI indicates obesity, which can increase health risks. A comprehensive nutrition and lifestyle plan can help you achieve sustainable, healthy weight loss.';
      }

      // Update result
      document.getElementById('bmi-value').textContent = bmiRounded;

      const categoryEl = document.getElementById('bmi-category');
      categoryEl.textContent = category;
      categoryEl.className = 'bmi-category ' + categoryClass;

      document.getElementById('bmi-range').textContent = 'Healthy BMI Range: 18.5 – 24.9';
      document.getElementById('bmi-recommendation').textContent = recommendation;

      bmiResult.classList.add('visible');

      // Scroll result into view
      bmiResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  // ---- FAQ Accordion ----
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other FAQs
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          otherItem.querySelector('.faq-answer').style.maxHeight = null;
        }
      });

      // Toggle current
      if (isActive) {
        item.classList.remove('active');
        question.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });

    // Keyboard accessibility
    question.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        question.click();
      }
    });
  });

  // ---- Contact Form Handling ----
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const phone = document.getElementById('contact-phone').value.trim();
      const subject = document.getElementById('contact-subject').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      // Basic validation
      if (!name || !email || !message) {
        showFormMessage('Please fill in all required fields.', 'error');
        return;
      }

      if (!isValidEmail(email)) {
        showFormMessage('Please enter a valid email address.', 'error');
        return;
      }

      // Build WhatsApp message
      let waMessage = `Hi Samatha! I'd like to book a consultation.\n\n`;
      waMessage += `*Name:* ${name}\n`;
      waMessage += `*Email:* ${email}\n`;
      if (phone) waMessage += `*Phone:* ${phone}\n`;
      if (subject) waMessage += `*Subject:* ${subject}\n`;
      waMessage += `*Message:* ${message}`;

      const waUrl = `https://wa.me/919121231781?text=${encodeURIComponent(waMessage)}`;

      // Open WhatsApp
      window.open(waUrl, '_blank');

      showFormMessage('Redirecting to WhatsApp... Thank you for reaching out!', 'success');

      // Reset form
      contactForm.reset();
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showFormMessage(msg, type) {
    // Remove existing message
    const existing = contactForm.querySelector('.form-message');
    if (existing) existing.remove();

    const msgEl = document.createElement('div');
    msgEl.className = `form-message form-message-${type}`;
    msgEl.textContent = msg;
    msgEl.style.cssText = `
      grid-column: 1 / -1;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 500;
      text-align: center;
      animation: fadeInUp 0.3s ease;
      ${type === 'success'
        ? 'background: #D8F3DC; color: #1B4332; border: 1px solid #95D5B2;'
        : 'background: #FEE2E2; color: #991B1B; border: 1px solid #FCA5A5;'
      }
    `;

    contactForm.appendChild(msgEl);

    // Auto-remove after 5s
    setTimeout(() => {
      if (msgEl.parentNode) {
        msgEl.style.opacity = '0';
        msgEl.style.transition = 'opacity 0.3s ease';
        setTimeout(() => msgEl.remove(), 300);
      }
    }, 5000);
  }

  // ---- Smooth Scroll for all anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ---- Lazy Load Images (native + fallback) ----
  if ('loading' in HTMLImageElement.prototype) {
    // Browser supports native lazy loading — images already have loading="lazy"
  } else {
    // Fallback: use IntersectionObserver
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  }

  // ---- Year Update in Footer ----
  const yearEl = document.querySelector('.footer-bottom p');
  if (yearEl) {
    const currentYear = new Date().getFullYear();
    yearEl.innerHTML = yearEl.innerHTML.replace(/\d{4}/, currentYear);
  }
});
