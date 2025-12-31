// ====================================
// Enums Database - نظام عيادة نساء وولادة
// جميع الـ Enums المستخدمة في التطبيق
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
// 3️⃣ أيام الأسبوع
// ====================================
export enum DayName {
  SATURDAY = "السبت",
  SUNDAY = "الأحد",
  MONDAY = "الاثنين",
  TUESDAY = "الثلاثاء",
  WEDNESDAY = "الأربعاء",
  THURSDAY = "الخميس",
  FRIDAY = "الجمعة",
}

export const DayNameLabels: Record<DayName, string> = {
  [DayName.SATURDAY]: "السبت",
  [DayName.SUNDAY]: "الأحد",
  [DayName.MONDAY]: "الاثنين",
  [DayName.TUESDAY]: "الثلاثاء",
  [DayName.WEDNESDAY]: "الأربعاء",
  [DayName.THURSDAY]: "الخميس",
  [DayName.FRIDAY]: "الجمعة",
};

// ====================================
// 4️⃣ أنواع الإجازات
// ====================================
export enum LeaveType {
  ANNUAL = "إجازة سنوية",
  SICK = "إجازة مرضية",
  EMERGENCY = "إجازة طارئة",
  HOLIDAY = "عطلة رسمية",
}

export const LeaveTypeLabels: Record<LeaveType, string> = {
  [LeaveType.ANNUAL]: "إجازة سنوية",
  [LeaveType.SICK]: "إجازة مرضية",
  [LeaveType.EMERGENCY]: "إجازة طارئة",
  [LeaveType.HOLIDAY]: "عطلة رسمية",
};

// ====================================
// 5️⃣ أنواع المواعيد
// ====================================
export enum AppointmentType {
  FIRST_VISIT = "كشف أول",
  FOLLOWUP = "متابعة",
  EMERGENCY = "طوارئ",
  SURGERY = "عملية",
  ULTRASOUND = "سونار",
  CONSULTATION = "استشارة",
}

export const AppointmentTypeLabels: Record<AppointmentType, string> = {
  [AppointmentType.FIRST_VISIT]: "كشف أول",
  [AppointmentType.FOLLOWUP]: "متابعة",
  [AppointmentType.EMERGENCY]: "طوارئ",
  [AppointmentType.SURGERY]: "عملية",
  [AppointmentType.ULTRASOUND]: "سونار",
  [AppointmentType.CONSULTATION]: "استشارة",
};

// ====================================
// 6️⃣ حالات المواعيد
// ====================================
export enum AppointmentStatus {
  BOOKED = "محجوز",
  CONFIRMED = "مؤكد",
  ATTENDED = "تم الحضور",
  CANCELLED = "ملغي",
  NO_SHOW = "لم يحضر",
  POSTPONED = "مؤجل",
}

export const AppointmentStatusLabels: Record<AppointmentStatus, string> = {
  [AppointmentStatus.BOOKED]: "محجوز",
  [AppointmentStatus.CONFIRMED]: "مؤكد",
  [AppointmentStatus.ATTENDED]: "تم الحضور",
  [AppointmentStatus.CANCELLED]: "ملغي",
  [AppointmentStatus.NO_SHOW]: "لم يحضر",
  [AppointmentStatus.POSTPONED]: "مؤجل",
};

// ====================================
// 7️⃣ الأولوية
// ====================================
export enum Priority {
  NORMAL = "عادي",
  URGENT = "عاجل",
  EMERGENCY = "طارئ",
}

export const PriorityLabels: Record<Priority, string> = {
  [Priority.NORMAL]: "عادي",
  [Priority.URGENT]: "عاجل",
  [Priority.EMERGENCY]: "طارئ",
};

// ====================================
// 8️⃣ حالة الزيارة
// ====================================
export enum VisitStatus {
  IN_PROGRESS = "جارية",
  COMPLETED = "مكتملة",
  FOLLOWUP_REQUIRED = "متابعة",
}

export const VisitStatusLabels: Record<VisitStatus, string> = {
  [VisitStatus.IN_PROGRESS]: "جارية",
  [VisitStatus.COMPLETED]: "مكتملة",
  [VisitStatus.FOLLOWUP_REQUIRED]: "متابعة",
};

