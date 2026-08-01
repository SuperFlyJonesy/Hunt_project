// Bristol venues with coordinates aligned to Google / OpenStreetMap

const venues = [
  {
    name: "Bristol Beacon",
    lat: 51.4546,    // Bristol Beacon [web:67]
    lng: -2.5981,
    type: "induction",
    address: "Colston Street, Bristol BS1 5AR",
    categoryText: "🏛️ Concert Hall",
    rating: "4.6",
    reviews: "4,120",
    icon: "🎵",
    photos: {
      main:  "Contents/Map/bristol-beacon-main.png",
      thumb2: "Contents/Map/bristol-beacon-2.png",
      thumb3: "Contents/Map/bristol-beacon-3.png"
    }
  },
  {
    name: "Watershed",
    lat: 51.45198,   // Watershed media centre [web:52][web:53]
    lng: -2.59808,
    type: "auracast",
    address: "1 Canon's Road, Harbourside, Bristol BS1 5TX",
    categoryText: "🎬 Cinema",
    rating: "4.5",
    reviews: "2,352",
    icon: "🎬",
    photos: {
      main:  "Contents/Map/watershed-main.png",
      thumb2: "Contents/Map/watershed-2.png",
      thumb3: "Contents/Map/watershed-3.png"
    }
  },
  {
    name: "M Shed",
    lat: 51.4473,    // M Shed on Princes Wharf [web:68]
    lng: -2.5986,
    type: "quiet",
    address: "Princes Wharf, Wapping Road, Bristol BS1 4RN",
    categoryText: "🏛️ Museum",
    rating: "4.7",
    reviews: "5,890",
    icon: "🏛️",
    photos: {
      main:  "Contents/Map/mshed-main.png",
      thumb2: "Contents/Map/mshed-2.png",
      thumb3: "Contents/Map/mshed-3.png"
    }
  },
  {
    name: "Bristol Old Vic",
    lat: 51.4521,    // King Street theatre [web:70]
    lng: -2.5942,
    type: "induction",
    address: "King Street, Bristol BS1 4ED",
    categoryText: "🎭 Theatre",
    rating: "4.8",
    reviews: "1,500",
    icon: "🎭",
    photos: {
      main:  "Contents/Map/bristol-old-vic-main.png",
      thumb2: "Contents/Map/bristol-old-vic-2.png",
      thumb3: "Contents/Map/bristol-old-vic-3.png"
    }
  },
  {
    name: "Tobacco Factory Theatres",
    lat: 51.4423,    // North Street / Raleigh Road [web:69]
    lng: -2.6135,
    type: "induction",
    address: "Raleigh Road, Southville, Bristol BS3 1TF",
    categoryText: "🎭 Theatre",
    rating: "4.6",
    reviews: "800",
    icon: "🎭",
    photos: {
      main:  "Contents/Map/tobacco-factory-main.png",
      thumb2: "Contents/Map/tobacco-factory-2.png",
      thumb3: "Contents/Map/tobacco-factory-3.png"
    }
  },
  {
    name: "Aerospace Bristol",
    lat: 51.52304,   // Filton museum [web:72]
    lng: -2.57875,
    type: "quiet",
    address: "Hayes Way, Patchway, Bristol BS34 5BZ",
    categoryText: "✈️ Museum",
    rating: "4.7",
    reviews: "3,200",
    icon: "✈️",
    photos: {
      main:  "Contents/Map/aerospace-bristol-main.png",
      thumb2: "Contents/Map/aerospace-bristol-2.png",
      thumb3: "Contents/Map/aerospace-bristol-3.png"
    }
  },
  {
    name: "Bristol Hippodrome",
    lat: 51.4531,    // St Augustine's Parade [web:66]
    lng: -2.5981,
    type: "auracast",
    address: "St Augustine's Parade, Bristol BS1 4UZ",
    categoryText: "🎭 Theatre",
    rating: "4.5",
    reviews: "2,900",
    icon: "🎭",
    photos: {
      main:  "Contents/Map/bristol-hippodrome-main.png",
      thumb2: "Contents/Map/bristol-hippodrome-2.png",
      thumb3: "Contents/Map/bristol-hippodrome-3.png"
    }
  },
  {
    name: "Future Inns Bristol",
    lat: 51.4590,    // as per your original map
    lng: -2.5866,
    type: "quiet",
    address: "Bond Street South, Bristol BS1 3EN",
    categoryText: "🏨 Hotel",
    rating: "4.4",
    reviews: "1,100",
    icon: "🏨",
    photos: {
      main:  "Contents/Map/future-inns-main.png",
      thumb2: "Contents/Map/future-inns-2.png",
      thumb3: "Contents/Map/future-inns-3.png"
    }
  },
  {
    name: "Bristol Temple Meads",
    lat: 51.4491,    // station coordinates [web:64][web:65]
    lng: -2.5804,
    type: "auracast",
    address: "Station Approach, Bristol BS1 6QF",
    categoryText: "🚆 Station",
    rating: "4.0",
    reviews: "500",
    icon: "🚆",
    photos: {
      main:  "Contents/Map/temple-meads-main.png",
      thumb2: "Contents/Map/temple-meads-2.png",
      thumb3: "Contents/Map/temple-meads-3.png"
    }
  }
];

