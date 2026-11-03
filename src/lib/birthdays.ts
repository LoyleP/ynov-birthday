import type { Student } from "./store";

const TZ = "Europe/Paris";

export function todayParis(now = new Date()) {
  const [y, m, d] = new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(now).split("-").map(Number);
  return { y, m, d };
}

const isLeap = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

/** Month/day on which the birthday is celebrated in year y (29 Feb -> 28 Feb off leap years). */
function celebrated(naissance: string, y: number) {
  const [, m, d] = naissance.split("-").map(Number);
  return m === 2 && d === 29 && !isLeap(y) ? { m: 2, d: 28 } : { m, d };
}

export type Upcoming = { student: Student; inDays: number; age: number };

export function upcoming(students: Student[], days: number, now = new Date()): Upcoming[] {
  const t = todayParis(now);
  const start = Date.UTC(t.y, t.m - 1, t.d);
  const out: Upcoming[] = [];
  for (const s of students) {
    const birthYear = Number(s.naissance.slice(0, 4));
    for (let i = 0; i <= days; i++) {
      const date = new Date(start + i * 86400000);
      const y = date.getUTCFullYear();
      const c = celebrated(s.naissance, y);
      if (c.m === date.getUTCMonth() + 1 && c.d === date.getUTCDate()) {
        out.push({ student: s, inDays: i, age: y - birthYear });
        break;
      }
    }
  }
  return out.sort((a, b) => a.inDays - b.inDays || a.student.nom.localeCompare(b.student.nom));
}

export const todays = (students: Student[], now = new Date()) =>
  upcoming(students, 0, now).filter((u) => u.inDays === 0);

export function formatDay(inDays: number, now = new Date()) {
  const t = todayParis(now);
  const date = new Date(Date.UTC(t.y, t.m - 1, t.d + inDays));
  return new Intl.DateTimeFormat("fr-FR", { weekday: "short", day: "numeric", month: "long", timeZone: "UTC" }).format(date);
}
