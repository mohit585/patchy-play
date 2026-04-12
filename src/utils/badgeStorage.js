const BADGE_KEY = "therapyBadges";
const SESSION_KEY = "therapySessions";
const TOTAL_TIME_KEY = "sessionTime";

export const badgeDefinitions = [
  {
    id: "first_session",
    title: "First Session",
    description: "Complete your first therapy session.",
  },
  {
    id: "ten_minutes",
    title: "10 Minute Focus",
    description: "Reach a 10 minute session.",
  },
  {
    id: "three_day_streak",
    title: "3 Day Streak",
    description: "Use therapy for 3 days in a row.",
  },
  {
    id: "one_hour_total",
    title: "1 Hour Total",
    description: "Reach 1 hour of total therapy time.",
  },
];

function getSavedBadges() {
  const raw = localStorage.getItem(BADGE_KEY);
  if (!raw) return {};

  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function getRawSessions() {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getTotalTime() {
  const saved = localStorage.getItem(TOTAL_TIME_KEY);
  return saved ? Number(saved) : 0;
}

function getBestSessionDuration() {
  const sessions = getRawSessions();
  const bestFromHistory = sessions.reduce(
    (best, session) => Math.max(best, session.duration || 0),
    0
  );

  return Math.max(bestFromHistory, getTotalTime());
}

function getStreakCount() {
  const sessions = getRawSessions()
    .filter((session) => session.duration > 0)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (sessions.length === 0) return 0;

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (let i = sessions.length - 1; i >= 0; i -= 1) {
    const sessionDate = new Date(sessions[i].date);
    sessionDate.setHours(0, 0, 0, 0);

    if (sessionDate.getTime() === currentDate.getTime()) {
      streak += 1;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (sessionDate.getTime() < currentDate.getTime()) {
      break;
    }
  }

  return streak;
}

export function computeUnlockedBadges() {
  const totalTime = getTotalTime();
  const bestSession = getBestSessionDuration();
  const streak = getStreakCount();

  return {
    first_session: totalTime > 0,
    ten_minutes: bestSession >= 600,
    three_day_streak: streak >= 3,
    one_hour_total: totalTime >= 3600,
  };
}

export function syncBadges() {
  const previous = getSavedBadges();
  const computed = computeUnlockedBadges();

  const merged = {
    ...previous,
    ...Object.fromEntries(
      Object.entries(computed).map(([key, value]) => [key, previous[key] || value])
    ),
  };

  localStorage.setItem(BADGE_KEY, JSON.stringify(merged));
  return merged;
}

export function getBadgeList() {
  const unlocked = syncBadges();

  return badgeDefinitions.map((badge) => ({
    ...badge,
    unlocked: Boolean(unlocked[badge.id]),
  }));
}
