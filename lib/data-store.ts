'use client'

import {
  UserProfile,
  EnergyReading,
  BillAnalysisResult,
  Mission,
  MissionSubmission,
  Community,
  RewardItem,
  Badge,
  PointsLedgerEntry,
  SolarAssessment,
  LearnArticle,
  NotificationItem,
  DistrictImpact,
  AdminCampaign,
  AdminAuditLog,
} from './types'
import { calculateCarbonFootprint } from './footprint-calc'
import { estimateGujaratBill } from './energy-calc'

const STORAGE_KEY_PREFIX = 'life_gujarat_'

const DEFAULT_USER: UserProfile = {
  id: 'usr_aditi_01',
  name: 'Aditi Shah',
  email: 'aditi.shah@ahmedabad.life',
  role: 'citizen',
  district: 'Ahmedabad',
  discom: 'UGVCL',
  consumerNumber: '02148/99120',
  householdMembers: 4,
  homeType: 'apartment',
  points: 420,
  streakDays: 6,
  joinedDate: '2026-04-12',
  language: 'en',
  avatarInitials: 'AS',
}

const DEFAULT_ADMIN: UserProfile = {
  id: 'usr_bhavin_admin',
  name: 'Bhavin Patel',
  email: 'bhavin.patel@gujarat.gov.in',
  role: 'admin',
  district: 'Gandhinagar',
  discom: 'UGVCL',
  consumerNumber: '01001/00021',
  householdMembers: 3,
  homeType: 'individual_bungalow',
  points: 1250,
  streakDays: 45,
  joinedDate: '2025-10-01',
  language: 'en',
  avatarInitials: 'BP',
}

const SEED_READINGS: EnergyReading[] = [
  {
    id: 'rd_2026_10',
    userId: 'usr_aditi_01',
    startDate: '2026-09-15',
    endDate: '2026-10-15',
    consumptionKwh: 260,
    billAmount: 1820,
    source: 'bill_scan',
    notes: 'Post-monsoon moderate use, minimal AC usage.',
    status: 'verified',
    createdAt: '2026-10-16T10:00:00Z',
  },
  {
    id: 'rd_2026_09',
    userId: 'usr_aditi_01',
    startDate: '2026-08-15',
    endDate: '2026-09-15',
    consumptionKwh: 285,
    billAmount: 2040,
    source: 'manual',
    notes: 'Ceiling fans and humid cooling.',
    status: 'verified',
    createdAt: '2026-09-16T11:30:00Z',
  },
  {
    id: 'rd_2026_08',
    userId: 'usr_aditi_01',
    startDate: '2026-07-15',
    endDate: '2026-08-15',
    consumptionKwh: 310,
    billAmount: 2260,
    source: 'discom_sync',
    notes: 'Monsoon season cooling.',
    status: 'verified',
    createdAt: '2026-08-16T09:15:00Z',
  },
  {
    id: 'rd_2026_07',
    userId: 'usr_aditi_01',
    startDate: '2026-06-15',
    endDate: '2026-07-15',
    consumptionKwh: 345,
    billAmount: 2580,
    source: 'bill_scan',
    notes: 'High summer heat AC operation at 24C.',
    status: 'verified',
    createdAt: '2026-07-16T14:20:00Z',
  },
  {
    id: 'rd_2026_06',
    userId: 'usr_aditi_01',
    startDate: '2026-05-15',
    endDate: '2026-06-15',
    consumptionKwh: 390,
    billAmount: 3010,
    source: 'bill_scan',
    notes: 'Peak Ahmedabad summer.',
    status: 'verified',
    createdAt: '2026-06-16T10:00:00Z',
  },
  {
    id: 'rd_2026_05',
    userId: 'usr_aditi_01',
    startDate: '2026-04-15',
    endDate: '2026-05-15',
    consumptionKwh: 330,
    billAmount: 2450,
    source: 'manual',
    notes: 'Initial baseline reading.',
    status: 'verified',
    createdAt: '2026-05-16T16:00:00Z',
  },
]

