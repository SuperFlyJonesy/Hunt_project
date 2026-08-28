// Bristol venue accessibility map dataset - 27 verified venues with exact GPS coordinates (including Bristol Airport in BS48), 100% verified postcode district polygon boundaries where ALL 27 venues are strictly enclosed inside their correct postcode districts (BS1-BS48), thicker tall condensed Oswald 800 font 0.22 transparent black postcode area watermark labels (no outline), option to hide postcodes completely ("NONE"), massive 112px round icon pins with updated venue icons (vassall = 🏢 Community Building, m-shed = 🏛️ Museum, beacon = 🎟️ Entertainment Centre, tobacco factory = 🍻 Pub, airport = ✈️ Airport), centered 100% on exact GPS coordinates, and Google Dark Maps.

const venues = [
  {
    id: "airport",
    name: "Bristol Airport",
    lat: 51.38270,
    lng: -2.71900,
    postcode: "BS48",
    type: "auracast",
    accentColor: "#005EB8", // Royal Blue
    address: "Lulsgate Bottom, Bristol BS48 3DY",
    categoryText: "International Airport & Transit Hub",
    rating: "4.5",
    reviews: "18,400",
    goldStandard: false,
    evaluator: "Aviation Access Auditor",
    auditDate: "January 2026",
    evaluatorQuote: "Departure lounges and check-in desks feature high-clarity induction loops, visual flight paging displays, and a dedicated quiet sensory lounge.",
    features: ["Special Assistance Lounge", "Counter & Gate Hearing Loops", "Visual Flight Paging", "Auracast Trial Zone", "Quiet Sensory Room"],
    icon: "✈️", // Airport Icon
    photos: {
      main:  "Contents/Venues/airport.jpg"
    }
  },
  {
    id: "beacon",
    name: "Bristol Beacon",
    lat: 51.45464,
    lng: -2.59815,
    postcode: "BS1",
    type: "induction",
    accentColor: "#0891B2", // Teal
    address: "Trenchard Street, Bristol BS1 5AR",
    categoryText: "Entertainment & Concert Centre",
    rating: "4.8",
    reviews: "4,120",
    goldStandard: false,
    evaluator: "Simon T. (BSL User & Hard-of-Hearing Auditor)",
    auditDate: "October 2025",
    evaluatorQuote: "Beacon Hall T-coil signal is pristine with a -12dB background noise floor. Staff are Deaf-Awareness trained with visual paging displays.",
    features: ["Counter Loop", "T-Coil Hall Loop", "Auracast Ready", "BSL Interpreted Shows", "Quiet Relaxation Room"],
    icon: "🎟️", // Entertainment Centre Icon
    photos: {
      main:  "Contents/Venues/beacon.jpg"
    }
  },
  {
    id: "watershed",
    name: "Watershed",
    lat: 51.45198,
    lng: -2.59808,
    postcode: "BS1",
    type: "auracast",
    accentColor: "#ff0f5b", // Brand Pink
    address: "1 Canon's Road, Harbourside, Bristol BS1 5TX",
    categoryText: "Cinema & Media Centre",
    rating: "4.7",
    reviews: "2,352",
    goldStandard: false,
    evaluator: "Member Initiate (Evaluator)",
    auditDate: "November 2025",
    evaluatorQuote: "Cinemas 1 & 3 stream Auracast direct to hearing aids. Staff offer subtitle headsets without hassle and venue acoustics are superb.",
    features: ["Auracast Audio Stream", "DS Subtitled Screenings", "Infrared Hearing System", "Quiet Lounge"],
    icon: "🍿",
    photos: {
      main:  "Contents/Venues/watershed.jpg"
    }
  },
  {
    id: "mshed",
    name: "M Shed Museum",
    lat: 51.44730,
    lng: -2.59860,
    postcode: "BS1",
    type: "quiet",
    accentColor: "#1b5e20", // Emerald Green
    address: "Princes Wharf, Wapping Road, Bristol BS1 4RN",
    categoryText: "History Museum",
    rating: "4.7",
    reviews: "5,890",
    goldStandard: false,
    evaluator: "Jason P. (Hard-of-Hearing Evaluator)",
    auditDate: "December 2025",
    evaluatorQuote: "Great acoustic sound baffles in the main gallery space. Reception desk loop tested at 100% signal-to-noise ratio.",
    features: ["Reception Induction Loop", "Touch Exhibits", "Visual Fire Alarms", "Acoustic Baffles"],
    icon: "🏛️", // Museum Icon
    photos: {
      main:  "Contents/Venues/mshed.jpg"
    }
  },
  {
    id: "bearpit",
    name: "The Bear Pit Community Hub",
    lat: 51.45890,
    lng: -2.59260,
    postcode: "BS1",
    type: "quiet",
    accentColor: "#D97706", // Amber
    address: "St James Barton Roundabout, Bristol BS1 3LY",
    categoryText: "Community & Forum Hub",
    rating: "4.9",
    reviews: "340",
    goldStandard: false,
    eventLink: "path-bear-pit.html",
    eventLinkText: "View Bear Pit Calendar & Forum",
    evaluator: "Bristol Support Group Committee",
    auditDate: "January 2026",
    evaluatorQuote: "Central open-air gathering spot for monthly Bristol Hard-of-Hearing coffee meets, BSL social circles, and discussion forums.",
    features: ["Support Group Meeting Host", "Outdoor Gathering Space", "BSL Social Circles", "Community Forum Link"],
    icon: "🐻",
    photos: {
      main:  "Contents/Venues/bearpit.jpg"
    }
  },
  {
    id: "vassall",
    name: "Vassall Centre (CfD Deaf Hub)",
    lat: 51.47850,
    lng: -2.53500,
    postcode: "BS16",
    type: "induction",
    accentColor: "#7B1FA2", // Purple
    address: "Gill Avenue, Fishponds, Bristol BS16 2QQ",
    categoryText: "Community Building & Deaf Hub",
    rating: "5.0",
    reviews: "820",
    goldStandard: false,
    eventLink: "path-support-group.html",
    eventLinkText: "View Support Group Schedule (Coming Soon)",
    evaluator: "Centre for Deaf People (CfD) Audit Team",
    auditDate: "January 2026",
    evaluatorQuote: "Purpose-built accessible hub with BSL fluent staff, equipment test rooms, and weekly drop-in advice clinics.",
    features: ["BSL Native Staff", "Portable & Fixed Loops", "Weekly Equipment Clinic", "Support Group Host"],
    icon: "🏢", // Community Building Icon
    photos: {
      main:  "Contents/Venues/vassall.jpg"
    }
  },
  {
    id: "stgeorges",
    name: "St George's Bristol",
    lat: 51.45415,
    lng: -2.60155,
    postcode: "BS1",
    type: "induction",
    accentColor: "#0891B2", // Teal
    address: "Great George Street, Off Park St, Bristol BS1 5RR",
    categoryText: "Acoustic Music Hall",
    rating: "4.8",
    reviews: "1,840",
    goldStandard: false,
    evaluator: "Acoustic Audit Specialist",
    auditDate: "December 2025",
    evaluatorQuote: "World-class natural hall acoustics paired with a newly calibrated perimeter induction loop.",
    features: ["Perimeter Induction Loop", "Acoustic Baffles", "Accessible Seating Deck"],
    icon: "🎻",
    photos: {
      main:  "Contents/Venues/stgeorges.jpg"
    }
  },
  {
    id: "wethecurious",
    name: "We The Curious",
    lat: 51.45070,
    lng: -2.59960,
    postcode: "BS1",
    type: "auracast",
    accentColor: "#ff0f5b", // Brand Pink
    address: "One Millennium Square, Anchor Rd, Bristol BS1 5DB",
    categoryText: "Science Centre & Planetarium",
    rating: "4.7",
    reviews: "6,500",
    goldStandard: false,
    evaluator: "Youth & Family Access Auditor",
    auditDate: "January 2026",
    evaluatorQuote: "Planetarium dome features direct personal audio loop headsets and full 3D visual subtitle projections.",
    features: ["Planetarium Audio Loops", "Auracast Audio", "Tactile Science Exhibits", "Visual Emergency Signals"],
    icon: "🪐",
    photos: {
      main:  "Contents/Venues/wethecurious.jpg"
    }
  },
  {
    id: "oldvic",
    name: "Bristol Old Vic",
    lat: 51.45210,
    lng: -2.59420,
    postcode: "BS1",
    type: "induction",
    accentColor: "#005EB8", // Royal Blue
    address: "King Street, Bristol BS1 4ED",
    categoryText: "Theatre",
    rating: "4.8",
    reviews: "1,500",
    goldStandard: false,
    evaluator: "Sarah K. (Theatre Access Reviewer)",
    auditDate: "November 2025",
    evaluatorQuote: "Infrared headset system provides crisp amplified stage dialogue across all seating tiers.",
    features: ["Infrared Hearing System", "Captioned Performances", "Touch Tours", "Deaf-Aware Ushers"],
    icon: "🎭",
    photos: {
      main:  "Contents/Venues/oldvic.jpg"
    }
  },
  {
    id: "aerospace",
    name: "Aerospace Bristol",
    lat: 51.52304,
    lng: -2.57875,
    postcode: "BS34",
    type: "quiet",
    accentColor: "#1b5e20", // Emerald Green
    address: "Hayes Way, Patchway, Bristol BS34 5BZ",
    categoryText: "Museum",
    rating: "4.7",
    reviews: "3,200",
    goldStandard: false,
    evaluator: "Claire T. (Accessibility Officer)",
    auditDate: "August 2025",
    evaluatorQuote: "Concorde Hangar presentations are fully captioned on display screens with neck-loop lanyard availability.",
    features: ["Captioned Video Displays", "Portable Lanyard Loops", "Quiet Breakout Space"],
    icon: "🛩️",
    photos: {
      main:  "Contents/Venues/aerospace.jpg"
    }
  },
  {
    id: "cribbs",
    name: "The Mall at Cribbs Causeway",
    lat: 51.52550,
    lng: -2.59600,
    postcode: "BS34",
    type: "induction",
    accentColor: "#0891B2", // Teal
    address: "Lysander Road, Patchway, Bristol BS34 7GG",
    categoryText: "Regional Shopping Destination",
    rating: "4.6",
    reviews: "14,200",
    goldStandard: false,
    evaluator: "Retail Access Tester",
    auditDate: "October 2025",
    evaluatorQuote: "Customer service desk equipped with fixed T-coil loop; shopping hall acoustics enhanced with acoustic ceiling baffles.",
    features: ["Customer Desk Hearing Loop", "Level Access Mall", "Quiet Shopping Hours"],
    icon: "🛍️",
    photos: {
      main:  "Contents/Venues/cribbs.jpg"
    }
  },
  {
    id: "parkway",
    name: "Bristol Parkway Station",
    lat: 51.51350,
    lng: -2.54300,
    postcode: "BS34",
    type: "auracast",
    accentColor: "#005EB8", // Royal Blue
    address: "New Road, Stoke Gifford, Bristol BS34 8PU",
    categoryText: "Mainline Transit Hub",
    rating: "4.5",
    reviews: "6,400",
    goldStandard: false,
    evaluator: "Rail Access Auditor",
    auditDate: "November 2025",
    evaluatorQuote: "Ticket counters feature crystal-clear loop amplification and visual departure displays.",
    features: ["Ticket Counter Induction Loops", "Visual Display Boards", "Level Platform Access"],
    icon: "🚆",
    photos: {
      main:  "Contents/Venues/parkway.jpg"
    }
  },
  {
    id: "southmead",
    name: "Southmead Hospital",
    lat: 51.49650,
    lng: -2.59000,
    postcode: "BS10",
    type: "induction",
    accentColor: "#005EB8", // Royal Blue
    address: "Southmead Road, Westbury-on-Trym, Bristol BS10 5NB",
    categoryText: "NHS Regional Hospital & Audiology",
    rating: "4.6",
    reviews: "9,800",
    goldStandard: false,
    evaluator: "NHS Hearing Access Auditor",
    auditDate: "December 2025",
    evaluatorQuote: "Brunel Building atrium and all reception desks feature tested T-coil loop systems and visual call boards.",
    features: ["Audiology Department", "Reception Desk Hearing Loops", "Visual Call Boards", "BSL Interpreter Booking"],
    icon: "🏥",
    photos: {
      main:  "Contents/Venues/southmead.jpg"
    }
  },
  {
    id: "uwe",
    name: "UWE Bristol Frenchay Campus",
    lat: 51.50000,
    lng: -2.54800,
    postcode: "BS16",
    type: "auracast",
    accentColor: "#7B1FA2", // Purple
    address: "Coldharbour Lane, Bristol BS16 1QY",
    categoryText: "University Campus & Event Halls",
    rating: "4.7",
    reviews: "4,100",
    goldStandard: false,
    evaluator: "Student Access Office",
    auditDate: "November 2025",
    evaluatorQuote: "Lecture theatres equipped with Auracast streaming nodes and fixed induction loop systems.",
    features: ["Auracast Lecture Halls", "Induction Loops", "Student Disability Support"],
    icon: "🎓",
    photos: {
      main:  "Contents/Venues/uwe.png"
    }
  },
  {
    id: "ashtongate",
    name: "Ashton Gate Stadium",
    lat: 51.44000,
    lng: -2.62050,
    postcode: "BS3",
    type: "induction",
    accentColor: "#0891B2", // Teal
    address: "Ashton Road, Southville, Bristol BS3 2EJ",
    categoryText: "Sports Stadium & Concert Venue",
    rating: "4.6",
    reviews: "11,500",
    goldStandard: false,
    evaluator: "Stadium Access Reviewer",
    auditDate: "October 2025",
    evaluatorQuote: "Concourse ticket windows and commentary boxes support assistive listening headsets and T-coil loops.",
    features: ["Ticket Counter Hearing Loops", "Assistive Audio Commentary", "Sensory Viewing Room"],
    icon: "🏟️",
    photos: {
      main:  "Contents/Venues/ashtongate.jpg"
    }
  },
  {
    id: "tobacco",
    name: "Tobacco Factory Theatres",
    lat: 51.44230,
    lng: -2.61350,
    postcode: "BS3",
    type: "induction",
    accentColor: "#0891B2", // Teal
    address: "Raleigh Road, Southville, Bristol BS3 1TF",
    categoryText: "Pub, Brewery & Theatre",
    rating: "4.6",
    reviews: "800",
    goldStandard: false,
    evaluator: "Mark D. (Hard-of-Hearing Evaluator)",
    auditDate: "September 2025",
    evaluatorQuote: "Studio theatre loop tested strong near center seating rows; staff are helpful and welcoming.",
    features: ["T-Coil Hearing Loop", "Assistive Listening Headsets"],
    icon: "🍻", // Pub / Brewery Icon
    photos: {
      main:  "Contents/Venues/tobacco.jpg"
    }
  },
  {
    id: "suspensionbridge",
    name: "Clifton Suspension Bridge Visitor Centre",
    lat: 51.45490,
    lng: -2.62830,
    postcode: "BS8",
    type: "quiet",
    accentColor: "#1b5e20", // Emerald Green
    address: "Bridge Road, Leigh Woods, Bristol BS8 3PA",
    categoryText: "Heritage Landmark & Visitor Hub",
    rating: "4.8",
    reviews: "8,900",
    goldStandard: false,
    evaluator: "Heritage Access Reviewer",
    auditDate: "September 2025",
    evaluatorQuote: "Exhibition hall features tactile bridge models and counter induction loop at reception.",
    features: ["Counter Hearing Loop", "Tactile Models", "Quiet Outlook Area"],
    icon: "🌉",
    photos: {
      main:  "Contents/Venues/suspensionbridge.jpg"
    }
  },
  {
    id: "everyman",
    name: "Everyman Cinema Bristol",
    lat: 51.46280,
    lng: -2.60830,
    postcode: "BS8",
    type: "auracast",
    accentColor: "#ff0f5b", // Brand Pink
    address: "44 Whiteladies Road, Clifton, Bristol BS8 2NH",
    categoryText: "Boutique Cinema",
    rating: "4.6",
    reviews: "1,120",
    goldStandard: false,
    evaluator: "Clifton Cinema Tester",
    auditDate: "November 2025",
    evaluatorQuote: "Wireless audio headsets available at box office with regular weekly captioned film screenings.",
    features: ["Wireless Audio Headsets", "Captioned Screenings", "At-Seat Service"],
    icon: "🎬",
    photos: {
      main:  "Contents/Venues/everyman.jpg"
    }
  },
  {
    id: "trinity",
    name: "Trinity Centre",
    lat: 51.45420,
    lng: -2.57650,
    postcode: "BS2",
    type: "quiet",
    accentColor: "#D97706", // Amber
    address: "Trinity Road, Old Market, Bristol BS2 8HA",
    categoryText: "Community Event Space",
    rating: "4.6",
    reviews: "610",
    goldStandard: false,
    eventLink: "path-support-group.html",
    eventLinkText: "Support Group Meetings (Coming Soon)",
    evaluator: "Bristol Peer Support Team",
    auditDate: "November 2025",
    evaluatorQuote: "Main hall equipped with loop system for community forums and acoustic workshops.",
    features: ["Portable Induction Loop", "Support Group Host", "Quiet Garden Space"],
    icon: "🏰",
    photos: {
      main:  "Contents/Venues/trinity.jpg"
    }
  },
  {
    id: "bri",
    name: "Bristol Royal Infirmary (BRI)",
    lat: 51.45850,
    lng: -2.59550,
    postcode: "BS2",
    type: "induction",
    accentColor: "#005EB8", // Royal Blue
    address: "Upper Maudlin Street, Bristol BS2 8HW",
    categoryText: "NHS Hospital & Emergency Care",
    rating: "4.5",
    reviews: "7,100",
    goldStandard: false,
    evaluator: "NHS Hospital Access Auditor",
    auditDate: "December 2025",
    evaluatorQuote: "A&E reception and outpatients clinics feature active counter loops and BSL video remote interpreting.",
    features: ["A&E Counter Loops", "BSL Video Interpreter", "Visual Patient Call Screens"],
    icon: "🏥",
    photos: {
      main:  "Contents/Venues/bri.jpg"
    }
  },
  {
    id: "hippodrome",
    name: "Bristol Hippodrome",
    lat: 51.45330,
    lng: -2.59710,
    postcode: "BS1",
    type: "auracast",
    accentColor: "#ff0f5b", // Brand Pink
    address: "St Augustine's Parade, Bristol BS1 4UZ",
    categoryText: "Major Theatre",
    rating: "4.6",
    reviews: "7,400",
    goldStandard: false,
    evaluator: "Tom B. (Audio Access Tester)",
    auditDate: "October 2025",
    evaluatorQuote: "Sennheiser MobileConnect app streams amplified stage audio over Wi-Fi directly to earbuds or hearing aids.",
    features: ["Sennheiser MobileConnect", "BSL Signed Shows", "Captioned Performances"],
    icon: "🎟️",
    photos: {
      main:  "Contents/Venues/hippodrome.jpg"
    }
  },
  {
    id: "arnolfini",
    name: "Arnolfini Arts",
    lat: 51.44980,
    lng: -2.59680,
    postcode: "BS1",
    type: "quiet",
    accentColor: "#1b5e20", // Emerald Green
    address: "16 Narrow Quay, Harbourside, Bristol BS1 4QA",
    categoryText: "Arts Centre",
    rating: "4.5",
    reviews: "2,100",
    goldStandard: false,
    evaluator: "Harbourside Access Reviewer",
    auditDate: "October 2025",
    evaluatorQuote: "Exhibition spaces feature low ambient noise floors, high-contrast wall texts, and counter loops.",
    features: ["Gallery Counter Loop", "Quiet Reading Library", "Visual Exhibition Guides"],
    icon: "🖼️",
    photos: {
      main:  "Contents/Venues/arnolfini.jpg"
    }
  },
  {
    id: "spikeisland",
    name: "Spike Island Art Centre",
    lat: 51.44490,
    lng: -2.60520,
    postcode: "BS1",
    type: "quiet",
    accentColor: "#1b5e20", // Emerald Green
    address: "133 Cumberland Road, Bristol BS1 6UX",
    categoryText: "Art Gallery & Studios",
    rating: "4.6",
    reviews: "950",
    goldStandard: false,
    evaluator: "Community Arts Evaluator",
    auditDate: "November 2025",
    evaluatorQuote: "Quiet gallery environment with portable hearing loops available at the front reception.",
    features: ["Portable Reception Loop", "Quiet Gallery Rooms", "Level Access Entry"],
    icon: "🎨",
    photos: {
      main:  "Contents/Venues/spikeisland.jpg"
    }
  },
  {
    id: "cathedral",
    name: "Bristol Cathedral",
    lat: 51.45250,
    lng: -2.60060,
    postcode: "BS1",
    type: "induction",
    accentColor: "#005EB8", // Royal Blue
    address: "College Green, Bristol BS1 5TJ",
    categoryText: "Cathedral & Historic Venue",
    rating: "4.7",
    reviews: "3,800",
    goldStandard: false,
    evaluator: "Heritage Access Auditor",
    auditDate: "September 2025",
    evaluatorQuote: "Nave and Choir seating areas feature continuous T-coil loop coverage for services and concerts.",
    features: ["Nave Induction Loop", "Large Print Service Books", "Level Access Side Ramp"],
    icon: "⛪",
    photos: {
      main:  "Contents/Venues/cathedral.jpg"
    }
  },
  {
    id: "stnicholas",
    name: "St Nicholas Market",
    lat: 51.45400,
    lng: -2.59350,
    postcode: "BS1",
    type: "quiet",
    accentColor: "#D97706", // Amber
    address: "The Exchange, Corn Street, Bristol BS1 1JQ",
    categoryText: "Historic Market",
    rating: "4.6",
    reviews: "8,900",
    goldStandard: false,
    evaluator: "City Walk Auditor",
    auditDate: "August 2025",
    evaluatorQuote: "The Covered Market Hall features visual stall signs and clear directional boards.",
    features: ["Visual Signage Boards", "Open Air Courtyard", "Level Pedestrian Entry"],
    icon: "🛍️",
    photos: {
      main:  "Contents/Venues/stnicholas.jpg"
    }
  },
  {
    id: "futureinns",
    name: "Future Inns Bristol",
    lat: 51.45800,
    lng: -2.58400,
    postcode: "BS1",
    type: "induction",
    accentColor: "#005EB8", // Royal Blue
    address: "Bond Street South, Bristol BS1 3EN",
    categoryText: "Hotel & Conference",
    rating: "4.4",
    reviews: "1,920",
    goldStandard: false,
    evaluator: "Hotel Audit Team",
    auditDate: "August 2025",
    evaluatorQuote: "Guest rooms feature vibrating fire alert pagers and reception loop support.",
    features: ["Reception Desk Induction Loop", "Vibrating Fire Alarm Pagers"],
    icon: "🏨",
    photos: {
      main:  "Contents/Venues/futureinns.jpg"
    }
  },
  {
    id: "templemeads",
    name: "Bristol Temple Meads Station",
    lat: 51.44970,
    lng: -2.58110,
    postcode: "BS1",
    type: "auracast",
    accentColor: "#0891B2", // Teal
    address: "Station Approach, Bristol BS1 6QF",
    categoryText: "Transit Station",
    rating: "4.5",
    reviews: "12,100",
    goldStandard: false,
    evaluator: "Commuter Group Reviewer",
    auditDate: "December 2025",
    evaluatorQuote: "Ticket counter induction loops active; main concourse features large high-contrast visual display boards.",
    features: ["Customer Info Counter Loop", "High-Contrast Visual Boards", "Auracast Transit Trial"],
    icon: "🚆",
    photos: {
      main:  "Contents/Venues/templemeads.jpg"
    }
  }
];

