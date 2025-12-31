// lib/prescriptions/utils.ts

export function isPrescriptionValid(validUntil: Date | null): boolean {
  if (!validUntil) return true;
  return new Date(validUntil) >= new Date();
}

export function canRefill(
  refillsAllowed: number,
  refillsUsed: number
): boolean {
  return refillsUsed < refillsAllowed;
}

export function getRemainingRefills(
  refillsAllowed: number,
  refillsUsed: number
): number {
  return Math.max(0, refillsAllowed - refillsUsed);
}

