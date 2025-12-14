const DESTINATIONS_DETAIL = {
  "tebing-breksi": {
    name: "Tebing Breksi",
    category: "Alam",
    snippet: "Golden hour terbaik di sisi timur kota.",
    image: "./Tebing-Breksi-Jogja-Dodi-Tri.jpg",
    priceFrom: "25K",
    highlights: [
      "Pemandangan sunset dengan siluet tebing batu kapur.",
      "Banyak spot foto artistik bertema relief & ukiran.",
      "Dekat dengan beberapa kafe rooftop sederhana.",
    ],
    rooms: [
      { id: "breksi-pagi", name: "Paket Tur Pagi", price: 75000 },
      { id: "breksi-sunset", name: "Paket Sunset & Foto", price: 120000 },
      { id: "breksi-full", name: "Paket Sehari Penuh", price: 180000 },
    ],
    rentals: [
      { id: "breksi-scooter", name: "Sewa motor harian", price: 80000 },
      { id: "breksi-car", name: "Sewa mobil + sopir", price: 350000 },
    ],
  },
  keraton: {
    name: "Keraton Yogyakarta",
    category: "Budaya",
    snippet: "Istana hidup yang sarat filosofi Jawa.",
    image: "./keraton yogyakarta.jpg",
    priceFrom: "15K",
    highlights: [
      "Area museum dengan koleksi pusaka & gamelan.",
      "Pertunjukan seni tradisi di jam-jam tertentu.",
      "Banyak guide lokal yang bisa menjelaskan filosofi Jawa.",
    ],
    rooms: [
      { id: "keraton-regular", name: "Tiket Regular", price: 20000 },
      { id: "keraton-guide", name: "Tiket + Local Guide", price: 45000 },
    ],
    rentals: [
      { id: "keraton-becak", name: "Becak wisata sekitar keraton", price: 50000 },
      { id: "keraton-car", name: "Mobil city tour 4 jam", price: 300000 },
    ],
  },
  "gudeg-pawon": {
    name: "Gudeg Pawon",
    category: "Kuliner",
    snippet: "Kuliner malam legendaris sejak 1950-an.",
    image:
      "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=1200&q=80",
    priceFrom: "35K",
    highlights: [
      "Pengalaman makan gudeg langsung dari pawon (dapur).",
      "Antrean panjang yang jadi bagian dari pengalaman.",
      "Cocok untuk eksplor kuliner malam di Jogja.",
    ],
    rooms: [
      { id: "gudeg-single", name: "Paket Single", price: 40000 },
      { id: "gudeg-couple", name: "Paket Berdua", price: 75000 },
    ],
    rentals: [{ id: "gudeg-ojek", name: "Ojek pulang-pergi", price: 60000 }],
  },
  "taman-sari": {
    name: "Taman Sari",
    category: "Budaya",
    snippet: "Kompleks pemandian dengan kisah romantik.",
    image: "./taman sari.jpg",
    priceFrom: "25K",
    highlights: [
      "Kolam pemandian bersejarah dengan arsitektur unik.",
      "Jalur lorong bawah tanah dan spot foto populer.",
      "Dekat dengan kampung wisata dan galeri batik.",
    ],
    rooms: [
      { id: "tamansari-regular", name: "Tiket Regular", price: 25000 },
      { id: "tamansari-photo", name: "Tiket + Sesi Foto", price: 60000 },
    ],
    rentals: [
      { id: "tamansari-bike", name: "Sepeda keliling kampung wisata", price: 50000 },
    ],
  },
  kalibiru: {
    name: "Kalibiru",
    category: "Alam",
    snippet: "Spot foto dengan latar Waduk Sermo.",
    image: "./kalibiru.jpg",
    priceFrom: "40K",
    highlights: [
      "Deck kayu di atas ketinggian dengan pemandangan waduk.",
      "Udara sejuk dengan hutan pinus di sekitar area.",
      "Banyak paket foto dengan properti unik.",
    ],
    rooms: [
      { id: "kalibiru-view", name: "Paket View Deck", price: 50000 },
      { id: "kalibiru-foto", name: "Paket Foto Profesional", price: 95000 },
    ],
    rentals: [
      { id: "kalibiru-jeep", name: "Jeep wisata Kalibiru", price: 250000 },
    ],
  },
};

const detailTitle = document.querySelector("#detailTitle");
const detailSubtitle = document.querySelector("#detailSubtitle");
const detailImage = document.querySelector("#detailImage");
const detailMeta = document.querySelector("#detailMeta");
const detailDescription = document.querySelector("#detailDescription");
const detailHighlights = document.querySelector("#detailHighlights");
const roomGrid = document.querySelector("#roomGrid");
const detailReviews = document.querySelector("#detailReviews");
const chatLog = document.querySelector("#chatLog");
const chatForm = document.querySelector("#chatForm");
const chatInput = document.querySelector("#chatInput");
const bookingTitle = document.querySelector("#bookingTitle");
const selectedRoomInput = document.querySelector("#selectedRoom");
const bookingSummary = document.querySelector("#bookingSummary");
const bookingForm = document.querySelector("#bookingForm");
const paymentForm = document.querySelector("#paymentForm");
const bookingSuccess = document.querySelector("#bookingSuccess");
const toastContainer = document.querySelector(".toast-container");
const rentalOptions = document.querySelector("#rentalOptions");

let activeId = null;
let activeRoom = null;
let activeRental = { id: "", name: "Tanpa kendaraan", price: 0 };

function getIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function showToast(message) {
  if (!toastContainer) return;
  const el = document.createElement("div");
  el.className = "toast toast--info";
  el.textContent = message;
  toastContainer.appendChild(el);
  setTimeout(() => {
    el.classList.add("fade-out");
    el.addEventListener("transitionend", () => el.remove(), { once: true });
  }, 2000);
}