// ====================================
// 9️⃣ انتظام الدورة
// ====================================
export enum CycleRegularity {
  REGULAR = "منتظمة",
  IRREGULAR = "غير منتظمة",
}

export const CycleRegularityLabels: Record<CycleRegularity, string> = {
  [CycleRegularity.REGULAR]: "منتظمة",
  [CycleRegularity.IRREGULAR]: "غير منتظمة",
};

// ====================================
// 🔟 تدفق الدورة
// ====================================
export enum MenstrualFlow {
  LIGHT = "خفيف",
  MODERATE = "متوسط",
  HEAVY = "غزير",
}

export const MenstrualFlowLabels: Record<MenstrualFlow, string> = {
  [MenstrualFlow.LIGHT]: "خفيف",
  [MenstrualFlow.MODERATE]: "متوسط",
  [MenstrualFlow.HEAVY]: "غزير",
};

// ====================================
// 1️⃣1️⃣ طريقة الإنجاب
// ====================================
export enum ConceptionMethod {
  NATURAL = "طبيعي",
  IVF = "IVF",
  IUI = "IUI",
  OTHER = "أخرى",
}

export const ConceptionMethodLabels: Record<ConceptionMethod, string> = {
  [ConceptionMethod.NATURAL]: "طبيعي",
  [ConceptionMethod.IVF]: "IVF",
  [ConceptionMethod.IUI]: "IUI",
  [ConceptionMethod.OTHER]: "أخرى",
};

// ====================================
// 1️⃣2️⃣ نوع الحمل
// ====================================
export enum PregnancyType {
  SINGLE = "حمل مفرد",
  TWINS = "توأم",
  TRIPLETS = "ثلاثي",
  MULTIPLE = "متعدد",
}

export const PregnancyTypeLabels: Record<PregnancyType, string> = {
  [PregnancyType.SINGLE]: "حمل مفرد",
  [PregnancyType.TWINS]: "توأم",
  [PregnancyType.TRIPLETS]: "ثلاثي",
  [PregnancyType.MULTIPLE]: "متعدد",
};

// ====================================
// 1️⃣3️⃣ حالة الحمل
// ====================================
export enum PregnancyStatus {
  CURRENT = "حمل حالي",
  NORMAL_DELIVERY = "ولادة طبيعية",
  CESAREAN = "قيصرية",
  MISCARRIAGE = "إجهاض تلقائي",
  ABORTION = "إجهاض علاجي",
  ECTOPIC = "حمل خارجي",
  FETAL_DEATH = "موت جنيني",
}

export const PregnancyStatusLabels: Record<PregnancyStatus, string> = {
  [PregnancyStatus.CURRENT]: "حمل حالي",
  [PregnancyStatus.NORMAL_DELIVERY]: "ولادة طبيعية",
  [PregnancyStatus.CESAREAN]: "قيصرية",
  [PregnancyStatus.MISCARRIAGE]: "إجهاض تلقائي",
  [PregnancyStatus.ABORTION]: "إجهاض علاجي",
  [PregnancyStatus.ECTOPIC]: "حمل خارجي",
  [PregnancyStatus.FETAL_DEATH]: "موت جنيني",
};

// ====================================
// 1️⃣4️⃣ مستوى الخطورة
// ====================================
export enum RiskLevel {
  LOW = "منخفض",
  MEDIUM = "متوسط",
  HIGH = "عالي",
}

export const RiskLevelLabels: Record<RiskLevel, string> = {
  [RiskLevel.LOW]: "منخفض",
  [RiskLevel.MEDIUM]: "متوسط",
  [RiskLevel.HIGH]: "عالي",
};

// ====================================
// 1️⃣5️⃣ جنس المولود
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
// 1️⃣6️⃣ حالة المولود
// ====================================
export enum BabyStatus {
  ALIVE = "حي",
  DEATH = "وفاة",
  STILLBORN = "جنين ميت",
}

export const BabyStatusLabels: Record<BabyStatus, string> = {
  [BabyStatus.ALIVE]: "حي",
  [BabyStatus.DEATH]: "وفاة",
  [BabyStatus.STILLBORN]: "جنين ميت",
};

