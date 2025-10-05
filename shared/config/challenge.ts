export const WEEKLY_CHALLENGE = {
  enabled: true,
  weeklyGoal: 100,
  weekStartsOn: 1,
  tiers: { Pro: "PRO", Elite: "ELITE" },
  points: { correct: 2, streakBonus: 5, speedBonusMax: 10 },
  badgeNames: {
    week1: "Consistent Nurse",
    week3: "Steady Learner",
    week6: "Committed RN",
    week12: "Streak Legend",
  },
} as const;
