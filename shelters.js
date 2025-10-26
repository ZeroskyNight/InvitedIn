let map;
let allMarkers = [];

window.initMap = async function() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 43.6532, lng: -79.3832 },
    zoom: 11
  });

  const geojsonUrl = "https://gis.toronto.ca/arcgis/rest/services/cot_geospatial26/FeatureServer/61/query?where=1=1&outFields=*&f=geojson";

  try {
    const res = await fetch(geojsonUrl);
    if (!res.ok) throw new Error("Network response not ok");
    const geojson = await res.json();

    const infoWindow = new google.maps.InfoWindow();

    geojson.features.forEach(feature => {
      const coords = feature.geometry.coordinates; // [lng, lat]
      const props = feature.properties;
      const type2 = (props.TYPE2 || "").toLowerCase();
      
      // Categorize the shelter type
      let category = "other";
      let iconUrl = "https://maps.google.com/mapfiles/ms/icons/blue-dot.png";
      
      if (type2.includes("single men")) {
        category = "men";
        iconUrl = "https://maps.google.com/mapfiles/ms/icons/blue-dot.png";
      } else if (type2.includes("single women")) {
        category = "women";
        iconUrl = "https://maps.google.com/mapfiles/ms/icons/pink-dot.png";
      } else if (type2.includes("family")) {
        category = "family";
        iconUrl = "https://maps.google.com/mapfiles/ms/icons/green-dot.png";
      } else if (type2.includes("mixed adult")) {
        category = "mixed";
        iconUrl = "https://maps.google.com/mapfiles/ms/icons/orange-dot.png";
      } else if (type2.includes("youth")) {
        category = "youth";
        iconUrl = "https://maps.google.com/mapfiles/ms/icons/purple-dot.png";
      }

      const marker = new google.maps.Marker({
        position: { lat: coords[1], lng: coords[0] },
        map: map,
        icon: { url: iconUrl, scaledSize: new google.maps.Size(32, 32) },
        title: props.NAME || "Shelter",
        shelterCategory: category
      });

      marker.addListener("click", () => {
        const content = `
          <div style="max-width: 250px;">
            <strong>${props.NAME || 'Shelter'}</strong><br>
            <strong>Address:</strong> ${props.ADDRESS_FULL || 'N/A'}<br>
            <strong>Type:</strong> ${props.TYPE2 || 'Unknown'}<br>
            <strong>Capacity:</strong> ${props.CAPACITY || 'N/A'}<br>
            <strong>Neighbourhood:</strong> ${props.NEIGHBOURHOOD || 'N/A'}
          </div>
        `;
        infoWindow.setContent(content);
        infoWindow.open(map, marker);
      });

      allMarkers.push(marker);

      // Reference to list container
const listContainer = document.getElementById("list-content");

// Create a shelter card
const card = document.createElement("div");
// card.classList.add("shelter-card");
card.classList.add("shelter-card", category); // Add category as a class
card.dataset.category = category; 

card.innerHTML = `
  <h3>${props.NAME || 'Shelter Name Unavailable'}</h3>
  <p>${props.TYPE2 || 'No description available'}</p>

  <div class="shelter-info">
    <div class="info-row">
      <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="#1a3d5c" stroke-width="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
      <span>${props.ADDRESS_FULL || 'Address not available'}</span>
    </div>

    <div class="info-row">
      <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="#1a3d5c" stroke-width="2">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
      </svg>
      <span>${props.PHONE || 'N/A'}</span>
    </div>

    <div class="info-row">
      <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="#1a3d5c" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
      <span>${props.HOURS || 'Hours not available'}</span>
    </div>
  </div>

  <a href="#" class="shelter-link">${props.WEBSITE || 'Website not listed'}</a>

  <div class="shelter-tags">
    <span class="tag">${props.TYPE2 || 'Unknown'}</span>
    <span class="tag">${props.CAPACITY ? 'Capacity: ' + props.CAPACITY : ''}</span>
  </div>
`;

// Optional: clicking a list card zooms to the marker
card.addEventListener("click", () => {
  map.setCenter(marker.getPosition());
  map.setZoom(14);
  google.maps.event.trigger(marker, "click");
});

// Append card to the list
listContainer.appendChild(card);
    });

    // Add filter functionality
    setupFilters();

  } catch (err) {
    console.error("Failed to load GeoJSON:", err);
  }
};

function setupFilters() {
  // const checkboxes = document.querySelectorAll("#filter-box input[type=checkbox]");

  // checkboxes.forEach(cb => {
  //   cb.addEventListener("change", filterMarkers);
  // });
  const pills = document.querySelectorAll("#filter-pills .filter-pill");
  
  pills.forEach(pill => {
    pill.addEventListener("click", () => {
      // Toggle active class on click
      pill.classList.toggle("active");
      filterMarkers(); // Update map and list
    });
  });
}

function filterMarkers() {
  // const checkboxes = document.querySelectorAll("#filter-box input[type=checkbox]");
  // const activeCategories = Array.from(checkboxes)
  //   .filter(c => c.checked)
  //   .map(c => c.value);

  // console.log("Active categories:", activeCategories); // Debug log

  // allMarkers.forEach(marker => {
  //   if (activeCategories.includes(marker.shelterCategory)) {
  //     marker.setMap(map);
  //   } else {
  //     marker.setMap(null);
  //   }
  // });

  // console.log("Total markers:", allMarkers.length); // Debug log
  // console.log("Visible markers:", allMarkers.filter(m => m.getMap() !== null).length); // Debug log

  // const pills = document.querySelectorAll("#filter-pills .filter-pill.active");
  // const activeCategories = Array.from(pills).map(p => p.dataset.category);

  // console.log("Active categories:", activeCategories);

  // allMarkers.forEach(marker => {
  //   if (activeCategories.length === 0 || activeCategories.includes(marker.shelterCategory)) {
  //     marker.setMap(map);
  //   } else {
  //     marker.setMap(null);
  //   }
  // });

  // console.log("Visible markers:", allMarkers.filter(m => m.getMap() !== null).length);


  
  const pills = document.querySelectorAll("#filter-pills .filter-pill");
  const activeCategories = Array.from(pills)
    .filter(p => p.classList.contains("active"))
    .map(p => p.dataset.category);

  console.log("Active categories:", activeCategories);

  const listCards = document.querySelectorAll("#list-content .shelter-card");

  // Show nothing if no pills active
  if (activeCategories.length === 0) {
    allMarkers.forEach(marker => marker.setMap(null));
    listCards.forEach(card => (card.style.display = "none"));
    return;
  }

  // Determine if all pills are active
  const allActive = activeCategories.length === pills.length;

  // Filter markers
  allMarkers.forEach(marker => {
    if (allActive || activeCategories.includes(marker.shelterCategory)) {
      marker.setMap(map);
    } else {
      marker.setMap(null);
    }
  });

  // Filter list cards
  listCards.forEach(card => {
    const category = card.dataset.category;
    if (allActive || activeCategories.includes(category)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });

  console.log("Visible markers:", allMarkers.filter(m => m.getMap() !== null).length);

}