// ====================================
// 1️⃣7️⃣ حركة الجنين
// ====================================
export enum FetalMovement {
  NORMAL = "طبيعي",
  INCREASED = "زائد",
  DECREASED = "قليل",
  NOT_FELT = "غير محسوس",
}

export const FetalMovementLabels: Record<FetalMovement, string> = {
  [FetalMovement.NORMAL]: "طبيعي",
  [FetalMovement.INCREASED]: "زائد",
  [FetalMovement.DECREASED]: "قليل",
  [FetalMovement.NOT_FELT]: "غير محسوس",
};

// ====================================
// 1️⃣8️⃣ نوع التشخيص
// ====================================
export enum DiagnosisType {
  PRIMARY = "أولي",
  SECONDARY = "ثانوي",
  SUSPECTED = "مشتبه به",
  DIFFERENTIAL = "تفريقي",
}

export const DiagnosisTypeLabels: Record<DiagnosisType, string> = {
  [DiagnosisType.PRIMARY]: "أولي",
  [DiagnosisType.SECONDARY]: "ثانوي",
  [DiagnosisType.SUSPECTED]: "مشتبه به",
  [DiagnosisType.DIFFERENTIAL]: "تفريقي",
};

// ====================================
// 1️⃣9️⃣ شدة التشخيص
// ====================================
export enum Severity {
  MILD = "خفيف",
  MODERATE = "متوسط",
  SEVERE = "شديد",
  CRITICAL = "حرج",
}

export const SeverityLabels: Record<Severity, string> = {
  [Severity.MILD]: "خفيف",
  [Severity.MODERATE]: "متوسط",
  [Severity.SEVERE]: "شديد",
  [Severity.CRITICAL]: "حرج",
};

// ====================================
// 2️⃣0️⃣ أشكال الأدوية
// ====================================
export enum MedicationForm {
  TABLETS = "أقراص",
  CAPSULES = "كبسولات",
  SYRUP = "شراب",
  INJECTION = "حقن",
  CREAM = "كريم",
  SUPPOSITORY = "تحاميل",
  PESSARY = "لبوس",
  SPRAY = "بخاخ",
  DROPS = "قطرة",
}

export const MedicationFormLabels: Record<MedicationForm, string> = {
  [MedicationForm.TABLETS]: "أقراص",
  [MedicationForm.CAPSULES]: "كبسولات",
  [MedicationForm.SYRUP]: "شراب",
  [MedicationForm.INJECTION]: "حقن",
  [MedicationForm.CREAM]: "كريم",
  [MedicationForm.SUPPOSITORY]: "تحاميل",
  [MedicationForm.PESSARY]: "لبوس",
  [MedicationForm.SPRAY]: "بخاخ",
  [MedicationForm.DROPS]: "قطرة",
};

// ====================================
// 2️⃣1️⃣ طرق إعطاء الأدوية
// ====================================
export enum MedicationRoute {
  ORAL = "فموي",
  IM = "حقن عضلي",
  IV = "حقن وريدي",
  TOPICAL = "موضعي",
  VAGINAL = "مهبلي",
  RECTAL = "شرجي",
}

export const MedicationRouteLabels: Record<MedicationRoute, string> = {
  [MedicationRoute.ORAL]: "فموي",
  [MedicationRoute.IM]: "حقن عضلي",
  [MedicationRoute.IV]: "حقن وريدي",
  [MedicationRoute.TOPICAL]: "موضعي",
  [MedicationRoute.VAGINAL]: "مهبلي",
  [MedicationRoute.RECTAL]: "شرجي",
};

// ====================================
// 2️⃣2️⃣ فئات التحاليل
// ====================================
export enum LabCategory {
  BLOOD = "دم",
  URINE = "بول",
  HORMONES = "هرمونات",
  SUGAR = "سكر",
  KIDNEY = "وظائف كلى",
  LIVER = "وظائف كبد",
  OTHER = "أخرى",
}

export const LabCategoryLabels: Record<LabCategory, string> = {
  [LabCategory.BLOOD]: "دم",
  [LabCategory.URINE]: "بول",
  [LabCategory.HORMONES]: "هرمونات",
  [LabCategory.SUGAR]: "سكر",
  [LabCategory.KIDNEY]: "وظائف كلى",
  [LabCategory.LIVER]: "وظائف كبد",
  [LabCategory.OTHER]: "أخرى",
};

