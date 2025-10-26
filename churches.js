let map;
let allMarkers = [];

window.initMap = async function() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 43.6532, lng: -79.3832 },
    zoom: 12
  });

  const infoWindow = new google.maps.InfoWindow();

  // Church data
  const churches = [
    { name: "C3 Toronto", address: "12 Pauline Avenue, Toronto, ON M6H 3M8", lat: 43.6599, lng: -79.4381 },
    { name: "St. Patrick's Roman Catholic Church", address: "141 McCaul St, Toronto, ON M5T 1W5", lat: 43.6547, lng: -79.3913 },
    { name: "St. Andrew's Church", address: "73 Simcoe St, Toronto, ON M5J 1W9", lat: 43.6472, lng: -79.3857 },
    { name: "Our Lady of Carmel Church", address: "202 St. Patrick St, Toronto, ON M5T 1V4", lat: 43.6552, lng: -79.3910 },
    { name: "Little Trinity Anglican Church", address: "425 King St E, Toronto, ON M5A 1L3", lat: 43.6525, lng: -79.3700 },
    { name: "Bloor Street United Church", address: "300 Bloor St W, Toronto, ON M5S 1W3", lat: 43.6650, lng: -79.3970 }
  ];

  // Reference to list container
  const listContainer = document.getElementById("list-content");

  // Create church markers
  churches.forEach(church => {
    const marker = new google.maps.Marker({
      position: { lat: church.lat, lng: church.lng },
      map: map,
      icon: {
        url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
        scaledSize: new google.maps.Size(32, 32)
      },
      title: church.name,
      category: "church"
    });

    marker.addListener("click", () => {
      const content = `
        <div style="max-width: 250px;">
          <strong>${church.name}</strong><br>
          <strong>Address:</strong> ${church.address}<br>
          <strong>Type:</strong> Church/Community Center
        </div>
      `;
      infoWindow.setContent(content);
      infoWindow.open(map, marker);
    });

    allMarkers.push(marker);

    // Create a church card for list view
    const card = document.createElement("div");
    card.classList.add("shelter-card", "church");
    card.dataset.category = "church";

    card.innerHTML = `
      <h3>${church.name}</h3>
      <p>Church and Community Center</p>

      <div class="shelter-info">
        <div class="info-row">
          <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="#1a3d5c" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span>${church.address}</span>
        </div>
      </div>

      <div class="shelter-tags">
        <span class="tag">Church</span>
        <span class="tag">Community Center</span>
      </div>
    `;

    // Clicking a list card zooms to the marker
    card.addEventListener("click", () => {
      map.setCenter(marker.getPosition());
      map.setZoom(15);
      google.maps.event.trigger(marker, "click");
    });

    listContainer.appendChild(card);
  });
};

// Language Dropdown Logic
const languageToggle = document.getElementById('language-toggle');
const languageMenu = document.getElementById('language-menu');

languageToggle.addEventListener('click', (event) => {
  event.stopPropagation();
  languageMenu.classList.toggle('active');
});

document.addEventListener('click', (event) => {
  if (languageMenu.classList.contains('active') && 
      !languageMenu.contains(event.target) && 
      event.target !== languageToggle) {
    languageMenu.classList.remove('active');
  }
});