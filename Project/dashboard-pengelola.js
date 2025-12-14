// Dashboard Pengelola JavaScript
// TODO: Semua data hardcoded telah dikosongkan
// Backend developer perlu mengisi data melalui API calls
// Struktur HTML sudah siap dengan ID yang jelas untuk diisi oleh JavaScript

const tabs = document.querySelectorAll('.dashboard-tab');
const panels = document.querySelectorAll('.dashboard-panel');

// Tab switching functionality
let isTabSwitching = false; // Flag to prevent navigation loops

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Prevent if already switching
    if (isTabSwitching) return;
    
    const targetTab = tab.dataset.tab;
    
    // Reset navigation flag when switching to beranda
    if (targetTab === 'dashboard') {
      isNavigating = false;
    }
    
    isTabSwitching = true;
    
    // Remove active class from all tabs and panels
    tabs.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    
    panels.forEach(p => {
      p.classList.remove('active');
    });
    
    // Hide service detail panel if showing
    const serviceDetailPanel = document.getElementById('service-detail-panel');
    if (serviceDetailPanel) {
      serviceDetailPanel.style.display = 'none';
      serviceDetailPanel.classList.remove('active');
    }
    
    // Show pengelolaan jasa panel if it was hidden
    const pengelolaanJasaPanel = document.getElementById('pengelolaan-jasa-panel');
    if (pengelolaanJasaPanel && targetTab === 'pengelolaan-jasa') {
      pengelolaanJasaPanel.style.display = 'block';
    }
    
    // Add active class to clicked tab and corresponding panel
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    
    const targetPanel = document.getElementById(`${targetTab}-panel`);
    if (targetPanel) {
      targetPanel.classList.add('active');
    }
    
    // Reset flag after a short delay
    setTimeout(() => {
      isTabSwitching = false;
    }, 100);
  });
});

// Logout functionality
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
      window.location.href = './index.html';
    }
  });
}

// Filter buttons for Pemesanan tab
// TODO: Implement filter logic dengan data dari backend API
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    // TODO: Filter table data dari backend berdasarkan status yang dipilih
    // Example: fetch(`/api/orders?status=${btn.dataset.status}`)
    console.log('Filter:', btn.textContent);
  });
});

// Action buttons (Detail, Edit, Delete, etc.)
// TODO: Implement action handlers dengan backend API
document.querySelectorAll('.btn-action').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const row = e.target.closest('tr');
    const orderId = row.querySelector('td').textContent;
    // TODO: Fetch order details from backend API
    // Example: fetch(`/api/orders/${orderId}`)
    alert(`Detail pemesanan: ${orderId}`);
  });
});

// Add service button from Beranda
// TODO: Implement add service modal/form dengan backend API
const addServiceBtnFromBeranda = document.getElementById('addServiceBtnFromBeranda');
if (addServiceBtnFromBeranda) {
  addServiceBtnFromBeranda.addEventListener('click', () => {
    // TODO: Show modal/form untuk menambah jasa baru
    // After form submission, POST to backend API
    // Example: fetch('/api/services', { method: 'POST', body: formData })
    alert('Pilih kategori jasa yang ingin ditambahkan:\n1. Kamar/Akomodasi\n2. Kendaraan\n3. Paket Destinasi');
  });
}

// Add service button from service panel
// TODO: Implement add service modal/form dengan backend API
const addServiceBtn = document.getElementById('addServiceBtn');
if (addServiceBtn) {
  addServiceBtn.addEventListener('click', () => {
    const pengelolaanJasaPanel = document.getElementById('pengelolaan-jasa-panel');
    let serviceType = 'kamar';
    
    // Determine service type from visible content
    if (pengelolaanJasaPanel && pengelolaanJasaPanel.style.display !== 'none') {
      const kamarContent = document.getElementById('kamar-content');
      const kendaraanContent = document.getElementById('kendaraan-content');
      const destinasiContent = document.getElementById('destinasi-content');
      
      if (kamarContent && kamarContent.style.display !== 'none') {
        serviceType = 'kamar';
      } else if (kendaraanContent && kendaraanContent.style.display !== 'none') {
        serviceType = 'kendaraan';
      } else if (destinasiContent && destinasiContent.style.display !== 'none') {
        serviceType = 'destinasi';
      }
    }
    
    // TODO: Show modal/form untuk menambah jasa baru berdasarkan serviceType
    // After form submission, POST to backend API
    // Example: fetch(`/api/services/${serviceType}`, { method: 'POST', body: formData })
    alert(`Tambah ${serviceType === 'kamar' ? 'Kamar/Akomodasi' : serviceType === 'kendaraan' ? 'Kendaraan' : 'Destinasi'}`);
  });
}

