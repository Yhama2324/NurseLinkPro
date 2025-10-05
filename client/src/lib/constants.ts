export const TAGLINES = [
  "We don't just give answers — we build nurses through experience.",
  "No shortcuts. No cheating. Just experience, growth, and mastery.",
  "Where learning feels real — we provide experience, not just answers.",
  "You don't memorize to pass — you experience to become.",
  "We can't give you answers, but we'll give you the strength to find them.",
  "Train hard. Think smart. Feel the nurse within you.",
  "Experience nursing before you wear the uniform."
];

export const QUIZ_CATEGORIES = [
  { value: "Y1", label: "Year 1" },
  { value: "Y2", label: "Year 2" },
  { value: "Y3", label: "Year 3" },
  { value: "Y4", label: "Year 4" },
  { value: "PNLE", label: "PNLE" },
  { value: "NCLEX", label: "NCLEX" }
];

export const QUIZ_TOPICS = [
  "Fundamentals of Nursing",
  "Anatomy & Physiology",
  "Medical-Surgical Nursing",
  "Pharmacology",
  "Maternal & Child Health",
  "Mental Health Nursing",
  "Community Health",
  "Nursing Research"
];

export const AD_CATEGORIES = [
  { value: "education", label: "Education" },
  { value: "career", label: "Career" },
  { value: "tools", label: "Tools" },
  { value: "uniforms", label: "Uniforms" },
  { value: "equipment", label: "Equipment" }
];

export const SUBSCRIPTION_TIERS = [
  {
    name: "Free",
    price: 0,
    currency: "₱",
    period: "",
    features: [
      "Daily Challenge access",
      "CareSpace feed",
      "Limited quiz drills (5/day)",
      "Basic profile",
      "Join parties"
    ]
  },
  {
    name: "Pro",
    price: 149,
    currency: "₱",
    period: "/month",
    popular: true,
    features: [
      "Unlimited quiz drills",
      "Analytics dashboard",
      "Create & join clans",
      "Custom assignments",
      "Progress tracking"
    ]
  },
  {
    name: "Elite",
    price: 299,
    currency: "₱",
    period: "/month",
    features: [
      "Everything in Pro",
      "AI Copilot (NurseMind)",
      "Clan Wars access",
      "Advanced analytics",
      "Priority support"
    ]
  }
];

export const RANK_LEVELS = [
  { min: 0, max: 99, name: "Student", color: "#94a3b8" },
  { min: 100, max: 499, name: "Practitioner", color: "#0080FF" },
  { min: 500, max: 1999, name: "Mentor", color: "#FFD0FD" },
  { min: 2000, max: Infinity, name: "Leader", color: "#FFA500" }
];
