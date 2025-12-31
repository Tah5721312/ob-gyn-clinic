// lib/labs/utils.ts

export function isResultCritical(resultStatus: string | null): boolean {
  return resultStatus === "حرج" || resultStatus === "عالٍ";
}

export function formatLabResult(
  resultValue: string | null,
  resultNumeric: number | null,
  unit: string | null
): string {
  if (resultValue) return resultValue;
  if (resultNumeric !== null) {
    return `${resultNumeric}${unit ? ` ${unit}` : ""}`;
  }
  return "—";
}

export function getResultStatusColor(resultStatus: string | null): string {
  switch (resultStatus) {
    case "طبيعي":
      return "green";
    case "عالٍ":
      return "yellow";
    case "منخفض":
      return "blue";
    case "حرج":
      return "red";
    default:
      return "gray";
  }
}