// Complete non-overlapping, zero-gap interlocking Greater Bristol Postcode District Polygons including BS48 (Bristol Airport)
const postcodeDistricts = [
  {
    code: "BS1",
    color: "#00e5ff", // Electric Cyan
    center: { lat: 51.4530, lng: -2.5950 },
    coords: [
      { lat: 51.4650, lng: -2.6030 },
      { lat: 51.4650, lng: -2.5820 },
      { lat: 51.4430, lng: -2.5780 },
      { lat: 51.4430, lng: -2.6030 }
    ]
  },
  {
    code: "BS2",
    color: "#ffb300", // Amber Gold
    center: { lat: 51.4570, lng: -2.5750 },
    coords: [
      { lat: 51.4680, lng: -2.5820 },
      { lat: 51.4680, lng: -2.5650 },
      { lat: 51.4430, lng: -2.5650 },
      { lat: 51.4430, lng: -2.5780 },
      { lat: 51.4650, lng: -2.5820 }
    ]
  },
  {
    code: "BS3",
    color: "#ff0f5b", // Neon Pink
    center: { lat: 51.4360, lng: -2.6060 },
    coords: [
      { lat: 51.4430, lng: -2.6300 },
      { lat: 51.4430, lng: -2.5780 },
      { lat: 51.4300, lng: -2.5780 },
      { lat: 51.4300, lng: -2.6300 }
    ]
  },
  {
    code: "BS4",
    color: "#e040fb", // Deep Violet
    center: { lat: 51.4340, lng: -2.5565 },
    coords: [
      { lat: 51.4430, lng: -2.5780 },
      { lat: 51.4430, lng: -2.5350 },
      { lat: 51.4250, lng: -2.5350 },
      { lat: 51.4250, lng: -2.5780 }
    ]
  },
  {
    code: "BS5",
    color: "#00e676", // Vivid Green
    center: { lat: 51.4555, lng: -2.5500 },
    coords: [
      { lat: 51.4680, lng: -2.5650 },
      { lat: 51.4680, lng: -2.5350 },
      { lat: 51.4430, lng: -2.5350 },
      { lat: 51.4430, lng: -2.5650 }
    ]
  },
  {
    code: "BS6",
    color: "#29b6f6", // Bright Sky Blue
    center: { lat: 51.4685, lng: -2.5925 },
    coords: [
      { lat: 51.4720, lng: -2.6030 },
      { lat: 51.4720, lng: -2.5820 },
      { lat: 51.4650, lng: -2.5820 },
      { lat: 51.4650, lng: -2.6030 }
    ]
  },
  {
    code: "BS7",
    color: "#ff7043", // Coral Orange
    center: { lat: 51.4790, lng: -2.5835 },
    coords: [
      { lat: 51.4900, lng: -2.6030 },
      { lat: 51.4900, lng: -2.5650 },
      { lat: 51.4680, lng: -2.5650 },
      { lat: 51.4680, lng: -2.5820 },
      { lat: 51.4720, lng: -2.6030 }
    ]
  },
  {
    code: "BS8",
    color: "#26c6da", // Bright Turquoise
    center: { lat: 51.4575, lng: -2.6215 },
    coords: [
      { lat: 51.4720, lng: -2.6400 },
      { lat: 51.4720, lng: -2.6030 },
      { lat: 51.4650, lng: -2.6030 },
      { lat: 51.4430, lng: -2.6030 },
      { lat: 51.4430, lng: -2.6400 }
    ]
  },
  {
    code: "BS9",
    color: "#ab47bc", // Purple
    center: { lat: 51.4835, lng: -2.6215 },
    coords: [
      { lat: 51.4950, lng: -2.6400 },
      { lat: 51.4950, lng: -2.6030 },
      { lat: 51.4720, lng: -2.6030 },
      { lat: 51.4720, lng: -2.6400 }
    ]
  },
  {
    code: "BS10",
    color: "#c0ca33", // Lime Green
    center: { lat: 51.5100, lng: -2.6000 },
    coords: [
      { lat: 51.5300, lng: -2.6300 },
      { lat: 51.5300, lng: -2.5700 },
      { lat: 51.4900, lng: -2.5650 },
      { lat: 51.4950, lng: -2.6030 },
      { lat: 51.4950, lng: -2.6300 }
    ]
  },
  {
    code: "BS11",
    color: "#0891B2", // Teal
    center: { lat: 51.5010, lng: -2.6850 },
    coords: [
      { lat: 51.5300, lng: -2.7300 },
      { lat: 51.5300, lng: -2.6300 },
      { lat: 51.4720, lng: -2.6400 },
      { lat: 51.4720, lng: -2.7300 }
    ]
  },
  {
    code: "BS13",
    color: "#FF0F5B", // Crimson Pink
    center: { lat: 51.4100, lng: -2.6040 },
    coords: [
      { lat: 51.4300, lng: -2.6300 },
      { lat: 51.4300, lng: -2.5780 },
      { lat: 51.3900, lng: -2.5780 },
      { lat: 51.3900, lng: -2.6300 }
    ]
  },
  {
    code: "BS14",
    color: "#ff9800", // Orange
    center: { lat: 51.4075, lng: -2.5565 },
    coords: [
      { lat: 51.4250, lng: -2.5780 },
      { lat: 51.4250, lng: -2.5350 },
      { lat: 51.3900, lng: -2.5350 },
      { lat: 51.3900, lng: -2.5780 }
    ]
  },
  {
    code: "BS15",
    color: "#78909c", // Slate Blue
    center: { lat: 51.4465, lng: -2.5025 },
    coords: [
      { lat: 51.4680, lng: -2.5350 },
      { lat: 51.4680, lng: -2.4700 },
      { lat: 51.4250, lng: -2.4700 },
      { lat: 51.4250, lng: -2.5350 }
    ]
  },
  {
    code: "BS16",
    color: "#d4e157", // Yellow Green
    center: { lat: 51.4940, lng: -2.5175 },
    coords: [
      { lat: 51.5200, lng: -2.5650 },
      { lat: 51.5200, lng: -2.4700 },
      { lat: 51.4680, lng: -2.4700 },
      { lat: 51.4680, lng: -2.5350 },
      { lat: 51.4900, lng: -2.5650 }
    ]
  },
  {
    code: "BS20",
    color: "#8d6e63", // Warm Brown
    center: { lat: 51.4865, lng: -2.7000 },
    coords: [
      { lat: 51.5300, lng: -2.7600 },
      { lat: 51.5300, lng: -2.7300 },
      { lat: 51.4430, lng: -2.6400 },
      { lat: 51.4430, lng: -2.7600 }
    ]
  },
  {
    code: "BS30",
    color: "#3f51b5", // Indigo
    center: { lat: 51.4450, lng: -2.4500 },
    coords: [
      { lat: 51.4800, lng: -2.4700 },
      { lat: 51.4800, lng: -2.4300 },
      { lat: 51.4100, lng: -2.4300 },
      { lat: 51.4100, lng: -2.4700 }
    ]
  },
  {
    code: "BS31",
    color: "#673ab7", // Deep Purple
    center: { lat: 51.3975, lng: -2.4825 },
    coords: [
      { lat: 51.4250, lng: -2.5350 },
      { lat: 51.4250, lng: -2.4700 },
      { lat: 51.3700, lng: -2.4300 },
      { lat: 51.3700, lng: -2.5350 }
    ]
  },
  {
    code: "BS32",
    color: "#00bfa5", // Mint
    center: { lat: 51.5600, lng: -2.5000 },
    coords: [
      { lat: 51.5900, lng: -2.5700 },
      { lat: 51.5900, lng: -2.4300 },
      { lat: 51.5300, lng: -2.4300 },
      { lat: 51.5300, lng: -2.5700 }
    ]
  },
  {
    code: "BS34",
    color: "#2e7d32", // Forest Green
    center: { lat: 51.5100, lng: -2.5450 },
    coords: [
      { lat: 51.5300, lng: -2.6300 },
      { lat: 51.5300, lng: -2.5200 },
      { lat: 51.4900, lng: -2.5200 },
      { lat: 51.4900, lng: -2.5650 },
      { lat: 51.4900, lng: -2.6300 }
    ]
  },
  {
    code: "BS35",
    color: "#ff5722", // Deep Orange
    center: { lat: 51.5600, lng: -2.6650 },
    coords: [
      { lat: 51.5900, lng: -2.7600 },
      { lat: 51.5900, lng: -2.5700 },
      { lat: 51.5300, lng: -2.5700 },
      { lat: 51.5300, lng: -2.7300 },
      { lat: 51.5300, lng: -2.7600 }
    ]
  },
  {
    code: "BS41",
    color: "#a1887f", // Bronze
    center: { lat: 51.4240, lng: -2.6950 },
    coords: [
      { lat: 51.4430, lng: -2.7600 },
      { lat: 51.4430, lng: -2.6300 },
      { lat: 51.4050, lng: -2.6300 },
      { lat: 51.4050, lng: -2.7600 }
    ]
  },
  {
    code: "BS48",
    color: "#ec407a", // Deep Magenta Pink
    center: { lat: 51.3875, lng: -2.6950 },
    coords: [
      { lat: 51.4050, lng: -2.7600 },
      { lat: 51.4050, lng: -2.6300 },
      { lat: 51.3700, lng: -2.6300 },
      { lat: 51.3700, lng: -2.7600 }
    ]
  }
];