// ====================================
// 2️⃣3️⃣ حالة طلب التحليل
// ====================================
export enum LabOrderStatus {
  PENDING = "معلق",
  COLLECTING = "جاري التحصيل",
  COLLECTED = "تم التحصيل",
  PROCESSING = "جاري التحليل",
  COMPLETED = "مكتمل",
  CANCELLED = "ملغي",
}

export const LabOrderStatusLabels: Record<LabOrderStatus, string> = {
  [LabOrderStatus.PENDING]: "معلق",
  [LabOrderStatus.COLLECTING]: "جاري التحصيل",
  [LabOrderStatus.COLLECTED]: "تم التحصيل",
  [LabOrderStatus.PROCESSING]: "جاري التحليل",
  [LabOrderStatus.COMPLETED]: "مكتمل",
  [LabOrderStatus.CANCELLED]: "ملغي",
};

// ====================================
// 2️⃣4️⃣ حالة نتيجة التحليل
// ====================================
export enum ResultStatus {
  NORMAL = "طبيعي",
  ABNORMAL = "غير طبيعي",
  CRITICAL = "حرج",
  UNDEFINED = "غير محدد",
}

export const ResultStatusLabels: Record<ResultStatus, string> = {
  [ResultStatus.NORMAL]: "طبيعي",
  [ResultStatus.ABNORMAL]: "غير طبيعي",
  [ResultStatus.CRITICAL]: "حرج",
  [ResultStatus.UNDEFINED]: "غير محدد",
};

// ====================================
// 2️⃣5️⃣ أنواع الأشعة
// ====================================
export enum RadiologyType {
  ULTRASOUND = "سونار",
  XRAY = "أشعة عادية",
  CONTRAST = "أشعة بالصبغة",
  DOPPLER = "دوبلر",
  MAMMOGRAM = "ماموجرام",
  MRI = "رنين مغناطيسي",
  CT_SCAN = "أشعة مقطعية",
}

export const RadiologyTypeLabels: Record<RadiologyType, string> = {
  [RadiologyType.ULTRASOUND]: "سونار",
  [RadiologyType.XRAY]: "أشعة عادية",
  [RadiologyType.CONTRAST]: "أشعة بالصبغة",
  [RadiologyType.DOPPLER]: "دوبلر",
  [RadiologyType.MAMMOGRAM]: "ماموجرام",
  [RadiologyType.MRI]: "رنين مغناطيسي",
  [RadiologyType.CT_SCAN]: "أشعة مقطعية",
};

// ====================================
// 2️⃣6️⃣ حالة طلب الأشعة
// ====================================
export enum RadiologyStatus {
  PENDING = "معلق",
  SCHEDULED = "مجدول",
  COMPLETED = "مكتمل",
  CANCELLED = "ملغي",
}

export const RadiologyStatusLabels: Record<RadiologyStatus, string> = {
  [RadiologyStatus.PENDING]: "معلق",
  [RadiologyStatus.SCHEDULED]: "مجدول",
  [RadiologyStatus.COMPLETED]: "مكتمل",
  [RadiologyStatus.CANCELLED]: "ملغي",
};

// ====================================
// 2️⃣7️⃣ أنواع العمليات
// ====================================
export enum SurgeryType {
  DIAGNOSTIC = "تشخيصية",
  THERAPEUTIC = "علاجية",
  COSMETIC = "تجميلية",
  EMERGENCY = "طارئة",
}

export const SurgeryTypeLabels: Record<SurgeryType, string> = {
  [SurgeryType.DIAGNOSTIC]: "تشخيصية",
  [SurgeryType.THERAPEUTIC]: "علاجية",
  [SurgeryType.COSMETIC]: "تجميلية",
  [SurgeryType.EMERGENCY]: "طارئة",
};

// ====================================
// 2️⃣8️⃣ أنواع التخدير
// ====================================
export enum AnesthesiaType {
  GENERAL = "عام",
  SPINAL = "نصفي",
  LOCAL = "موضعي",
  IV_SEDATION = "تخدير وريدي",
}

