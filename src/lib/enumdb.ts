// ====================================
// Enums Database - نظام عيادة نساء وولادة مبسط
// فقط الـ Enums المستخدمة في الـ Schema المبسط
// ====================================

// ====================================
// 1️⃣ فصائل الدم
// ====================================
export enum BloodType {
  A_POSITIVE = "A+",
  A_NEGATIVE = "A-",
  B_POSITIVE = "B+",
  B_NEGATIVE = "B-",
  AB_POSITIVE = "AB+",
  AB_NEGATIVE = "AB-",
  O_POSITIVE = "O+",
  O_NEGATIVE = "O-",
}

export const BloodTypeLabels: Record<BloodType, string> = {
  [BloodType.A_POSITIVE]: "A+",
  [BloodType.A_NEGATIVE]: "A-",
  [BloodType.B_POSITIVE]: "B+",
  [BloodType.B_NEGATIVE]: "B-",
  [BloodType.AB_POSITIVE]: "AB+",
  [BloodType.AB_NEGATIVE]: "AB-",
  [BloodType.O_POSITIVE]: "O+",
  [BloodType.O_NEGATIVE]: "O-",
};

// ====================================
// 2️⃣ الحالة الاجتماعية
// ====================================
export enum MaritalStatus {
  MARRIED = "متزوجة",
  SINGLE = "عزباء",
  DIVORCED = "مطلقة",
  WIDOWED = "أرملة",
}

export const MaritalStatusLabels: Record<MaritalStatus, string> = {
  [MaritalStatus.MARRIED]: "متزوجة",
  [MaritalStatus.SINGLE]: "عزباء",
  [MaritalStatus.DIVORCED]: "مطلقة",
  [MaritalStatus.WIDOWED]: "أرملة",
};

// ====================================
// 3️⃣ جنس المولود
// ====================================
export enum BabyGender {
  MALE = "ذكر",
  FEMALE = "أنثى",
}

export const BabyGenderLabels: Record<BabyGender, string> = {
  [BabyGender.MALE]: "ذكر",
  [BabyGender.FEMALE]: "أنثى",
};

// ====================================
// 4️⃣ فئات الحمل للأدوية (Pregnancy Category)
// ====================================
export enum PregnancyCategory {
  A = "A",
  B = "B",
  C = "C",
  D = "D",
}

export const PregnancyCategoryLabels: Record<PregnancyCategory, string> = {
  [PregnancyCategory.A]: "A",
  [PregnancyCategory.B]: "B",
  [PregnancyCategory.C]: "C",
  [PregnancyCategory.D]: "D",
};

// ====================================
// 5️⃣ الشكل الدوائي (Medication Form)
// ====================================
export enum MedicationForm {
  TABLETS = "أقراص",
  CAPSULES = "كبسولات",
  SYRUP = "شراب",
  INJECTION = "حقن",
  OINTMENT = "مرهم",
  CREAM = "كريم",
  DROPS = "قطرات",
  SPRAY = "بخاخ",
  SUPPOSITORY = "تحاميل",
  PATCH = "لصقة",
  OTHER = "أخرى",
}

export const MedicationFormLabels: Record<MedicationForm, string> = {
  [MedicationForm.TABLETS]: "أقراص",
  [MedicationForm.CAPSULES]: "كبسولات",
  [MedicationForm.SYRUP]: "شراب",
  [MedicationForm.INJECTION]: "حقن",
  [MedicationForm.OINTMENT]: "مرهم",
  [MedicationForm.CREAM]: "كريم",
  [MedicationForm.DROPS]: "قطرات",
  [MedicationForm.SPRAY]: "بخاخ",
  [MedicationForm.SUPPOSITORY]: "تحاميل",
  [MedicationForm.PATCH]: "لصقة",
  [MedicationForm.OTHER]: "أخرى",
};

// ====================================
// 6️⃣ أمان الدواء للرضاعة
// ====================================
export enum BreastfeedingSafe {
  SAFE = "SAFE", // آمن
  UNSAFE = "UNSAFE", // غير آمن
  CAUTION = "CAUTION", // بحذر
}

export const BreastfeedingSafeLabels: Record<BreastfeedingSafe, string> = {
  [BreastfeedingSafe.SAFE]: "آمن",
  [BreastfeedingSafe.UNSAFE]: "غير آمن",
  [BreastfeedingSafe.CAUTION]: "بحذر",
};

// ====================================
// 8️⃣ سبب الزيارة (Visit Reason)
// ====================================
export enum VisitReason {
  CONSULTATION = "كشف عادي",
  FOLLOWUP = "متابعة",
  PREGNANCY_FOLLOWUP = "متابعة حمل",
  ULTRASOUND = "سونار",
  EMERGENCY = "طوارئ",
  CHECKUP = "فحص دوري",
  OTHER = "أخرى",
}

