// lib/services/utils.ts

export function calculateServicePrice(
  basePrice: number,
  hasInsurance: boolean,
  insurancePrice: number | null
): number {
  if (hasInsurance && insurancePrice !== null) {
    return Number(insurancePrice);
  }
  return Number(basePrice);
}

export function calculateTaxAmount(
  price: number,
  taxPercentage: number
): number {
  return (price * Number(taxPercentage)) / 100;
}

export function calculateTotalWithTax(
  price: number,
  taxPercentage: number
): number {
  return price + calculateTaxAmount(price, taxPercentage);
}