function renderDestinationDetail() {
  const rawId = getIdFromUrl() || localStorage.getItem("mlaku_selected");
  if (!rawId || !DESTINATIONS_DETAIL[rawId]) {
    detailTitle.textContent = "Destinasi tidak ditemukan";
    detailSubtitle.textContent =
      "Silakan kembali ke halaman utama dan pilih destinasi lain.";
    return;
  }
  activeId = rawId;
  const d = DESTINATIONS_DETAIL[rawId];

  detailTitle.textContent = d.name;
  bookingTitle.textContent = `Pesan kunjungan ke ${d.name}`;
  detailSubtitle.textContent = d.snippet;
  detailImage.style.backgroundImage = `url("${d.image}")`;
  detailMeta.innerHTML = `
    <p><strong>Kategori:</strong> ${d.category}</p>
    <p><strong>Tiket mulai:</strong> ${d.priceFrom}</p>
  `;
  detailDescription.textContent =
    "Ini adalah destinasi contoh. Informasi lengkap seperti jam buka, fasilitas, dan kebijakan kunjungan dapat dihubungkan dari backend nantinya.";
  detailHighlights.innerHTML = d.highlights
    .map((item) => `<li>${item}</li>`)
    .join("");

  roomGrid.innerHTML = d.rooms
    .map(
      (r) => `
      <label class="room-card">
        <input type="radio" name="room" value="${r.id}" data-price="${r.price}" />
        <div class="room-card__body">
          <strong>${r.name}</strong>
          <span>Mulai ${r.price.toLocaleString("id-ID")} IDR</span>
        </div>
      </label>
    `
    )
    .join("");

  detailReviews.innerHTML = `
    <li>"Pengalaman yang sangat menyenangkan, staf ramah dan pemandangan bagus." – Rina</li>
    <li>"Mudah diakses dan cocok untuk keluarga dengan anak kecil." – Andi</li>
    <li>"Reservasi lewat Mlaku Mlaku bikin lebih tenang karena jadwal jelas." – Luthfi</li>
  `;

  chatLog.innerHTML = `
    <div class="chat-bubble">Halo Kak, ada pertanyaan terkait kunjungan ke ${d.name}?</div>
  `;

  if (rentalOptions) {
    const base = `
      <label>
        <input type="radio" name="rental" value="" checked />
        Tidak perlu kendaraan
      </label>
    `;
    const rentals = (d.rentals || [])
      .map(
        (r) => `
        <label>
          <input type="radio" name="rental" value="${r.id}" data-price="${r.price}" />
          ${r.name} • ${r.price.toLocaleString("id-ID")} IDR / hari
        </label>
      `
      )
      .join("");
    rentalOptions.innerHTML = base + rentals;
  }
}

document.addEventListener("change", (e) => {
  if (e.target.matches("input[name='room']")) {
    const input = e.target;
    const price = Number(input.dataset.price || 0);
    const roomLabel = input
      .closest(".room-card")
      .querySelector("strong").textContent;
    activeRoom = { id: input.value, name: roomLabel, price };
    selectedRoomInput.value = roomLabel;
  }

  if (e.target.matches("input[name='rental']")) {
    const input = e.target;
    if (!input.value) {
      activeRental = { id: "", name: "Tanpa kendaraan", price: 0 };
    } else {
      const d = DESTINATIONS_DETAIL[activeId];
      const opt = (d.rentals || []).find((r) => r.id === input.value);
      if (opt) {
        activeRental = { id: opt.id, name: opt.name, price: opt.price };
      }
    }
  }

  if (activeRoom) {
    const total = activeRoom.price + (activeRental?.price || 0);
    const rentalText =
      activeRental && activeRental.price > 0
        ? ` + kendaraan ${activeRental.name} (${activeRental.price.toLocaleString(
            "id-ID"
          )} IDR)`
        : "";
    bookingSummary.textContent = `Total estimasi untuk 1 hari: ${total.toLocaleString(
      "id-ID"
    )} IDR${rentalText}`;
  } else {
    bookingSummary.textContent =
      "Pilih kamar/paket terlebih dahulu untuk melihat estimasi total.";
  }
});

bookingForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!activeRoom) {
    showToast("Pilih kamar/paket dulu sebelum lanjut pembayaran.");
    return;
  }
  bookingForm.classList.add("hidden");
  paymentForm.classList.remove("hidden");
});

paymentForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(paymentForm).entries());
  const stored = {
    destinationId: activeId,
    room: activeRoom,
    rental: activeRental,
    payment: data,
  };
  localStorage.setItem("mlaku_last_booking", JSON.stringify(stored));
  paymentForm.classList.add("hidden");
  bookingSuccess.classList.remove("hidden");
  showToast("Simulasi pesanan tersimpan secara lokal.");
});

chatForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;
  const mine = document.createElement("div");
  mine.className = "chat-bubble chat-bubble--me";
  mine.textContent = text;
  chatLog.appendChild(mine);
  chatInput.value = "";

  setTimeout(() => {
    const reply = document.createElement("div");
    reply.className = "chat-bubble";
    reply.textContent =
      "Terima kasih kak, pesan sudah kami terima. Untuk konfirmasi resmi akan diatur lewat backend nanti.";
    chatLog.appendChild(reply);
    chatLog.scrollTop = chatLog.scrollHeight;
  }, 600);
});

document.querySelectorAll(".detail-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document
      .querySelectorAll(".detail-tab")
      .forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    const panelId = tab.dataset.panel;
    document.querySelectorAll(".detail-panel").forEach((p) => {
      p.classList.toggle("hidden", p.id !== `panel-${panelId}`);
    });
  });
});

renderDestinationDetail();


