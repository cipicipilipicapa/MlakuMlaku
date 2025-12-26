const destinations = [
  {
    id: "tebing-breksi",
    name: "Tebing Breksi",
    category: "alam",
    snippet: "Golden hour terbaik di sisi timur kota.",
    distance: "14 km",
    price: "25K",
    lat: -7.7833,
    lng: 110.5239,
    priceTier: "hemat",
    timeOfDay: "sore",
    suitability: ["keluarga", "pasangan"],
    image: "./Tebing-Breksi-Jogja-Dodi-Tri.jpg",
  },
  {
    id: "keraton",
    name: "Keraton Yogyakarta",
    category: "budaya",
    snippet: "Istana hidup yang sarat filosofi Jawa.",
    distance: "0 km",
    price: "15K",
    lat: -7.8053,
    lng: 110.3647,
    priceTier: "hemat",
    timeOfDay: "pagi",
    suitability: ["keluarga", "solo"],
    image: "./keraton yogyakarta.jpg",
  },
  {
    id: "gudeg-pawon",
    name: "Gudeg Pawon",
    category: "kuliner",
    snippet: "Kuliner malam legendaris sejak 1950-an.",
    distance: "2 km",
    price: "35K",
    lat: -7.8122,
    lng: 110.3815,
    priceTier: "hemat",
    timeOfDay: "malam",
    suitability: ["keluarga", "pasangan", "solo"],
    image:
      "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "taman-sari",
    name: "Taman Sari",
    category: "budaya",
    snippet: "Kompleks pemandian dengan kisah romantik.",
    distance: "1 km",
    price: "25K",
    lat: -7.8103,
    lng: 110.3609,
    priceTier: "sedang",
    timeOfDay: "pagi",
    suitability: ["keluarga", "pasangan"],
    image: "./taman sari.jpg",
  },
  {
    id: "kalibiru",
    name: "Kalibiru",
    category: "alam",
    snippet: "Spot foto dengan latar Waduk Sermo.",
    distance: "37 km",
    price: "40K",
    lat: -7.8137,
    lng: 110.1273,
    priceTier: "sedang",
    timeOfDay: "sore",
    suitability: ["keluarga", "solo"],
    image: "./kalibiru.jpg",
  },
];

const personas = {
  wisatawan: {
    heading: "Rencanakan perjalanan tanpa ribet.",
    bullets: [
      "Lihat rekomendasi spot sesuai minat, budget, dan waktu tempuh.",
      "Pantau kuota tiket atau event secara realtime.",
      "Simulasikan biaya & transaksi lewat dompet digital aman.",
      "Chat langsung untuk request privat tour atau guide.",
    ],
  },
  pengelola: {
    heading: "Kelola destinasi dengan dashboard intuitif.",
    bullets: [
      "Update harga, slot, dan promo harian dari satu panel.",
      "Terima pesan wisatawan dan balas dengan template cepat.",
      "Pantau penjualan, review, dan insight pengunjung.",
      "Integrasi pembayaran otomatis plus notifikasi bukti bayar.",
    ],
  },
  admin: {
    heading: "Pastikan ekosistem tetap sehat.",
    bullets: [
      "Moderasi konten, review, dan chat yang masuk.",
      "Monitor performa destinasi dan rekomendasi peningkatan.",
      "Kelola onboarding mitra usaha dengan status jelas.",
      "Analisa tren wisata untuk bahan laporan stakeholder.",
    ],
  },
};

// Review akan dimuat dari database
const reviews = [];

