// ------ Mock data with coordinates ------
const hotels = [
  {
    id: "h1",
    name: "Heritage Palace",
    location: "Jaipur",
    rating: 4.6,
    price: 3200,
    amenities: ["Free Wifi", "Breakfast Included", "Air Conditioning"],
    description:
      "Comfortable stay in the heart of Jaipur with rich Rajasthani vibes and rooftop dining.",
    coords: { lat: 26.9124, lng: 75.7873 }, // Jaipur
  },
  {
    id: "h2",
    name: "City Stay Inn",
    location: "Dehradun",
    rating: 4.2,
    price: 2100,
    amenities: ["Parking", "Hot Water", "Gym Access"],
    description:
      "Budget-friendly hotel close to major transit points with clean rooms and city views.",
    coords: { lat: 30.3165, lng: 78.0322 }, // Dehradun
  },
  {
    id: "h3",
    name: "Hillside Retreat",
    location: "Manali",
    rating: 4.8,
    price: 4500,
    amenities: ["Mountain View", "Bonfire", "Room Service"],
    description:
      "Cozy hillside property ideal for families and couples seeking a peaceful getaway.",
    coords: { lat: 32.2432, lng: 77.1892 }, // Manali
  },
];

const guides = [
  {
    id: "g1",
    name: "Sunil Sharma",
    baseLocation: "Jaipur",
    languages: ["English", "Hindi"],
    rating: 4.8,
    bio: "Local history expert with 10+ years guiding in forts, palaces, and heritage walks.",
    tags: ["Heritage Tours", "Photography Spots"],
    coords: { lat: 26.915, lng: 75.81 }, // near Jaipur
  },
  {
    id: "g2",
    name: "Meera Joshi",
    baseLocation: "Dehradun",
    languages: ["Hindi", "English", "Punjabi"],
    rating: 4.5,
    bio: "Specialist in culinary tours, local markets, and offbeat experiences.",
    tags: ["Food Tours", "Local Markets"],
    coords: { lat: 30.32, lng: 78.04 }, // near Dehradun
  },
];

const vehicles = [
  {
    id: "v1",
    type: "Bike",
    model: "Royal Enfield Classic",
    pricePerDay: 900,
    availability: true,
    location: "Jaipur",
  },
  {
    id: "v2",
    type: "Sedan",
    model: "Honda City",
    pricePerDay: 2200,
    availability: true,
    location: "Dehradun",
  },
  {
    id: "v3",
    type: "SUV",
    model: "Mahindra XUV500",
    pricePerDay: 3000,
    availability: false,
    location: "Manali",
  },
];

// ------ DOM elements ------
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const hotelList = document.getElementById("hotelList");
const guideList = document.getElementById("guideList");
const vehicleList = document.getElementById("vehicleList");
const hotelFilterInput = document.getElementById("hotelFilter");

const modalBackdrop = document.getElementById("bookingModalBackdrop");
const modalTitle = document.getElementById("modalTitle");
const modalCancel = document.getElementById("modalCancel");
const bookingForm = document.getElementById("bookingForm");
const bookingName = document.getElementById("bookingName");
const bookingDate = document.getElementById("bookingDate");
const bookingNights = document.getElementById("bookingNights");
const bookingNotes = document.getElementById("bookingNotes");

const bottomNav = document.getElementById("bottomNav");
const locateBtn = document.getElementById("locateBtn");

// Map variables
let map;
let hotelMarkers = [];
let guideMarkers = [];

// ------ Navbar toggle (mobile) ------
if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  navLinks.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      navLinks.classList.remove("open");
    }
  });
}