export const VisitReasonLabels: Record<VisitReason, string> = {
  [VisitReason.CONSULTATION]: "كشف عادي",
  [VisitReason.FOLLOWUP]: "متابعة",
  [VisitReason.PREGNANCY_FOLLOWUP]: "متابعة حمل",
  [VisitReason.ULTRASOUND]: "سونار",
  [VisitReason.EMERGENCY]: "طوارئ",
  [VisitReason.CHECKUP]: "فحص دوري",
  [VisitReason.OTHER]: "أخرى",
};

// ====================================
// 8️⃣ أدوار المستخدمين (User Roles)
// ====================================
export enum UserRole {
  DOCTOR = "DOCTOR",
  RECEPTIONIST = "RECEPTIONIST",
  ADMIN = "ADMIN",
}

export const UserRoleLabels: Record<UserRole, string> = {
  [UserRole.DOCTOR]: "طبيب",
  [UserRole.RECEPTIONIST]: "استقبال",
  [UserRole.ADMIN]: "مدير",
};

// ====================================
// 9️⃣ حالة الدفع (Payment Status)
// ====================================
export enum PaymentStatus {
  UNPAID = "UNPAID",
  PARTIAL = "PARTIAL",
  PAID = "PAID",
  CANCELLED = "CANCELLED",
}

export const PaymentStatusLabels: Record<PaymentStatus, string> = {
  [PaymentStatus.UNPAID]: "غير مدفوع",
  [PaymentStatus.PARTIAL]: "مدفوع جزئياً",
  [PaymentStatus.PAID]: "مدفوع بالكامل",
  [PaymentStatus.CANCELLED]: "ملغي",
};

// ====================================
// 🔟 طرق الدفع (Payment Methods)
// ====================================
export enum PaymentMethod {
  CASH = "CASH",
  CARD = "CARD",
  BANK_TRANSFER = "BANK_TRANSFER",
  INSURANCE = "INSURANCE",
  CHECK = "CHECK",
}

export const PaymentMethodLabels: Record<PaymentMethod, string> = {
  [PaymentMethod.CASH]: "نقدي",
  [PaymentMethod.CARD]: "بطاقة",
  [PaymentMethod.BANK_TRANSFER]: "تحويل بنكي",
  [PaymentMethod.INSURANCE]: "تأمين",
  [PaymentMethod.CHECK]: "شيك",
};

// ====================================

// 9️⃣ اقتراحات أنواع القوالب (Template Types Suggestions)
// ====================================
// ملاحظة: templateType و category الآن free text في الـ schema
// هذه مجرد اقتراحات للـ UI - الدكتور ممكن يكتب أي شيء

export const TEMPLATE_TYPE_SUGGESTIONS = [
  "روشتة",
  "تشخيص",
  "زيارة",
  "متابعة حمل",
  "سونار",
  "توصيات",
  "نظام غذائي",
] as const;

export const TEMPLATE_CATEGORY_SUGGESTIONS = [
  "حمل",
  "التهابات",
  "فيتامينات",
  "أمراض مزمنة",
  "أمراض نسائية",
] as const;


// ====================================
// أنواع بنود الفاتورة
// ====================================
export enum InvoiceItemType {
  CONSULTATION = "كشف",
  ULTRASOUND = "سونار",
  MEDICATION = "متابعة حمل",
  OTHER = "أخرى",
}

export const InvoiceItemTypeLabels: Record<InvoiceItemType, string> = {
  [InvoiceItemType.CONSULTATION]: "كشف",
  [InvoiceItemType.ULTRASOUND]: "سونار",
  [InvoiceItemType.MEDICATION]: "متابعة حمل",
  [InvoiceItemType.OTHER]: "أخرى",
};





// ====================================
// 1️⃣2️⃣ حالة الحجز (Appointment Status)
// ====================================
export enum AppointmentStatus {
  BOOKED = "BOOKED",
  CONFIRMED = "CONFIRMED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  NO_SHOW = "NO_SHOW",
}

export const AppointmentStatusLabels: Record<AppointmentStatus, string> = {
  [AppointmentStatus.BOOKED]: "محجوز",
  [AppointmentStatus.CONFIRMED]: "مؤكد",
  [AppointmentStatus.COMPLETED]: "مكتمل",
  [AppointmentStatus.CANCELLED]: "ملغي",
  [AppointmentStatus.NO_SHOW]: "لم يحضر",
};



// ====================================
export enum emergencyContactRelation {
    MOTHER = "أم",
    FATHER = "أب",
    BROTHER = "أخ",
    SISTER = "أخت",
    OTHER = "أخرى",
}

export const emergencyContactRelationLabels: Record<emergencyContactRelation, string> = {
  [emergencyContactRelation.MOTHER]: "أم",
  [emergencyContactRelation.FATHER]: "أب",
  [emergencyContactRelation.BROTHER]: "أخ",
  [emergencyContactRelation.SISTER]: "أخت",
  [emergencyContactRelation.OTHER]: "أخرى",
};