const SEED_MISSIONS: Mission[] = [
  {
    id: 'm_ac_24',
    title: 'Set Air Conditioner to 24°C Standard',
    titleGu: 'એર કન્ડીશનરને ૨૪°C તાપમાન પર સેટ કરો',
    description: 'Every 1°C increase in AC set-temperature saves approx 6% electricity in Gujarat’s climate.',
    descriptionGu: 'તાપમાનમાં દરેક ૧°C નો વધારો અંદાજે ૬% વીજળી બચાવે છે.',
    category: 'Energy',
    difficulty: 'Easy',
    duration: '2 min',
    points: 25,
    estimatedCo2ReductionKg: 1.8,
    verificationLevel: 'Photo Evidence',
    instructions: [
      'Locate your AC remote control.',
      'Adjust the thermostat set-point to 24°C or higher.',
      'Run ceiling fans on medium speed alongside AC for optimal air circulation.',
      'Upload a quick snapshot of the remote display.',
    ],
    whyItMatters:
      'Bureau of Energy Efficiency (BEE) research shows 24°C is the optimal thermal comfort zone for human bodies while slashing cooling loads drastically.',
    officialGuidanceUrl: 'https://beeindia.gov.in',
    featured: true,
  },
  {
    id: 'm_vampire_standby',
    title: 'Switch off Avoidable Vampire Standby Power',
    titleGu: 'સ્ટેન્ડબાય પાવર સ્વિચ ઓફ કરો',
    description: 'Eliminate phantom power drawn by microwave clocks, television boxes, and idle chargers.',
    descriptionGu: 'ટીવી સેટઅપ બોક્સ, માઇક્રોવેવ અને ચાર્જરના અનિચ્છનીય સ્ટેન્ડબાય વપરાશને અટકાવો.',
    category: 'Energy',
    difficulty: 'Easy',
    duration: '5 min',
    points: 20,
    estimatedCo2ReductionKg: 0.9,
    verificationLevel: 'Self-Declaration',
    instructions: [
      'Do a 5-minute walk-through of your home.',
      'Turn off switches at plug points for TVs, set-top boxes, and microwave displays when not in use.',
      'Unplug laptop and phone adapters once devices are charged.',
    ],
    whyItMatters:
      'Vampire power silently consumes up to 8–10% of standard household electricity without providing active service.',
    featured: true,
  },
  {
    id: 'm_clean_filter',
    title: 'Inspect & Clean AC & Fan Dust Filters',
    titleGu: 'એસી અને પંખાની જાળી સાફ કરો',
    description: 'Clogged dust mesh reduces airflow and forces cooling compressors to work 15% harder.',
    descriptionGu: 'ધૂળથી ભરાયેલી જાળી સાફ કરવાથી પંખા અને એસીની કાર્યક્ષમતા વધે છે.',
    category: 'Energy',
    difficulty: 'Medium',
    duration: '15 min',
    points: 35,
    estimatedCo2ReductionKg: 2.5,
    verificationLevel: 'Photo Evidence',
    instructions: [
      'Switch off power to the indoor air conditioner unit.',
      'Carefully unclip the front grill and slide out mesh filters.',
      'Wash gently with lukewarm water, allow to air dry completely, and reinstall.',
    ],
    whyItMatters:
      'Clean filters maintain high heat transfer efficiency and significantly improve indoor air quality.',
    featured: true,
  },
  {
    id: 'm_lighting_audit',
    title: 'Audit Lighting & Switch to 5-Star LEDs',
    titleGu: 'ઘરની લાઇટ્સનું ઓડિટ કરી LED અપનાવો',
    description: 'Replace incandescent or CFL bulbs with energy-efficient 9W/12W LED fixtures.',
    descriptionGu: 'જૂના બલ્બ બદલીને ૫-સ્ટાર એલઇડી બલ્બ લગાવો.',
    category: 'Energy',
    difficulty: 'Medium',
    duration: '30 min',
    points: 40,
    estimatedCo2ReductionKg: 3.2,
    verificationLevel: 'Photo Evidence',
    instructions: [
      'Count the number of bulbs across your living room, kitchen, and balconies.',
      'Verify that all high-use fixtures use BEE 5-Star rated LED lights.',
      'Dust exterior light covers to maximize lumen output.',
    ],
    whyItMatters:
      'LED lighting consumes up to 80% less power than traditional bulbs and produces substantially less ambient heat.',
  },
  {
    id: 'm_tap_leak',
    title: 'Audit & Fix Dripping Faucets & Taps',
    titleGu: 'ટપકતા નળનું ઓડિટ અને સમારકામ',
    description: 'A single dripping tap wastes more than 3,000 litres of clean potable water every month.',
    descriptionGu: 'એક ટપકતો નળ દર મહિને ૩૦૦૦ લીટરથી વધુ પાણીનો બગાડ કરે છે.',
    category: 'Water',
    difficulty: 'Medium',
    duration: '20 min',
    points: 30,
    estimatedCo2ReductionKg: 1.1,
    verificationLevel: 'Self-Declaration',
    instructions: [
      'Check kitchen sinks, bathroom washbasins, and outdoor garden taps.',
      'Replace worn-out rubber washers or tighten valve stems.',
      'Install aerators on high-flow kitchen taps.',
    ],
    whyItMatters:
      'In Gujarat, pumping municipal water involves intensive electricity consumption in civic pumping stations.',
  },
  {
    id: 'm_waste_segregation',
    title: 'Segregate Wet Organic & Dry Recyclable Waste',
    titleGu: 'ભીનો અને સૂકો કચરો અલગ કરો',
    description: 'Practice source segregation so organic waste can be converted into rich compost.',
    descriptionGu: 'રસોડાનો કચરો અને સૂકો પ્લાસ્ટિક કચરો અલગ રાખી નિકાલ કરો.',
    category: 'Waste',
    difficulty: 'Easy',
    duration: '10 min',
    points: 25,
    estimatedCo2ReductionKg: 1.5,
    verificationLevel: 'Photo Evidence',
    instructions: [
      'Set up two distinct bins: Green for organic peels/scraps, Blue for clean dry recyclables.',
      'Hand over segregated waste to your local municipal collection vehicle.',
    ],
    whyItMatters:
      'Prevents unsegregated biodegradable matter from rotting anaerobically in open landfills and producing potent methane gas.',
  },
  {
    id: 'm_metro_transit',
    title: 'Ride Ahmedabad / Surat Metro or BRTS',
    titleGu: 'મેટ્રો અથવા બીઆરટીએસ પબ્લિક ટ્રાન્સપોર્ટનો ઉપયોગ',
    description: 'Opt for mass rapid transit instead of solo petrol two-wheeler or four-wheeler commute.',
    descriptionGu: 'અંગત વાહનને બદલે જાહેર પરિવહન પસંદ કરો.',
    category: 'Transport',
    difficulty: 'Medium',
    duration: '45 min',
    points: 45,
    estimatedCo2ReductionKg: 4.2,
    verificationLevel: 'Photo Evidence',
    instructions: [
      'Plan a journey using Ahmedabad Metro, Surat BRTS, or local electric bus routes.',
      'Take a photo of your smart travel card or metro token.',
    ],
    whyItMatters:
      'Urban public transit drastically reduces road congestion, local PM2.5 emissions, and fossil fuel consumption.',
  },
  {
    id: 'm_local_produce',
    title: 'Source Seasonal & Local Gujarat Produce',
    titleGu: 'સ્થાનિક અને મોસમી શાકભાજીની ખરીદી',
    description: 'Buy regional fruits and vegetables from farmers markets to cut food transport miles.',
    descriptionGu: 'સ્થાનિક ખેડૂતો પાસેથી સીધી મોસમી શાકભાજી ખરીદો.',
    category: 'Food',
    difficulty: 'Easy',
    duration: '20 min',
    points: 20,
    estimatedCo2ReductionKg: 1.4,
    verificationLevel: 'Self-Declaration',
    instructions: [
      'Choose vegetables grown in nearby Gujarat agricultural districts (e.g. Anand, Kheda, Mehsana).',
      'Carry your own reusable cloth bag to avoid single-use polythene bags.',
    ],
    whyItMatters:
      'Minimizes cold chain storage fuel and long-distance interstate freight emissions.',
  },
]

const SEED_COMMUNITIES: Community[] = [
  {
    id: 'comm_shantigram',
    name: 'Shantigram Green Haven RWA',
    type: 'Residential Society',
    district: 'Ahmedabad',
    membersCount: 148,
    totalKwhSaved: 14200,
    totalPoints: 48900,
    activeChallenge: 'Pre-Diwali Common Lighting LED Shift',
    description: 'Active residential community committed to zero-waste segregation and corridor solar net-metering.',
    isJoined: true,
  },
  {
    id: 'comm_vesu',
    name: 'Vesu Eco-Neighborhood Ward 21',
    type: 'Ward/Taluka',
    district: 'Surat',
    membersCount: 236,
    totalKwhSaved: 21500,
    totalPoints: 67300,
    activeChallenge: 'Surat Solar Rooftop 100 kW Collective',
    description: 'Civic group collaborating with Surat Municipal Corporation on neighborhood energy conservation.',
    isJoined: false,
  },
  {
    id: 'comm_alkapuri',
    name: 'Alkapuri Sustainability Collective',
    type: 'Residential Society',
    district: 'Vadodara',
    membersCount: 92,
    totalKwhSaved: 8400,
    totalPoints: 28400,
    activeChallenge: 'Home Energy Audit Month',
    description: 'Neighborhood collective sharing energy tips, BLDC fan conversions, and rainwater harvesting.',
    isJoined: false,
  },
  {
    id: 'comm_nirma',
    name: 'Nirma University LiFE Youth Chapter',
    type: 'College/School',
    district: 'Ahmedabad',
    membersCount: 540,
    totalKwhSaved: 36800,
    totalPoints: 118400,
    activeChallenge: 'Campus Clean Mobility & Cycling Week',
    description: 'Student-led Mission LiFE club championing clean mobility, hostel energy audits, and e-waste drives.',
    isJoined: false,
  },
]

