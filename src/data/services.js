/**
 * The 7 service categories HomeServe offers.
 * Each service has everything the Detail page needs: description,
 * price range, what's included, and a few local fallback reviews
 * (used if the DummyJSON review fetch fails).
 */

export const SERVICES = [
  {
    id: 'cleaning',
    name: 'Cleaning',
    emoji: '🧹',
    tagline: 'Sparkling homes, on your schedule',
    shortDescription: 'Deep, regular and move-out cleaning by vetted pros.',
    description:
      'From a quick weekly tidy to a full move-out deep clean, our cleaning pros bring their own supplies and a checklist you can approve before they start. Every visit is insured, background-checked, and guaranteed — if anything is missed, we come back free.',
    priceRange: '$80 – $150',
    avgPrice: 115,
    duration: '2 – 4 hours',
    included: [
      'All supplies and equipment included',
      'Kitchen, bathrooms, and floors',
      'Move-out / move-in deep clean option',
      'Reusable cleaning checklist',
      'Insured & background-checked pros',
      'Satisfaction guarantee — free re-clean',
    ],
    reviews: [
      { user: 'Amanda R.', rating: 5, text: 'Spotless! They even scrubbed the baseboards without being asked. Worth every penny.', date: '2026-07-22' },
      { user: 'Marcus T.', rating: 4, text: 'Very thorough and on time. Booking online took under a minute.', date: '2026-07-10' },
      { user: 'Priya S.', rating: 5, text: 'Booked a move-out clean and got my full deposit back. Lifesavers!', date: '2026-06-28' },
    ],
  },
  {
    id: 'plumbing',
    name: 'Plumbing',
    emoji: '🔧',
    tagline: 'Leaks, clogs, and full repipes',
    shortDescription: 'Licensed plumbers for fixes and installations.',
    description:
      'Licensed and insured plumbers handle everything from a dripping faucet to a full repipe. We give you a flat price before any work starts, show up in a window you pick, and clean up after ourselves.',
    priceRange: '$120 – $400',
    avgPrice: 260,
    duration: '1 – 3 hours',
    included: [
      'Upfront flat-rate pricing',
      'Licensed, insured technicians',
      'Faucets, toilets, water heaters',
      'Drain cleaning & camera inspection',
      '90-day workmanship guarantee',
      'Tidy work area, guaranteed',
    ],
    reviews: [
      { user: 'Dave K.', rating: 5, text: 'Water heater died on a Friday night — they had it swapped by Saturday noon. Incredible.', date: '2026-07-19' },
      { user: 'Lena F.', rating: 4, text: 'Clear quote, no surprises. The tech explained everything as he went.', date: '2026-07-02' },
      { user: 'Omar H.', rating: 5, text: 'Clog gone in 20 minutes. Fair price for a Sunday call-out.', date: '2026-06-15' },
    ],
  },
  {
    id: 'electrical',
    name: 'Electrical',
    emoji: '⚡',
    tagline: 'Safe power, done right',
    shortDescription: 'Certified electricians for repairs and upgrades.',
    description:
      'Certified electricians install lighting, outlets, panels, and EV chargers. Every job is code-compliant, permitted where required, and backed by a full warranty on parts and labor.',
    priceRange: '$100 – $350',
    avgPrice: 220,
    duration: '1 – 4 hours',
    included: [
      'Certified & licensed electricians',
      'Lighting, outlets & switches',
      'Panel upgrades & EV chargers',
      'Code-compliant, permitted work',
      '1-year parts & labor warranty',
      'Safety inspection included',
    ],
    reviews: [
      { user: 'Nadia P.', rating: 5, text: 'Installed 6 recessed lights and made it look easy. Panel was cleaner than before they came.', date: '2026-07-25' },
      { user: 'Greg W.', rating: 4, text: 'Quick, tidy, and walked me through the permit paperwork.', date: '2026-07-08' },
      { user: 'Sofia M.', rating: 5, text: 'Fixed a scary buzzing outlet same day. Very professional.', date: '2026-06-20' },
    ],
  },
  {
    id: 'lawn-care',
    name: 'Lawn Care',
    emoji: '🌱',
    tagline: 'A lawn the neighbors envy',
    shortDescription: 'Mowing, fertilization, and seasonal cleanups.',
    description:
      'Weekly mowing, fertilization programs, and seasonal cleanups that keep your yard green all year. Pick a recurring plan or book a one-time cut — our crews arrive with everything they need.',
    priceRange: '$50 – $120',
    avgPrice: 85,
    duration: '1 – 2 hours',
    included: [
      'Mowing, edging & blowing',
      'Fertilization & weed control',
      'Leaf and debris cleanup',
      'Recurring weekly plans available',
      'Pet-friendly treatments',
      'No contract required',
    ],
    reviews: [
      { user: 'Chris B.', rating: 5, text: 'My lawn has never looked better. The crew is here like clockwork every week.', date: '2026-07-21' },
      { user: 'Emma L.', rating: 4, text: 'Edges are razor sharp. Booking recurring was one click.', date: '2026-07-12' },
      { user: 'Juan D.', rating: 5, text: 'They went the extra mile after the storm cleanup. Highly recommend.', date: '2026-06-30' },
    ],
  },
  {
    id: 'snow-removal',
    name: 'Snow Removal',
    emoji: '❄️',
    tagline: 'Driveways cleared before coffee',
    shortDescription: 'Plowing, shoveling, and salting.',
    description:
      'When the snow hits, we hit it back. Driveway plowing, walkway shoveling, and de-icing with live service windows and text alerts when we are en route.',
    priceRange: '$60 – $200',
    avgPrice: 130,
    duration: '30 min – 2 hours',
    included: [
      'Driveway & walkway clearing',
      'De-icing salt application',
      '24/7 storm response',
      'Seasonal plans available',
      'Text alerts when we arrive',
      'Senior discount',
    ],
    reviews: [
      { user: 'Tom H.', rating: 5, text: 'They were here at 6 AM before the storm even stopped. Made it to work on time!', date: '2026-01-18' },
      { user: 'Rachel G.', rating: 4, text: 'Reliable and fast. The text alert when they arrived was a nice touch.', date: '2026-01-05' },
      { user: 'Viktor N.', rating: 5, text: 'Seasonal plan is a steal. Never had to shovel once all winter.', date: '2025-12-27' },
    ],
  },
  {
    id: 'painting',
    name: 'Painting',
    emoji: '🎨',
    tagline: 'Fresh color, crisp lines',
    shortDescription: 'Interior and exterior painting by pros.',
    description:
      'Interior, exterior, and cabinet painting with premium paints, careful prep, and drop-cloth-everything protection. Get a detailed quote from photos, then relax while we transform your space.',
    priceRange: '$150 – $600',
    avgPrice: 380,
    duration: '1 – 3 days',
    included: [
      'Premium paints & supplies',
      'Full surface prep included',
      'Interior, exterior & cabinets',
      'Furniture protection & cleanup',
      'Detailed written quote',
      '5-year paint warranty',
    ],
    reviews: [
      { user: 'Holly J.', rating: 5, text: 'Three rooms painted in two days. The lines are so crisp I keep staring at them.', date: '2026-07-15' },
      { user: 'Andre W.', rating: 4, text: 'Great color advice and they moved everything back exactly where it was.', date: '2026-07-01' },
      { user: 'Mia C.', rating: 5, text: 'Cabinets look brand new. Would hire again in a heartbeat.', date: '2026-06-18' },
    ],
  },
  {
    id: 'handyman',
    name: 'Handyman',
    emoji: '🛠️',
    tagline: 'One pro for the whole list',
    shortDescription: 'Furniture, shelves, repairs and small fixes.',
    description:
      'Got a list of small jobs? Our handymen knock them all out in one visit — furniture assembly, TV mounting, shelves, drywall patching, door fixes, and more. Book by the hour and only pay for what gets done.',
    priceRange: '$75 – $250',
    avgPrice: 160,
    duration: '1 – 4 hours',
    included: [
      'Hourly or flat project pricing',
      'TV mounting & furniture assembly',
      'Shelving, drywall & trim repair',
      'Door & lock adjustments',
      'Bring your own materials or ours',
      '30-day work guarantee',
    ],
    reviews: [
      { user: 'Ben F.', rating: 5, text: 'Knocked out 9 items from my to-do list in one afternoon. The app was 10/10.', date: '2026-07-23' },
      { user: 'Aisha K.', rating: 4, text: 'TV mount is perfect. He even hid the cables through the wall.', date: '2026-07-09' },
      { user: 'George P.', rating: 5, text: 'Fair hourly rate and genuinely nice guy. Will book again.', date: '2026-06-25' },
    ],
  },
]