// ------ Render Hotels ------
function renderHotels(list) {
  if (!hotelList) return;
  hotelList.innerHTML = "";

  if (!list || list.length === 0) {
    hotelList.innerHTML =
      '<p style="font-size:0.85rem;color:#6b7280;">No hotels match this filter.</p>';
    return;
  }

  list.forEach((hotel) => {
    const card = document.createElement("article");
    card.className = "card";

    card.innerHTML = `
      <div class="card-header"></div>
      <div class="card-body">
        <h3>${hotel.name}</h3>
        <p class="card-meta">
          ${hotel.location} • ₹${hotel.price}/night • ⭐ ${hotel.rating}
        </p>
        <p class="card-desc">${hotel.description}</p>
        <div class="card-tags">
          ${hotel.amenities
            .map((a) => `<span class="tag">${a}</span>`)
            .join("")}
        </div>
      </div>
      <div class="card-footer">
        <span style="font-size:0.82rem;color:#111827;font-weight:500;">
          From ₹${hotel.price}/night
        </span>
        <button
          class="btn btn-primary"
          data-type="hotel"
          data-id="${hotel.id}"
          data-label="${hotel.name}"
        >
          Book
        </button>
      </div>
    `;

    hotelList.appendChild(card);
  });
}

// ------ Render Guides ------
function renderGuides() {
  if (!guideList) return;
  guideList.innerHTML = "";

  guides.forEach((g) => {
    const card = document.createElement("article");
    card.className = "card";

    card.innerHTML = `
      <div class="card-header"></div>
      <div class="card-body">
        <h3>${g.name}</h3>
        <p class="card-meta">
          Base: ${g.baseLocation} • Languages: ${g.languages.join(", ")} • ⭐ ${
      g.rating
    }
        </p>
        <p class="card-desc">${g.bio}</p>
        <div class="card-tags">
          ${g.tags.map((t) => `<span class="tag">${t}</span>`).join("")}
        </div>
      </div>
      <div class="card-footer">
        <span style="font-size:0.8rem;color:#111827;font-weight:500;">
          Local guide
        </span>
        <button
          class="btn btn-primary"
          data-type="guide"
          data-id="${g.id}"
          data-label="${g.name}"
        >
          Contact
        </button>
      </div>
    `;

    guideList.appendChild(card);
  });
}

// ------ Render Vehicles ------
function renderVehicles() {
  if (!vehicleList) return;
  vehicleList.innerHTML = "";

  vehicles.forEach((v) => {
    const card = document.createElement("article");
    card.className = "card";

    const statusText = v.availability ? "Available" : "Not available";
    const disabledAttr = v.availability ? "" : "disabled";

    card.innerHTML = `
      <div class="card-header"></div>
      <div class="card-body">
        <h3>${v.model}</h3>
        <p class="card-meta">
          ${v.type} • ₹${v.pricePerDay}/day • ${v.location}
        </p>
        <p class="card-desc">${statusText}</p>
      </div>
      <div class="card-footer">
        <span style="font-size:0.8rem;color:#111827;font-weight:500;">
          From ₹${v.pricePerDay}/day
        </span>
        <button
          class="btn btn-primary"
          ${disabledAttr}
          data-type="vehicle"
          data-id="${v.id}"
          data-label="${v.model}"
        >
          Rent
        </button>
      </div>
    `;

    vehicleList.appendChild(card);
  });
}

// ------ Modal ------
function openModal(context) {
  if (!modalBackdrop) return;
  currentBookingContext = context;
  modalTitle.textContent = `Request: ${context.label}`;
  bookingForm.reset();
  bookingNights.value = 1;
  modalBackdrop.classList.add("show");
}

function closeModal() {
  if (!modalBackdrop) return;
  modalBackdrop.classList.remove("show");
  currentBookingContext = null;
}

let currentBookingContext = null;

if (modalCancel) {
  modalCancel.addEventListener("click", closeModal);
}

if (modalBackdrop) {
  modalBackdrop.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });
}

if (bookingForm) {
  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!currentBookingContext) return;

    const payload = {
      type: currentBookingContext.type,
      targetId: currentBookingContext.id,
      targetLabel: currentBookingContext.label,
      name: bookingName.value,
      date: bookingDate.value,
      nights: bookingNights.value,
      notes: bookingNotes.value,
    };

    console.log("Mock booking/rental request:", payload);
    alert(
      `Your request for ${payload.targetLabel} has been recorded (mock).\nCheck DevTools console for full payload.`
    );
    closeModal();
  });
}