const SEED_REWARDS: RewardItem[] = [
  {
    id: 'rw_discom_rebate',
    title: '₹150 Electricity Bill Rebate Coupon',
    description: 'Direct adjustment coupon valid for your next UGVCL/DGVCL/MGVCL/PGVCL residential electricity bill.',
    costPoints: 500,
    category: 'Discount',
    partner: 'Gujarat Urja Vikas Nigam Ltd (GUVNL)',
    isAvailable: true,
    stockRemaining: 45,
  },
  {
    id: 'rw_led_kit',
    title: 'BEE 5-Star 9W LED Bulbs (3-Pack)',
    description: 'High-lumen, flicker-free energy saving LED pack delivered to your registered doorstep.',
    costPoints: 350,
    category: 'Eco-Kit',
    partner: 'EESL India',
    isAvailable: true,
    stockRemaining: 80,
  },
  {
    id: 'rw_tree_sapling',
    title: 'Gujarat Social Forestry Native Tree Sapling',
    description: 'Redeemable voucher at any government social forestry nursery across Gujarat for Neem, Peepal, or Gulmohar.',
    costPoints: 200,
    category: 'Tree Planting',
    partner: 'Gujarat State Forest Department',
    isAvailable: true,
    stockRemaining: 150,
  },
  {
    id: 'rw_life_cert',
    title: 'Certified LiFE Gujarat Green Citizen E-Certificate',
    description: 'Government of Gujarat co-branded verifiable digital certificate of recognition.',
    costPoints: 100,
    category: 'Certificate',
    partner: 'Climate Change Dept, Govt of Gujarat',
    isAvailable: true,
    stockRemaining: 999,
  },
]

const SEED_BADGES: Badge[] = [
  {
    id: 'bdg_first_step',
    title: 'First Step',
    description: 'Completed your very first Mission LiFE action.',
    iconName: 'Footprints',
    isUnlocked: true,
    unlockedAt: '2026-04-15',
  },
  {
    id: 'bdg_grid_master',
    title: 'Grid Master',
    description: 'Tracked over 1,500 kWh of electricity with consistent monthly readings.',
    iconName: 'Zap',
    isUnlocked: true,
    unlockedAt: '2026-08-16',
  },
  {
    id: 'bdg_streak_star',
    title: 'Weekly Champion',
    description: 'Maintained a 6-day continuous streak of sustainable actions.',
    iconName: 'Flame',
    isUnlocked: true,
    unlockedAt: '2026-10-27',
  },
  {
    id: 'bdg_solar_pioneer',
    title: 'Solar Pioneer',
    description: 'Completed a rooftop solar feasibility evaluation for your home.',
    iconName: 'Sun',
    isUnlocked: false,
  },
  {
    id: 'bdg_community_builder',
    title: 'Community Builder',
    description: 'Joined a neighborhood LiFE society challenge.',
    iconName: 'Users',
    isUnlocked: true,
    unlockedAt: '2026-09-02',
  },
]

const SEED_POINTS_LEDGER: PointsLedgerEntry[] = [
  {
    id: 'pledg_01',
    userId: 'usr_aditi_01',
    points: 25,
    type: 'earned',
    source: 'Mission: Set Air Conditioner to 24°C Standard',
    date: '2026-10-28',
  },
  {
    id: 'pledg_02',
    userId: 'usr_aditi_01',
    points: 20,
    type: 'earned',
    source: 'Mission: Switch off Avoidable Vampire Standby Power',
    date: '2026-10-27',
  },
  {
    id: 'pledg_03',
    userId: 'usr_aditi_01',
    points: 50,
    type: 'earned',
    source: 'Monthly Reading Verified (260 kWh)',
    date: '2026-10-16',
  },
  {
    id: 'pledg_04',
    userId: 'usr_aditi_01',
    points: 35,
    type: 'earned',
    source: 'Mission: Inspect & Clean AC Air Filters',
    date: '2026-10-10',
  },
  {
    id: 'pledg_05',
    userId: 'usr_aditi_01',
    points: 100,
    type: 'bonus',
    source: 'Onboarding & Baseline Pledge Completed',
    date: '2026-04-12',
  },
]

