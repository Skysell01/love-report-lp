/**
 * Admin Panel JavaScript Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const loginScreen = document.getElementById('admin-login-screen');
  const dashboardView = document.getElementById('admin-dashboard-view');
  const loginForm = document.getElementById('admin-login-form');
  const loginError = document.getElementById('login-error-msg');
  const logoutBtn = document.getElementById('admin-logout-btn');

  // Check Authentication Session
  function checkAuthStatus() {
    const isAuthenticated = sessionStorage.getItem('admin_authenticated') === 'true';
    if (isAuthenticated) {
      loginScreen.classList.add('hidden');
      dashboardView.classList.remove('hidden');
      loadDashboardData();
    } else {
      loginScreen.classList.remove('hidden');
      dashboardView.classList.add('hidden');
    }
  }

  // Handle Login
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('admin-email').value.trim();
    const password = document.getElementById('admin-password').value.trim();

    if (email === 'admin@admin.com' && password === 'admin@admin') {
      sessionStorage.setItem('admin_authenticated', 'true');
      loginError.classList.add('hidden');
      checkAuthStatus();
    } else {
      loginError.classList.remove('hidden');
    }
  });

  // Handle Logout
  logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('admin_authenticated');
    checkAuthStatus();
  });

  // Initial Auth Check
  checkAuthStatus();

  // Webhook Config Logic (Optional)
  const webhookInput = document.getElementById('webhook-url-input');
  const webhookForm = document.getElementById('webhook-config-form');
  const toggleGasBtn = document.getElementById('toggle-gas-instructions');
  const gasBox = document.getElementById('gas-instructions-box');

  if (webhookForm && webhookInput) {
    const defaultWebhook = 'https://script.google.com/macros/s/AKfycbxHiEvZd_rhRX8KPfqGHLZHb_cVygKnd7ATDqsgGifwjgls9EGIJgWT_ZEpkHjw9cIi/exec';
    const savedWebhook = localStorage.getItem('google_webhook_url') || defaultWebhook;
    webhookInput.value = savedWebhook;

    webhookForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newUrl = webhookInput.value.trim();
      localStorage.setItem('google_webhook_url', newUrl);
      alert('✅ Google Sheet Webhook URL saved successfully!');
    });
  }

  if (toggleGasBtn && gasBox) {
    toggleGasBtn.addEventListener('click', () => {
      gasBox.classList.toggle('hidden');
    });
  }

  // Dashboard Orders Management
  let allOrders = [];
  let currentFilter = 'all';

  function loadDashboardData() {
    try {
      allOrders = JSON.parse(localStorage.getItem('love_report_orders') || '[]');
    } catch (err) {
      allOrders = [];
    }

    updateAnalytics(allOrders);
    renderOrdersTable();
  }

  function updateAnalytics(orders) {
    let totalRevenue = 0;
    let pendingCount = 0;
    let successCount = 0;

    orders.forEach(ord => {
      const priceVal = parseInt((ord.price || '').replace(/[^0-9]/g, '')) || 0;
      totalRevenue += priceVal;

      if (ord.paymentStatus === 'Success') {
        successCount++;
      } else {
        pendingCount++;
      }
    });

    document.getElementById('stat-total-orders').textContent = orders.length;
    document.getElementById('stat-total-revenue').textContent = '₹' + totalRevenue.toLocaleString('en-IN');
    document.getElementById('stat-pending-orders').textContent = pendingCount;
    document.getElementById('stat-completed-orders').textContent = successCount;
  }

  function renderOrdersTable() {
    const tbody = document.getElementById('orders-table-body');
    const emptyMsg = document.getElementById('empty-orders-msg');
    const searchVal = document.getElementById('order-search-input').value.toLowerCase().trim();

    tbody.innerHTML = '';

    const filtered = allOrders.filter(ord => {
      // Status Filter
      if (currentFilter !== 'all' && ord.paymentStatus !== currentFilter) {
        return false;
      }

      // Search Filter
      if (searchVal) {
        const textStr = `${ord.orderId} ${ord.name} ${ord.email} ${ord.contact} ${ord.city} ${ord.package}`.toLowerCase();
        if (!textStr.includes(searchVal)) {
          return false;
        }
      }

      return true;
    });

    if (filtered.length === 0) {
      emptyMsg.classList.remove('hidden');
      return;
    } else {
      emptyMsg.classList.add('hidden');
    }

    filtered.forEach((ord, index) => {
      const tr = document.createElement('tr');

      const dateStr = ord.timestamp ? new Date(ord.timestamp).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
      }) : 'N/A';

      const isSuccess = ord.paymentStatus === 'Success';
      const statusBadgeHtml = `
        <button class="status-badge ${isSuccess ? 'success' : 'pending'}" onclick="toggleOrderStatus('${ord.orderId}')">
          ${isSuccess ? '✅ Paid' : '⌛ Pending'}
        </button>
      `;

      tr.innerHTML = `
        <td>
          <span class="user-name-title">${ord.orderId}</span>
          <span class="user-contact-sub">${dateStr}</span>
        </td>
        <td>
          <span class="user-name-title">${escapeHtml(ord.name)}</span>
          <span class="user-contact-sub">📧 ${escapeHtml(ord.email)}</span><br>
          <span class="user-contact-sub">📞 ${escapeHtml(ord.contact)}</span>
        </td>
        <td>
          <span class="user-name-title">📍 ${escapeHtml(ord.city)}</span>
          <span class="user-contact-sub">DOB: ${escapeHtml(ord.dob)} (${escapeHtml(ord.gender)})</span>
        </td>
        <td>
          <strong style="color:var(--gold-dark);">${escapeHtml(ord.package)}</strong>
        </td>
        <td>
          <strong style="color:var(--primary-orange); font-size:1.05rem;">${escapeHtml(ord.price)}</strong>
        </td>
        <td>
          ${statusBadgeHtml}
        </td>
        <td>
          <button class="action-btn-danger" onclick="deleteOrder('${ord.orderId}')">Delete 🗑️</button>
        </td>
      `;

      tbody.appendChild(tr);
    });
  }

  // Global Functions for Inline Onclick Events
  window.toggleOrderStatus = function(orderId) {
    const target = allOrders.find(o => o.orderId === orderId);
    if (target) {
      target.paymentStatus = target.paymentStatus === 'Success' ? 'Pending' : 'Success';
      localStorage.setItem('love_report_orders', JSON.stringify(allOrders));
      loadDashboardData();
    }
  };

  window.deleteOrder = function(orderId) {
    if (confirm(`Are you sure you want to delete order ${orderId}?`)) {
      allOrders = allOrders.filter(o => o.orderId !== orderId);
      localStorage.setItem('love_report_orders', JSON.stringify(allOrders));
      loadDashboardData();
    }
  };

  // Filter Tabs
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.getAttribute('data-filter');
      renderOrdersTable();
    });
  });

  // Search Control
  document.getElementById('order-search-input').addEventListener('input', () => {
    renderOrdersTable();
  });

  // Export CSV
  document.getElementById('export-csv-btn').addEventListener('click', () => {
    if (allOrders.length === 0) {
      alert('No orders available to export.');
      return;
    }

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Timestamp,Order ID,Name,Email,Contact,DOB,Gender,City,Package,Price,Payment Status\n';

    allOrders.forEach(ord => {
      const row = [
        `"${ord.timestamp || ''}"`,
        `"${ord.orderId || ''}"`,
        `"${(ord.name || '').replace(/"/g, '""')}"`,
        `"${(ord.email || '').replace(/"/g, '""')}"`,
        `"${(ord.contact || '').replace(/"/g, '""')}"`,
        `"${ord.dob || ''}"`,
        `"${ord.gender || ''}"`,
        `"${(ord.city || '').replace(/"/g, '""')}"`,
        `"${(ord.package || '').replace(/"/g, '""')}"`,
        `"${ord.price || ''}"`,
        `"${ord.paymentStatus || ''}"`
      ].join(',');
      csvContent += row + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Love_Report_Orders_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  // Clear All Demo Orders
  document.getElementById('clear-demo-btn').addEventListener('click', () => {
    if (confirm('Clear all local test order history? This cannot be undone.')) {
      allOrders = [];
      localStorage.setItem('love_report_orders', JSON.stringify([]));
      loadDashboardData();
    }
  });

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
