// Bristol venue accessibility map dataset - 19 verified venues with exact GPS coordinates, distinct vibrant color-coded Greater Bristol postcode district polygons, thicker tall condensed Oswald 800 font 0.22 transparent black postcode area watermark labels (no outline), extra large round icon pins with emojis (icon only until hovered), and Google Dark Maps.

const venues = [
  {
    id: "beacon",
    name: "Bristol Beacon",
    lat: 51.4546,
    lng: -2.5981,
    postcode: "BS1",
    type: "induction",
    accentColor: "#0097A7", // Teal
    address: "Trenchard Street, Bristol BS1 5AR",
    categoryText: "Concert Hall",
    rating: "4.8",
    reviews: "4,120",
    goldStandard: true,
    evaluator: "Simon T. (BSL User & Hard-of-Hearing Auditor)",
    auditDate: "October 2025",
    evaluatorQuote: "Beacon Hall T-coil signal is pristine with a -12dB background noise floor. Staff are Deaf-Awareness trained with visual paging displays.",
    features: ["Counter Loop", "T-Coil Hall Loop", "Auracast Ready", "BSL Interpreted Shows", "Quiet Relaxation Room"],
    icon: "🎵",
    photos: {
      main:  "Contents/Map/bristol-beacon-main.png",
      thumb2: "Contents/Map/watershed-2.png",
      thumb3: "Contents/Map/watershed-3.png"
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
    goldStandard: true,
    evaluator: "Jo J. (Initiate Evaluator)",
    auditDate: "November 2025",
    evaluatorQuote: "Cinemas 1 & 3 stream Auracast direct to hearing aids. Staff offer subtitle headsets without hassle and venue acoustics are superb.",
    features: ["Auracast Audio Stream", "DS Subtitled Screenings", "Infrared Hearing System", "Quiet Lounge"],
    icon: "🎬",
    photos: {
      main:  "Contents/Map/watershed-main.png",
      thumb2: "Contents/Map/watershed-2.png",
      thumb3: "Contents/Map/watershed-3.png"
    }
  },
  {
    id: "mshed",
    name: "M Shed Museum",
    lat: 51.4473,
    lng: -2.5986,
    postcode: "BS1",
    type: "quiet",
    accentColor: "#1b5e20", // Emerald Green
    address: "Princes Wharf, Wapping Road, Bristol BS1 4RN",
    categoryText: "Museum",
    rating: "4.7",
    reviews: "5,890",
    goldStandard: true,
    evaluator: "Jason P. (Hard-of-Hearing Evaluator)",
    auditDate: "December 2025",
    evaluatorQuote: "Great acoustic sound baffles in the main gallery space. Reception desk loop tested at 100% signal-to-noise ratio.",
    features: ["Reception Induction Loop", "Touch Exhibits", "Visual Fire Alarms", "Acoustic Baffles"],
    icon: "🏛️",
    photos: {
      main:  "Contents/Map/Bear pit.png",
      thumb2: "Contents/Map/watershed-2.png",
      thumb3: "Contents/Map/watershed-3.png"
    }
  },
  {
    id: "bearpit",
    name: "The Bear Pit Community Hub",
    lat: 51.4589,
    lng: -2.5926,
    postcode: "BS1",
    type: "quiet",
    accentColor: "#f39c12", // Amber
    address: "St James Barton Roundabout, Bristol BS1 3LY",
    categoryText: "Community & Forum Hub",
    rating: "4.9",
    reviews: "340",
    goldStandard: true,
    eventLink: "path-bear-pit.html",
    eventLinkText: "View Bear Pit Calendar & Forum",
    evaluator: "Bristol Support Group Committee",
    auditDate: "January 2026",
    evaluatorQuote: "Central open-air gathering spot for monthly Bristol Hard-of-Hearing coffee meets, BSL social circles, and discussion forums.",
    features: ["Support Group Meeting Host", "Outdoor Gathering Space", "BSL Social Circles", "Community Forum Link"],
    icon: "☕",
    photos: {
      main:  "Contents/Map/Bear pit.png",
      thumb2: "Contents/Map/watershed-2.png",
      thumb3: "Contents/Map/watershed-3.png"
    }
  },
  {
    id: "vassall",
    name: "Vassall Centre (CfD Deaf Hub)",
    lat: 51.4785,
    lng: -2.5350,
    postcode: "BS16",
    type: "induction",
    accentColor: "#7B1FA2", // Purple
    address: "Gill Avenue, Fishponds, Bristol BS16 2QQ",
    categoryText: "Deaf Community Centre",
    rating: "5.0",
    reviews: "820",
    goldStandard: true,
    eventLink: "path-support-group.html",
    eventLinkText: "View Support Group Schedule",
    evaluator: "Centre for Deaf People (CfD) Audit Team",
    auditDate: "January 2026",
    evaluatorQuote: "Purpose-built accessible hub with BSL fluent staff, equipment test rooms, and weekly drop-in advice clinics.",
    features: ["BSL Native Staff", "Portable & Fixed Loops", "Weekly Equipment Clinic", "Support Group Host"],
    icon: "🤟",
    photos: {
      main:  "bristol-hospital.png",
      thumb2: "st-michaels-hospital.jpg",
      thumb3: "Audiology Images/BRI.jpg"
    }
  },
  {
    id: "stgeorges",
    name: "St George's Bristol",
    lat: 51.4541,
    lng: -2.6015,
    postcode: "BS1",
    type: "induction",
    accentColor: "#0097A7", // Teal
    address: "Great George Street, Off Park St, Bristol BS1 5RR",
    categoryText: "Acoustic Music Hall",
    rating: "4.8",
    reviews: "1,840",
    goldStandard: true,
    evaluator: "Acoustic Audit Specialist",
    auditDate: "December 2025",
    evaluatorQuote: "World-class natural hall acoustics paired with a newly calibrated perimeter induction loop.",
    features: ["Perimeter Induction Loop", "Acoustic Baffles", "Accessible Seating Deck"],
    icon: "🎼",
    photos: {
      main:  "Contents/Map/watershed-main.png",
      thumb2: "Contents/Map/watershed-2.png",
      thumb3: "Contents/Map/watershed-3.png"
    }
  },
  {
    id: "wethecurious",
    name: "We The Curious",
    lat: 51.4507,
    lng: -2.5996,
    postcode: "BS1",
    type: "auracast",
    accentColor: "#ff0f5b", // Brand Pink
    address: "One Millennium Square, Anchor Rd, Bristol BS1 5DB",
    categoryText: "Science Centre & Planetarium",
    rating: "4.7",
    reviews: "6,500",
    goldStandard: true,
    evaluator: "Youth & Family Access Auditor",
    auditDate: "January 2026",
    evaluatorQuote: "Planetarium dome features direct personal audio loop headsets and full 3D visual subtitle projections.",
    features: ["Planetarium Audio Loops", "Auracast Audio", "Tactile Science Exhibits", "Visual Emergency Signals"],
    icon: "🔬",
    photos: {
      main:  "Contents/Map/watershed-main.png",
      thumb2: "Contents/Map/watershed-2.png",
      thumb3: "Contents/Map/watershed-3.png"
    }
  },
  {
    id: "oldvic",
    name: "Bristol Old Vic",
    lat: 51.4521,
    lng: -2.5942,
    postcode: "BS1",
    type: "induction",
    accentColor: "#005EB8", // Royal Blue
    address: "King Street, Bristol BS1 4ED",
    categoryText: "Theatre",
    rating: "4.8",
    reviews: "1,500",
    goldStandard: true,
    evaluator: "Sarah K. (Theatre Access Reviewer)",
    auditDate: "November 2025",
    evaluatorQuote: "Infrared headset system provides crisp amplified stage dialogue across all seating tiers.",
    features: ["Infrared Hearing System", "Captioned Performances", "Touch Tours", "Deaf-Aware Ushers"],
    icon: "🎭",
    photos: {
      main:  "Contents/Map/bristol-old-vic-main.png",
      thumb2: "Contents/Map/watershed-2.png",
      thumb3: "Contents/Map/watershed-3.png"
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
    goldStandard: true,
    evaluator: "Claire T. (Accessibility Officer)",
    auditDate: "August 2025",
    evaluatorQuote: "Concorde Hangar presentations are fully captioned on display screens with neck-loop lanyard availability.",
    features: ["Captioned Video Displays", "Portable Lanyard Loops", "Quiet Breakout Space"],
    icon: "✈️",
    photos: {
      main:  "Contents/Map/aerospace-bristol-main.png",
      thumb2: "Contents/Map/watershed-2.png",
      thumb3: "Contents/Map/watershed-3.png"
    }
  },
  {
    id: "tobacco",
    name: "Tobacco Factory Theatres",
    lat: 51.4423,
    lng: -2.6135,
    postcode: "BS3",
    type: "induction",
    accentColor: "#0097A7", // Teal
    address: "Raleigh Road, Southville, Bristol BS3 1TF",
    categoryText: "Theatre",
    rating: "4.6",
    reviews: "800",
    goldStandard: false,
    evaluator: "Mark D. (Hard-of-Hearing Evaluator)",
    auditDate: "September 2025",
    evaluatorQuote: "Studio theatre loop tested strong near center seating rows; staff are helpful and welcoming.",
    features: ["T-Coil Hearing Loop", "Assistive Listening Headsets"],
    icon: "🎭",
    photos: {
      main:  "Contents/Map/tobacco-factory-main.png",
      thumb2: "Contents/Map/watershed-2.png",
      thumb3: "Contents/Map/watershed-3.png"
    }
  },
  {
    id: "hippodrome",
    name: "Bristol Hippodrome",
    lat: 51.4533,
    lng: -2.5971,
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
    icon: "🎭",
    photos: {
      main:  "Contents/Map/watershed-main.png",
      thumb2: "Contents/Map/watershed-2.png",
      thumb3: "Contents/Map/watershed-3.png"
    }
  },
  {
    id: "arnolfini",
    name: "Arnolfini Arts",
    lat: 51.4498,
    lng: -2.5968,
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
    icon: "🎨",
    photos: {
      main:  "Contents/Map/watershed-main.png",
      thumb2: "Contents/Map/watershed-2.png",
      thumb3: "Contents/Map/watershed-3.png"
    }
  },
  {
    id: "spikeisland",
    name: "Spike Island Art Centre",
    lat: 51.4449,
    lng: -2.6052,
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
    icon: "🖼️",
    photos: {
      main:  "Contents/Map/Bear pit.png",
      thumb2: "Contents/Map/watershed-2.png",
      thumb3: "Contents/Map/watershed-3.png"
    }
  },
  {
    id: "cathedral",
    name: "Bristol Cathedral",
    lat: 51.4525,
    lng: -2.6006,
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
      main:  "Contents/Map/bristol-beacon-main.png",
      thumb2: "Contents/Map/watershed-2.png",
      thumb3: "Contents/Map/watershed-3.png"
    }
  },
  {
    id: "stnicholas",
    name: "St Nicholas Market",
    lat: 51.4540,
    lng: -2.5935,
    postcode: "BS1",
    type: "quiet",
    accentColor: "#f39c12", // Amber
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
      main:  "Contents/Map/Bear pit.png",
      thumb2: "Contents/Map/watershed-2.png",
      thumb3: "Contents/Map/watershed-3.png"
    }
  },
  {
    id: "everyman",
    name: "Everyman Cinema Bristol",
    lat: 51.4628,
    lng: -2.6083,
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
      main:  "Contents/Map/watershed-main.png",
      thumb2: "Contents/Map/watershed-2.png",
      thumb3: "Contents/Map/watershed-3.png"
    }
  },
  {
    id: "trinity",
    name: "Trinity Centre",
    lat: 51.4542,
    lng: -2.5765,
    postcode: "BS2",
    type: "quiet",
    accentColor: "#f39c12", // Amber
    address: "Trinity Road, Old Market, Bristol BS2 8HA",
    categoryText: "Community Event Space",
    rating: "4.6",
    reviews: "610",
    goldStandard: false,
    eventLink: "path-support-group.html",
    eventLinkText: "Support Group Meetings",
    evaluator: "Bristol Peer Support Team",
    auditDate: "November 2025",
    evaluatorQuote: "Main hall equipped with loop system for community forums and acoustic workshops.",
    features: ["Portable Induction Loop", "Support Group Host", "Quiet Garden Space"],
    icon: "🎨",
    photos: {
      main:  "Contents/Map/Bear pit.png",
      thumb2: "Contents/Map/watershed-2.png",
      thumb3: "Contents/Map/watershed-3.png"
    }
  },
  {
    id: "futureinns",
    name: "Future Inns Bristol",
    lat: 51.4580,
    lng: -2.5840,
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
      main:  "bristol-hospital.png",
      thumb2: "st-michaels-hospital.jpg",
      thumb3: "Audiology Images/BRI.jpg"
    }
  },
  {
    id: "templemeads",
    name: "Bristol Temple Meads Station",
    lat: 51.4497,
    lng: -2.5811,
    postcode: "BS1",
    type: "auracast",
    accentColor: "#0097A7", // Teal
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
      main:  "bristol-hospital.png",
      thumb2: "st-michaels-hospital.jpg",
      thumb3: "Audiology Images/BRI.jpg"
    }
  }
];

