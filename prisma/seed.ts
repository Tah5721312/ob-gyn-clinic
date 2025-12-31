import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { config } from 'dotenv';
// @ts-ignore - Type definitions may not be available
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Load .env file - must be first
config();

// Debug: Check if DATABASE_URL is loaded
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in environment');
  console.error('   Make sure .env file exists in the project root');
  process.exit(1);
}

import {
  BloodType,
  MaritalStatus,
  DayName,
  LeaveType,
  AppointmentType,
  AppointmentStatus,
  Priority,
  VisitStatus,
  CycleRegularity,
  MenstrualFlow,
  ConceptionMethod,
  PregnancyType,
  PregnancyStatus,
  RiskLevel,
  BabyGender,
  BabyStatus,
  FetalMovement,
  DiagnosisType,
  Severity,
  MedicationForm,
  MedicationRoute,
  LabCategory,
  LabOrderStatus,
  ResultStatus,
  RadiologyType,
  RadiologyStatus,
  SurgeryType,
  AnesthesiaType,
  SurgeryStatus,
  HealingStatus,
  ServiceCategory,
  PaymentStatus,
  ItemType,
  PaymentMethod,
  StaffPosition,
  EmploymentType,
  UserType,
  ActionType,
} from '../src/lib/enumdb';

// Create PostgreSQL pool with SSL configuration
// Clean DATABASE_URL - remove quotes and trim
let cleanDbUrl = process.env.DATABASE_URL!.trim();
cleanDbUrl = cleanDbUrl.replace(/^['"]|['"]$/g, ''); // Remove surrounding quotes

// Debug: Log connection info (without password)
const dbInfo = cleanDbUrl.replace(/:[^:@]+@/, ':****@');
console.log('🔗 Connecting to database:', dbInfo.split('@')[1]?.split('/')[0] || 'unknown');

const pool = new Pool({
  connectionString: cleanDbUrl,
  ssl: cleanDbUrl.includes('sslmode=require') || cleanDbUrl.includes('ssl')
    ? { rejectUnauthorized: false }
    : false,
  max: 1, // Use single connection for seed
  connectionTimeoutMillis: 10000, // 10 seconds timeout
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter: adapter,
});

async function main() {
  console.log('🌱 بدء إدخال البيانات التجريبية...\n');

  // ====================================
  // 🗑️ حذف البيانات الموجودة (بترتيب عكسي للعلاقات)
  // ====================================
  console.log('🗑️ حذف البيانات الموجودة...');
  
  // حذف البيانات بترتيب عكسي للعلاقات
  await prisma.auditLog.deleteMany();
  await prisma.systemUser.deleteMany();
  await prisma.rolePermission.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.role.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.patientInsurance.deleteMany();
  await prisma.insuranceCompany.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.invoiceDetail.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.service.deleteMany();
  await prisma.surgeryFollowup.deleteMany();
  await prisma.surgery.deleteMany();
  await prisma.radiologyOrder.deleteMany();
  await prisma.labResult.deleteMany();
  await prisma.labOrder.deleteMany();
  await prisma.labTest.deleteMany();
  await prisma.prescriptionDetail.deleteMany();
  await prisma.prescription.deleteMany();
  await prisma.medication.deleteMany();
  await prisma.diagnosis.deleteMany();
  await prisma.pregnancyFollowup.deleteMany();
  await prisma.pregnancyRecord.deleteMany();
  await prisma.medicalHistory.deleteMany();
  await prisma.medicalVisit.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.doctorLeave.deleteMany();
  await prisma.workingSchedule.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.patient.deleteMany();
  
  console.log('✅ تم حذف جميع البيانات الموجودة.');
  
  // ====================================
  // 🔄 إعادة تعيين الـ Sequences
  // ====================================
  console.log('🔄 إعادة تعيين الـ Sequences...');
  
  // إعادة تعيين جميع الـ sequences في PostgreSQL
  await prisma.$executeRawUnsafe(`
    DO $$ 
    DECLARE 
      r RECORD;
    BEGIN
      FOR r IN 
        SELECT sequence_name 
        FROM information_schema.sequences 
        WHERE sequence_schema = 'public'
      LOOP
        EXECUTE 'ALTER SEQUENCE ' || quote_ident(r.sequence_name) || ' RESTART WITH 1';
      END LOOP;
    END $$;
  `);
  
  console.log('✅ تم إعادة تعيين جميع الـ Sequences.\n');

  // ====================================
  // 1️⃣ إنشاء الأطباء
  // ====================================
  console.log('👨‍⚕️ إنشاء الأطباء...');
  const doctor1 = await prisma.doctor.create({
    data: {
      nationalId: '12345678901234',
      firstName: 'أحمد',
      lastName: 'محمد',
      specialization: 'نساء وتوليد',
      subSpecialization: 'جراحة نسائية',
      licenseNumber: 'DOC-001',
      phone: '01012345678',
      email: 'ahmed.mohamed@clinic.com',
      consultationFee: 500,
      followupFee: 300,
      emergencyFee: 800,
      surgeryBaseFee: 5000,
      yearsOfExperience: 15,
      qualification: 'دكتوراه في طب النساء والتوليد',
      bio: 'طبيب استشاري في أمراض النساء والتوليد',
      isActive: true,
    },
  });

  const doctor2 = await prisma.doctor.create({
    data: {
      nationalId: '23456789012345',
      firstName: 'فاطمة',
      lastName: 'علي',
      specialization: 'نساء وتوليد',
      subSpecialization: 'عقم وأطفال الأنابيب',
      licenseNumber: 'DOC-002',
      phone: '01023456789',
      email: 'fatima.ali@clinic.com',
      consultationFee: 600,
      followupFee: 350,
      emergencyFee: 900,
      surgeryBaseFee: 6000,
      yearsOfExperience: 12,
      qualification: 'دكتوراه في طب النساء والتوليد',
      bio: 'طبيبة استشارية متخصصة في العقم وأطفال الأنابيب',
      isActive: true,
    },
  });

  console.log(`✅ تم إنشاء ${2} طبيب\n`);

  // ====================================
  // 2️⃣ إنشاء الموظفين
  // ====================================
  console.log('👥 إنشاء الموظفين...');
  const staff1 = await prisma.staff.create({
    data: {
      employeeNumber: 'EMP-001',
      nationalId: '34567890123456',
      firstName: 'سارة',
      lastName: 'أحمد',
      position: StaffPosition.RECEPTIONIST,
      department: 'الاستقبال',
      phone: '01034567890',
      email: 'sara.ahmed@clinic.com',
      address: 'القاهرة، مصر',
      hireDate: new Date('2020-01-15'),
      employmentType: EmploymentType.FULL_TIME,
      salary: 8000,
      salaryCurrency: 'EGP',
      workingHoursPerWeek: 40,
      emergencyContactName: 'محمد أحمد',
      emergencyContactPhone: '01011111111',
      isActive: true,
    },
  });

  const staff2 = await prisma.staff.create({
    data: {
      employeeNumber: 'EMP-002',
      nationalId: '45678901234567',
      firstName: 'مريم',
      lastName: 'حسن',
      position: StaffPosition.NURSE,
      department: 'التمريض',
      phone: '01045678901',
      email: 'mariam.hassan@clinic.com',
      address: 'الجيزة، مصر',
      hireDate: new Date('2019-06-01'),
      employmentType: EmploymentType.FULL_TIME,
      salary: 6000,
      salaryCurrency: 'EGP',
      workingHoursPerWeek: 40,
      emergencyContactName: 'حسن محمد',
      emergencyContactPhone: '01022222222',
      isActive: true,
    },
  });

  console.log(`✅ تم إنشاء ${2} موظف\n`);

  // ====================================
  // 3️⃣ إنشاء الأدوار والصلاحيات
  // ====================================
  console.log('🔐 إنشاء الأدوار والصلاحيات...');
  
  // الأدوار التفصيلية (Roles) - تحدد الصلاحيات الفعلية
  const superAdminRole = await prisma.role.create({
    data: {
      roleName: 'مدير النظام',
      roleCode: 'SUPER_ADMIN',
      description: 'صلاحيات كاملة على النظام',
      isActive: true,
    },
  });

  const doctorRole = await prisma.role.create({
    data: {
      roleName: 'طبيب',
      roleCode: 'DOCTOR',
      description: 'صلاحيات الطبيب - إدارة الزيارات والروشتات',
      isActive: true,
    },
  });

  const receptionRole = await prisma.role.create({
    data: {
      roleName: 'استقبال',
      roleCode: 'RECEPTION',
      description: 'إدارة المواعيد والمرضى',
      isActive: true,
    },
  });

  const accountantRole = await prisma.role.create({
    data: {
      roleName: 'محاسب',
      roleCode: 'ACCOUNTANT',
      description: 'إدارة الفواتير والمدفوعات',
      isActive: true,
    },
  });

  const nurseRole = await prisma.role.create({
    data: {
      roleName: 'ممرضة',
      roleCode: 'NURSE',
      description: 'إدارة المرضى والتحاليل',
      isActive: true,
    },
  });

  // إنشاء الصلاحيات
  const permissions = await Promise.all([
    prisma.permission.create({
      data: {
        permissionName: 'إدارة المرضى',
        permissionCode: 'PATIENT_MANAGE',
        description: 'إضافة وتعديل وحذف المرضى',
        module: 'المرضى',
        isActive: true,
      },
    }),
    prisma.permission.create({
      data: {
        permissionName: 'إدارة المواعيد',
        permissionCode: 'APPOINTMENT_MANAGE',
        description: 'إدارة المواعيد',
        module: 'المواعيد',
        isActive: true,
      },
    }),
    prisma.permission.create({
      data: {
        permissionName: 'إدارة الفواتير',
        permissionCode: 'INVOICE_MANAGE',
        description: 'إدارة الفواتير والمدفوعات',
        module: 'المالية',
        isActive: true,
      },
    }),
    prisma.permission.create({
      data: {
        permissionName: 'إنشاء زيارة',
        permissionCode: 'VISIT_CREATE',
        description: 'إنشاء زيارة طبية',
        module: 'الزيارات',
        isActive: true,
      },
    }),
    prisma.permission.create({
      data: {
        permissionName: 'كتابة روشتة',
        permissionCode: 'PRESCRIPTION_WRITE',
        description: 'كتابة الروشتات',
        module: 'الروشتات',
        isActive: true,
      },
    }),
    prisma.permission.create({
      data: {
        permissionName: 'إدارة النظام',
        permissionCode: 'SYSTEM_MANAGE',
        description: 'إدارة النظام بالكامل',
        module: 'النظام',
        isActive: true,
      },
    }),
  ]);

  // ربط الصلاحيات بالأدوار
  await prisma.rolePermission.createMany({
    data: [
      // SuperAdmin - جميع الصلاحيات
      { roleId: superAdminRole.id, permissionId: permissions[0].id }, // PATIENT_MANAGE
      { roleId: superAdminRole.id, permissionId: permissions[1].id }, // APPOINTMENT_MANAGE
      { roleId: superAdminRole.id, permissionId: permissions[2].id }, // INVOICE_MANAGE
      { roleId: superAdminRole.id, permissionId: permissions[3].id }, // VISIT_CREATE
      { roleId: superAdminRole.id, permissionId: permissions[4].id }, // PRESCRIPTION_WRITE
      { roleId: superAdminRole.id, permissionId: permissions[5].id }, // SYSTEM_MANAGE
      
      // Doctor - المرضى، المواعيد، الزيارات، الروشتات
      { roleId: doctorRole.id, permissionId: permissions[0].id }, // PATIENT_MANAGE
      { roleId: doctorRole.id, permissionId: permissions[1].id }, // APPOINTMENT_MANAGE
      { roleId: doctorRole.id, permissionId: permissions[3].id }, // VISIT_CREATE
      { roleId: doctorRole.id, permissionId: permissions[4].id }, // PRESCRIPTION_WRITE
      
      // Reception - المواعيد والمرضى
      { roleId: receptionRole.id, permissionId: permissions[0].id }, // PATIENT_MANAGE
      { roleId: receptionRole.id, permissionId: permissions[1].id }, // APPOINTMENT_MANAGE
      
      // Accountant - الفواتير
      { roleId: accountantRole.id, permissionId: permissions[2].id }, // INVOICE_MANAGE
      
      // Nurse - المرضى
      { roleId: nurseRole.id, permissionId: permissions[0].id }, // PATIENT_MANAGE
    ],
  });

  console.log(`✅ تم إنشاء ${5} أدوار و ${permissions.length} صلاحيات\n`);

  // ====================================
  // 4️⃣ إنشاء مستخدمي النظام
  // ====================================
  console.log('👤 إنشاء مستخدمي النظام...');
  const hashedPassword = await bcrypt.hash('123456', 10);

  // Admin مع SuperAdmin Role
  const adminUser = await prisma.systemUser.create({
    data: {
      username: 'admin',
      passwordHash: hashedPassword,
      email: 'admin@clinic.com',
      userType: UserType.ADMIN,
      roleId: superAdminRole.id,
      isActive: true,
    },
  });

  // Doctor مع Doctor Role
  const doctorUser = await prisma.systemUser.create({
    data: {
      username: 'doctor1',
      passwordHash: hashedPassword,
      email: doctor1.email,
      userType: UserType.DOCTOR,
      roleId: doctorRole.id,
      doctorId: doctor1.id,
      isActive: true,
    },
  });

  // Staff مع Reception Role
  const receptionUser = await prisma.systemUser.create({
    data: {
      username: 'reception',
      passwordHash: hashedPassword,
      email: staff1.email,
      userType: UserType.STAFF,
      roleId: receptionRole.id,
      staffId: staff1.id,
      isActive: true,
    },
  });

  // Staff مع Accountant Role
  const accountantUser = await prisma.systemUser.create({
    data: {
      username: 'accountant',
      passwordHash: hashedPassword,
      email: 'accountant@clinic.com',
      userType: UserType.STAFF,
      roleId: accountantRole.id,
      staffId: staff2.id,
      isActive: true,
    },
  });

  // Staff مع Nurse Role
  const nurseUser = await prisma.systemUser.create({
    data: {
      username: 'nurse',
      passwordHash: hashedPassword,
      email: 'nurse@clinic.com',
      userType: UserType.STAFF,
      roleId: nurseRole.id,
      isActive: true,
    },
  });

  // إضافة مستخدمين إضافيين للاختبار
  // Reception إضافي
  const receptionUser2 = await prisma.systemUser.create({
    data: {
      username: 'reception2',
      passwordHash: hashedPassword,
      email: 'reception2@clinic.com',
      userType: UserType.STAFF,
      roleId: receptionRole.id,
      isActive: true,
    },
  });

  // Accountant إضافي
  const accountantUser2 = await prisma.systemUser.create({
    data: {
      username: 'accountant2',
      passwordHash: hashedPassword,
      email: 'accountant2@clinic.com',
      userType: UserType.STAFF,
      roleId: accountantRole.id,
      isActive: true,
    },
  });

  // Reception ثالث
  const receptionUser3 = await prisma.systemUser.create({
    data: {
      username: 'reception3',
      passwordHash: hashedPassword,
      email: 'reception3@clinic.com',
      userType: UserType.STAFF,
      roleId: receptionRole.id,
      isActive: true,
    },
  });

  // Accountant ثالث
  const accountantUser3 = await prisma.systemUser.create({
    data: {
      username: 'accountant3',
      passwordHash: hashedPassword,
      email: 'accountant3@clinic.com',
      userType: UserType.STAFF,
      roleId: accountantRole.id,
      isActive: true,
    },
  });

  console.log(`✅ تم إنشاء ${9} مستخدم (كلمة المرور: 123456)`);
  console.log(`   📋 قائمة المستخدمين للاختبار:`);
  console.log(`   👑 Admin:`);
  console.log(`     • admin (ADMIN) → /dashboard`);
  console.log(`   👨‍⚕️ Doctors:`);
  console.log(`     • doctor1 (DOCTOR) → /dashboard`);
  console.log(`   📅 Reception (→ /appointments):`);
  console.log(`     • reception (STAFF - RECEPTION) → /appointments`);
  console.log(`     • reception2 (STAFF - RECEPTION) → /appointments`);
  console.log(`     • reception3 (STAFF - RECEPTION) → /appointments`);
  console.log(`   💰 Accountant (→ /billing):`);
  console.log(`     • accountant (STAFF - ACCOUNTANT) → /billing`);
  console.log(`     • accountant2 (STAFF - ACCOUNTANT) → /billing`);
  console.log(`     • accountant3 (STAFF - ACCOUNTANT) → /billing`);
  console.log(`   👩‍⚕️ Nurse:`);
  console.log(`     • nurse (STAFF - NURSE) → /dashboard\n`);

  // ====================================
  // 5️⃣ إنشاء جداول العمل
  // ====================================
  console.log('📅 إنشاء جداول العمل...');
  const workingSchedules = await Promise.all([
    // جدول الطبيب الأول
    prisma.workingSchedule.create({
      data: {
        doctorId: doctor1.id,
        dayOfWeek: 0, // الأحد
        dayName: DayName.SUNDAY,
        startTime: new Date('1970-01-01T09:00:00'),
        endTime: new Date('1970-01-01T13:00:00'),
        slotDurationMinutes: 30,
        maxPatientsPerSlot: 1,
        isActive: true,
      },
    }),
    prisma.workingSchedule.create({
      data: {
        doctorId: doctor1.id,
        dayOfWeek: 1, // الاثنين
        dayName: DayName.MONDAY,
        startTime: new Date('1970-01-01T09:00:00'),
        endTime: new Date('1970-01-01T13:00:00'),
        slotDurationMinutes: 30,
        maxPatientsPerSlot: 1,
        isActive: true,
      },
    }),
    prisma.workingSchedule.create({
      data: {
        doctorId: doctor1.id,
        dayOfWeek: 2, // الثلاثاء
        dayName: DayName.TUESDAY,
        startTime: new Date('1970-01-01T09:00:00'),
        endTime: new Date('1970-01-01T13:00:00'),
        slotDurationMinutes: 30,
        maxPatientsPerSlot: 1,
        isActive: true,
      },
    }),
    // جدول الطبيبة الثانية
    prisma.workingSchedule.create({
      data: {
        doctorId: doctor2.id,
        dayOfWeek: 3, // الأربعاء
        dayName: DayName.WEDNESDAY,
        startTime: new Date('1970-01-01T10:00:00'),
        endTime: new Date('1970-01-01T14:00:00'),
        slotDurationMinutes: 30,
        maxPatientsPerSlot: 1,
        isActive: true,
      },
    }),
    prisma.workingSchedule.create({
      data: {
        doctorId: doctor2.id,
        dayOfWeek: 4, // الخميس
        dayName: DayName.THURSDAY,
        startTime: new Date('1970-01-01T10:00:00'),
        endTime: new Date('1970-01-01T14:00:00'),
        slotDurationMinutes: 30,
        maxPatientsPerSlot: 1,
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ تم إنشاء ${workingSchedules.length} جدول عمل\n`);

  // ====================================
  // 6️⃣ إنشاء المرضى
  // ====================================
  console.log('👩 إنشاء المرضى...');
  const patient1 = await prisma.patient.create({
    data: {
      nationalId: '56789012345678',
      firstName: 'نورا',
      lastName: 'محمد',
      birthDate: new Date('1990-05-15'),
      bloodType: BloodType.O_POSITIVE,
      phone: '01056789012',
      phone2: '01056789013',
      email: 'nora.mohamed@email.com',
      address: 'مدينة نصر، القاهرة',
      city: 'القاهرة',
      maritalStatus: MaritalStatus.MARRIED,
      occupation: 'معلمة',
      emergencyContactName: 'محمد أحمد',
      emergencyContactPhone: '01033333333',
      emergencyContactRelation: 'زوج',
      registrationDate: new Date('2024-01-10'),
      isActive: true,
    },
  });

  const patient2 = await prisma.patient.create({
    data: {
      nationalId: '67890123456789',
      firstName: 'سلمى',
      lastName: 'علي',
      birthDate: new Date('1988-08-20'),
      bloodType: BloodType.A_POSITIVE,
      phone: '01067890123',
      email: 'salma.ali@email.com',
      address: 'المعادي، القاهرة',
      city: 'القاهرة',
      maritalStatus: MaritalStatus.MARRIED,
      occupation: 'مهندسة',
      emergencyContactName: 'علي حسن',
      emergencyContactPhone: '01044444444',
      emergencyContactRelation: 'زوج',
      registrationDate: new Date('2024-02-05'),
      isActive: true,
    },
  });

  const patient3 = await prisma.patient.create({
    data: {
      nationalId: '78901234567890',
      firstName: 'ليلى',
      lastName: 'حسن',
      birthDate: new Date('1992-12-10'),
      bloodType: BloodType.B_POSITIVE,
      phone: '01078901234',
      address: 'الزمالك، القاهرة',
      city: 'القاهرة',
      maritalStatus: MaritalStatus.SINGLE,
      occupation: 'طالبة',
      registrationDate: new Date('2024-03-15'),
      isActive: true,
    },
  });

  console.log(`✅ تم إنشاء ${3} مريضة\n`);

  // ====================================
  // 7️⃣ إنشاء التاريخ المرضي
  // ====================================
  console.log('📋 إنشاء التاريخ المرضي...');
  await prisma.medicalHistory.create({
    data: {
      patientId: patient1.id,
      chronicDiseases: 'لا توجد',
      previousSurgeries: 'عملية استئصال الزائدة الدودية - 2015',
      allergies: 'حساسية من البنسلين',
      currentMedications: 'مكملات الحديد',
      familyHistory: 'سكري في العائلة',
      gynecologicalHistory: 'دورة شهرية منتظمة',
      ageOfMenarche: 13,
      lastMenstrualPeriod: new Date('2024-12-01'),
      menstrualCycleLength: 28,
      menstrualCycleRegularity: CycleRegularity.REGULAR,
      menstrualFlow: MenstrualFlow.MODERATE,
      contraceptionMethod: 'حبوب منع الحمل',
      gravida: 2,
      para: 1,
      abortion: 0,
      livingChildren: 1,
    },
  });

  await prisma.medicalHistory.create({
    data: {
      patientId: patient2.id,
      chronicDiseases: 'لا توجد',
      previousSurgeries: 'لا توجد',
      allergies: 'لا توجد',
      currentMedications: 'لا توجد',
      familyHistory: 'لا توجد',
      gynecologicalHistory: 'دورة شهرية منتظمة',
      ageOfMenarche: 12,
      lastMenstrualPeriod: new Date('2024-11-25'),
      menstrualCycleLength: 30,
      menstrualCycleRegularity: CycleRegularity.REGULAR,
      menstrualFlow: MenstrualFlow.HEAVY,
      gravida: 0,
      para: 0,
      abortion: 0,
      livingChildren: 0,
    },
  });

  console.log(`✅ تم إنشاء التاريخ المرضي\n`);

  // ====================================
  // 8️⃣ إنشاء سجلات الحمل
  // ====================================
  console.log('🤰 إنشاء سجلات الحمل...');
  const pregnancy1 = await prisma.pregnancyRecord.create({
    data: {
      patientId: patient1.id,
      pregnancyNumber: 2,
      lmpDate: new Date('2024-05-01'),
      eddDate: new Date('2025-02-08'),
      conceptionMethod: ConceptionMethod.NATURAL,
      pregnancyType: PregnancyType.SINGLE,
      pregnancyStatus: PregnancyStatus.CURRENT,
      riskLevel: RiskLevel.LOW,
    },
  });

  const pregnancy2 = await prisma.pregnancyRecord.create({
    data: {
      patientId: patient2.id,
      pregnancyNumber: 1,
      lmpDate: new Date('2024-04-15'),
      eddDate: new Date('2025-01-22'),
      conceptionMethod: ConceptionMethod.IVF,
      pregnancyType: PregnancyType.SINGLE,
      pregnancyStatus: PregnancyStatus.CURRENT,
      riskLevel: RiskLevel.MEDIUM,
    },
  });

  console.log(`✅ تم إنشاء ${2} سجل حمل\n`);

  // ====================================
  // 9️⃣ إنشاء المواعيد
  // ====================================
  console.log('📅 إنشاء المواعيد...');
  const appointment1 = await prisma.appointment.create({
    data: {
      patientId: patient1.id,
      doctorId: doctor1.id,
      appointmentDate: new Date('2024-12-20'),
      appointmentTime: new Date('1970-01-01T10:00:00'),
      appointmentType: AppointmentType.FOLLOWUP,
      status: AppointmentStatus.BOOKED,
      priority: Priority.NORMAL,
      durationMinutes: 30,
    },
  });

  const appointment2 = await prisma.appointment.create({
    data: {
      patientId: patient2.id,
      doctorId: doctor2.id,
      appointmentDate: new Date('2024-12-21'),
      appointmentTime: new Date('1970-01-01T11:00:00'),
      appointmentType: AppointmentType.ULTRASOUND,
      status: AppointmentStatus.BOOKED,
      priority: Priority.NORMAL,
      durationMinutes: 30,
    },
  });

  const appointment3 = await prisma.appointment.create({
    data: {
      patientId: patient3.id,
      doctorId: doctor1.id,
      appointmentDate: new Date('2024-12-22'),
      appointmentTime: new Date('1970-01-01T09:30:00'),
      appointmentType: AppointmentType.FIRST_VISIT,
      status: AppointmentStatus.CONFIRMED,
      priority: Priority.URGENT,
      durationMinutes: 45,
    },
  });

  console.log(`✅ تم إنشاء ${3} موعد\n`);

  // ====================================
  // 🔟 إنشاء الزيارات الطبية
  // ====================================
  console.log('🏥 إنشاء الزيارات الطبية...');
  const visit1 = await prisma.medicalVisit.create({
    data: {
      appointmentId: appointment1.id,
      patientId: patient1.id,
      doctorId: doctor1.id,
      visitDate: new Date('2024-12-15'),
      visitStartTime: new Date('2024-12-15T10:00:00'),
      visitEndTime: new Date('2024-12-15T10:30:00'),
      chiefComplaint: 'متابعة الحمل',
      symptoms: 'لا توجد أعراض',
      weight: 65.5,
      height: 165,
      bloodPressureSystolic: 120,
      bloodPressureDiastolic: 80,
      temperature: 36.5,
      pulse: 75,
      visitType: 'متابعة حمل',
      examinationFindings: 'الحمل يسير بشكل طبيعي',
      treatmentPlan: 'متابعة دورية',
      recommendations: 'تناول المكملات الغذائية',
      visitStatus: VisitStatus.COMPLETED,
    },
  });

  const visit2 = await prisma.medicalVisit.create({
    data: {
      appointmentId: appointment2.id,
      patientId: patient2.id,
      doctorId: doctor2.id,
      visitDate: new Date('2024-12-10'),
      visitStartTime: new Date('2024-12-10T11:00:00'),
      visitEndTime: new Date('2024-12-10T11:30:00'),
      chiefComplaint: 'سونار',
      weight: 58.0,
      height: 160,
      bloodPressureSystolic: 115,
      bloodPressureDiastolic: 75,
      visitType: 'سونار',
      examinationFindings: 'الجنين بحالة جيدة',
      visitStatus: VisitStatus.COMPLETED,
    },
  });

  console.log(`✅ تم إنشاء ${2} زيارة طبية\n`);

  // ====================================
  // 1️⃣1️⃣ إنشاء متابعة الحمل
  // ====================================
  console.log('📊 إنشاء متابعة الحمل...');
  await prisma.pregnancyFollowup.create({
    data: {
      pregnancyId: pregnancy1.id,
      visitId: visit1.id,
      visitDate: new Date('2024-12-15'),
      visitNumber: 3,
      gestationalAgeWeeks: 32.5,
      gestationalAgeDays: 227,
      fundalHeight: 32.0,
      fetalHeartRate: 145,
      fetalMovement: FetalMovement.NORMAL,
      maternalWeight: 65.5,
      weightGain: 2.5,
      bloodPressure: '120/80',
      recommendations: 'متابعة أسبوعية',
      nextVisitDate: new Date('2024-12-22'),
    },
  });

  console.log(`✅ تم إنشاء متابعة الحمل\n`);

  // ====================================
  // 1️⃣2️⃣ إنشاء التشخيصات
  // ====================================
  console.log('🔍 إنشاء التشخيصات...');
  await prisma.diagnosis.create({
    data: {
      visitId: visit1.id,
      patientId: patient1.id,
      icdCode: 'O09.9',
      diagnosisName: 'حمل طبيعي',
      diagnosisNameEn: 'Normal Pregnancy',
      diagnosisType: DiagnosisType.PRIMARY,
      severity: Severity.MILD,
      diagnosisDate: new Date('2024-12-15'),
      isChronic: false,
      isResolved: false,
    },
  });

  console.log(`✅ تم إنشاء التشخيصات\n`);

  // ====================================
  // 1️⃣3️⃣ إنشاء الأدوية
  // ====================================
  console.log('💊 إنشاء الأدوية...');
  const medication1 = await prisma.medication.create({
    data: {
      medicationName: 'فيروجلوبين',
      genericName: 'Ferrous Fumarate',
      scientificName: 'Ferrous Fumarate',
      category: 'مكملات غذائية',
      subcategory: 'حديد',
      form: MedicationForm.TABLETS,
      strength: '200',
      unit: 'mg',
      manufacturer: 'شركة فاركو',
      pregnancyCategory: 'A',
      breastfeedingSafe: true,
      price: 45.0,
      isActive: true,
    },
  });

  const medication2 = await prisma.medication.create({
    data: {
      medicationName: 'فوليك أسيد',
      genericName: 'Folic Acid',
      scientificName: 'Folic Acid',
      category: 'فيتامينات',
      subcategory: 'فيتامين ب',
      form: MedicationForm.TABLETS,
      strength: '5',
      unit: 'mg',
      manufacturer: 'شركة إيبيكو',
      pregnancyCategory: 'A',
      breastfeedingSafe: true,
      price: 25.0,
      isActive: true,
    },
  });

  console.log(`✅ تم إنشاء ${2} دواء\n`);

  // ====================================
  // 1️⃣4️⃣ إنشاء الروشتات
  // ====================================
  console.log('📝 إنشاء الروشتات...');
  const prescription1 = await prisma.prescription.create({
    data: {
      visitId: visit1.id,
      patientId: patient1.id,
      doctorId: doctor1.id,
      prescriptionDate: new Date('2024-12-15'),
      isEmergency: false,
      isChronicMedication: false,
      refillsAllowed: 2,
      refillsUsed: 0,
    },
  });

  await prisma.prescriptionDetail.create({
    data: {
      prescriptionId: prescription1.id,
      medicationId: medication1.id,
      dosage: 'قرص واحد',
      frequency: 'مرة واحدة يومياً',
      frequencyPerDay: 1,
      route: MedicationRoute.ORAL,
      timing: 'بعد الأكل',
      durationDays: 30,
      totalQuantity: 30,
      instructions: 'يؤخذ بعد الأكل لتجنب اضطراب المعدة',
    },
  });

  await prisma.prescriptionDetail.create({
    data: {
      prescriptionId: prescription1.id,
      medicationId: medication2.id,
      dosage: 'قرص واحد',
      frequency: 'مرة واحدة يومياً',
      frequencyPerDay: 1,
      route: MedicationRoute.ORAL,
      durationDays: 30,
      totalQuantity: 30,
    },
  });

  console.log(`✅ تم إنشاء الروشتات\n`);

  // ====================================
  // 1️⃣5️⃣ إنشاء التحاليل المعملية
  // ====================================
  console.log('🧪 إنشاء التحاليل المعملية...');
  const labTest1 = await prisma.labTest.create({
    data: {
      testCode: 'CBC',
      testName: 'صورة دم كاملة',
      testNameEn: 'Complete Blood Count',
      testCategory: LabCategory.BLOOD,
      normalRangeMin: 4.0,
      normalRangeMax: 5.5,
      normalRangeText: '4.0-5.5 مليون/مم³',
      unit: 'مليون/مم³',
      sampleType: 'دم',
      fastingRequired: false,
      price: 150.0,
      isActive: true,
    },
  });

  const labTest2 = await prisma.labTest.create({
    data: {
      testCode: 'HB',
      testName: 'هيموجلوبين',
      testNameEn: 'Hemoglobin',
      testCategory: LabCategory.BLOOD,
      normalRangeMin: 12.0,
      normalRangeMax: 16.0,
      normalRangeText: '12-16 جم/دل',
      unit: 'جم/دل',
      sampleType: 'دم',
      fastingRequired: false,
      price: 50.0,
      isActive: true,
    },
  });

  const labOrder1 = await prisma.labOrder.create({
    data: {
      visitId: visit1.id,
      patientId: patient1.id,
      doctorId: doctor1.id,
      orderDate: new Date('2024-12-15'),
      orderReason: 'متابعة الحمل',
      priority: Priority.NORMAL,
      status: LabOrderStatus.PENDING,
      expectedResultDate: new Date('2024-12-17'),
    },
  });

  await prisma.labResult.create({
    data: {
      orderId: labOrder1.id,
      testId: labTest1.id,
      resultValue: '4.8',
      resultNumeric: 4.8,
      resultStatus: ResultStatus.NORMAL,
      resultDate: new Date('2024-12-16'),
      performedBy: 'مختبر المركز',
      isCritical: false,
    },
  });

  await prisma.labResult.create({
    data: {
      orderId: labOrder1.id,
      testId: labTest2.id,
      resultValue: '13.5',
      resultNumeric: 13.5,
      resultStatus: ResultStatus.NORMAL,
      resultDate: new Date('2024-12-16'),
      performedBy: 'مختبر المركز',
      isCritical: false,
    },
  });

  console.log(`✅ تم إنشاء التحاليل المعملية\n`);

  // ====================================
  // 1️⃣6️⃣ إنشاء طلبات الأشعة
  // ====================================
  console.log('📷 إنشاء طلبات الأشعة...');
  const radiologyOrder1 = await prisma.radiologyOrder.create({
    data: {
      visitId: visit2.id,
      patientId: patient2.id,
      doctorId: doctor2.id,
      pregnancyId: pregnancy2.id,
      examType: RadiologyType.ULTRASOUND,
      examArea: 'البطن والحوض',
      examReason: 'متابعة الحمل',
      orderDate: new Date('2024-12-10'),
      examDate: new Date('2024-12-10'),
      gestationalAgeAtScan: 33.5,
      findings: 'الجنين بحالة جيدة، المشيمة في الوضع الطبيعي',
      impression: 'حمل طبيعي',
      status: RadiologyStatus.COMPLETED,
      performedBy: 'د. أحمد',
    },
  });

  console.log(`✅ تم إنشاء طلبات الأشعة\n`);

  // ====================================
  // 1️⃣7️⃣ إنشاء الخدمات
  // ====================================
  console.log('💰 إنشاء الخدمات...');
  const service1 = await prisma.service.create({
    data: {
      serviceCode: 'SVC-001',
      serviceName: 'كشف أول',
      serviceCategory: ServiceCategory.CONSULTATION,
      description: 'كشف أول للمريضة',
      basePrice: 500,
      insurancePrice: 400,
      durationMinutes: 30,
      isTaxable: true,
      taxPercentage: 14,
      isActive: true,
    },
  });

  const service2 = await prisma.service.create({
    data: {
      serviceCode: 'SVC-002',
      serviceName: 'متابعة',
      serviceCategory: ServiceCategory.CONSULTATION,
      description: 'كشف متابعة',
      basePrice: 300,
      insurancePrice: 250,
      durationMinutes: 20,
      isTaxable: true,
      taxPercentage: 14,
      isActive: true,
    },
  });

  const service3 = await prisma.service.create({
    data: {
      serviceCode: 'SVC-003',
      serviceName: 'سونار',
      serviceCategory: ServiceCategory.RADIOLOGY,
      description: 'سونار للحمل',
      basePrice: 400,
      insurancePrice: 350,
      durationMinutes: 30,
      isTaxable: true,
      taxPercentage: 14,
      isActive: true,
    },
  });

  console.log(`✅ تم إنشاء ${3} خدمة\n`);

  // ====================================
  // 1️⃣8️⃣ إنشاء شركات التأمين
  // ====================================
  console.log('🏢 إنشاء شركات التأمين...');
  const insurance1 = await prisma.insuranceCompany.create({
    data: {
      companyCode: 'INS-001',
      companyName: 'شركة التأمين الصحي',
      companyNameEn: 'Health Insurance Company',
      contactPerson: 'أحمد محمد',
      phone: '01099999999',
      email: 'info@insurance.com',
      address: 'القاهرة، مصر',
      city: 'القاهرة',
      coveragePercentage: 80,
      copayAmount: 50,
      deductibleAmount: 500,
      maxCoveragePerVisit: 2000,
      maxCoverageAnnual: 50000,
      approvalRequired: true,
      isActive: true,
    },
  });

  console.log(`✅ تم إنشاء شركة تأمين\n`);

  // ====================================
  // 1️⃣9️⃣ إنشاء تأمين المرضى
  // ====================================
  console.log('🛡️ إنشاء تأمين المرضى...');
  await prisma.patientInsurance.create({
    data: {
      patientId: patient1.id,
      insuranceId: insurance1.id,
      policyNumber: 'POL-001',
      memberId: 'MEM-001',
      policyHolderName: 'نورا محمد',
      relationshipToHolder: 'حامل البوليصة',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      coverageType: 'تأمين صحي شامل',
      preauthorizationRequired: true,
      isPrimary: true,
      isActive: true,
    },
  });

  console.log(`✅ تم إنشاء تأمين المرضى\n`);

  // ====================================
  // 2️⃣0️⃣ إنشاء الفواتير
  // ====================================
  console.log('🧾 إنشاء الفواتير...');
  const invoice1 = await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-2024-001',
      patientId: patient1.id,
      visitId: visit1.id,
      invoiceDate: new Date('2024-12-15'),
      dueDate: new Date('2024-12-30'),
      subtotalAmount: 800,
      discountPercentage: 0,
      discountAmount: 0,
      taxAmount: 112,
      totalAmount: 912,
      insuranceCoverage: 640,
      patientResponsibility: 272,
      netAmount: 912,
      paymentStatus: PaymentStatus.PARTIALLY_PAID,
      paidAmount: 150,
      remainingAmount: 762,
      insuranceId: insurance1.id,
    },
  });

  await prisma.invoiceDetail.create({
    data: {
      invoiceId: invoice1.id,
      serviceId: service2.id,
      itemType: ItemType.SERVICE,
      description: 'كشف متابعة',
      quantity: 1,
      unitPrice: 300,
      discountAmount: 0,
      taxAmount: 42,
      totalPrice: 342,
    },
  });

  await prisma.invoiceDetail.create({
    data: {
      invoiceId: invoice1.id,
      serviceId: service3.id,
      itemType: ItemType.SERVICE,
      description: 'سونار',
      quantity: 1,
      unitPrice: 400,
      discountAmount: 0,
      taxAmount: 56,
      totalPrice: 456,
    },
  });

  console.log(`✅ تم إنشاء الفواتير\n`);

  // ====================================
  // 2️⃣1️⃣ إنشاء المدفوعات
  // ====================================
  console.log('💳 إنشاء المدفوعات...');
      await prisma.payment.create({
        data: {
          paymentNumber: 'PAY-2024-001',
          invoiceId: invoice1.id,
          paymentDate: new Date('2024-12-15'),
          paymentTime: new Date('2024-12-15T14:30:00'),
          paymentAmount: 150,
          paymentMethod: PaymentMethod.CASH,
          processedBy: accountantUser.id,
          receiptNumber: 'REC-001',
          isRefund: false,
        },
      });

  console.log(`✅ تم إنشاء المدفوعات\n`);

  // ====================================
  // 2️⃣2️⃣ إنشاء العمليات الجراحية
  // ====================================
  console.log('🏥 إنشاء العمليات الجراحية...');
  const surgery1 = await prisma.surgery.create({
    data: {
      patientId: patient3.id,
      doctorId: doctor1.id,
      surgeryName: 'منظار تشخيصي',
      surgeryType: SurgeryType.DIAGNOSTIC,
      scheduledDate: new Date('2025-01-10'),
      scheduledTime: new Date('2025-01-10T09:00:00'),
      expectedDurationMinutes: 60,
      status: SurgeryStatus.SCHEDULED,
    },
  });

  console.log(`✅ تم إنشاء العملية الجراحية\n`);

  // ====================================
  // 2️⃣3️⃣ إنشاء سجل النشاطات
  // ====================================
  console.log('📝 إنشاء سجل النشاطات...');
  await prisma.auditLog.create({
    data: {
      userId: adminUser.id,
      actionType: ActionType.CREATE,
      tableName: 'patients',
      recordId: patient1.id,
      newValue: JSON.stringify({ name: 'نورا محمد' }),
      ipAddress: '192.168.1.1',
      actionTimestamp: new Date('2024-12-15T10:00:00'),
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: doctorUser.id,
      actionType: ActionType.CREATE,
      tableName: 'appointments',
      recordId: appointment1.id,
      newValue: JSON.stringify({ date: '2024-12-20' }),
      ipAddress: '192.168.1.2',
      actionTimestamp: new Date('2024-12-15T11:00:00'),
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: receptionUser.id,
      actionType: ActionType.CREATE,
      tableName: 'appointments',
      recordId: appointment2.id,
      newValue: JSON.stringify({ date: '2024-12-21' }),
      ipAddress: '192.168.1.3',
      actionTimestamp: new Date('2024-12-15T12:00:00'),
    },
  });

  console.log(`✅ تم إنشاء سجل النشاطات\n`);

  console.log('✅ تم إدخال جميع البيانات بنجاح! 🎉\n');
  console.log('📊 ملخص البيانات:');
  console.log(`   - ${2} طبيب`);
  console.log(`   - ${2} موظف`);
  console.log(`   - ${3} مريضة`);
  console.log(`   - ${3} موعد`);
  console.log(`   - ${2} زيارة طبية`);
  console.log(`   - ${2} سجل حمل`);
  console.log(`   - ${2} دواء`);
  console.log(`   - ${1} روشتة`);
  console.log(`   - ${2} تحليل معملي`);
  console.log(`   - ${1} طلب أشعة`);
  console.log(`   - ${3} خدمة`);
  console.log(`   - ${1} شركة تأمين`);
  console.log(`   - ${1} فاتورة`);
  console.log(`   - ${1} عملية جراحية`);
  console.log(`   - ${9} مستخدم (كلمة المرور: 123456)`);
  console.log(`     📋 قائمة المستخدمين للاختبار:`);
  console.log(`     👑 Admin:`);
  console.log(`       • admin (ADMIN) → /dashboard`);
  console.log(`     👨‍⚕️ Doctors:`);
  console.log(`       • doctor1 (DOCTOR) → /dashboard`);
  console.log(`     📅 Reception (→ /appointments):`);
  console.log(`       • reception (STAFF - RECEPTION) → /appointments`);
  console.log(`       • reception2 (STAFF - RECEPTION) → /appointments`);
  console.log(`       • reception3 (STAFF - RECEPTION) → /appointments`);
  console.log(`     💰 Accountant (→ /billing):`);
  console.log(`       • accountant (STAFF - ACCOUNTANT) → /billing`);
  console.log(`       • accountant2 (STAFF - ACCOUNTANT) → /billing`);
  console.log(`       • accountant3 (STAFF - ACCOUNTANT) → /billing`);
  console.log(`     👩‍⚕️ Nurse:`);
  console.log(`       • nurse (STAFF - NURSE) → /dashboard`);
}

main()
  .catch((e) => {
    console.error('❌ خطأ في إدخال البيانات:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