// Clickable service cards - Show detail view
const clickableServices = document.querySelectorAll('.clickable-service');
const serviceDetailPanel = document.getElementById('service-detail-panel');
const pengelolaanJasaPanel = document.getElementById('pengelolaan-jasa-panel');
const backToServicesBtn = document.getElementById('backToServices');

clickableServices.forEach(card => {
  card.addEventListener('click', () => {
    const serviceId = card.dataset.serviceId;
    const serviceType = card.dataset.serviceType;
    const serviceName = card.dataset.serviceName;
    
    // Hide pengelolaan jasa panel and show detail panel
    pengelolaanJasaPanel.classList.remove('active');
    pengelolaanJasaPanel.style.display = 'none';
    serviceDetailPanel.style.display = 'block';
    serviceDetailPanel.classList.add('active');
    
    // Update detail view with service data
    updateServiceDetail(serviceId, serviceType, serviceName);
  });
});

// Back to services list (from detail view) - goes back to pengelolaan jasa panel
if (backToServicesBtn) {
  backToServicesBtn.addEventListener('click', () => {
    // Reset navigation flag
    isNavigating = false;
    
    const serviceDetailPanel = document.getElementById('service-detail-panel');
    const pengelolaanJasaPanel = document.getElementById('pengelolaan-jasa-panel');
    
    if (serviceDetailPanel) {
      serviceDetailPanel.style.display = 'none';
      serviceDetailPanel.classList.remove('active');
    }
    
    // Show pengelolaan jasa panel (the list of services)
    if (pengelolaanJasaPanel) {
      pengelolaanJasaPanel.style.display = 'block';
      pengelolaanJasaPanel.classList.add('active');
    }
  });
}

// Service detail tabs
const serviceDetailTabs = document.querySelectorAll('.service-detail-tab');
const detailContentPanels = document.querySelectorAll('.detail-content-panel');

serviceDetailTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const targetTab = tab.dataset.detailTab;
    
    // Remove active from all tabs and panels
    serviceDetailTabs.forEach(t => t.classList.remove('active'));
    detailContentPanels.forEach(p => p.classList.remove('active'));
    
    // Add active to clicked tab and panel
    tab.classList.add('active');
    const targetPanel = document.getElementById(`${targetTab}-content`);
    if (targetPanel) {
      targetPanel.classList.add('active');
    }
  });
});

// Update service detail with data
function updateServiceDetail(serviceId, serviceType, serviceName) {
  // Update header
  document.getElementById('serviceDetailName').textContent = serviceName;
  
  const typeLabels = {
    'kamar': 'Kamar/Akomodasi',
    'kendaraan': 'Kendaraan',
    'destinasi': 'Destinasi'
  };
  document.getElementById('serviceDetailType').textContent = typeLabels[serviceType] || serviceType;
  
  // TODO: Update dashboard stats from backend API
  // This should fetch real data from backend
  loadServiceDetailData(serviceId, serviceType);
  
  // Update settings form
  if (document.getElementById('detailServiceName')) {
    document.getElementById('detailServiceName').value = serviceName;
  }
}

// TODO: Fungsi ini akan mengambil data dari backend API
// Ganti dengan fetch/axios call ke endpoint backend
async function getServiceData(serviceId, serviceType) {
  // Example:
  // const response = await fetch(`/api/services/${serviceId}`);
  // const data = await response.json();
  // return data;
  
  // Return empty data structure for now
  return {
    orders: '0',
    revenue: 'Rp 0',
    rating: '0',
    occupancy: '0%'
  };
}

// TODO: Load service detail data from backend API
async function loadServiceDetailData(serviceId, serviceType) {
  // Example:
  // const response = await fetch(`/api/services/${serviceId}/details`);
  // const data = await response.json();
  // Then populate the detail view with the data
  
  // For now, set empty values
  const statsGrid = document.getElementById('detailStatsGrid');
  const orderList = document.getElementById('detailOrderList');
  const activityList = document.getElementById('detailActivityList');
  
  if (statsGrid) {
    // TODO: Generate stat cards from backend data
    statsGrid.innerHTML = '<!-- Stat cards akan di-generate dari data backend -->';
  }
  
  if (orderList) {
    // TODO: Generate order items from backend data
    orderList.innerHTML = '<!-- Order items akan di-generate dari data backend -->';
  }
  
  if (activityList) {
    // TODO: Generate activity items from backend data
    activityList.innerHTML = '<!-- Activity items akan di-generate dari data backend -->';
  }
}