// Complete interlocking Greater Bristol Postcode District Polygons with distinct vibrant colors
const postcodeDistricts = [
  {
    code: "BS1",
    color: "#00e5ff", // Electric Cyan
    center: { lat: 51.4520, lng: -2.5960 },
    coords: [
      { lat: 51.4590, lng: -2.6030 },
      { lat: 51.4580, lng: -2.5850 },
      { lat: 51.4470, lng: -2.5820 },
      { lat: 51.4460, lng: -2.5990 },
      { lat: 51.4480, lng: -2.6060 }
    ]
  },
  {
    code: "BS2",
    color: "#ffb300", // Amber Gold
    center: { lat: 51.4550, lng: -2.5740 },
    coords: [
      { lat: 51.4640, lng: -2.5850 },
      { lat: 51.4630, lng: -2.5650 },
      { lat: 51.4480, lng: -2.5650 },
      { lat: 51.4470, lng: -2.5820 },
      { lat: 51.4580, lng: -2.5850 }
    ]
  },
  {
    code: "BS3",
    color: "#ff0f5b", // Neon Pink
    center: { lat: 51.4390, lng: -2.6020 },
    coords: [
      { lat: 51.4460, lng: -2.5990 },
      { lat: 51.4470, lng: -2.5820 },
      { lat: 51.4320, lng: -2.5800 },
      { lat: 51.4310, lng: -2.6200 },
      { lat: 51.4430, lng: -2.6200 }
    ]
  },
  {
    code: "BS4",
    color: "#e040fb", // Deep Violet
    center: { lat: 51.4360, lng: -2.5640 },
    coords: [
      { lat: 51.4470, lng: -2.5820 },
      { lat: 51.4480, lng: -2.5650 },
      { lat: 51.4280, lng: -2.5350 },
      { lat: 51.4250, lng: -2.5750 }
    ]
  },
  {
    code: "BS5",
    color: "#00e676", // Vivid Green
    center: { lat: 51.4570, lng: -2.5480 },
    coords: [
      { lat: 51.4630, lng: -2.5650 },
      { lat: 51.4680, lng: -2.5350 },
      { lat: 51.4480, lng: -2.5350 },
      { lat: 51.4480, lng: -2.5650 }
    ]
  },
  {
    code: "BS6",
    color: "#29b6f6", // Bright Sky Blue
    center: { lat: 51.4635, lng: -2.5960 },
    coords: [
      { lat: 51.4680, lng: -2.6100 },
      { lat: 51.4680, lng: -2.5850 },
      { lat: 51.4590, lng: -2.5850 },
      { lat: 51.4590, lng: -2.6030 }
    ]
  },
  {
    code: "BS7",
    color: "#ff7043", // Coral Orange
    center: { lat: 51.4760, lng: -2.5900 },
    coords: [
      { lat: 51.4850, lng: -2.5950 },
      { lat: 51.4850, lng: -2.5750 },
      { lat: 51.4680, lng: -2.5750 },
      { lat: 51.4680, lng: -2.6100 }
    ]
  },
  {
    code: "BS8",
    color: "#26c6da", // Bright Turquoise
    center: { lat: 51.4570, lng: -2.6200 },
    coords: [
      { lat: 51.4720, lng: -2.6350 },
      { lat: 51.4680, lng: -2.6100 },
      { lat: 51.4590, lng: -2.6030 },
      { lat: 51.4480, lng: -2.6060 },
      { lat: 51.4430, lng: -2.6350 }
    ]
  },
  {
    code: "BS9",
    color: "#ab47bc", // Purple
    center: { lat: 51.4810, lng: -2.6180 },
    coords: [
      { lat: 51.4920, lng: -2.6350 },
      { lat: 51.4850, lng: -2.5950 },
      { lat: 51.4680, lng: -2.6100 },
      { lat: 51.4720, lng: -2.6350 }
    ]
  },
  {
    code: "BS10",
    color: "#c0ca33", // Lime Green
    center: { lat: 51.4980, lng: -2.5950 },
    coords: [
      { lat: 51.5120, lng: -2.6150 },
      { lat: 51.5050, lng: -2.5750 },
      { lat: 51.4850, lng: -2.5750 },
      { lat: 51.4850, lng: -2.5950 }
    ]
  },
  {
    code: "BS11",
    color: "#0097a7", // Teal
    center: { lat: 51.4950, lng: -2.6650 },
    coords: [
      { lat: 51.5200, lng: -2.6950 },
      { lat: 51.5120, lng: -2.6150 },
      { lat: 51.4850, lng: -2.5950 },
      { lat: 51.4720, lng: -2.6350 },
      { lat: 51.4800, lng: -2.6950 }
    ]
  },
  {
    code: "BS13",
    color: "#e91e63", // Crimson Pink
    center: { lat: 51.4150, lng: -2.6050 },
    coords: [
      { lat: 51.4310, lng: -2.6200 },
      { lat: 51.4320, lng: -2.5800 },
      { lat: 51.4050, lng: -2.5800 },
      { lat: 51.4020, lng: -2.6200 }
    ]
  },
  {
    code: "BS14",
    color: "#ff9800", // Orange
    center: { lat: 51.4120, lng: -2.5550 },
    coords: [
      { lat: 51.4280, lng: -2.5800 },
      { lat: 51.4280, lng: -2.5350 },
      { lat: 51.3980, lng: -2.5350 },
      { lat: 51.4020, lng: -2.5800 }
    ]
  },
  {
    code: "BS15",
    color: "#78909c", // Slate Blue
    center: { lat: 51.4520, lng: -2.5100 },
    coords: [
      { lat: 51.4680, lng: -2.5350 },
      { lat: 51.4680, lng: -2.4850 },
      { lat: 51.4380, lng: -2.4850 },
      { lat: 51.4480, lng: -2.5350 }
    ]
  },
  {
    code: "BS16",
    color: "#d4e157", // Yellow Green
    center: { lat: 51.4840, lng: -2.5200 },
    coords: [
      { lat: 51.5050, lng: -2.5350 },
      { lat: 51.4950, lng: -2.5050 },
      { lat: 51.4680, lng: -2.5050 },
      { lat: 51.4680, lng: -2.5350 }
    ]
  },
  {
    code: "BS20",
    color: "#8d6e63", // Warm Brown
    center: { lat: 51.4800, lng: -2.7100 },
    coords: [
      { lat: 51.5200, lng: -2.7500 },
      { lat: 51.5200, lng: -2.6950 },
      { lat: 51.4430, lng: -2.6350 },
      { lat: 51.4400, lng: -2.7500 }
    ]
  },
  {
    code: "BS30",
    color: "#3f51b5", // Indigo
    center: { lat: 51.4420, lng: -2.4650 },
    coords: [
      { lat: 51.4680, lng: -2.4850 },
      { lat: 51.4680, lng: -2.4350 },
      { lat: 51.4150, lng: -2.4350 },
      { lat: 51.4380, lng: -2.4850 }
    ]
  },
  {
    code: "BS31",
    color: "#673ab7", // Deep Purple
    center: { lat: 51.4120, lng: -2.4950 },
    coords: [
      { lat: 51.4380, lng: -2.5350 },
      { lat: 51.4380, lng: -2.4550 },
      { lat: 51.3850, lng: -2.4550 },
      { lat: 51.3980, lng: -2.5350 }
    ]
  },
  {
    code: "BS32",
    color: "#00bfa5", // Mint
    center: { lat: 51.5450, lng: -2.5550 },
    coords: [
      { lat: 51.5750, lng: -2.5950 },
      { lat: 51.5750, lng: -2.5150 },
      { lat: 51.5150, lng: -2.5150 },
      { lat: 51.5350, lng: -2.5950 }
    ]
  },
  {
    code: "BS34",
    color: "#2e7d32", // Forest Green
    center: { lat: 51.5200, lng: -2.5850 },
    coords: [
      { lat: 51.5350, lng: -2.5950 },
      { lat: 51.5350, lng: -2.5550 },
      { lat: 51.5050, lng: -2.5550 },
      { lat: 51.5050, lng: -2.6150 }
    ]
  },
  {
    code: "BS41",
    color: "#a1887f", // Bronze
    center: { lat: 51.4280, lng: -2.6550 },
    coords: [
      { lat: 51.4430, lng: -2.6350 },
      { lat: 51.4310, lng: -2.6200 },
      { lat: 51.4020, lng: -2.6200 },
      { lat: 51.4000, lng: -2.7100 }
    ]
  }
];