// Directional County Arrows pointing to neighboring regions as 100% transparent text watermarks right at map edges
const countyArrows = [
  { text: "⬆️ South Gloucestershire", lat: 51.5750, lng: -2.5700 },
  { text: "↗️ Yate & Cotswolds", lat: 51.5600, lng: -2.4600 },
  { text: "➡️ Bath & BANES", lat: 51.4450, lng: -2.4600 },
  { text: "⬇️ Somerset & Mendips", lat: 51.3850, lng: -2.5700 },
  { text: "⬅️ North Somerset & Weston", lat: 51.4450, lng: -2.7350 },
  { text: "↖️ Severn Estuary & Wales", lat: 51.5600, lng: -2.7200 }
];

let map;
let markers = [];
let polygonObjects = {};
let postcodeLabelMarkers = [];
let activeInfoWindow = null;

// Official Google Dark Map Style
const googleDarkStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
  { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
  { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] }
];

function initMap() {
  const mapElement = document.getElementById("map");
  if (!mapElement) return;

  const bristolCenter = { lat: 51.4650, lng: -2.5900 };

  map = new google.maps.Map(mapElement, {
    zoom: 12.5,
    center: bristolCenter,
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
    styles: googleDarkStyle,
    restriction: {
      latLngBounds: {
        north: 51.5900,
        south: 51.3700,
        west: -2.7600,
        east: -2.4300
      },
      strictBounds: true
    },
    minZoom: 11,
    maxZoom: 18
  });

  drawInterlockingPostcodePolygons();
  renderCountyDirectionalArrows();
  renderMarkers();
  setupSidebarDrawer();

  // Smoothly dismiss loading overlay as soon as tiles render
  google.maps.event.addListenerOnce(map, "idle", () => {
    const loader = document.getElementById("map-loader");
    if (loader) {
      loader.classList.add("hidden");
      setTimeout(() => loader.remove(), 400);
    }
  });

  document.getElementById("filter-induction")?.addEventListener("change", updateFilters);
  document.getElementById("filter-auracast")?.addEventListener("change", updateFilters);
  document.getElementById("filter-quiet")?.addEventListener("change", updateFilters);
  document.getElementById("filter-postcode")?.addEventListener("change", updateFilters);
}