let map;
let activeMarkers = [];
let AdvancedMarkerElement;

window.initMap = async function () {
  try {
    const { Map } = await google.maps.importLibrary("maps");
    const markerLib = await google.maps.importLibrary("marker");
    AdvancedMarkerElement = markerLib.AdvancedMarkerElement;

    // Centre roughly on central Bristol so all venues are nearby
    map = new Map(document.getElementById("map"), {
      zoom: 13,
      center: { lat: 51.4545, lng: -2.5879 },
      mapId: "a5a5d1d5648102f0d543daaa",
      colorScheme: "DARK",
      disableDefaultUI: true,
      clickableIcons: false
    });

    renderMarkers();
    setupFilters();
  } catch (err) {
    document.getElementById("map").innerHTML = "<div style='color:red; padding: 20px;'>Map Error: " + err.message + "<br>" + err.stack + "</div>";
    console.error(err);
  }
};

function renderMarkers() {
  // Remove old markers
  activeMarkers.forEach(marker => (marker.map = null));
  activeMarkers = [];

  const showInduction = document.getElementById("filter-induction").checked;
  const showAuracast = document.getElementById("filter-auracast").checked;
  const showQuiet = document.getElementById("filter-quiet").checked;

  venues.forEach(venue => {
    if (
      (venue.type === "induction" && !showInduction) ||
      (venue.type === "auracast" && !showAuracast) ||
      (venue.type === "quiet" && !showQuiet)
    ) {
      return;
    }

    // Custom marker content
    const markerContent = document.createElement("div");
    markerContent.style.display = "flex";
    markerContent.style.flexDirection = "column";
    markerContent.style.alignItems = "center";
    markerContent.style.cursor = "pointer";

    markerContent.innerHTML = `
      <div style="
        background: #1e1e1e;
        color: #fff;
        width: 72px;
        height: 72px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        border: 4px solid #8AB4F8;
        font-size: 32px;
      ">
        ${venue.icon}
      </div>
      <div style="
        background: rgba(20, 24, 33, 0.9);
        color: #fff;
        padding: 4px 12px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: bold;
        margin-top: 8px;
        white-space: nowrap;
        box-shadow: 0 2px 6px rgba(0,0,0,0.4);
        border: 1px solid rgba(255,255,255,0.1);
      ">
        ${venue.name}
      </div>
    `;

    // Attach marker to the map at the venue coordinates
    const marker = new AdvancedMarkerElement({
      map,
      position: { lat: venue.lat, lng: venue.lng },
      title: venue.name,
      content: markerContent
    });

    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      venue.name + " " + venue.address
    )}`;

    const photos   = venue.photos || {};
    const mainSrc  = photos.main   || `https://placehold.co/300x150?text=${encodeURIComponent(venue.name)}`;
    const thumb2Src = photos.thumb2 || "https://placehold.co/150x70?text=Photo+2";
    const thumb3Src = photos.thumb3 || "https://placehold.co/150x70?text=Photo+3";

    const infowindow = new google.maps.InfoWindow({
      content: `
        <div class="dark-popup">
          <h3>${venue.name}</h3>
          <p class="rating">
            ⭐ ${venue.rating} (${venue.reviews} reviews)<br>
            ${venue.categoryText}
          </p>
          <p style="margin-bottom: 10px;">${venue.address}</p>

          <div class="popup-buttons">
            <button class="popup-btn" onclick="window.open('${mapsUrl}', '_blank')">
              Website
            </button>
            <button class="popup-btn" onclick="window.open('${mapsUrl}', '_blank')">
              Directions
            </button>
            <button class="popup-btn" onclick="window.open('${mapsUrl}', '_blank')">
              Share
            </button>
          </div>

          <div class="photo-grid">
            <img class="photo-main" src="${mainSrc}" onerror="this.onerror=null; this.src='https://placehold.co/300x150/202124/8AB4F8?text=${encodeURIComponent(venue.name)}'" alt="${venue.name}">
            <img src="${thumb2Src}" onerror="this.onerror=null; this.src='https://placehold.co/150x70/202124/8AB4F8?text=Photo+2'" alt="${venue.name}">
            <img src="${thumb3Src}" onerror="this.onerror=null; this.src='https://placehold.co/150x70/202124/8AB4F8?text=Photo+3'" alt="${venue.name}">
          </div>

          <a href="${mapsUrl}" target="_blank" class="open-map-btn">
            Open in Google Maps
          </a>
        </div>
      `,
      maxWidth: 360,
      pixelOffset: new google.maps.Size(0, -10)
    });

    // Clicking the marker opens the popup anchored to that marker
    markerContent.addEventListener("click", () => {
      infowindow.close();
      infowindow.open({ anchor: marker, map });
    });

    activeMarkers.push(marker);
  });
}

function setupFilters() {
  ["filter-induction", "filter-auracast", "filter-quiet"].forEach(id => {
    document
      .getElementById(id)
      .addEventListener("change", renderMarkers);
  });
}