const SEED_ARTICLES: LearnArticle[] = [
  {
    slug: 'bldc-ceiling-fans-gujarat',
    title: 'BLDC Ceiling Fans: The 65% Electricity Saver for Gujarat Homes',
    titleGu: 'BLDC પંખા: ૬૫% વીજળીની બચત કરતા આધુનિક પંખા',
    category: 'Energy Efficiency',
    readTime: '4 min',
    summary: 'Why upgrading conventional 75W induction ceiling fans to 28W brushless DC fans saves up to ₹1,800 per fan annually in Gujarat.',
    lastReviewed: '2026-09-20',
    author: 'Bureau of Energy Efficiency & LiFE Directorate',
    keyTakeaways: [
      'Conventional induction ceiling fans consume 70W–80W, whereas BLDC fans consume just 28W at top speed.',
      'No humming noise and runs 3x longer on home inverters during power fluctuations.',
      'Simple payback period of under 14–18 months in warm climates with high daily operating hours.',
    ],
    contentSections: [
      {
        heading: 'How Brushless DC (BLDC) Motor Technology Operates',
        body: 'Unlike conventional AC motors that use mechanical copper coils and carbon brushes subject to frictional heat, BLDC motors utilize permanent magnets and electronic commutators. This reduces thermal losses dramatically, operating efficiently at only 28–32 Watts while delivering the same 220 CMM air volume.',
      },
      {
        heading: 'Economics for a Gujarat Household with 4 Fans',
        body: 'In Gujarat, fans run an average of 14 hours daily from March through October. 4 traditional fans consume roughly 4.2 kWh daily. Switching to BLDC drops this to 1.56 kWh daily, saving over 600 kWh and ~₹4,000 every cooling season.',
      },
    ],
    actionChecklist: [
      'Check existing fan wattage labels on older ceiling fixtures.',
      'Prioritize replacing fans in bedrooms and living halls where daily runtime exceeds 10 hours.',
      'Choose BEE 5-Star rated BLDC models with RF remote controls.',
    ],
    relatedMissionIds: ['m_lighting_audit', 'm_vampire_standby'],
    officialResources: [
      { name: 'National Energy Efficiency Fan Scheme (EESL)', url: 'https://eeslindia.org' },
      { name: 'GERC Consumer Awareness Guidelines', url: 'https://gercin.org' },
    ],
  },
  {
    slug: 'pm-surya-ghar-gujarat-guide',
    title: 'PM Surya Ghar Muft Bijli Yojana: Step-by-Step Citizen Guide',
    titleGu: 'પીએમ સૂર્ય ઘર મુક્ત વીજળી યોજના: માર્ગદર્શિકા',
    category: 'Rooftop Solar',
    readTime: '6 min',
    summary: 'How Gujarat residential homeowners can apply for up to ₹78,000 in direct central subsidy and generate up to 300 units of free power each month.',
    lastReviewed: '2026-10-05',
    author: 'Ministry of New & Renewable Energy & GEDA',
    keyTakeaways: [
      'Direct Benefit Transfer (DBT) subsidy of ₹30,000 for 1 kW, ₹60,000 for 2 kW, and ₹78,000 for 3 kW systems.',
      'Net metering agreement with your regional Discom (UGVCL/DGVCL/MGVCL/PGVCL/Torrent Power).',
      'Requires approx 100 sq ft shadow-free rooftop per kilowatt capacity.',
    ],
    contentSections: [
      {
        heading: 'Eligibility Criteria & Discom Integration',
        body: 'Any individual homeowner with an active residential power connection in Gujarat can apply via the National Solar Portal. Discom engineers conduct feasibility checks and install bi-directional net meters upon system commissioning.',
      },
      {
        heading: 'System Lifespan & Financial Return',
        body: 'Modern mono-crystalline panels come with a 25-year output warranty (at least 80% generation guaranteed at year 25). For an investment of ~₹85,000 net after subsidy on a 3kW system, annual bill savings in Gujarat exceed ₹25,000, yielding a payback within 3.5 years.',
      },
    ],
    actionChecklist: [
      'Calculate your 12-month average electricity consumption from past bills.',
      'Inspect roof area for shadows from water tanks or neighboring trees.',
      'Submit consumer number and Aadhaar on pmsuryaghar.gov.in portal.',
    ],
    relatedMissionIds: ['m_ac_24', 'm_clean_filter'],
    officialResources: [
      { name: 'PM Surya Ghar National Portal', url: 'https://pmsuryaghar.gov.in' },
      { name: 'Gujarat Energy Development Agency (GEDA)', url: 'https://geda.gujarat.gov.in' },
    ],
  },
  {
    slug: 'ac-efficiency-gujarat-summers',
    title: 'The 24°C Comfort Standard: Summer AC Guide',
    titleGu: 'ઉનાળામાં એસી કાર્યક્ષમતા અને ૨૪°C નો નિયમ',
    category: 'Energy Efficiency',
    readTime: '5 min',
    summary: 'Scientific rationale for running split air conditioners at 24°C paired with ceiling fans in Western India.',
    lastReviewed: '2026-08-14',
    author: 'LiFE Thermal Comfort Cell',
    keyTakeaways: [
      'Setting thermostat at 18°C does NOT cool a room faster; it only keeps the compressor running continuously.',
      'Pairing a 24°C AC with a ceiling fan on low speed provides equivalent perceived cooling of 21°C due to gentle wind chill.',
      'Reduces peak grid strain during Gujarat’s demanding afternoon hours.',
    ],
    contentSections: [
      {
        heading: 'Thermodynamics of Room Cooling',
        body: 'Compressors run at maximum tonnage regardless of set-point until target temperature is met. Setting 18°C merely prevents the compressor from cycling down, raising monthly bills by 36% compared to 24°C.',
      },
    ],
    actionChecklist: [
      'Set default AC temperature on remote to 24°C.',
      'Ensure curtains or solar blinds are drawn over west-facing windows during peak afternoon sun.',
    ],
    relatedMissionIds: ['m_ac_24', 'm_clean_filter'],
    officialResources: [
      { name: 'BEE AC Star Label Program', url: 'https://beeindia.gov.in' },
    ],
  },
]

const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_01',
    userId: 'usr_aditi_01',
    title: 'Mission Approved: 24°C AC Standard',
    message: 'Your photo submission was verified by the LiFE review team. +25 points credited to your ledger!',
    type: 'mission',
    link: '/rewards',
    isRead: false,
    createdAt: '2026-10-28T14:30:00Z',
  },
  {
    id: 'notif_02',
    userId: 'usr_aditi_01',
    title: 'Monthly Energy Bill Analysis Ready',
    message: 'Your October electricity consumption was 260 kWh (down 8.8% from September). Great work!',
    type: 'energy',
    link: '/energy',
    isRead: false,
    createdAt: '2026-10-26T09:00:00Z',
  },
  {
    id: 'notif_03',
    userId: 'usr_aditi_01',
    title: 'New Community Challenge in Shantigram',
    message: 'Your residential society has launched the Pre-Diwali Common Lighting LED Shift.',
    type: 'community',
    link: '/community',
    isRead: true,
    createdAt: '2026-10-20T11:00:00Z',
  },
  {
    id: 'notif_04',
    userId: 'usr_aditi_01',
    title: 'PM Surya Ghar Subsidy Enhanced',
    message: 'Check your eligibility for up to ₹78,000 rooftop solar subsidy in the Solar Advisor calculator.',
    type: 'system',
    link: '/solar-advisor',
    isRead: true,
    createdAt: '2026-10-15T08:00:00Z',
  },
]