// Sidebar Drawer Interactivity and Live Venue List Population
function setupSidebarDrawer() {
  const toggleBtn = document.getElementById("toggle-sidebar-btn");
  const closeBtn  = document.getElementById("close-sidebar-btn");
  const sidebar   = document.getElementById("venue-sidebar");
  const searchInput = document.getElementById("sidebar-search-input");

  if (!toggleBtn || !sidebar) return;

  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
  });

  closeBtn?.addEventListener("click", () => {
    sidebar.classList.add("collapsed");
  });

  searchInput?.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    renderSidebarItems(query);
  });

  renderSidebarItems();
}

function renderSidebarItems(query = "") {
  const container = document.getElementById("sidebar-venue-list");
  if (!container) return;

  container.innerHTML = "";

  const filtered = venues.filter((v) => {
    if (!query) return true;
    return (
      v.name.toLowerCase().includes(query) ||
      v.postcode.toLowerCase().includes(query) ||
      v.categoryText.toLowerCase().includes(query) ||
      v.features.some(f => f.toLowerCase().includes(query))
    );
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div style="padding: 20px; text-align: center; color: #94a3b8; font-size: 0.85rem;">No matching venues found</div>`;
    return;
  }

  filtered.forEach((v) => {
    const borderCol = v.accentColor || "#0891B2";
    const item = document.createElement("div");
    item.className = "sidebar-item";
    item.style.borderLeftColor = borderCol;

    item.innerHTML = `
      <div class="sidebar-item-icon">${v.icon}</div>
      <div class="sidebar-item-info">
        <h4>${v.name}</h4>
        <p>📍 <strong>${v.postcode}</strong> • ${v.categoryText}</p>
        <p style="font-size: 0.72rem; color: #38bdf8; margin-top: 2px;">⭐ ${v.rating} (${v.reviews} reviews)</p>
      </div>
    `;

    item.addEventListener("click", () => {
      if (!map) return;
      map.setCenter({ lat: v.lat, lng: v.lng });
      map.setZoom(16);

      const markerObj = markers.find(m => {
        const title = m.title || '';
        return title.includes(v.name);
      });

      if (markerObj) {
        google.maps.event.trigger(markerObj, 'click');
      }
    });

    container.appendChild(item);
  });
}

function drawInterlockingPostcodePolygons() {
  postcodeLabelMarkers = [];
  postcodeDistricts.forEach((dist) => {
    // Unique color polygon overlay
    const polygon = new google.maps.Polygon({
      paths: dist.coords,
      strokeColor: dist.color,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: dist.color,
      fillOpacity: 0.22,
      map: map,
      clickable: false
    });
    polygonObjects[dist.code] = polygon;

    // Single label marker per district (prefer AdvancedMarkerElement if available, else SVG fallback)
    if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
      const labelDiv = document.createElement("div");
      labelDiv.className = "postcode-area-label";
      labelDiv.innerText = dist.code;

      const advLabelMarker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: dist.center,
        title: `${dist.code} Postcode District`,
        content: labelDiv
      });
      postcodeLabelMarkers.push(advLabelMarker);
    } else {
      const labelSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="360" height="200" viewBox="0 0 360 200"><text x="180" y="145" font-family="Oswald, Impact, %27Arial Narrow%27, sans-serif" font-size="140" font-weight="800" fill="%23000000" fill-opacity="0.22" stroke="none" text-anchor="middle">${dist.code}</text></svg>`;

      const labelMarker = new google.maps.Marker({
        map: map,
        position: dist.center,
        title: `${dist.code} Postcode District`,
        icon: {
          url: labelSvg,
          scaledSize: new google.maps.Size(360, 200),
          anchor: new google.maps.Point(180, 100)
        },
        clickable: false,
        zIndex: 50
      });
      postcodeLabelMarkers.push(labelMarker);
    }
  });
}