export const AnesthesiaTypeLabels: Record<AnesthesiaType, string> = {
  [AnesthesiaType.GENERAL]: "عام",
  [AnesthesiaType.SPINAL]: "نصفي",
  [AnesthesiaType.LOCAL]: "موضعي",
  [AnesthesiaType.IV_SEDATION]: "تخدير وريدي",
};

// ====================================
// 2️⃣9️⃣ حالة العملية
// ====================================
export enum SurgeryStatus {
  SCHEDULED = "مجدولة",
  PREPARED = "تم التحضير",
  IN_PROGRESS = "جارية",
  COMPLETED = "مكتملة",
  CANCELLED = "ملغاة",
  POSTPONED = "مؤجلة",
}

export const SurgeryStatusLabels: Record<SurgeryStatus, string> = {
  [SurgeryStatus.SCHEDULED]: "مجدولة",
  [SurgeryStatus.PREPARED]: "تم التحضير",
  [SurgeryStatus.IN_PROGRESS]: "جارية",
  [SurgeryStatus.COMPLETED]: "مكتملة",
  [SurgeryStatus.CANCELLED]: "ملغاة",
  [SurgeryStatus.POSTPONED]: "مؤجلة",
};

// ====================================
// 3️⃣0️⃣ حالة الشفاء
// ====================================
export enum HealingStatus {
  EXCELLENT = "ممتاز",
  GOOD = "جيد",
  FAIR = "مقبول",
  POOR = "سيء",
}

export const HealingStatusLabels: Record<HealingStatus, string> = {
  [HealingStatus.EXCELLENT]: "ممتاز",
  [HealingStatus.GOOD]: "جيد",
  [HealingStatus.FAIR]: "مقبول",
  [HealingStatus.POOR]: "سيء",
};

// ====================================
// 3️⃣1️⃣ فئات الخدمات
// ====================================
export enum ServiceCategory {
  CONSULTATION = "استشارة",
  EXAMINATION = "كشف",
  PROCEDURE = "إجراء",
  SURGERY = "عملية",
  LAB_TEST = "تحليل",
  RADIOLOGY = "أشعة",
  OTHER = "أخرى",
}

export const ServiceCategoryLabels: Record<ServiceCategory, string> = {
  [ServiceCategory.CONSULTATION]: "استشارة",
  [ServiceCategory.EXAMINATION]: "كشف",
  [ServiceCategory.PROCEDURE]: "إجراء",
  [ServiceCategory.SURGERY]: "عملية",
  [ServiceCategory.LAB_TEST]: "تحليل",
  [ServiceCategory.RADIOLOGY]: "أشعة",
  [ServiceCategory.OTHER]: "أخرى",
};

// ====================================
// 3️⃣2️⃣ حالة الدفع
// ====================================
export enum PaymentStatus {
  UNPAID = "غير مدفوع",
  PARTIALLY_PAID = "مدفوع جزئي",
  PAID = "مدفوع",
  CANCELLED = "ملغي",
  PENDING = "معلق",
}

export const PaymentStatusLabels: Record<PaymentStatus, string> = {
  [PaymentStatus.UNPAID]: "غير مدفوع",
  [PaymentStatus.PARTIALLY_PAID]: "مدفوع جزئي",
  [PaymentStatus.PAID]: "مدفوع",
  [PaymentStatus.CANCELLED]: "ملغي",
  [PaymentStatus.PENDING]: "معلق",
};

// ====================================
// 3️⃣3️⃣ أنواع العناصر
// ====================================
export enum ItemType {
  SERVICE = "خدمة",
  MEDICATION = "دواء",
  LAB_TEST = "تحليل",
  RADIOLOGY = "أشعة",
  PROCEDURE = "إجراء",
  OTHER = "أخرى",
}

export const ItemTypeLabels: Record<ItemType, string> = {
  [ItemType.SERVICE]: "خدمة",
  [ItemType.MEDICATION]: "دواء",
  [ItemType.LAB_TEST]: "تحليل",
  [ItemType.RADIOLOGY]: "أشعة",
  [ItemType.PROCEDURE]: "إجراء",
  [ItemType.OTHER]: "أخرى",
};

