const STORAGE_KEY = "therapySessions";

const fallbackSessions = [
  { date: "2026-04-03", duration: 300 },
  { date: "2026-04-04", duration: 420 },
  { date: "2026-04-05", duration: 180 },
  { date: "2026-04-06", duration: 600 },
  { date: "2026-04-07", duration: 480 },
  { date: "2026-04-08", duration: 360 },
  { date: "2026-04-09", duration: 540 },
];

function getTodayDateString() {
  return new Date().toISOString().split("T")[0];
}

function sortSessionsByDate(sessions) {
  return [...sessions].sort((a, b) => new Date(a.date) - new Date(b.date));
}

export function getSessions() {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) return fallbackSessions;

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return fallbackSessions;
  } catch {
    return fallbackSessions;
  }
}

export function getTodayCompliance(goalSeconds = 600) {
  const sessions = getSessions();
  const today = getTodayDateString();
  const todaySession = sessions.find((session) => session.date === today);
  const todayDuration = todaySession ? todaySession.duration : 0;

  return Math.min(100, Math.round((todayDuration / goalSeconds) * 100));
}

export function getTotalTherapyTime() {
  const sessions = getSessions();
  return sessions.reduce((total, session) => total + session.duration, 0);
}

export function getBestSession() {
  const sessions = getSessions();
  return sessions.reduce(
    (best, session) => Math.max(best, session.duration),
    0
  );
}

export function getStreakCount() {
  const sessions = sortSessionsByDate(getSessions()).filter(
    (session) => session.duration > 0
  );

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

export function getLast7Sessions() {
  const sessions = sortSessionsByDate(getSessions());
  return sessions.slice(-7).map((session) => ({
    date: session.date.slice(5),
    duration: session.duration,
  }));
}
