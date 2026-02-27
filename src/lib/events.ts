import type { CollectionEntry } from "astro:content";

// NOTE: Classification is evaluated at static build time.
// Production must run scheduled rebuilds so upcoming/past sections stay accurate.

export type EventEntry = CollectionEntry<"events">;
export type EventStatus = "upcoming" | "past";

const DAY_IN_MS = 86_400_000;

function getEventEndInclusive(event: EventEntry): Date {
  const boundary = event.data.endDate ?? event.data.date;
  return new Date(boundary.getTime() + DAY_IN_MS);
}

export function deriveEventStatus(event: EventEntry, now: Date = new Date()): EventStatus {
  if (event.data.status) return event.data.status;
  if (typeof event.data.past === "boolean") return event.data.past ? "past" : "upcoming";
  return getEventEndInclusive(event) > now ? "upcoming" : "past";
}

export function splitEventsByStatus(
  events: EventEntry[],
  now: Date = new Date(),
): { upcoming: EventEntry[]; past: EventEntry[] } {
  const upcoming: EventEntry[] = [];
  const past: EventEntry[] = [];

  for (const event of events) {
    if (deriveEventStatus(event, now) === "upcoming") {
      upcoming.push(event);
    } else {
      past.push(event);
    }
  }

  upcoming.sort((a, b) => a.data.date.getTime() - b.data.date.getTime());
  past.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return { upcoming, past };
}

export function formatEventDate(start: Date, end?: Date): string {
  const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC" };
  if (!end) {
    return start.toLocaleDateString("en-US", {
      ...opts,
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  const sMonth = start.toLocaleDateString("en-US", { ...opts, month: "long" });
  const eMonth = end.toLocaleDateString("en-US", { ...opts, month: "long" });

  if (sMonth === eMonth) {
    return `${sMonth} ${start.getUTCDate()}–${end.getUTCDate()}, ${start.getUTCFullYear()}`;
  }

  return `${start.toLocaleDateString("en-US", { ...opts, month: "long", day: "numeric" })} – ${end.toLocaleDateString(
    "en-US",
    {
      ...opts,
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  )}`;
}
