// lib/doctors/utils.ts

export function buildDoctorFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim();
}

export function formatDoctorSpecialization(
  specialization: string,
  subSpecialization: string | null
): string {
  if (subSpecialization) {
    return `${specialization} - ${subSpecialization}`;
  }
  return specialization;
}