const heroListElm = document.querySelector("#heroList");
const chips = document.querySelectorAll(".chip");
const personaPanel = document.querySelector("#personaPanel");
const personaTabs = document.querySelectorAll(".tab");
const destinationGrid = document.querySelector("#destinationGrid");
const reviewTrack = document.querySelector("#reviewTrack");
const navButtons = document.querySelectorAll(".review-carousel .nav");
const locateMeBtn = document.querySelector("#locateMeBtn");
const mapLegend = document.querySelector("#mapLegend");
const searchInput = document.querySelector("#searchInput");
const experienceFilter = document.querySelector("#experienceFilter");
const savedStrip = document.querySelector("#savedStrip");
const savedListElm = document.querySelector("#savedList");
const plannerList = document.querySelector("#plannerList");
const plannerSummary = document.querySelector("#plannerSummary");
const toastContainer = document.querySelector(".toast-container");
const destinationModal = document.querySelector("#destinationModal");
const modalContent = document.querySelector("#modalContent");
const modalCloseBtn = document.querySelector("#modalCloseBtn");
const modalBackdrop = document.querySelector("#modalBackdrop");

let map;
let markers = [];
let savedIds = new Set(
  JSON.parse(localStorage.getItem("mlaku_saved") || "[]")
);

function showToast(message, type = "info") {
  if (!toastContainer) return;
  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("fade-out");
    toast.addEventListener("transitionend", () => toast.remove(), {
      once: true,
    });
  }, 2000);
}

function renderHeroList(category = "semua") {
  const filtered =
    category === "semua"
      ? destinations.slice(0, 3)
      : destinations.filter((item) => item.category === category).slice(0, 3);

  heroListElm.innerHTML = filtered
    .map(
      (item) => `
      <article class="mini-card" data-id="${item.id}" style="cursor: pointer;">
        <img src="${item.image}" alt="${item.name}" />
        <div>
          <strong>${item.name}</strong>
          <span>${item.snippet}</span>
        </div>
      </article>
    `
    )
    .join("");
}

function renderPersona(role = "wisatawan") {
  const persona = personas[role];
  personaPanel.innerHTML = `
    <h3>${persona.heading}</h3>
    <ul>
      ${persona.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}
    </ul>
  `;
}

function applyDestinationFilters() {
  let list = [...destinations];
  const q = (searchInput?.value || "").toLowerCase();
  const exp = experienceFilter?.value || "semua";

  if (q) {
    list = list.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.snippet.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q)
    );
  }

  if (exp !== "semua") {
    if (exp === "hemat") {
      list = list.filter((d) => d.priceTier === "hemat");
    } else if (exp === "keluarga") {
      list = list.filter((d) => d.suitability.includes("keluarga"));
    } else if (exp === "malam") {
      list = list.filter((d) => d.timeOfDay === "malam");
    }
  }

  return list;
}

function renderDestinations() {
  const list = applyDestinationFilters();
  destinationGrid.innerHTML = list
    .map(
      (item) => `
      <article class="destination-card" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" loading="lazy" />
        <div class="content">
          <div class="meta">
            <span>${item.category}</span>
            <span>${item.distance}</span>
          </div>
          <h3>${item.name}</h3>
          <p>${item.snippet}</p>
          <p class="meta">Tiket mulai ${item.price}</p>
          <div class="destination-actions">
            <button class="icon-btn heart ${
              savedIds.has(item.id) ? "is-saved" : ""
            }" data-id="${item.id}" aria-label="Simpan destinasi"></button>
            <div>
              <button class="btn subtle small" data-action="detail" data-id="${
                item.id
              }">Detail</button>
              <button class="btn ghost small" data-focus="map" data-id="${
                item.id
              }">Lihat di peta</button>
            </div>
          </div>
        </div>
      </article>
    `
    )
    .join("");
}

function renderMapLegend() {
  if (!mapLegend) return;
  mapLegend.innerHTML = destinations
    .map(
      (d) => `
      <li>
        <strong>${d.name}</strong>
        <span>${d.distance}</span>
      </li>
    `
    )
    .join("");
}

function renderSavedStrip() {
  if (!savedStrip || !savedListElm) return;
  const ids = [...savedIds];
  if (!ids.length) {
    savedStrip.hidden = true;
    return;
  }
  const entries = destinations.filter((d) => ids.includes(d.id));
  savedStrip.hidden = false;
  savedListElm.innerHTML = entries
    .map((d) => `<li>${d.name}</li>`)
    .join("");
}