// ====================================
// 3️⃣4️⃣ طرق الدفع
// ====================================
export enum PaymentMethod {
  CASH = "نقدي",
  CREDIT_CARD = "بطاقة ائتمان",
  DEBIT_CARD = "بطاقة خصم",
  BANK_TRANSFER = "تحويل بنكي",
  CHECK = "شيك",
  INSURANCE = "تأمين",
  OTHER = "أخرى",
}

export const PaymentMethodLabels: Record<PaymentMethod, string> = {
  [PaymentMethod.CASH]: "نقدي",
  [PaymentMethod.CREDIT_CARD]: "بطاقة ائتمان",
  [PaymentMethod.DEBIT_CARD]: "بطاقة خصم",
  [PaymentMethod.BANK_TRANSFER]: "تحويل بنكي",
  [PaymentMethod.CHECK]: "شيك",
  [PaymentMethod.INSURANCE]: "تأمين",
  [PaymentMethod.OTHER]: "أخرى",
};

// ====================================
// 3️⃣5️⃣ مناصب الموظفين
// ====================================
export enum StaffPosition {
  RECEPTIONIST = "استقبال",
  NURSE = "ممرضة",
  ACCOUNTANT = "محاسب",
  SECRETARY = "سكرتيرة",
  PHARMACIST = "صيدلي",
  LAB_TECH = "فني مختبر",
  SECURITY = "أمن",
  CLEANER = "نظافة",
  OTHER = "أخرى",
}

export const StaffPositionLabels: Record<StaffPosition, string> = {
  [StaffPosition.RECEPTIONIST]: "استقبال",
  [StaffPosition.NURSE]: "ممرضة",
  [StaffPosition.ACCOUNTANT]: "محاسب",
  [StaffPosition.SECRETARY]: "سكرتيرة",
  [StaffPosition.PHARMACIST]: "صيدلي",
  [StaffPosition.LAB_TECH]: "فني مختبر",
  [StaffPosition.SECURITY]: "أمن",
  [StaffPosition.CLEANER]: "نظافة",
  [StaffPosition.OTHER]: "أخرى",
};

// ====================================
// 3️⃣6️⃣ أنواع التوظيف
// ====================================
export enum EmploymentType {
  FULL_TIME = "دوام كامل",
  PART_TIME = "دوام جزئي",
  CONTRACT = "عقد",
  TEMPORARY = "مؤقت",
}

export const EmploymentTypeLabels: Record<EmploymentType, string> = {
  [EmploymentType.FULL_TIME]: "دوام كامل",
  [EmploymentType.PART_TIME]: "دوام جزئي",
  [EmploymentType.CONTRACT]: "عقد",
  [EmploymentType.TEMPORARY]: "مؤقت",
};

// ====================================
// 3️⃣7️⃣ أنواع المستخدمين
// ====================================
export enum UserType {
  DOCTOR = "طبيب",
  STAFF = "موظف",
  ADMIN = "مدير",
  PHARMACIST = "صيدلي",
  ACCOUNTANT = "محاسب",
}

export const UserTypeLabels: Record<UserType, string> = {
  [UserType.DOCTOR]: "طبيب",
  [UserType.STAFF]: "موظف",
  [UserType.ADMIN]: "مدير",
  [UserType.PHARMACIST]: "صيدلي",
  [UserType.ACCOUNTANT]: "محاسب",
};

// ====================================
// 3️⃣8️⃣ أنواع الإجراءات
// ====================================
export enum ActionType {
  CREATE = "إنشاء",
  UPDATE = "تعديل",
  DELETE = "حذف",
  VIEW = "عرض",
  LOGIN = "تسجيل دخول",
  LOGOUT = "تسجيل خروج",
}

export const ActionTypeLabels: Record<ActionType, string> = {
  [ActionType.CREATE]: "إنشاء",
  [ActionType.UPDATE]: "تعديل",
  [ActionType.DELETE]: "حذف",
  [ActionType.VIEW]: "عرض",
  [ActionType.LOGIN]: "تسجيل دخول",
  [ActionType.LOGOUT]: "تسجيل خروج",
};

