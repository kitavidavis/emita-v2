// Most utilities don't read meters on a clean calendar month — a cycle is a rolling window
// defined by a start day-of-month, a reading duration, and a review buffer, and it routinely
// spans two calendar months (e.g. 25 Aug – 2 Sep, bills out ~5 Sep). This mirrors how the field's
// leading platform actually models it: three numbers, applied every month, never a stored
// "August cycle" object. A cycle is identified by its real date range, never a month name.

export type BillingCycleConfig = {
  startDay: number; // 1–31, day of month the reading window opens
  durationDays: number; // length of the reading window, inclusive of the start day
  reviewDays: number; // buffer days after reading closes, before bills are issued
};

// Bwaliro Water's own configuration — editable from Configurations → Billing Cycle.
export const BILLING_CYCLE_CONFIG: BillingCycleConfig = {
  startDay: 25,
  durationDays: 9,
  reviewDays: 2,
};

export type CycleDates = {
  readingStart: Date;
  readingEnd: Date;
  reviewEnd: Date;
  billIssueDate: Date;
};

function addDays(d: Date, n: number): Date {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + n);
  return copy;
}

function cycleAt(config: BillingCycleConfig, year: number, month: number): CycleDates {
  const readingStart = new Date(year, month, config.startDay);
  const readingEnd = addDays(readingStart, config.durationDays - 1);
  const reviewEnd = addDays(readingEnd, config.reviewDays);
  const billIssueDate = addDays(reviewEnd, 1);
  return { readingStart, readingEnd, reviewEnd, billIssueDate };
}

/** The most recent `count` cycles, most recent first. Index 0 is the cycle currently in
 * progress (or the one whose reading window most recently opened, relative to `now`). */
export function recentCycles(config: BillingCycleConfig, count: number, now: Date = new Date()): CycleDates[] {
  let year = now.getFullYear();
  let month = now.getMonth();
  if (now.getDate() < config.startDay) {
    month -= 1;
    if (month < 0) {
      month = 11;
      year -= 1;
    }
  }
  const cycles: CycleDates[] = [];
  for (let i = 0; i < count; i++) {
    cycles.push(cycleAt(config, year, month));
    month -= 1;
    if (month < 0) {
      month = 11;
      year -= 1;
    }
  }
  return cycles;
}

const dayMonth = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
const dayMonthYear = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

/** e.g. "25 Aug – 2 Sep 2026" — spans months/years gracefully, never assumes one calendar month. */
export function formatCyclePeriod(c: CycleDates): string {
  const sameYear = c.readingStart.getFullYear() === c.readingEnd.getFullYear();
  const sameMonth = sameYear && c.readingStart.getMonth() === c.readingEnd.getMonth();
  if (sameMonth) {
    return `${c.readingStart.getDate()}–${dayMonthYear(c.readingEnd)}`;
  }
  return `${dayMonth(c.readingStart)} – ${dayMonthYear(c.readingEnd)}`;
}

export function cycleStatus(c: CycleDates, now: Date = new Date()): "pending" | "running" | "review" | "completed" {
  if (now < c.readingStart) return "pending";
  if (now <= c.readingEnd) return "running";
  if (now <= c.reviewEnd) return "review";
  return "completed";
}
