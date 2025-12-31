// lib/appointments/utils.ts

/**
 * Utility functions for Appointment operations
 */

export function formatAppointmentTime(time: Date): string {
  return new Date(time).toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatAppointmentDate(date: Date): string {
  return new Date(date).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function isAppointmentToday(date: Date): boolean {
  const today = new Date();
  const appointmentDate = new Date(date);
  return (
    today.getFullYear() === appointmentDate.getFullYear() &&
    today.getMonth() === appointmentDate.getMonth() &&
    today.getDate() === appointmentDate.getDate()
  );
}

export function isAppointmentPast(date: Date, time: Date): boolean {
  const now = new Date();
  const appointmentDateTime = new Date(date);
  appointmentDateTime.setHours(
    new Date(time).getHours(),
    new Date(time).getMinutes()
  );
  return appointmentDateTime < now;
}