// Settings modal
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const settingsModalClose = document.getElementById('settingsModalClose');
const settingsModalBackdrop = document.getElementById('settingsModalBackdrop');

if (settingsBtn) {
  settingsBtn.addEventListener('click', () => {
    settingsModal.style.display = 'block';
  });
}

if (settingsModalClose) {
  settingsModalClose.addEventListener('click', () => {
    settingsModal.style.display = 'none';
  });
}

if (settingsModalBackdrop) {
  settingsModalBackdrop.addEventListener('click', () => {
    settingsModal.style.display = 'none';
  });
}

// Clickable income cards - Navigate to service management panel
let isNavigating = false; // Flag to prevent multiple navigations

const clickableIncomeCards = document.querySelectorAll('.clickable-income');

clickableIncomeCards.forEach(card => {
  card.addEventListener('click', (e) => {
    // Prevent if already navigating or tab switching
    if (isNavigating || isTabSwitching) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    
    const serviceType = card.dataset.serviceType;
    
    // Set flag to prevent multiple clicks
    isNavigating = true;
    
    // Hide service detail panel if showing
    const serviceDetailPanel = document.getElementById('service-detail-panel');
    const pengelolaanJasaPanel = document.getElementById('pengelolaan-jasa-panel');
    const dashboardPanel = document.getElementById('dashboard-panel');
    
    // Hide dashboard panel
    if (dashboardPanel) {
      dashboardPanel.classList.remove('active');
    }
    
    // Show pengelolaan jasa panel
    if (pengelolaanJasaPanel) {
      pengelolaanJasaPanel.style.display = 'block';
      pengelolaanJasaPanel.classList.add('active');
    }
    
    // Hide service detail panel if showing
    if (serviceDetailPanel) {
      serviceDetailPanel.style.display = 'none';
      serviceDetailPanel.classList.remove('active');
    }
    
    // Update panel title based on service type
    const typeLabels = {
      'kamar': { title: 'Kamar/Akomodasi', subtitle: 'Kelola kamar dan akomodasi yang tersedia' },
      'kendaraan': { title: 'Kendaraan', subtitle: 'Kelola armada kendaraan untuk disewakan' },
      'destinasi': { title: 'Paket Destinasi', subtitle: 'Kelola paket wisata dan destinasi Anda' }
    };
    
    const typeInfo = typeLabels[serviceType] || { title: 'Pengelolaan Jasa', subtitle: 'Kelola jasa Anda' };
    
    if (document.getElementById('servicePanelTitle')) {
      document.getElementById('servicePanelTitle').textContent = typeInfo.title;
    }
    if (document.getElementById('servicePanelSubtitle')) {
      document.getElementById('servicePanelSubtitle').textContent = typeInfo.subtitle;
    }
    
    // Hide all service contents
    document.querySelectorAll('.service-content').forEach(content => {
      content.style.display = 'none';
    });
    
    // Show the correct service content
    const targetContent = document.getElementById(`${serviceType}-content`);
    if (targetContent) {
      targetContent.style.display = 'block';
    }
    
    // Reset flag after navigation completes
    setTimeout(() => {
      isNavigating = false;
    }, 300);
  });
});

// Back to Beranda button
const backToBerandaBtn = document.getElementById('backToBeranda');
if (backToBerandaBtn) {
  backToBerandaBtn.addEventListener('click', () => {
    // Reset navigation flag
    isNavigating = false;
    
    const pengelolaanJasaPanel = document.getElementById('pengelolaan-jasa-panel');
    const dashboardPanel = document.getElementById('dashboard-panel');
    const serviceDetailPanel = document.getElementById('service-detail-panel');
    
    // Hide pengelolaan jasa panel
    if (pengelolaanJasaPanel) {
      pengelolaanJasaPanel.style.display = 'none';
      pengelolaanJasaPanel.classList.remove('active');
    }
    
    // Hide service detail panel
    if (serviceDetailPanel) {
      serviceDetailPanel.style.display = 'none';
      serviceDetailPanel.classList.remove('active');
    }
    
    // Show dashboard panel
    if (dashboardPanel) {
      dashboardPanel.classList.add('active');
    }
  });
}

// Initialize
console.log('Dashboard Pengelola loaded');

