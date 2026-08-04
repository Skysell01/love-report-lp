/**
 * Checkout Page JavaScript Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Package Data Dictionary
  const packagesData = {
    '499': {
      id: '499',
      title: 'Basic Package',
      fullName: 'Basic Package - Only PDF (₹499)',
      desc: 'Only Love Report PDF',
      originalPrice: '₹999',
      priceNum: 499,
      priceStr: '₹499',
      discountStr: '-₹500 (50% OFF)',
      graphicHtml: `
        <div class="pkg-image-box" style="margin:0;">
          <img src="assets/love-report-book.png" alt="Love Report Book" style="max-width:130px; height:auto; mix-blend-mode:multiply;">
        </div>
      `,
      features: [
        '✨ Complete Personalised Kundali Love Report (PDF)',
        '🔮 98.4% Precision Parashari Vedic Calculations',
        '⚡ Delivered directly to WhatsApp & Email within 24 Hours'
      ]
    },
    '699': {
      id: '699',
      title: 'Standard Package',
      fullName: 'Standard Package - PDF + 15 Min Call (₹699)',
      desc: 'Love Report PDF + 15 Min 1-on-1 Consultation',
      originalPrice: '₹1,499',
      priceNum: 699,
      priceStr: '₹699',
      discountStr: '-₹800 (53% OFF)',
      graphicHtml: `
        <div class="pkg-bundle-box" style="margin:0; padding:0.5rem;">
          <div class="bundle-item">
            <img src="assets/love-report-book.png" alt="Book" class="bundle-book-img" style="max-width:85px;">
          </div>
          <div class="bundle-plus-icon" style="font-size:1.5rem;">+</div>
          <div class="bundle-item">
            <img src="assets/astrologer-consultation.svg" alt="Astro" class="bundle-astro-img" style="width:75px; height:75px;">
          </div>
        </div>
      `,
      features: [
        '✨ Complete Personalised Kundali Love Report (PDF)',
        '📞 15-Minute Live 1-on-1 Phone Call with Senior Vedic Astrologer',
        '🔮 Personalised Remedies & Answers to Your Questions',
        '⚡ Delivery on WhatsApp & Email within 24 Hours'
      ]
    },
    '999': {
      id: '999',
      title: 'VIP Package',
      fullName: 'VIP Package - PDF + 30 Min Call (₹999)',
      desc: 'Love Report PDF + 30 Min 1-on-1 Consultation',
      originalPrice: '₹1,999',
      priceNum: 999,
      priceStr: '₹999',
      discountStr: '-₹1,000 (50% OFF)',
      graphicHtml: `
        <div class="pkg-bundle-box" style="margin:0; padding:0.5rem;">
          <div class="bundle-item">
            <img src="assets/love-report-book.png" alt="Book" class="bundle-book-img" style="max-width:85px;">
          </div>
          <div class="bundle-plus-icon" style="font-size:1.5rem;">+</div>
          <div class="bundle-item">
            <img src="assets/astrologer-consultation.svg" alt="Astro" class="bundle-astro-img" style="width:75px; height:75px;">
          </div>
        </div>
      `,
      features: [
        '👑 Complete Personalised Kundali Love Report (PDF)',
        '📞 30-Minute In-Depth Live 1-on-1 Phone Call with Senior Astrologer',
        '⚡ Priority VIP Processing & Delivery within 12 Hours',
        '🛡️ In-Depth Manglik, Nadi & Dasha Remedies Guide'
      ]
    }
  };

  // URL Params Parser
  const urlParams = new URLSearchParams(window.location.search);
  let activePkgId = urlParams.get('package') || '699';
  if (!packagesData[activePkgId]) {
    activePkgId = '699';
  }

  // Update Package View UI
  function updatePackageView(pkgId) {
    const pkg = packagesData[pkgId];
    if (!pkg) return;

    activePkgId = pkgId;
    document.getElementById('selected-pkg-id').value = pkg.id;
    document.getElementById('selected-pkg-title').value = pkg.fullName;

    document.getElementById('pkg-display-name').textContent = pkg.title;
    document.getElementById('pkg-display-desc').textContent = pkg.desc;
    document.getElementById('pkg-graphic-container').innerHTML = pkg.graphicHtml;

    document.getElementById('pkg-original-price').textContent = pkg.originalPrice;
    document.getElementById('pkg-discount').textContent = pkg.discountStr;
    document.getElementById('pkg-total-price').textContent = pkg.priceStr;

    // Update Switcher Buttons
    document.querySelectorAll('.pkg-switch-btn').forEach(btn => {
      if (btn.getAttribute('data-price') === pkgId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update Features List
    const featList = document.getElementById('pkg-features-list');
    featList.innerHTML = '';
    pkg.features.forEach(feat => {
      const li = document.createElement('li');
      li.textContent = feat;
      featList.appendChild(li);
    });
  }

  // Initial Render
  updatePackageView(activePkgId);

  // Switcher Click Handlers
  document.querySelectorAll('.pkg-switch-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pkgPrice = btn.getAttribute('data-price');
      updatePackageView(pkgPrice);
    });
  });

  // Handle Form Submission
  const checkoutForm = document.getElementById('checkout-form');
  const submitBtn = document.getElementById('submit-btn');

  checkoutForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const contact = document.getElementById('contact').value.trim();
    const dob = document.getElementById('dob').value;
    const gender = document.getElementById('gender').value;
    const city = document.getElementById('city').value.trim();

    const selectedPkg = packagesData[activePkgId];
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const timestamp = new Date().toISOString();

    const orderData = {
      orderId: orderId,
      timestamp: timestamp,
      name: name,
      email: email,
      contact: contact,
      dob: dob,
      gender: gender,
      city: city,
      package: selectedPkg.fullName,
      price: selectedPkg.priceStr,
      paymentStatus: 'Pending' // Payment Gateway Integration Placeholder
    };

    // UI Loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Registering Order...';

    // 1. Save to Local Storage for Admin Panel
    try {
      const existingOrders = JSON.parse(localStorage.getItem('love_report_orders') || '[]');
      existingOrders.unshift(orderData);
      localStorage.setItem('love_report_orders', JSON.stringify(existingOrders));
    } catch (err) {
      console.error('LocalStorage write error:', err);
    }

    // 2. Sync with Google Apps Script Webhook
    const defaultWebhook = 'https://script.google.com/macros/s/AKfycbxHiEvZd_rhRX8KPfqGHLZHb_cVygKnd7ATDqsgGifwjgls9EGIJgWT_ZEpkHjw9cIi/exec';
    const webhookUrl = localStorage.getItem('google_webhook_url') || defaultWebhook;
    if (webhookUrl && webhookUrl.startsWith('http')) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          mode: 'no-cors', // CORS handling for Google Apps Script
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(orderData)
        });
      } catch (webhookErr) {
        console.warn('Webhook sync note:', webhookErr);
      }
    }

    // 3. Show Success Modal
    document.getElementById('success-order-id').textContent = orderId;
    document.getElementById('success-user-name').textContent = name;
    document.getElementById('success-user-contact').textContent = contact;

    const modal = document.getElementById('checkout-success-modal');
    modal.classList.add('active');

    submitBtn.disabled = false;
    submitBtn.textContent = 'Proceed to Complete Order →';
  });
});