const SEED_DISTRICTS: DistrictImpact[] = [
  { district: 'Ahmedabad', householdsEnrolled: 8420, verifiedMissionsCompleted: 38400, totalKwhSaved: 482000, totalCo2AvoidedTonnes: 345.1, rooftopSolarInstalledKw: 4200, primaryDiscom: 'UGVCL / Torrent' },
  { district: 'Surat', householdsEnrolled: 7190, verifiedMissionsCompleted: 32600, totalKwhSaved: 412000, totalCo2AvoidedTonnes: 295.0, rooftopSolarInstalledKw: 3850, primaryDiscom: 'DGVCL / Torrent' },
  { district: 'Vadodara', householdsEnrolled: 4890, verifiedMissionsCompleted: 21400, totalKwhSaved: 278000, totalCo2AvoidedTonnes: 199.0, rooftopSolarInstalledKw: 2400, primaryDiscom: 'MGVCL' },
  { district: 'Rajkot', householdsEnrolled: 4320, verifiedMissionsCompleted: 19800, totalKwhSaved: 254000, totalCo2AvoidedTonnes: 181.9, rooftopSolarInstalledKw: 2150, primaryDiscom: 'PGVCL' },
  { district: 'Gandhinagar', householdsEnrolled: 3150, verifiedMissionsCompleted: 15900, totalKwhSaved: 198000, totalCo2AvoidedTonnes: 141.8, rooftopSolarInstalledKw: 1800, primaryDiscom: 'UGVCL' },
  { district: 'Bhavnagar', householdsEnrolled: 2420, verifiedMissionsCompleted: 11200, totalKwhSaved: 142000, totalCo2AvoidedTonnes: 101.7, rooftopSolarInstalledKw: 1100, primaryDiscom: 'PGVCL' },
  { district: 'Jamnagar', householdsEnrolled: 2180, verifiedMissionsCompleted: 9800, totalKwhSaved: 126000, totalCo2AvoidedTonnes: 90.2, rooftopSolarInstalledKw: 950, primaryDiscom: 'PGVCL' },
  { district: 'Junagadh', householdsEnrolled: 1890, verifiedMissionsCompleted: 8400, totalKwhSaved: 108000, totalCo2AvoidedTonnes: 77.3, rooftopSolarInstalledKw: 820, primaryDiscom: 'PGVCL' },
  { district: 'Kutch', householdsEnrolled: 2310, verifiedMissionsCompleted: 10400, totalKwhSaved: 139000, totalCo2AvoidedTonnes: 99.5, rooftopSolarInstalledKw: 1450, primaryDiscom: 'PGVCL' },
  { district: 'Anand', householdsEnrolled: 1950, verifiedMissionsCompleted: 8900, totalKwhSaved: 114000, totalCo2AvoidedTonnes: 81.6, rooftopSolarInstalledKw: 890, primaryDiscom: 'MGVCL' },
  { district: 'Mehsana', householdsEnrolled: 1820, verifiedMissionsCompleted: 8200, totalKwhSaved: 105000, totalCo2AvoidedTonnes: 75.2, rooftopSolarInstalledKw: 810, primaryDiscom: 'UGVCL' },
  { district: 'Bharuch', householdsEnrolled: 1640, verifiedMissionsCompleted: 7500, totalKwhSaved: 98000, totalCo2AvoidedTonnes: 70.2, rooftopSolarInstalledKw: 760, primaryDiscom: 'DGVCL' },
  { district: 'Navsari', householdsEnrolled: 1320, verifiedMissionsCompleted: 6100, totalKwhSaved: 79000, totalCo2AvoidedTonnes: 56.6, rooftopSolarInstalledKw: 620, primaryDiscom: 'DGVCL' },
  { district: 'Valsad', householdsEnrolled: 1290, verifiedMissionsCompleted: 5800, totalKwhSaved: 74000, totalCo2AvoidedTonnes: 53.0, rooftopSolarInstalledKw: 580, primaryDiscom: 'DGVCL' },
  { district: 'Panchmahal', householdsEnrolled: 980, verifiedMissionsCompleted: 4300, totalKwhSaved: 56000, totalCo2AvoidedTonnes: 40.1, rooftopSolarInstalledKw: 410, primaryDiscom: 'MGVCL' },
  { district: 'Patan', householdsEnrolled: 890, verifiedMissionsCompleted: 3900, totalKwhSaved: 51000, totalCo2AvoidedTonnes: 36.5, rooftopSolarInstalledKw: 480, primaryDiscom: 'UGVCL' },
  { district: 'Banaskantha', householdsEnrolled: 1150, verifiedMissionsCompleted: 5200, totalKwhSaved: 68000, totalCo2AvoidedTonnes: 48.7, rooftopSolarInstalledKw: 690, primaryDiscom: 'UGVCL' },
  { district: 'Surendranagar', householdsEnrolled: 940, verifiedMissionsCompleted: 4100, totalKwhSaved: 54000, totalCo2AvoidedTonnes: 38.7, rooftopSolarInstalledKw: 490, primaryDiscom: 'PGVCL' },
  { district: 'Morbi', householdsEnrolled: 1120, verifiedMissionsCompleted: 4900, totalKwhSaved: 64000, totalCo2AvoidedTonnes: 45.8, rooftopSolarInstalledKw: 590, primaryDiscom: 'PGVCL' },
  { district: 'Amreli', householdsEnrolled: 870, verifiedMissionsCompleted: 3800, totalKwhSaved: 49000, totalCo2AvoidedTonnes: 35.1, rooftopSolarInstalledKw: 420, primaryDiscom: 'PGVCL' },
  { district: 'Porbandar', householdsEnrolled: 720, verifiedMissionsCompleted: 3200, totalKwhSaved: 41000, totalCo2AvoidedTonnes: 29.4, rooftopSolarInstalledKw: 360, primaryDiscom: 'PGVCL' },
  { district: 'Gir Somnath', householdsEnrolled: 810, verifiedMissionsCompleted: 3600, totalKwhSaved: 46000, totalCo2AvoidedTonnes: 32.9, rooftopSolarInstalledKw: 390, primaryDiscom: 'PGVCL' },
  { district: 'Devbhumi Dwarka', householdsEnrolled: 690, verifiedMissionsCompleted: 3050, totalKwhSaved: 39000, totalCo2AvoidedTonnes: 27.9, rooftopSolarInstalledKw: 340, primaryDiscom: 'PGVCL' },
  { district: 'Botad', householdsEnrolled: 620, verifiedMissionsCompleted: 2750, totalKwhSaved: 35000, totalCo2AvoidedTonnes: 25.1, rooftopSolarInstalledKw: 310, primaryDiscom: 'PGVCL' },
  { district: 'Sabarkantha', householdsEnrolled: 890, verifiedMissionsCompleted: 3900, totalKwhSaved: 51000, totalCo2AvoidedTonnes: 36.5, rooftopSolarInstalledKw: 430, primaryDiscom: 'UGVCL' },
  { district: 'Aravalli', householdsEnrolled: 710, verifiedMissionsCompleted: 3100, totalKwhSaved: 40000, totalCo2AvoidedTonnes: 28.6, rooftopSolarInstalledKw: 350, primaryDiscom: 'UGVCL' },
  { district: 'Mahisagar', householdsEnrolled: 640, verifiedMissionsCompleted: 2800, totalKwhSaved: 36000, totalCo2AvoidedTonnes: 25.8, rooftopSolarInstalledKw: 310, primaryDiscom: 'MGVCL' },
  { district: 'Dahod', householdsEnrolled: 820, verifiedMissionsCompleted: 3600, totalKwhSaved: 47000, totalCo2AvoidedTonnes: 33.7, rooftopSolarInstalledKw: 390, primaryDiscom: 'MGVCL' },
  { district: 'Chhota Udepur', householdsEnrolled: 540, verifiedMissionsCompleted: 2350, totalKwhSaved: 30000, totalCo2AvoidedTonnes: 21.5, rooftopSolarInstalledKw: 260, primaryDiscom: 'MGVCL' },
  { district: 'Narmada', householdsEnrolled: 590, verifiedMissionsCompleted: 2600, totalKwhSaved: 33000, totalCo2AvoidedTonnes: 23.6, rooftopSolarInstalledKw: 290, primaryDiscom: 'DGVCL' },
  { district: 'Tapi', householdsEnrolled: 630, verifiedMissionsCompleted: 2750, totalKwhSaved: 35000, totalCo2AvoidedTonnes: 25.1, rooftopSolarInstalledKw: 300, primaryDiscom: 'DGVCL' },
  { district: 'Dang', householdsEnrolled: 420, verifiedMissionsCompleted: 1850, totalKwhSaved: 23000, totalCo2AvoidedTonnes: 16.5, rooftopSolarInstalledKw: 210, primaryDiscom: 'DGVCL' },
]