// ------ Event delegation for buttons (Book / Rent / Contact) ------
document.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-type]");
  if (!btn) return;

  const type = btn.getAttribute("data-type");
  const id = btn.getAttribute("data-id");
  const label = btn.getAttribute("data-label");

  openModal({ type, id, label });
});

// ------ Hotel filter ------
if (hotelFilterInput) {
  hotelFilterInput.addEventListener("input", (e) => {
    const value = e.target.value.trim().toLowerCase();
    const filtered = hotels.filter((h) =>
      h.location.toLowerCase().includes(value)
    );
    renderHotels(filtered);
  });
}

// ------ Google Maps integration ------
function initMap() {
  const mapEl = document.getElementById("map");
  if (!mapEl) return;

  const indiaCenter = { lat: 23.5937, lng: 80.9629 };

  map = new google.maps.Map(mapEl, {
    center: indiaCenter,
    zoom: 5,
  });

  addHotelMarkers();
  addGuideMarkers();
}

function addHotelMarkers() {
  if (!map) return;
  hotelMarkers.forEach((m) => m.setMap(null));
  hotelMarkers = [];

  hotels.forEach((h) => {
    if (!h.coords) return;
    const marker = new google.maps.Marker({
      position: h.coords,
      map,
      title: h.name,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 7,
        fillColor: "#2563eb",
        fillOpacity: 1,
        strokeWeight: 1,
        strokeColor: "#ffffff",
      },
    });
    hotelMarkers.push(marker);
  });
}

function addGuideMarkers() {
  if (!map) return;
  guideMarkers.forEach((m) => m.setMap(null));
  guideMarkers = [];

  guides.forEach((g) => {
    if (!g.coords) return;
    const marker = new google.maps.Marker({
      position: g.coords,
      map,
      title: g.name,
      icon: {
        path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
        scale: 5,
        fillColor: "#f97316",
        fillOpacity: 1,
        strokeWeight: 1,
        strokeColor: "#ffffff",
      },
    });
    guideMarkers.push(marker);
  });
}

// Expose initMap to global for Google callback
window.initMap = initMap;

// "Use my location" button
if (locateBtn && navigator.geolocation) {
  locateBtn.addEventListener("click", () => {
    if (!map) {
      alert("Map not ready yet. Please wait a moment.");
      return;
    }

    locateBtn.disabled = true;
    locateBtn.textContent = "Locating...";

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLatLng = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        map.setCenter(userLatLng);
        map.setZoom(11);

        new google.maps.Marker({
          position: userLatLng,
          map,
          title: "You are here",
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 6,
            fillColor: "#10b981",
            fillOpacity: 1,
            strokeWeight: 1,
            strokeColor: "#ffffff",
          },
        });

        locateBtn.textContent = "Use my location";
        locateBtn.disabled = false;
      },
      (err) => {
        console.error(err);
        alert(
          "Could not get your location. Please allow location access in your browser."
        );
        locateBtn.textContent = "Use my location";
        locateBtn.disabled = false;
      }
    );
  });
}

// ------ Bottom nav scroll + active state ------
if (bottomNav) {
  bottomNav.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-target]");
    if (!btn) return;

    const target = btn.getAttribute("data-target");
    const el = document.querySelector(target);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

const sections = [
  { id: "#home", el: document.getElementById("home") },
  { id: "#hotels", el: document.getElementById("hotels") },
  { id: "#guides", el: document.getElementById("guides") },
  { id: "#vehicles", el: document.getElementById("vehicles") },
];

function updateBottomNavActive() {
  if (!bottomNav) return;
  const scrollPos = window.scrollY + 120;
  let currentId = "#home";

  for (const s of sections) {
    if (!s.el) continue;
    const top = s.el.offsetTop;
    if (scrollPos >= top) {
      currentId = s.id;
    }
  }

  [...bottomNav.querySelectorAll("button")].forEach((btn) => {
    const target = btn.getAttribute("data-target");
    btn.classList.toggle("active", target === currentId);
  });
}

window.addEventListener("scroll", updateBottomNavActive);

// ------ Init ------
document.addEventListener("DOMContentLoaded", () => {
  renderHotels(hotels);
  renderGuides();
  renderVehicles();
  updateBottomNavActive();
});
