// lib/visits/utils.ts

export function calculateVisitDuration(
  startTime: Date | null,
  endTime: Date | null
): number | null {
  if (!startTime || !endTime) return null;
  const start = new Date(startTime);
  const end = new Date(endTime);
  return Math.round((end.getTime() - start.getTime()) / 1000 / 60); // minutes
}

export function formatVisitTime(time: Date | null): string {
  if (!time) return "—";
  return new Date(time).toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