export const getService = (id) => SERVICES.find((s) => s.id === id)

/** Local fallback providers (used if the DummyJSON fetch fails). */
export const FALLBACK_PROVIDERS = [
  { id: 1, name: 'Alex Rivera', role: 'Lead Cleaner', imageUrl: '', skills: ['Deep cleaning', 'Move-out clean', 'Eco supplies'], rating: 4.9, completedJobs: 312, service: 'cleaning', bio: '10 years making homes shine, one checklist at a time.' },
  { id: 2, name: 'Jordan Lee', role: 'Master Plumber', imageUrl: '', skills: ['Repipes', 'Water heaters', 'Drain camera'], rating: 4.8, completedJobs: 540, service: 'plumbing', bio: 'Licensed plumber who believes in flat pricing, always.' },
  { id: 3, name: 'Sam Carter', role: 'Electrician', imageUrl: '', skills: ['Panel upgrades', 'EV chargers', 'Recessed lighting'], rating: 5.0, completedJobs: 428, service: 'electrical', bio: 'Certified electrician with a thing for tidy panels.' },
  { id: 4, name: 'Maria Gomez', role: 'Lawn Specialist', imageUrl: '', skills: ['Fertilization', 'Weed control', 'Seasonal cleanups'], rating: 4.7, completedJobs: 660, service: 'lawn-care', bio: 'Keeping neighborhoods green for 8 seasons and counting.' },
  { id: 5, name: 'Theo Banks', role: 'Snow Crew Lead', imageUrl: '', skills: ['Plowing', 'De-icing', 'Storm response'], rating: 4.9, completedJobs: 215, service: 'snow-removal', bio: 'First on the street when the flakes fly.' },
  { id: 6, name: 'Renata Silva', role: 'Painter', imageUrl: '', skills: ['Interior paint', 'Cabinets', 'Color consulting'], rating: 4.8, completedJobs: 389, service: 'painting', bio: 'Crisp lines and happy clients since 2014.' },
  { id: 7, name: 'Chris Doyle', role: 'Handyman', imageUrl: '', skills: ['TV mounting', 'Assembly', 'Drywall'], rating: 4.6, completedJobs: 501, service: 'handyman', bio: 'Your whole to-do list, handled in one visit.' },
]