const SEED_SUBMISSIONS: MissionSubmission[] = [
  {
    id: 'sub_001',
    missionId: 'm_ac_24',
    missionTitle: 'Set Air Conditioner to 24°C Standard',
    userId: 'usr_aditi_01',
    userName: 'Aditi Shah',
    userDistrict: 'Ahmedabad',
    submittedAt: '2026-10-28T09:15:00Z',
    evidenceText: 'Adjusted master bedroom split AC thermostat to 24°C and turned on ceiling fan on speed 3.',
    status: 'approved',
    pointsAwarded: 25,
    reviewedBy: 'Bhavin Patel',
    reviewedAt: '2026-10-28T14:30:00Z',
  },
  {
    id: 'sub_002',
    missionId: 'm_clean_filter',
    missionTitle: 'Inspect & Clean AC & Fan Dust Filters',
    userId: 'usr_chintan_02',
    userName: 'Chintan Mehta',
    userDistrict: 'Surat',
    submittedAt: '2026-10-28T11:45:00Z',
    evidenceText: 'Washed out twin nylon mesh filters from Daikin 1.5T inverter AC and air dried.',
    status: 'pending',
    pointsAwarded: 35,
  },
  {
    id: 'sub_003',
    missionId: 'm_waste_segregation',
    missionTitle: 'Segregate Wet Organic & Dry Recyclable Waste',
    userId: 'usr_pooja_03',
    userName: 'Pooja Trivedi',
    userDistrict: 'Vadodara',
    submittedAt: '2026-10-28T08:30:00Z',
    evidenceText: 'Dedicated green compost bucket set up beside kitchen counter for vegetable trimmings.',
    status: 'pending',
    pointsAwarded: 25,
  },
]

const SEED_CAMPAIGNS: AdminCampaign[] = [
  {
    id: 'cmp_01',
    title: 'Gujarat Summer 24°C Cooling Drive',
    targetDistrict: 'All 33 Districts',
    startDate: '2026-03-01',
    endDate: '2026-07-31',
    goalKwhReduction: 1000000,
    currentKwhReduction: 785000,
    enrolledCitizens: 28400,
    status: 'active',
  },
  {
    id: 'cmp_02',
    title: 'Surat Solar Rooftop 10,000 Homes Challenge',
    targetDistrict: 'Surat',
    startDate: '2026-06-01',
    endDate: '2026-12-31',
    goalKwhReduction: 500000,
    currentKwhReduction: 385000,
    enrolledCitizens: 9200,
    status: 'active',
  },
  {
    id: 'cmp_03',
    title: 'Mission LiFE Youth Campus Month',
    targetDistrict: 'Ahmedabad & Gandhinagar',
    startDate: '2026-11-01',
    endDate: '2026-11-30',
    goalKwhReduction: 250000,
    currentKwhReduction: 0,
    enrolledCitizens: 4500,
    status: 'upcoming',
  },
]

const SEED_AUDIT_LOGS: AdminAuditLog[] = [
  {
    id: 'aud_01',
    timestamp: '2026-10-28 14:30:12',
    actorName: 'Bhavin Patel',
    actorRole: 'Admin',
    action: 'Approved Mission Evidence',
    targetEntity: 'sub_001 (Aditi Shah)',
    details: 'Verified photo evidence for 24C AC standard. 25 points credited.',
  },
  {
    id: 'aud_02',
    timestamp: '2026-10-27 16:40:05',
    actorName: 'Bhavin Patel',
    actorRole: 'Admin',
    action: 'Updated Campaign Goal',
    targetEntity: 'cmp_01',
    details: 'Adjusted target goal to 1,000,000 kWh reduction based on district enrollment velocity.',
  },
  {
    id: 'aud_03',
    timestamp: '2026-10-25 11:15:22',
    actorName: 'System Service',
    actorRole: 'Automated Worker',
    action: 'Monthly CEA Grid Emission Baseline Sync',
    targetEntity: 'CEA Factor v19.0',
    details: 'Re-validated emission factor at 0.716 kg CO2/kWh as published by MoP.',
  },
]

function getStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const item = localStorage.getItem(STORAGE_KEY_PREFIX + key)
    return item ? (JSON.parse(item) as T) : fallback
  } catch {
    return fallback
  }
}

function setStored<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value))
  } catch {
    // ignore
  }
}