function renderPlanner() {
  if (!plannerList || !plannerSummary) return;
  plannerList.innerHTML = destinations
    .map(
      (d) => `
    <li>
      <label>
        <input type="checkbox" value="${d.id}" class="planner-checkbox" />
        ${d.name}
      </label>
    </li>
  `
    )
    .join("");
  plannerSummary.textContent =
    "Pilih beberapa destinasi untuk melihat estimasi jarak tempuh.";
}

function updatePlannerSummary() {
  if (!plannerList || !plannerSummary) return;
  const checked = [
    ...plannerList.querySelectorAll(".planner-checkbox:checked"),
  ].map((el) => el.value);
  if (checked.length < 2) {
    plannerSummary.textContent =
      "Pilih minimal dua destinasi untuk menghitung estimasi jarak tempuh.";
    return;
  }
  const selected = destinations.filter((d) => checked.includes(d.id));
  let total = 0;
  for (let i = 0; i < selected.length - 1; i += 1) {
    total += haversineDistance(
      selected[i].lat,
      selected[i].lng,
      selected[i + 1].lat,
      selected[i + 1].lng
    );
  }
  plannerSummary.textContent = `Perkiraan jarak tempuh garis lurus: ${total
    .toFixed(1)
    .replace(".", ",")} km untuk ${selected.length} destinasi.`;
}

function renderReviews() {
  if (!reviewTrack) return;
  
  // Jika tidak ada review dari database, tampilkan pesan kosong
  if (reviews.length === 0) {
    reviewTrack.innerHTML = `
      <article class="review-card">
        <p style="color: var(--muted); font-style: italic;">
          Belum ada ulasan. Review akan dimuat dari database.
        </p>
      </article>
    `;
    return;
  }
  
  reviewTrack.innerHTML = reviews
    .map(
      (item) => `
      <article class="review-card">
        <p>${item.quote}</p>
        <strong>${item.name}</strong>
      </article>
    `
    )
    .join("");
}

// Event listener untuk filter chip di hero card
document.addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (!chip || !chip.dataset.filter) return;
  
  // Hanya handle chip di hero card (yang punya data-filter)
  const allChips = document.querySelectorAll(".chip[data-filter]");
  allChips.forEach((c) => c.classList.remove("active"));
  chip.classList.add("active");
  renderHeroList(chip.dataset.filter);
});

if (searchInput) {
  searchInput.addEventListener("input", () => {
    renderDestinations();
  });
}

if (experienceFilter) {
  experienceFilter.addEventListener("change", () => {
    renderDestinations();
  });
}

if (plannerList) {
  plannerList.addEventListener("change", (e) => {
    if (!e.target.matches(".planner-checkbox")) return;
    updatePlannerSummary();
  });
}

// Event listener untuk mini-card di hero list
if (heroListElm) {
  heroListElm.addEventListener("click", (e) => {
    const miniCard = e.target.closest(".mini-card");
    if (!miniCard || !miniCard.dataset.id) return;
    const id = miniCard.dataset.id;
    localStorage.setItem("mlaku_selected", id);
    window.location.href = `./destination.html?id=${encodeURIComponent(id)}`;
  });
}

if (destinationGrid) {
  destinationGrid.addEventListener("click", (e) => {
    const heartBtn = e.target.closest(".heart");
    const detailBtn = e.target.closest("[data-action='detail']");
    const id = heartBtn?.dataset.id || detailBtn?.dataset.id;

    if (heartBtn && id) {
      if (savedIds.has(id)) {
        savedIds.delete(id);
        heartBtn.classList.remove("is-saved");
        showToast("Destinasi dihapus dari daftar simpan.", "info");
      } else {
        savedIds.add(id);
        heartBtn.classList.add("is-saved");
        showToast("Destinasi disimpan.", "success");
      }
      localStorage.setItem("mlaku_saved", JSON.stringify([...savedIds]));
      renderSavedStrip();
      return;
    }

    if (detailBtn && id) {
      localStorage.setItem("mlaku_selected", id);
      window.location.href = `./destination.html?id=${encodeURIComponent(id)}`;
    }
  });
}

