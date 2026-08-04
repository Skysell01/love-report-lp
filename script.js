/* ==========================================================================
   LOVE REPORT LANDING PAGE - INTERACTIVE JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Scroll Triggered Animations using IntersectionObserver
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    animatedElements.forEach(el => el.classList.add('is-visible'));
  }

  // 2. Countdown Timer Ticker (Urgency Element)
  const timerDisplay = document.getElementById('timer-display');
  if (timerDisplay) {
    let durationSeconds = 14 * 60 + 52; // 14 mins 52 secs initial

    const updateTimer = () => {
      const mins = Math.floor(durationSeconds / 60);
      const secs = durationSeconds % 60;

      timerDisplay.textContent = `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;

      if (durationSeconds > 0) {
        durationSeconds--;
      } else {
        durationSeconds = 15 * 60; // Reset back to 15 mins
      }
    };

    updateTimer();
    setInterval(updateTimer, 1000);
  }

  // 3. FAQ Accordion Interaction
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all active items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
      });

      // Toggle clicked item
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 4. Order / Lead Modal Dialog Management
  const modalOverlay = document.getElementById('order-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const openModalBtns = document.querySelectorAll('.open-order-modal');
  const packageSelect = document.getElementById('selected-package');
  const leadForm = document.getElementById('lead-form');
  const successMsg = document.getElementById('success-msg');
  const doneBtn = document.getElementById('modal-done-btn');

  const openModal = (pkgName = null) => {
    if (modalOverlay) {
      if (pkgName && packageSelect) {
        // Preselect matching option
        for (let option of packageSelect.options) {
          if (option.value.includes(pkgName) || option.text.includes(pkgName)) {
            option.selected = true;
            break;
          }
        }
      }
      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
  };

  const closeModal = () => {
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
      
      // Reset form view after close
      setTimeout(() => {
        if (leadForm && successMsg) {
          leadForm.classList.remove('hidden');
          successMsg.classList.add('hidden');
          leadForm.reset();
        }
      }, 300);
    }
  };

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const pkg = btn.getAttribute('data-package');
      openModal(pkg);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }

  // 5. Order Form Submission Simulation
  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Submit simulation feedback
      const submitBtn = leadForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Calculating Kundali & Processing...';

      setTimeout(() => {
        leadForm.classList.add('hidden');
        successMsg.classList.remove('hidden');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }, 1200);
    });
  }

  if (doneBtn) {
    doneBtn.addEventListener('click', closeModal);
  }

  // 6. Header Scroll Effect
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
});