class DataStore {
  // Authentication & session management
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false
    return getStored<boolean>('auth_session', false)
  }

  login(userUpdate?: Partial<UserProfile>, role?: 'citizen' | 'admin'): UserProfile {
    const current = this.getUser()
    const baseUser = role === 'admin' ? DEFAULT_ADMIN : (current || DEFAULT_USER)
    const updated: UserProfile = {
      ...baseUser,
      ...(userUpdate || {}),
      role: role || userUpdate?.role || baseUser.role || 'citizen',
    }
    setStored('current_user', updated)
    setStored('auth_session', true)
    setStored('auth_token', 'life_token_' + Date.now())
    if (typeof document !== 'undefined') {
      document.cookie = 'life_session=1; path=/; max-age=86400; SameSite=Lax'
    }
    return updated
  }

  logout(): void {
    setStored('auth_session', false)
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY_PREFIX + 'auth_token')
      } catch {
        // ignore
      }
    }
    if (typeof document !== 'undefined') {
      document.cookie = 'life_session=; path=/; max-age=0; SameSite=Lax'
    }
  }

  // Current logged in user (swappable for testing citizen vs admin)
  getUser(): UserProfile {
    return getStored<UserProfile>('current_user', DEFAULT_USER)
  }

  setUser(user: UserProfile) {
    setStored('current_user', user)
  }

  switchRole(role: 'citizen' | 'admin'): UserProfile {
    const target = role === 'admin' ? DEFAULT_ADMIN : DEFAULT_USER
    setStored('current_user', target)
    setStored('auth_session', true)
    if (typeof document !== 'undefined') {
      document.cookie = 'life_session=1; path=/; max-age=86400; SameSite=Lax'
    }
    return target
  }

  // Energy readings
  getReadings(): EnergyReading[] {
    return getStored<EnergyReading[]>('readings', SEED_READINGS)
  }

  addReading(reading: Omit<EnergyReading, 'id' | 'createdAt'>): EnergyReading {
    const current = this.getReadings()
    const newEntry: EnergyReading = {
      ...reading,
      id: 'rd_' + Date.now(),
      createdAt: new Date().toISOString(),
    }
    const updated = [newEntry, ...current]
    setStored('readings', updated)

    // award points for entering reading
    this.addPoints(50, `Monthly reading submitted (${reading.consumptionKwh} kWh)`)
    this.addNotification({
      title: 'Energy Reading Added',
      message: `Logged ${reading.consumptionKwh} kWh for period ${reading.startDate} to ${reading.endDate}.`,
      type: 'energy',
      link: '/energy',
    })

    return newEntry
  }

  updateReading(id: string, updates: Partial<EnergyReading>): EnergyReading | null {
    const current = this.getReadings()
    const index = current.findIndex((r) => r.id === id)
    if (index === -1) return null

    current[index] = { ...current[index], ...updates }
    setStored('readings', [...current])
    return current[index]
  }

  deleteReading(id: string): boolean {
    const current = this.getReadings()
    const filtered = current.filter((r) => r.id !== id)
    setStored('readings', filtered)
    return true
  }

  // Bill analyses
  getBillAnalyses(): BillAnalysisResult[] {
    return getStored<BillAnalysisResult[]>('bill_analyses', [
      {
        id: 'bill_oct_2026',
        fileName: 'UGVCL_Bill_Oct2026.pdf',
        fileSize: 420000,
        uploadedAt: '2026-10-16T09:45:00Z',
        discom: 'UGVCL',
        consumerNumber: '02148/99120',
        billingPeriodStart: '2026-09-15',
        billingPeriodEnd: '2026-10-15',
        unitsKwh: 260,
        amountDue: 1820,
        meterReadingPrevious: 14820,
        meterReadingCurrent: 15080,
        status: 'confirmed',
        extractedFieldsConfidence: { kwh: 98, amount: 96, dates: 99 },
      },
    ])
  }

  addBillAnalysis(analysis: BillAnalysisResult) {
    const current = this.getBillAnalyses()
    const updated = [analysis, ...current]
    setStored('bill_analyses', updated)
  }

  // Missions
  getMissions(): Mission[] {
    return getStored<Mission[]>('missions', SEED_MISSIONS)
  }

  getMissionById(id: string): Mission | undefined {
    return this.getMissions().find((m) => m.id === id)
  }

  getSubmissions(): MissionSubmission[] {
    return getStored<MissionSubmission[]>('submissions', SEED_SUBMISSIONS)
  }

  getUserSubmissions(userId: string): MissionSubmission[] {
    return this.getSubmissions().filter((s) => s.userId === userId)
  }

  submitMissionEvidence(missionId: string, evidenceText: string): MissionSubmission {
    const mission = this.getMissionById(missionId)
    const user = this.getUser()
    if (!mission) throw new Error('Mission not found')

    const currentSubmissions = this.getSubmissions()
    // Duplicate check: already completed today or pending
    const existing = currentSubmissions.find(
      (s) => s.missionId === missionId && s.userId === user.id && (s.status === 'pending' || s.status === 'approved')
    )
    if (existing) {
      throw new Error('You have already submitted evidence for this mission.')
    }

    // Auto-approve if self-declaration, else pending admin review
    const isSelfDeclaration = mission.verificationLevel === 'Self-Declaration'
    const newSubmission: MissionSubmission = {
      id: 'sub_' + Date.now(),
      missionId,
      missionTitle: mission.title,
      userId: user.id,
      userName: user.name,
      userDistrict: user.district,
      submittedAt: new Date().toISOString(),
      evidenceText,
      status: isSelfDeclaration ? 'approved' : 'pending',
      pointsAwarded: mission.points,
      reviewedBy: isSelfDeclaration ? 'Automated Policy Check' : undefined,
      reviewedAt: isSelfDeclaration ? new Date().toISOString() : undefined,
    }

    const updated = [newSubmission, ...currentSubmissions]
    setStored('submissions', updated)

    if (isSelfDeclaration) {
      this.addPoints(mission.points, `Completed: ${mission.title}`)
      this.addNotification({
        title: 'Mission Completed!',
        message: `Self-declaration recorded for "${mission.title}". +${mission.points} points awarded!`,
        type: 'mission',
        link: '/rewards',
      })
    } else {
      this.addNotification({
        title: 'Evidence Submitted for Review',
        message: `Your evidence for "${mission.title}" has been submitted to the LiFE verification team.`,
        type: 'mission',
        link: '/missions',
      })
    }

    return newSubmission
  }

  // Admin Review
  reviewSubmission(submissionId: string, status: 'approved' | 'rejected', reviewerName: string, reason?: string) {
    const all = this.getSubmissions()
    const target = all.find((s) => s.id === submissionId)
    if (!target) return null

    target.status = status
    target.reviewedBy = reviewerName
    target.reviewedAt = new Date().toISOString()
    if (reason) target.rejectionReason = reason

    setStored('submissions', [...all])

    if (status === 'approved') {
      this.addPoints(target.pointsAwarded, `Mission approved: ${target.missionTitle}`)
    }

    this.addAuditLog({
      actorName: reviewerName,
      actorRole: 'Admin',
      action: status === 'approved' ? 'Approved Mission Evidence' : 'Rejected Mission Evidence',
      targetEntity: `${target.id} (${target.userName})`,
      details: reason ? `Reason: ${reason}` : `Awarded ${target.pointsAwarded} points.`,
    })

    return target
  }

  // Communities
  getCommunities(): Community[] {
    return getStored<Community[]>('communities', SEED_COMMUNITIES)
  }

  toggleCommunityJoin(id: string): boolean {
    const list = this.getCommunities()
    const comm = list.find((c) => c.id === id)
    if (!comm) return false
    comm.isJoined = !comm.isJoined
    if (comm.isJoined) {
      comm.membersCount += 1
      this.addNotification({
        title: 'Joined Community',
        message: `Welcome to ${comm.name}! Collaborate on challenges with your neighbors.`,
        type: 'community',
        link: `/community/${id}`,
      })
    } else {
      comm.membersCount = Math.max(1, comm.membersCount - 1)
    }
    setStored('communities', [...list])
    return comm.isJoined
  }

  createCommunity(newComm: Omit<Community, 'id' | 'membersCount' | 'totalKwhSaved' | 'totalPoints' | 'isJoined'>): Community {
    const list = this.getCommunities()
    const created: Community = {
      ...newComm,
      id: 'comm_' + Date.now(),
      membersCount: 1,
      totalKwhSaved: 0,
      totalPoints: 100,
      isJoined: true,
    }
    setStored('communities', [created, ...list])
    this.addNotification({
      title: 'Community Created',
      message: `Your new community "${created.name}" is now active in ${created.district}.`,
      type: 'community',
      link: `/community/${created.id}`,
    })
    return created
  }

  // Rewards & Points Ledger
  getRewards(): RewardItem[] {
    return getStored<RewardItem[]>('rewards', SEED_REWARDS)
  }

  getBadges(): Badge[] {
    return getStored<Badge[]>('badges', SEED_BADGES)
  }

  getPointsLedger(): PointsLedgerEntry[] {
    return getStored<PointsLedgerEntry[]>('points_ledger', SEED_POINTS_LEDGER)
  }

  addPoints(amount: number, source: string) {
    const user = this.getUser()
    user.points += amount
    this.setUser(user)

    const ledger = this.getPointsLedger()
    const entry: PointsLedgerEntry = {
      id: 'pledg_' + Date.now(),
      userId: user.id,
      points: amount,
      type: amount >= 0 ? 'earned' : 'redeemed',
      source,
      date: new Date().toISOString().split('T')[0],
    }
    setStored('points_ledger', [entry, ...ledger])
  }

  // Solar Assessments
  getSolarAssessments(): SolarAssessment[] {
    return getStored<SolarAssessment[]>('solar_assessments', [
      {
        id: 'sol_01',
        userId: 'usr_aditi_01',
        district: 'Ahmedabad',
        monthlyKwh: 310,
        roofAreaSqFt: 450,
        roofShadingPercent: 10,
        propertyType: 'apartment',
        recommendedCapacityKw: 3,
        annualGenerationKwh: 4350,
        annualSavingsInr: 26970,
        estimatedCostInr: 165000,
        estimatedSubsidyInr: 78000,
        netInvestmentInr: 87000,
        paybackYears: 3.2,
        createdAt: '2026-10-18T12:00:00Z',
      },
    ])
  }

  saveSolarAssessment(assessment: Omit<SolarAssessment, 'id' | 'createdAt'>): SolarAssessment {
    const list = this.getSolarAssessments()
    const newEntry: SolarAssessment = {
      ...assessment,
      id: 'sol_' + Date.now(),
      createdAt: new Date().toISOString(),
    }
    setStored('solar_assessments', [newEntry, ...list])
    this.addPoints(50, 'Completed Rooftop Solar Feasibility Assessment')

    // Unlock solar badge
    const badges = this.getBadges()
    const solarBadge = badges.find((b) => b.id === 'bdg_solar_pioneer')
    if (solarBadge && !solarBadge.isUnlocked) {
      solarBadge.isUnlocked = true
      solarBadge.unlockedAt = new Date().toISOString().split('T')[0]
      setStored('badges', [...badges])
    }

    this.addNotification({
      title: 'Solar Assessment Saved',
      message: `Your ${assessment.recommendedCapacityKw} kW rooftop scenario has been saved to your profile.`,
      type: 'energy',
      link: '/solar-advisor',
    })

    return newEntry
  }

  // Learn Articles
  getArticles(): LearnArticle[] {
    return getStored<LearnArticle[]>('articles', SEED_ARTICLES)
  }

  getArticleBySlug(slug: string): LearnArticle | undefined {
    return this.getArticles().find((a) => a.slug === slug)
  }

  // Notifications
  getNotifications(): NotificationItem[] {
    return getStored<NotificationItem[]>('notifications', SEED_NOTIFICATIONS)
  }

  addNotification(notif: Omit<NotificationItem, 'id' | 'userId' | 'isRead' | 'createdAt'>) {
    const user = this.getUser()
    const current = this.getNotifications()
    const created: NotificationItem = {
      ...notif,
      id: 'notif_' + Date.now(),
      userId: user.id,
      isRead: false,
      createdAt: new Date().toISOString(),
    }
    setStored('notifications', [created, ...current])
  }

  markNotificationRead(id: string) {
    const current = this.getNotifications()
    const target = current.find((n) => n.id === id)
    if (target) {
      target.isRead = true
      setStored('notifications', [...current])
    }
  }

  markAllNotificationsRead() {
    const current = this.getNotifications()
    current.forEach((n) => (n.isRead = true))
    setStored('notifications', [...current])
  }

  // District Impact
  getDistrictImpacts(): DistrictImpact[] {
    return getStored<DistrictImpact[]>('district_impacts', SEED_DISTRICTS)
  }

  // Admin Campaigns
  getAdminCampaigns(): AdminCampaign[] {
    return getStored<AdminCampaign[]>('admin_campaigns', SEED_CAMPAIGNS)
  }

  createCampaign(campaign: Omit<AdminCampaign, 'id' | 'currentKwhReduction' | 'enrolledCitizens'>): AdminCampaign {
    const list = this.getAdminCampaigns()
    const created: AdminCampaign = {
      ...campaign,
      id: 'cmp_' + Date.now(),
      currentKwhReduction: 0,
      enrolledCitizens: 1,
    }
    setStored('admin_campaigns', [created, ...list])
    this.addAuditLog({
      actorName: 'Bhavin Patel',
      actorRole: 'Admin',
      action: 'Created Campaign',
      targetEntity: created.title,
      details: `Target: ${created.goalKwhReduction} kWh reduction across ${created.targetDistrict}.`,
    })
    return created
  }

  // Admin Audit Logs
  getAuditLogs(): AdminAuditLog[] {
    return getStored<AdminAuditLog[]>('audit_logs', SEED_AUDIT_LOGS)
  }

  addAuditLog(entry: Omit<AdminAuditLog, 'id' | 'timestamp'>) {
    const current = this.getAuditLogs()
    const created: AdminAuditLog = {
      ...entry,
      id: 'aud_' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    }
    setStored('audit_logs', [created, ...current])
  }
}

export const dataStore = new DataStore()