function closeModal() {
  if (!destinationModal) return;
  destinationModal.classList.add("hidden");
}

modalCloseBtn?.addEventListener("click", closeModal);
modalBackdrop?.addEventListener("click", closeModal);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

personaTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    personaTabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    renderPersona(tab.dataset.role);
  });
});

let reviewIndex = 0;

function updateReviewTrack() {
  if (!reviewTrack) return;
  const cards = reviewTrack.children.length;
  if (cards === 0) return;
  reviewIndex = Math.min(Math.max(reviewIndex, 0), cards - 1);
  reviewTrack.style.transform = `translateX(-${reviewIndex * 100}%)`;
  reviewTrack.style.transition = "transform 0.4s ease";
}

if (navButtons && navButtons.length > 0) {
  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const direction = btn.classList.contains("next") ? 1 : -1;
      const maxIndex = Math.max(reviews.length - 1, 0);
      reviewIndex = Math.min(Math.max(reviewIndex + direction, 0), maxIndex);
      updateReviewTrack();
    });
  });
}

function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

if (locateMeBtn && "geolocation" in navigator) {
  locateMeBtn.addEventListener("click", () => {
    locateMeBtn.disabled = true;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        destinations.forEach((d) => {
          const dist = haversineDistance(latitude, longitude, d.lat, d.lng);
          d.distance = `${dist.toFixed(1)} km`;
        });
        renderDestinations();
        renderHeroList();
        renderMapLegend();
        showToast("Lokasi berhasil digunakan untuk hitung jarak.", "success");
        locateMeBtn.textContent = "Lokasi digunakan";
        locateMeBtn.classList.add("active");
      },
      (err) => {
        locateMeBtn.disabled = false;
        console.error(err);
        showToast(
          "Tidak dapat mengakses lokasi. Periksa izin lokasi browser.",
          "info"
        );
      }
    );
  });
}

window.initMap = function initMap() {
  const centerJogja = { lat: -7.7956, lng: 110.3695 };
  map = new google.maps.Map(document.getElementById("gmaps"), {
    center: centerJogja,
    zoom: 11,
    styles: [
      {
        featureType: "all",
        elementType: "geometry",
        stylers: [{ color: "#fdf9f5" }],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#e0c7b5" }],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#efe4d8" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#d9e4f5" }],
      },
    ],
    disableDefaultUI: true,
    zoomControl: true,
  });

  const bounds = new google.maps.LatLngBounds();

  markers = destinations.map((d) => {
    const position = { lat: d.lat, lng: d.lng };
    const marker = new google.maps.Marker({
      position,
      map,
      title: d.name,
    });
    bounds.extend(position);
    const info = new google.maps.InfoWindow({
      content: `<strong>${d.name}</strong><br/><small>${d.snippet}</small>`,
    });
    marker.addListener("click", () => {
      info.open(map, marker);
    });
    return marker;
  });

  if (!bounds.isEmpty()) {
    map.fitBounds(bounds);
  }

  destinationGrid.addEventListener("click", (e) => {
    const focusBtn = e.target.closest("[data-focus='map']");
    if (!focusBtn) return;
    const id = focusBtn.dataset.id;
    const idx = destinations.findIndex((d) => d.id === id);
    if (idx > -1 && markers[idx]) {
      map.panTo(markers[idx].getPosition());
      map.setZoom(13);
    }
  });
};


const fadeSections = document.querySelectorAll(".fade-section");
if (fadeSections.length && "IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  fadeSections.forEach((sec) => io.observe(sec));
}

renderHeroList();
renderPersona();
renderDestinations();
renderReviews();
renderMapLegend();
renderSavedStrip();
renderPlanner();
