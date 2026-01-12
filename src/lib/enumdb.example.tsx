import { apiFetch } from "@/lib/api";
// ====================================
// مثال على استخدام الـ Enums في الـ Frontend
// ====================================

import {
  BloodType,
  BloodTypeLabels,
  MaritalStatus,
  MaritalStatusLabels,
  AppointmentStatus,
  AppointmentStatusLabels,
  VisitReason,
  VisitReasonLabels,
  BabyGender,
  BabyGenderLabels,
  PregnancyCategory,
  PregnancyCategoryLabels,
  BreastfeedingSafe,
  BreastfeedingSafeLabels,
} from "@/lib/enumdb";

// ====================================
// 1️⃣ استخدام في React Component - Select/Dropdown
// ====================================

export function PatientFormExample() {
  return (
    <div>
      {/* فصيلة الدم */}
      <select name="bloodType">
        <option value="">اختر فصيلة الدم</option>
        {Object.values(BloodType).map((type) => (
          <option key={type} value={type}>
            {BloodTypeLabels[type]}
          </option>
        ))}
      </select>

      {/* الحالة الاجتماعية */}
      <select name="maritalStatus">
        <option value="">اختر الحالة الاجتماعية</option>
        {Object.values(MaritalStatus).map((status) => (
          <option key={status} value={status}>
            {MaritalStatusLabels[status]}
          </option>
        ))}
      </select>
    </div>
  );
}

// ====================================
// 2️⃣ استخدام في Appointment Form
// ====================================

export function AppointmentFormExample() {
  return (
    <div>
      {/* حالة الحجز */}
      <select name="status">
        {Object.values(AppointmentStatus).map((status) => (
          <option key={status} value={status}>
            {AppointmentStatusLabels[status]}
          </option>
        ))}
      </select>

      {/* سبب الزيارة */}
      <select name="visitReason">
        <option value="">اختر سبب الزيارة</option>
        {Object.values(VisitReason).map((reason) => (
          <option key={reason} value={reason}>
            {VisitReasonLabels[reason]}
          </option>
        ))}
      </select>
    </div>
  );
}

// ====================================
// 3️⃣ استخدام في Display/Show (عرض البيانات)
// ====================================

export function PatientDisplayExample({ patient }: { patient: any }) {
  return (
    <div>
      <p>
        فصيلة الدم:{" "}
        {patient.bloodType
          ? BloodTypeLabels[patient.bloodType as BloodType]
          : "غير محدد"}
      </p>
      <p>
        الحالة الاجتماعية:{" "}
        {patient.maritalStatus
          ? MaritalStatusLabels[patient.maritalStatus as MaritalStatus]
          : "غير محدد"}
      </p>
    </div>
  );
}

// ====================================
// 4️⃣ استخدام في Validation (التحقق)
// ====================================

export function validateBloodType(value: string): boolean {
  return Object.values(BloodType).includes(value as BloodType);
}

export function validateAppointmentStatus(value: string): boolean {
  return Object.values(AppointmentStatus).includes(value as AppointmentStatus);
}

// ====================================
// 5️⃣ استخدام في TypeScript Types
// ====================================

export interface CreatePatientFormData {
  firstName: string;
  lastName: string;
  bloodType?: BloodType; // ✅ Type-safe
  maritalStatus?: MaritalStatus; // ✅ Type-safe
}

export interface CreateAppointmentFormData {
  patientId: number;
  doctorId: number;
  status: AppointmentStatus; // ✅ Type-safe
  visitReason?: VisitReason; // ✅ Type-safe
}

// ====================================
// 6️⃣ استخدام في API Request
// ====================================

export async function createPatient(data: CreatePatientFormData) {
  // TypeScript يمنع الأخطاء هنا
  const response = await apiFetch("/api/patients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...data,
      // ✅ Type-safe - لا يمكن إرسال قيمة خاطئة
      bloodType: data.bloodType, // BloodType enum
      maritalStatus: data.maritalStatus, // MaritalStatus enum
    }),
  });
  return response.json();
}

// ====================================
// 7️⃣ استخدام في Badge/Status Display
// ====================================

export function AppointmentStatusBadge({ status }: { status: string }) {
  const statusConfig: Record<
    AppointmentStatus,
    { label: string; color: string }
  > = {
    [AppointmentStatus.BOOKED]: {
      label: AppointmentStatusLabels[AppointmentStatus.BOOKED],
      color: "blue",
    },
    [AppointmentStatus.CONFIRMED]: {
      label: AppointmentStatusLabels[AppointmentStatus.CONFIRMED],
      color: "purple",
    },
    [AppointmentStatus.COMPLETED]: {
      label: AppointmentStatusLabels[AppointmentStatus.COMPLETED],
      color: "green",
    },
    [AppointmentStatus.CANCELLED]: {
      label: AppointmentStatusLabels[AppointmentStatus.CANCELLED],
      color: "red",
    },
    [AppointmentStatus.NO_SHOW]: {
      label: AppointmentStatusLabels[AppointmentStatus.NO_SHOW],
      color: "gray",
    },
  };

  const config = statusConfig[status as AppointmentStatus];

  return (
    <span
      style={{
        padding: "4px 8px",
        borderRadius: "4px",
        backgroundColor: config?.color,
        color: "white",
      }}
    >
      {config?.label || status}
    </span>
  );
}

// ====================================
// 8️⃣ استخدام في Filter/Search
// ====================================

export function AppointmentFilters() {
  return (
    <div>
      <select name="statusFilter">
        <option value="">كل الحالات</option>
        {Object.values(AppointmentStatus).map((status) => (
          <option key={status} value={status}>
            {AppointmentStatusLabels[status]}
          </option>
        ))}
      </select>

      <select name="reasonFilter">
        <option value="">كل الأسباب</option>
        {Object.values(VisitReason).map((reason) => (
          <option key={reason} value={reason}>
            {VisitReasonLabels[reason]}
          </option>
        ))}
      </select>
    </div>
  );
}