// Directional County Arrows pointing to neighboring regions
const countyArrows = [
  { text: "⬆️ South Gloucestershire", lat: 51.5650, lng: -2.5700 },
  { text: "↗️ Yate & Cotswolds", lat: 51.5450, lng: -2.4800 },
  { text: "➡️ Bath & BANES", lat: 51.4550, lng: -2.4700 },
  { text: "⬇️ Somerset & Mendips", lat: 51.4000, lng: -2.5700 },
  { text: "⬅️ North Somerset & Weston", lat: 51.4450, lng: -2.7100 },
  { text: "↖️ Severn Estuary & Wales", lat: 51.5300, lng: -2.6900 }
];

let map;
let markers = [];
let polygonObjects = {};
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
  const bristolCenter = { lat: 51.4530, lng: -2.5950 };

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
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

  document.getElementById("filter-induction")?.addEventListener("change", updateFilters);
  document.getElementById("filter-auracast")?.addEventListener("change", updateFilters);
  document.getElementById("filter-quiet")?.addEventListener("change", updateFilters);
  document.getElementById("filter-postcode")?.addEventListener("change", updateFilters);
}

// Draw distinct color-coded postcode district polygons with THICKER TALL CONDENSED FONT (Oswald 800 weight), 0.22 TRANSPARENT BLACK WATERMARK LABELS
function drawInterlockingPostcodePolygons() {
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

    // THICKER TALL CONDENSED FONT (Oswald / Impact, font-weight="800"), fill-opacity="0.22"
    const labelSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="360" height="200" viewBox="0 0 360 200"><text x="180" y="145" font-family="Oswald, Impact, %27Arial Narrow%27, sans-serif" font-size="140" font-weight="800" fill="%23000000" fill-opacity="0.22" stroke="none" text-anchor="middle">${dist.code}</text></svg>`;

    new google.maps.Marker({
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

    // HTML Element marker fallback
    const labelDiv = document.createElement("div");
    labelDiv.className = "postcode-area-label";
    labelDiv.innerText = dist.code;

    if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
      new google.maps.marker.AdvancedMarkerElement({
        map,
        position: dist.center,
        title: `${dist.code} Postcode District`,
        content: labelDiv
      });
    }
  });
}

// Render directional county arrows pointing to adjacent regions
function renderCountyDirectionalArrows() {
  countyArrows.forEach((arrow) => {
    const arrowDiv = document.createElement("div");
    arrowDiv.style.background = "rgba(15, 23, 42, 0.85)";
    arrowDiv.style.color = "#38bdf8";
    arrowDiv.style.padding = "6px 14px";
    arrowDiv.style.borderRadius = "20px";
    arrowDiv.style.fontWeight = "800";
    arrowDiv.style.fontSize = "0.85rem";
    arrowDiv.style.border = "1.5px solid #38bdf8";
    arrowDiv.style.boxShadow = "0 4px 15px rgba(0,0,0,0.6)";
    arrowDiv.style.pointerEvents = "none";
    arrowDiv.innerText = arrow.text;

    if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
      new google.maps.marker.AdvancedMarkerElement({
        map,
        position: { lat: arrow.lat, lng: arrow.lng },
        title: arrow.text,
        content: arrowDiv
      });
    }
  });
}

function renderMarkers() {
  clearMarkers();

  const showInduction = document.getElementById("filter-induction")?.checked ?? true;
  const showAuracast  = document.getElementById("filter-auracast")?.checked ?? true;
  const showQuiet     = document.getElementById("filter-quiet")?.checked ?? true;
  const selectedPostcode = document.getElementById("filter-postcode")?.value || "ALL";

  // Dynamic Postcode Area Highlighting
  Object.keys(polygonObjects).forEach((code) => {
    const poly = polygonObjects[code];
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

  venues.forEach((v) => {
    if (v.type === "induction" && !showInduction) return;
    if (v.type === "auracast"  && !showAuracast)  return;
    if (v.type === "quiet"     && !showQuiet)     return;
    if (selectedPostcode !== "ALL" && v.postcode !== selectedPostcode) return;

    const pinBg = v.accentColor || (v.type === "auracast" ? "#ff0f5b" : (v.type === "quiet" ? "#1b5e20" : "#0097A7"));

    // EXTRA LARGE ROUND VENUE PIN (56px x 56px WITH HUGE CRISP EMOJI ICON)
    const pinElement = document.createElement("div");
    pinElement.className = "round-icon-marker";
    pinElement.style.backgroundColor = pinBg;
    pinElement.style.boxShadow = v.goldStandard 
      ? "0 0 20px rgba(255, 215, 0, 0.95), 0 6px 18px rgba(0,0,0,0.6)" 
      : "0 6px 16px rgba(0,0,0,0.5)";
    pinElement.style.border = v.goldStandard ? "4px solid #FFD700" : "3px solid #ffffff";

    // Pin HTML: Extra large emoji inside circle + hover title tooltip
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
      // Fallback SVG circle marker with SVG text emoji
      const pinSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56"><circle cx="28" cy="28" r="24" fill="${encodeURIComponent(pinBg)}" stroke="${v.goldStandard ? '%23FFD700' : '%23ffffff'}" stroke-width="${v.goldStandard ? '4' : '3'}"/><text x="28" y="36" font-size="28" text-anchor="middle">${encodeURIComponent(v.icon)}</text></svg>`;
      marker = new google.maps.Marker({
        map,
        position: { lat: v.lat, lng: v.lng },
        title: `${v.name} (${v.postcode})`,
        icon: {
          url: pinSvg,
          scaledSize: new google.maps.Size(56, 56)
        }
      });
    }

    const goldBadgeHtml = v.goldStandard 
      ? `<div style="background: rgba(255, 248, 225, 0.15); color: #ffd700; font-size: 0.725rem; font-weight: 800; padding: 4px 10px; border-radius: 10px; display: inline-flex; align-items: center; gap: 4px; margin-bottom: 8px; border: 1.5px solid #FFD700;">Gold Standard Certified</div>` 
      : '';
    
    const venueCardLink = `path-accessible-venues.html#venue-${v.id}`;
    const mainPhoto = v.photos?.main || "Contents/Map/watershed-main.png";
    const thumb2 = v.photos?.thumb2 || "Contents/Map/watershed-2.png";
    const thumb3 = v.photos?.thumb3 || "Contents/Map/watershed-3.png";

    // CLEAN SIMPLE POPUP LINKED DIRECTLY TO GOOGLE MAPS & VENUE CARD
    const contentString = `
      <div class="dark-popup" style="border-left: 5px solid ${pinBg};">
        ${goldBadgeHtml}
        <h3>${v.name}</h3>
        <p class="rating">⭐ ${v.rating} (${v.reviews} reviews) • ${v.categoryText} • <strong>${v.postcode}</strong></p>
        
        <div class="photo-grid">
          <img src="${mainPhoto}" alt="${v.name}" class="photo-main" />
          <img src="${thumb2}" alt="${v.name} photo 2" />
          <img src="${thumb3}" alt="${v.name} photo 3" />
        </div>

        <p style="font-size: 0.85rem; color: #bdc1c6; margin-bottom: 10px;">📍 ${v.address}</p>

        <div class="popup-buttons">
          <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v.name + ' ' + v.address)}" target="_blank" rel="noopener" class="open-map-btn" style="background-color: ${pinBg}; color: white; border: none; font-weight: 700;">
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