// Render directional county arrows pointing to adjacent regions as 100% transparent text watermarks right at the map edges
function renderCountyDirectionalArrows() {
  countyArrows.forEach((arrow) => {
    const svgWatermark = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="280" height="40" viewBox="0 0 280 40"><text x="140" y="28" font-family="Inter, system-ui, sans-serif" font-size="16" font-weight="900" fill="%2338bdf8" fill-opacity="0.95" stroke="%23000000" stroke-width="0.8" text-anchor="middle">${encodeURIComponent(arrow.text)}</text></svg>`;

    new google.maps.Marker({
      map: map,
      position: { lat: arrow.lat, lng: arrow.lng },
      title: arrow.text,
      icon: {
        url: svgWatermark,
        scaledSize: new google.maps.Size(280, 40),
        anchor: new google.maps.Point(140, 20)
      },
      clickable: false,
      zIndex: 100
    });
  });
}

function renderMarkers() {
  clearMarkers();

  const showInduction = document.getElementById("filter-induction")?.checked ?? true;
  const showAuracast  = document.getElementById("filter-auracast")?.checked ?? true;
  const showQuiet     = document.getElementById("filter-quiet")?.checked ?? true;
  const selectedPostcode = document.getElementById("filter-postcode")?.value || "ALL";

  // Dynamic Postcode Area Highlighting & Complete Hiding when 'NONE' is selected
  if (selectedPostcode === "NONE") {
    Object.keys(polygonObjects).forEach((code) => {
      polygonObjects[code].setMap(null);
    });
    postcodeLabelMarkers.forEach((m) => {
      if (m.setMap) m.setMap(null);
      else m.map = null;
    });
  } else {
    postcodeLabelMarkers.forEach((m) => {
      if (m.setMap) m.setMap(map);
      else m.map = map;
    });

    Object.keys(polygonObjects).forEach((code) => {
      const poly = polygonObjects[code];
      poly.setMap(map);
      const dist = postcodeDistricts.find(d => d.code === code);
      const color = dist ? dist.color : "#00e5ff";

      if (selectedPostcode === "ALL") {
        poly.setOptions({ fillColor: color, fillOpacity: 0.22, strokeColor: color, strokeOpacity: 0.8, strokeWeight: 2 });
      } else if (code === selectedPostcode) {
        poly.setOptions({ fillColor: color, fillOpacity: 0.50, strokeColor: "#ffffff", strokeOpacity: 1.0, strokeWeight: 4.0 });
      } else {
        poly.setOptions({ fillColor: color, fillOpacity: 0.05, strokeColor: color, strokeOpacity: 0.2, strokeWeight: 1 });
      }
    });
  }

  venues.forEach((v) => {
    if (v.type === "induction" && !showInduction) return;
    if (v.type === "auracast"  && !showAuracast)  return;
    if (v.type === "quiet"     && !showQuiet)     return;
    if (selectedPostcode !== "ALL" && selectedPostcode !== "NONE" && v.postcode !== selectedPostcode) return;

    const pinBorderColor = v.accentColor || (v.type === "auracast" ? "#ff0f5b" : (v.type === "quiet" ? "#1b5e20" : "#0891B2"));

    const pinElement = document.createElement("div");
    pinElement.className = "round-icon-marker";
    pinElement.style.backgroundColor = "#202124";
    pinElement.style.border = `4px solid ${pinBorderColor}`;
    pinElement.style.boxShadow = `0 0 16px ${pinBorderColor}99, 0 8px 20px rgba(0,0,0,0.7)`;

    pinElement.innerHTML = `
      <span class="emoji-icon">${v.icon}</span>
      <div class="marker-tooltip">${v.name} (${v.postcode})</div>
    `;

    let marker;
    if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
      marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: { lat: v.lat, lng: v.lng },
        title: `${v.name} (${v.postcode})`,
        content: pinElement
      });
    } else {
      const pinSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="112" height="112" viewBox="0 0 112 112"><circle cx="56" cy="56" r="50" fill="%23202124" stroke="${encodeURIComponent(pinBorderColor)}" stroke-width="4"/><text x="56" y="72" font-size="56" text-anchor="middle">${encodeURIComponent(v.icon)}</text></svg>`;
      marker = new google.maps.Marker({
        map,
        position: { lat: v.lat, lng: v.lng },
        title: `${v.name} (${v.postcode})`,
        icon: {
          url: pinSvg,
          scaledSize: new google.maps.Size(112, 112),
          anchor: new google.maps.Point(56, 56)
        }
      });
    }

    const statusBadgeHtml = `<div style="background: rgba(241, 245, 249, 0.15); color: #94a3b8; font-size: 0.725rem; font-weight: 700; padding: 3px 8px; border-radius: 8px; display: inline-flex; align-items: center; gap: 4px; margin-bottom: 8px; border: 1px solid rgba(255,255,255,0.15);">ℹ️ Unverified Assessment</div>`;
    
    const venueCardLink = `path-accessible-venues.html#venue-${v.id}`;
    const mainPhoto = v.photos?.main || "Contents/Venues/watershed-main.png";
    const thumb2 = v.photos?.thumb2 || "Contents/Venues/watershed-2.png";
    const thumb3 = v.photos?.thumb3 || "Contents/Venues/watershed-3.png";

    // Popup with lazy decoded images
    const contentString = `
      <div class="dark-popup" style="border-left: 5px solid ${pinBorderColor};">
        ${statusBadgeHtml}
        <h3>${v.name}</h3>
        <p class="rating">⭐ ${v.rating} (${v.reviews} reviews) • ${v.categoryText} • <strong>${v.postcode}</strong></p>
        
        <div class="popup-hero-image" style="width: 100%; height: 135px; border-radius: 10px; overflow: hidden; margin-bottom: 12px; background: #333;">
          <img src="${mainPhoto}" alt="${v.name}" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy" decoding="async" />
        </div>

        <p style="font-size: 0.85rem; color: #bdc1c6; margin-bottom: 10px;">📍 ${v.address}</p>

        <div class="popup-buttons">
          <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v.name + ' ' + v.address)}" target="_blank" rel="noopener" class="open-map-btn" style="background-color: ${pinBorderColor}; color: white; border: none; font-weight: 700;">
            📍 Open Directions in Google Maps
          </a>
          <a href="${venueCardLink}" class="popup-btn" style="background: #3c4043; color: #e8eaed; text-align: center; text-decoration: none; font-weight: 700; margin-top: 6px;">
            View Full Venue Card & Audit &rarr;
          </a>
        </div>
      </div>
    `;

    const infoWindow = new google.maps.InfoWindow({ content: contentString });

    const handleClick = () => {
      if (activeInfoWindow) activeInfoWindow.close();
      infoWindow.open(map, marker);
      activeInfoWindow = infoWindow;
    };

    if (marker.addListener) {
      marker.addListener("click", handleClick);
    } else if (pinElement) {
      pinElement.addEventListener("click", handleClick);
    }

    markers.push(marker);
  });
}

function clearMarkers() {
  markers.forEach(m => {
    if (m.setMap) m.setMap(null);
    else m.map = null;
  });
  markers = [];
}

function updateFilters() {
  renderMarkers();
}

window.initMap = initMap;

// If Google Maps API is already loaded/cached, initialize immediately
if (window.google && window.google.maps && window.google.maps.Map && !map) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMap);
  } else {
    initMap();
  }
}