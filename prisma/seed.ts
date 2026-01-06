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
  BabyGender,
  PaymentMethod,
  PaymentStatus,
  AppointmentStatus,
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
  await prisma.payment.deleteMany();
  await prisma.invoiceItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.prescriptionItem.deleteMany();
  await prisma.prescription.deleteMany();
  await prisma.pregnancyFollowup.deleteMany();
  await prisma.pregnancyRecord.deleteMany();
  await prisma.diagnosis.deleteMany();
  await prisma.medicalVisit.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.medicalHistory.deleteMany();
  await prisma.insurance.deleteMany();
  await prisma.template.deleteMany();
  await prisma.workingSchedule.deleteMany();
  await prisma.user.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.medication.deleteMany();
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
      licenseNumber: 'DOC-001',
      phone: '01012345678',
      isActive: true,
    },
  });

  const doctor2 = await prisma.doctor.create({
    data: {
      nationalId: '23456789012345',
      firstName: 'فاطمة',
      lastName: 'علي',
      specialization: 'نساء وتوليد',
      licenseNumber: 'DOC-002',
      phone: '01023456789',
      isActive: true,
    },
  });

  const doctor3 = await prisma.doctor.create({
    data: {
      nationalId: '34567890123456',
      firstName: 'محمود',
      lastName: 'حسن',
      specialization: 'نساء وتوليد',
      licenseNumber: 'DOC-003',
      phone: '01034567890',
      isActive: true,
    },
  });

  const doctor4 = await prisma.doctor.create({
    data: {
      nationalId: '45678901234567',
      firstName: 'سارة',
      lastName: 'إبراهيم',
      specialization: 'نساء وتوليد',
      licenseNumber: 'DOC-004',
      phone: '01045678901',
      isActive: true,
    },
  });

  console.log(`✅ تم إنشاء ${4} أطباء\n`);

  // ====================================
  // 2️⃣ إنشاء المستخدمين
  // ====================================
  console.log('👤 إنشاء المستخدمين...');
  const hashedPassword = await bcrypt.hash('123456', 10);

  // Admin
  const adminUser = await prisma.user.create({
    data: {
      username: 'admin',
      passwordHash: hashedPassword,
      role: 'ADMIN',
      firstName: 'مدير',
      lastName: 'النظام',
      email: 'admin@clinic.com',
      phone: '01000000000',
      isActive: true,
    },
  });

  // Doctors
  const doctorUser = await prisma.user.create({
    data: {
      username: 'doctor1',
      passwordHash: hashedPassword,
      role: 'DOCTOR',
      doctorId: doctor1.id,
      firstName: doctor1.firstName,
      lastName: doctor1.lastName,
      email: 'doctor1@clinic.com',
      phone: doctor1.phone,
      isActive: true,
    },
  });

  const doctorUser2 = await prisma.user.create({
    data: {
      username: 'doctor2',
      passwordHash: hashedPassword,
      role: 'DOCTOR',
      doctorId: doctor2.id,
      firstName: doctor2.firstName,
      lastName: doctor2.lastName,
      email: 'doctor2@clinic.com',
      phone: doctor2.phone,
      isActive: true,
    },
  });

  const doctorUser3 = await prisma.user.create({
    data: {
      username: 'doctor3',
      passwordHash: hashedPassword,
      role: 'DOCTOR',
      doctorId: doctor3.id,
      firstName: doctor3.firstName,
      lastName: doctor3.lastName,
      email: 'doctor3@clinic.com',
      phone: doctor3.phone,
      isActive: true,
    },
  });

  // Receptionists
  const receptionUser = await prisma.user.create({
    data: {
      username: 'reception',
      passwordHash: hashedPassword,
      role: 'RECEPTIONIST',
      firstName: 'سارة',
      lastName: 'أحمد',
      email: 'reception@clinic.com',
      phone: '01034567890',
      isActive: true,
    },
  });

  const receptionUser2 = await prisma.user.create({
    data: {
      username: 'reception2',
      passwordHash: hashedPassword,
      role: 'RECEPTIONIST',
      firstName: 'مريم',
      lastName: 'حسن',
      email: 'reception2@clinic.com',
      phone: '01045678901',
      isActive: true,
    },
  });

  const receptionUser3 = await prisma.user.create({
    data: {
      username: 'reception3',
      passwordHash: hashedPassword,
      role: 'RECEPTIONIST',
      firstName: 'رانيا',
      lastName: 'محمود',
      email: 'reception3@clinic.com',
      phone: '01056789012',
      isActive: true,
    },
  });

  console.log(`✅ تم إنشاء ${7} مستخدمين (كلمة المرور: 123456)`);
  console.log(`   📋 قائمة المستخدمين للاختبار:`);
  console.log(`   👑 Admin:`);
  console.log(`     • admin (ADMIN) → /dashboard`);
  console.log(`   👨‍⚕️ Doctors:`);
  console.log(`     • doctor1 (DOCTOR) → /dashboard`);
  console.log(`     • doctor2 (DOCTOR) → /dashboard`);
  console.log(`     • doctor3 (DOCTOR) → /dashboard`);
  console.log(`   📅 Reception (→ /appointments):`);
  console.log(`     • reception (RECEPTIONIST) → /appointments`);
  console.log(`     • reception2 (RECEPTIONIST) → /appointments`);
  console.log(`     • reception3 (RECEPTIONIST) → /appointments\n`);

  // ====================================
  // 3️⃣ إنشاء جداول العمل
  // ====================================
  console.log('📅 إنشاء جداول العمل...');
  const workingSchedules = await Promise.all([
    // جدول الطبيب الأول
    prisma.workingSchedule.create({
      data: {
        doctorId: doctor1.id,
        dayOfWeek: 0, // الأحد
        dayName: 'الأحد',
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
        dayName: 'الاثنين',
        startTime: new Date('1970-01-01T09:00:00'),
        endTime: new Date('1970-01-01T14:00:00'),
        slotDurationMinutes: 30,
        maxPatientsPerSlot: 1,
        isActive: true,
      },
    }),
    prisma.workingSchedule.create({
      data: {
        doctorId: doctor1.id,
        dayOfWeek: 2, // الثلاثاء
        dayName: 'الثلاثاء',
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
        dayOfWeek: 3, // الأربعاء
        dayName: 'الأربعاء',
        startTime: new Date('1970-01-01T10:00:00'),
        endTime: new Date('1970-01-01T14:00:00'),
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
        dayName: 'الأربعاء',
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
        dayName: 'الخميس',
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
        dayOfWeek: 5, // الجمعة
        dayName: 'الجمعة',
        startTime: new Date('1970-01-01T16:00:00'),
        endTime: new Date('1970-01-01T19:00:00'),
        slotDurationMinutes: 30,
        maxPatientsPerSlot: 1,
        isActive: true,
      },
    }),
    // جدول الطبيب الثالث
    prisma.workingSchedule.create({
      data: {
        doctorId: doctor3.id,
        dayOfWeek: 1, // الاثنين
        dayName: 'الاثنين',
        startTime: new Date('1970-01-01T14:00:00'),
        endTime: new Date('1970-01-01T18:00:00'),
        slotDurationMinutes: 30,
        maxPatientsPerSlot: 1,
        isActive: true,
      },
    }),
    prisma.workingSchedule.create({
      data: {
        doctorId: doctor3.id,
        dayOfWeek: 2, // الثلاثاء
        dayName: 'الثلاثاء',
        startTime: new Date('1970-01-01T14:00:00'),
        endTime: new Date('1970-01-01T18:00:00'),
        slotDurationMinutes: 30,
        maxPatientsPerSlot: 1,
        isActive: true,
      },
    }),
    prisma.workingSchedule.create({
      data: {
        doctorId: doctor3.id,
        dayOfWeek: 4, // الخميس
        dayName: 'الخميس',
        startTime: new Date('1970-01-01T14:00:00'),
        endTime: new Date('1970-01-01T18:00:00'),
        slotDurationMinutes: 30,
        maxPatientsPerSlot: 1,
        isActive: true,
      },
    }),
    // جدول الطبيبة الرابعة
    prisma.workingSchedule.create({
      data: {
        doctorId: doctor4.id,
        dayOfWeek: 0, // الأحد
        dayName: 'الأحد',
        startTime: new Date('1970-01-01T08:00:00'),
        endTime: new Date('1970-01-01T12:00:00'),
        slotDurationMinutes: 30,
        maxPatientsPerSlot: 1,
        isActive: true,
      },
    }),
    prisma.workingSchedule.create({
      data: {
        doctorId: doctor4.id,
        dayOfWeek: 2, // الثلاثاء
        dayName: 'الثلاثاء',
        startTime: new Date('1970-01-01T08:00:00'),
        endTime: new Date('1970-01-01T12:00:00'),
        slotDurationMinutes: 30,
        maxPatientsPerSlot: 1,
        isActive: true,
      },
    }),
    prisma.workingSchedule.create({
      data: {
        doctorId: doctor4.id,
        dayOfWeek: 4, // الخميس
        dayName: 'الخميس',
        startTime: new Date('1970-01-01T08:00:00'),
        endTime: new Date('1970-01-01T12:00:00'),
        slotDurationMinutes: 30,
        maxPatientsPerSlot: 1,
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ تم إنشاء ${workingSchedules.length} جدول عمل\n`);

  // ====================================
  // 4️⃣ إنشاء المرضى
  // ====================================
  console.log('👩 إنشاء المرضى...');
  const patients = await Promise.all([
    prisma.patient.create({
      data: {
        nationalId: '56789012345678',
        firstName: 'نورا',
        lastName: 'محمد',
        birthDate: new Date('1990-05-15'),
        bloodType: BloodType.O_POSITIVE,
        phone: '01056789012',
        phone2: '01056789013',
        address: 'مدينة نصر، القاهرة',
        maritalStatus: MaritalStatus.MARRIED,
        emergencyContactName: 'محمد أحمد',
        emergencyContactPhone: '01033333333',
        emergencyContactRelation: 'زوج',
        registrationDate: new Date('2024-01-10'),
        isActive: true,
      },
    }),
    prisma.patient.create({
      data: {
        nationalId: '67890123456789',
        firstName: 'سلمى',
        lastName: 'علي',
        birthDate: new Date('1988-08-20'),
        bloodType: BloodType.A_POSITIVE,
        phone: '01067890123',
        address: 'المعادي، القاهرة',
        maritalStatus: MaritalStatus.MARRIED,
        emergencyContactName: 'علي حسن',
        emergencyContactPhone: '01044444444',
        emergencyContactRelation: 'زوج',
        registrationDate: new Date('2024-02-05'),
        isActive: true,
      },
    }),
    prisma.patient.create({
      data: {
        nationalId: '78901234567890',
        firstName: 'ليلى',
        lastName: 'حسن',
        birthDate: new Date('1992-12-10'),
        bloodType: BloodType.B_POSITIVE,
        phone: '01078901234',
        address: 'الزمالك، القاهرة',
        maritalStatus: MaritalStatus.SINGLE,
        registrationDate: new Date('2024-03-15'),
        isActive: true,
      },
    }),
    prisma.patient.create({
      data: {
        nationalId: '89012345678901',
        firstName: 'دينا',
        lastName: 'محمود',
        birthDate: new Date('1995-03-22'),
        bloodType: BloodType.AB_POSITIVE,
        phone: '01089012345',
        address: 'شبرا، القاهرة',
        maritalStatus: MaritalStatus.MARRIED,
        emergencyContactName: 'أحمد علي',
        emergencyContactPhone: '01055555555',
        emergencyContactRelation: 'زوج',
        registrationDate: new Date('2024-04-01'),
        isActive: true,
      },
    }),
    prisma.patient.create({
      data: {
        nationalId: '90123456789012',
        firstName: 'هناء',
        lastName: 'إبراهيم',
        birthDate: new Date('1987-07-18'),
        bloodType: BloodType.O_NEGATIVE,
        phone: '01090123456',
        address: 'التجمع الخامس، القاهرة',
        maritalStatus: MaritalStatus.MARRIED,
        emergencyContactName: 'محمود حسين',
        emergencyContactPhone: '01066666666',
        emergencyContactRelation: 'زوج',
        registrationDate: new Date('2024-05-10'),
        isActive: true,
      },
    }),
    prisma.patient.create({
      data: {
        nationalId: '01234567890123',
        firstName: 'شيماء',
        lastName: 'عبدالله',
        birthDate: new Date('1994-09-05'),
        bloodType: BloodType.A_NEGATIVE,
        phone: '01001234567',
        address: 'الدقي، القاهرة',
        maritalStatus: MaritalStatus.MARRIED,
        emergencyContactName: 'علاء محمد',
        emergencyContactPhone: '01077777777',
        emergencyContactRelation: 'زوج',
        registrationDate: new Date('2024-06-12'),
        isActive: true,
      },
    }),
    prisma.patient.create({
      data: {
        nationalId: '12340567890124',
        firstName: 'رحاب',
        lastName: 'محمد',
        birthDate: new Date('1991-11-28'),
        bloodType: BloodType.B_NEGATIVE,
        phone: '01012340567',
        address: 'النزهة، القاهرة',
        maritalStatus: MaritalStatus.DIVORCED,
        registrationDate: new Date('2024-07-15'),
        isActive: true,
      },
    }),
    prisma.patient.create({
      data: {
        nationalId: '23451678901235',
        firstName: 'آمنة',
        lastName: 'حسين',
        birthDate: new Date('1989-01-14'),
        bloodType: BloodType.AB_NEGATIVE,
        phone: '01023451678',
        address: 'مصر الجديدة، القاهرة',
        maritalStatus: MaritalStatus.MARRIED,
        emergencyContactName: 'إبراهيم سليم',
        emergencyContactPhone: '01088888888',
        emergencyContactRelation: 'زوج',
        registrationDate: new Date('2024-08-20'),
        isActive: true,
      },
    }),
    prisma.patient.create({
      data: {
        nationalId: '34562789012346',
        firstName: 'ميرا',
        lastName: 'حسن',
        birthDate: new Date('1993-06-08'),
        bloodType: BloodType.O_POSITIVE,
        phone: '01034562789',
        address: 'الرمايه، القاهرة',
        maritalStatus: MaritalStatus.MARRIED,
        emergencyContactName: 'سامح أحمد',
        emergencyContactPhone: '01099999999',
        emergencyContactRelation: 'زوج',
        registrationDate: new Date('2024-09-10'),
        isActive: true,
      },
    }),
    prisma.patient.create({
      data: {
        nationalId: '45673890123457',
        firstName: 'نادية',
        lastName: 'فارس',
        birthDate: new Date('1986-04-30'),
        bloodType: BloodType.A_POSITIVE,
        phone: '01045673890',
        address: 'الجزيرة، القاهرة',
        maritalStatus: MaritalStatus.MARRIED,
        emergencyContactName: 'فايز محمد',
        emergencyContactPhone: '01011111111',
        emergencyContactRelation: 'زوج',
        registrationDate: new Date('2024-10-05'),
        isActive: true,
      },
    }),
  ]);

  const [patient1, patient2, patient3, patient4, patient5, patient6, patient7, patient8, patient9, patient10] = patients;
  console.log(`✅ تم إنشاء ${patients.length} مريضة\n`);

  // ====================================
  // 5️⃣ إنشاء التأمين
  // ====================================
  console.log('🛡️ إنشاء التأمين...');
  const insurances = await Promise.all([
    prisma.insurance.create({
      data: {
        patientId: patient1.id,
        insuranceCompany: 'شركة التأمين الصحي',
        policyNumber: 'POL-001',
        expiryDate: new Date('2025-12-31'),
        coverageDetails: 'تأمين صحي شامل - تغطية 80%',
        isActive: true,
      },
    }),
    prisma.insurance.create({
      data: {
        patientId: patient2.id,
        insuranceCompany: 'أليانز للتأمين',
        policyNumber: 'POL-002',
        expiryDate: new Date('2025-12-31'),
        coverageDetails: 'تأمين صحي شامل - تغطية 90%',
        isActive: true,
      },
    }),
    prisma.insurance.create({
      data: {
        patientId: patient4.id,
        insuranceCompany: 'الأهلية للتأمين',
        policyNumber: 'POL-003',
        expiryDate: new Date('2025-12-31'),
        coverageDetails: 'تأمين صحي شامل - تغطية 85%',
        isActive: true,
      },
    }),
    prisma.insurance.create({
      data: {
        patientId: patient5.id,
        insuranceCompany: 'شركة التأمين الصحي',
        policyNumber: 'POL-004',
        expiryDate: new Date('2025-12-31'),
        coverageDetails: 'تأمين صحي شامل - تغطية 80%',
        isActive: true,
      },
    }),
  ]);

  // تحديث التأمين النشط للمرضى
  await Promise.all([
    prisma.patient.update({ where: { id: patient1.id }, data: { insuranceId: insurances[0].id } }),
    prisma.patient.update({ where: { id: patient2.id }, data: { insuranceId: insurances[1].id } }),
    prisma.patient.update({ where: { id: patient4.id }, data: { insuranceId: insurances[2].id } }),
    prisma.patient.update({ where: { id: patient5.id }, data: { insuranceId: insurances[3].id } }),
  ]);

  console.log(`✅ تم إنشاء ${insurances.length} تأمين\n`);

  // ====================================
  // 6️⃣ إنشاء التاريخ المرضي
  // ====================================
  console.log('📋 إنشاء التاريخ المرضي...');
  await Promise.all([
    prisma.medicalHistory.create({
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
        menstrualNotes: 'دورة منتظمة، تدفق متوسط',
        contraceptionMethod: 'حبوب منع الحمل',
        gravida: 2,
        para: 1,
        abortion: 0,
        livingChildren: 1,
      },
    }),
    prisma.medicalHistory.create({
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
        menstrualNotes: 'دورة منتظمة، تدفق غزير',
        gravida: 0,
        para: 0,
        abortion: 0,
        livingChildren: 0,
      },
    }),
    prisma.medicalHistory.create({
      data: {
        patientId: patient3.id,
        chronicDiseases: 'ارتفاع ضغط الدم',
        previousSurgeries: 'عملية استئصال الكيس - 2018',
        allergies: 'حساسية من الأسبرين',
        currentMedications: 'أدوية ضغط الدم',
        familyHistory: 'أمراض القلب في العائلة',
        gynecologicalHistory: 'دورة شهرية منتظمة',
        ageOfMenarche: 14,
        lastMenstrualPeriod: new Date('2024-12-05'),
        menstrualCycleLength: 28,
        menstrualNotes: 'دورة منتظمة، تدفق طبيعي',
        gravida: 1,
        para: 0,
        abortion: 1,
        livingChildren: 0,
      },
    }),
    prisma.medicalHistory.create({
      data: {
        patientId: patient4.id,
        chronicDiseases: 'لا توجد',
        previousSurgeries: 'عملية ولادة قيصرية - 2020',
        allergies: 'لا توجد',
        currentMedications: 'مكملات الكالسيوم والفيتامينات',
        familyHistory: 'لا توجد',
        gynecologicalHistory: 'دورة شهرية منتظمة بعد الولادة',
        ageOfMenarche: 13,
        lastMenstrualPeriod: new Date('2024-12-03'),
        menstrualCycleLength: 29,
        menstrualNotes: 'دورة منتظمة',
        gravida: 2,
        para: 2,
        abortion: 0,
        livingChildren: 2,
      },
    }),
    prisma.medicalHistory.create({
      data: {
        patientId: patient5.id,
        chronicDiseases: 'سكري النوع الثاني',
        previousSurgeries: 'لا توجد',
        allergies: 'حساسية من المسكنات',
        currentMedications: 'أدوية السكري والفيتامينات',
        familyHistory: 'سكري وضغط الدم في العائلة',
        gynecologicalHistory: 'دورة شهرية غير منتظمة',
        ageOfMenarche: 12,
        lastMenstrualPeriod: new Date('2024-11-20'),
        menstrualCycleLength: 35,
        menstrualNotes: 'دورة غير منتظمة، تدفق متغير',
        gravida: 3,
        para: 2,
        abortion: 1,
        livingChildren: 2,
      },
    }),
    prisma.medicalHistory.create({
      data: {
        patientId: patient6.id,
        chronicDiseases: 'لا توجد',
        previousSurgeries: 'لا توجد',
        allergies: 'لا توجد',
        currentMedications: 'لا توجد',
        familyHistory: 'لا توجد',
        gynecologicalHistory: 'دورة شهرية منتظمة',
        ageOfMenarche: 13,
        lastMenstrualPeriod: new Date('2024-12-02'),
        menstrualCycleLength: 28,
        menstrualNotes: 'دورة منتظمة جداً',
        gravida: 1,
        para: 1,
        abortion: 0,
        livingChildren: 1,
      },
    }),
    prisma.medicalHistory.create({
      data: {
        patientId: patient7.id,
        chronicDiseases: 'الربو',
        previousSurgeries: 'لا توجد',
        allergies: 'حساسية من الأنسولين',
        currentMedications: 'موسعات الشعب الهوائية',
        familyHistory: 'الربو في العائلة',
        gynecologicalHistory: 'دورة شهرية منتظمة',
        ageOfMenarche: 12,
        lastMenstrualPeriod: new Date('2024-12-04'),
        menstrualCycleLength: 28,
        menstrualNotes: 'دورة منتظمة',
        gravida: 0,
        para: 0,
        abortion: 0,
        livingChildren: 0,
      },
    }),
    prisma.medicalHistory.create({
      data: {
        patientId: patient8.id,
        chronicDiseases: 'قصور الغدة الدرقية',
        previousSurgeries: 'استئصال كيس - 2019',
        allergies: 'لا توجد',
        currentMedications: 'أدوية الغدة الدرقية',
        familyHistory: 'أمراض الغدة الدرقية',
        gynecologicalHistory: 'دورة شهرية منتظمة',
        ageOfMenarche: 13,
        lastMenstrualPeriod: new Date('2024-11-30'),
        menstrualCycleLength: 30,
        menstrualNotes: 'دورة منتظمة',
        gravida: 2,
        para: 1,
        abortion: 1,
        livingChildren: 1,
      },
    }),
    prisma.medicalHistory.create({
      data: {
        patientId: patient9.id,
        chronicDiseases: 'لا توجد',
        previousSurgeries: 'لا توجد',
        allergies: 'لا توجد',
        currentMedications: 'مكملات الحديد والفيتامينات',
        familyHistory: 'لا توجد',
        gynecologicalHistory: 'دورة شهرية منتظمة',
        ageOfMenarche: 13,
        lastMenstrualPeriod: new Date('2024-12-01'),
        menstrualCycleLength: 28,
        menstrualNotes: 'دورة منتظمة جداً',
        gravida: 1,
        para: 1,
        abortion: 0,
        livingChildren: 1,
      },
    }),
    prisma.medicalHistory.create({
      data: {
        patientId: patient10.id,
        chronicDiseases: 'لا توجد',
        previousSurgeries: 'لا توجد',
        allergies: 'لا توجد',
        currentMedications: 'لا توجد',
        familyHistory: 'لا توجد',
        gynecologicalHistory: 'دورة شهرية منتظمة',
        ageOfMenarche: 12,
        lastMenstrualPeriod: new Date('2024-11-28'),
        menstrualCycleLength: 29,
        menstrualNotes: 'دورة منتظمة',
        gravida: 0,
        para: 0,
        abortion: 0,
        livingChildren: 0,
      },
    }),
  ]);

  console.log(`✅ تم إنشاء التاريخ المرضي لـ 10 مرضى\n`);

  // ====================================
  // 7️⃣ إنشاء سجلات الحمل
  // ====================================
  console.log('🤰 إنشاء سجلات الحمل...');
  const pregnancies = await Promise.all([
    prisma.pregnancyRecord.create({
      data: {
        patientId: patient1.id,
        pregnancyNumber: 2,
        lmpDate: new Date('2024-05-01'),
        eddDate: new Date('2025-02-08'),
        isActive: true,
      },
    }),
    prisma.pregnancyRecord.create({
      data: {
        patientId: patient2.id,
        pregnancyNumber: 1,
        lmpDate: new Date('2024-04-15'),
        eddDate: new Date('2025-01-22'),
        isActive: true,
      },
    }),
    prisma.pregnancyRecord.create({
      data: {
        patientId: patient4.id,
        pregnancyNumber: 3,
        lmpDate: new Date('2024-06-10'),
        eddDate: new Date('2025-03-17'),
        isActive: true,
      },
    }),
    prisma.pregnancyRecord.create({
      data: {
        patientId: patient6.id,
        pregnancyNumber: 2,
        lmpDate: new Date('2024-07-01'),
        eddDate: new Date('2025-04-08'),
        isActive: true,
      },
    }),
    prisma.pregnancyRecord.create({
      data: {
        patientId: patient8.id,
        pregnancyNumber: 3,
        lmpDate: new Date('2024-05-20'),
        eddDate: new Date('2025-02-26'),
        isActive: true,
      },
    }),
    prisma.pregnancyRecord.create({
      data: {
        patientId: patient9.id,
        pregnancyNumber: 2,
        lmpDate: new Date('2024-08-15'),
        eddDate: new Date('2025-05-22'),
        isActive: true,
      },
    }),
  ]);

  const [pregnancy1, pregnancy2, pregnancy3, pregnancy4, pregnancy5, pregnancy6] = pregnancies;
  console.log(`✅ تم إنشاء ${pregnancies.length} سجل حمل\n`);

  // ====================================
  // 8️⃣ إنشاء المواعيد
  // ====================================
  console.log('📅 إنشاء المواعيد...');
  const appointments = await Promise.all([
    // مواعيد الطبيب الأول
    prisma.appointment.create({
      data: {
        patientId: patient1.id,
        doctorId: doctor1.id,
        appointmentDate: new Date('2024-12-20'),
        appointmentTime: new Date('1970-01-01T10:00:00'),
        status: AppointmentStatus.BOOKED,
        durationMinutes: 30,
        visitReason: 'متابعة حمل',
      },
    }),
    prisma.appointment.create({
      data: {
        patientId: patient3.id,
        doctorId: doctor1.id,
        appointmentDate: new Date('2024-12-22'),
        appointmentTime: new Date('1970-01-01T09:30:00'),
        status: AppointmentStatus.BOOKED,
        durationMinutes: 45,
        visitReason: 'كشف أول',
      },
    }),
    prisma.appointment.create({
      data: {
        patientId: patient7.id,
        doctorId: doctor1.id,
        appointmentDate: new Date('2024-12-23'),
        appointmentTime: new Date('1970-01-01T11:00:00'),
        status: AppointmentStatus.BOOKED,
        durationMinutes: 30,
        visitReason: 'فحص دوري',
      },
    }),
    // مواعيد الطبيبة الثانية
    prisma.appointment.create({
      data: {
        patientId: patient2.id,
        doctorId: doctor2.id,
        appointmentDate: new Date('2024-12-21'),
        appointmentTime: new Date('1970-01-01T11:00:00'),
        status: AppointmentStatus.BOOKED,
        durationMinutes: 30,
        visitReason: 'سونار',
      },
    }),
    prisma.appointment.create({
      data: {
        patientId: patient4.id,
        doctorId: doctor2.id,
        appointmentDate: new Date('2024-12-24'),
        appointmentTime: new Date('1970-01-01T12:00:00'),
        status: AppointmentStatus.BOOKED,
        durationMinutes: 30,
        visitReason: 'متابعة حمل',
      },
    }),
    // مواعيد الطبيب الثالث
    prisma.appointment.create({
      data: {
        patientId: patient5.id,
        doctorId: doctor3.id,
        appointmentDate: new Date('2024-12-25'),
        appointmentTime: new Date('1970-01-01T15:00:00'),
        status: AppointmentStatus.BOOKED,
        durationMinutes: 30,
        visitReason: 'فحص دوري',
      },
    }),
    prisma.appointment.create({
      data: {
        patientId: patient6.id,
        doctorId: doctor3.id,
        appointmentDate: new Date('2024-12-26'),
        appointmentTime: new Date('1970-01-01T15:30:00'),
        status: AppointmentStatus.BOOKED,
        durationMinutes: 30,
        visitReason: 'متابعة حمل',
      },
    }),
    // مواعيد الطبيبة الرابعة
    prisma.appointment.create({
      data: {
        patientId: patient8.id,
        doctorId: doctor4.id,
        appointmentDate: new Date('2024-12-27'),
        appointmentTime: new Date('1970-01-01T09:00:00'),
        status: AppointmentStatus.BOOKED,
        durationMinutes: 30,
        visitReason: 'فحص شامل',
      },
    }),
    prisma.appointment.create({
      data: {
        patientId: patient9.id,
        doctorId: doctor4.id,
        appointmentDate: new Date('2024-12-28'),
        appointmentTime: new Date('1970-01-01T10:00:00'),
        status: AppointmentStatus.BOOKED,
        durationMinutes: 30,
        visitReason: 'متابعة حمل',
      },
    }),
    prisma.appointment.create({
      data: {
        patientId: patient10.id,
        doctorId: doctor4.id,
        appointmentDate: new Date('2024-12-29'),
        appointmentTime: new Date('1970-01-01T11:00:00'),
        status: AppointmentStatus.BOOKED,
        durationMinutes: 30,
        visitReason: 'كشف أول',
      },
    }),
  ]);

  const [
    appointment1, appointment2, appointment3,
    appointment4, appointment5,
    appointment6, appointment7,
    appointment8, appointment9, appointment10
  ] = appointments;

  console.log(`✅ تم إنشاء ${appointments.length} موعد\n`);

  // ====================================
  // 9️⃣ إنشاء الزيارات الطبية
  // ====================================
  console.log('🏥 إنشاء الزيارات الطبية...');
  const visits = await Promise.all([
    prisma.medicalVisit.create({
      data: {
        appointmentId: appointment1.id,
        patientId: patient1.id,
        doctorId: doctor1.id,
        visitDate: new Date('2024-12-15'),
        visitStartTime: new Date('2024-12-15T10:00:00'),
        visitEndTime: new Date('2024-12-15T10:30:00'),
        completedAt: new Date('2024-12-15T10:30:00'),
        isDraft: false,
        chiefComplaint: 'متابعة الحمل',
        symptoms: 'لا توجد أعراض',
        weight: 65.5,
        bloodPressureSystolic: 120,
        bloodPressureDiastolic: 80,
        temperature: 36.5,
        pulse: 75,
        examinationFindings: 'الحمل يسير بشكل طبيعي',
        treatmentPlan: 'متابعة دورية',
        recommendations: 'تناول المكملات الغذائية',
      },
    }),
    prisma.medicalVisit.create({
      data: {
        appointmentId: appointment2.id,
        patientId: patient2.id,
        doctorId: doctor2.id,
        visitDate: new Date('2024-12-10'),
        visitStartTime: new Date('2024-12-10T11:00:00'),
        visitEndTime: new Date('2024-12-10T11:30:00'),
        completedAt: new Date('2024-12-10T11:30:00'),
        isDraft: false,
        chiefComplaint: 'سونار',
        weight: 58.0,
        bloodPressureSystolic: 115,
        bloodPressureDiastolic: 75,
        examinationFindings: 'الجنين بحالة جيدة',
      },
    }),
    prisma.medicalVisit.create({
      data: {
        appointmentId: appointment3.id,
        patientId: patient3.id,
        doctorId: doctor1.id,
        visitDate: new Date('2024-12-12'),
        visitStartTime: new Date('2024-12-12T09:30:00'),
        visitEndTime: new Date('2024-12-12T10:15:00'),
        completedAt: new Date('2024-12-12T10:15:00'),
        isDraft: false,
        chiefComplaint: 'كشف شامل',
        symptoms: 'آلام خفيفة',
        weight: 62.0,
        bloodPressureSystolic: 125,
        bloodPressureDiastolic: 82,
        temperature: 36.7,
        pulse: 78,
        examinationFindings: 'حالة طبيعية',
      },
    }),
    prisma.medicalVisit.create({
      data: {
        appointmentId: appointment4.id,
        patientId: patient4.id,
        doctorId: doctor2.id,
        visitDate: new Date('2024-12-11'),
        visitStartTime: new Date('2024-12-11T12:00:00'),
        visitEndTime: new Date('2024-12-11T12:30:00'),
        completedAt: new Date('2024-12-11T12:30:00'),
        isDraft: false,
        chiefComplaint: 'متابعة الحمل',
        weight: 70.0,
        bloodPressureSystolic: 118,
        bloodPressureDiastolic: 78,
        examinationFindings: 'الحمل يتقدم بشكل جيد',
      },
    }),
    prisma.medicalVisit.create({
      data: {
        appointmentId: appointment5.id,
        patientId: patient5.id,
        doctorId: doctor3.id,
        visitDate: new Date('2024-12-13'),
        visitStartTime: new Date('2024-12-13T15:00:00'),
        visitEndTime: new Date('2024-12-13T15:30:00'),
        completedAt: new Date('2024-12-13T15:30:00'),
        isDraft: false,
        chiefComplaint: 'فحص دوري',
        weight: 68.5,
        bloodPressureSystolic: 130,
        bloodPressureDiastolic: 85,
        temperature: 36.6,
        pulse: 80,
        examinationFindings: 'بحاجة لمراقبة السكري',
      },
    }),
    prisma.medicalVisit.create({
      data: {
        appointmentId: appointment6.id,
        patientId: patient6.id,
        doctorId: doctor3.id,
        visitDate: new Date('2024-12-14'),
        visitStartTime: new Date('2024-12-14T15:30:00'),
        visitEndTime: new Date('2024-12-14T16:00:00'),
        completedAt: new Date('2024-12-14T16:00:00'),
        isDraft: false,
        chiefComplaint: 'متابعة حمل',
        weight: 61.0,
        bloodPressureSystolic: 115,
        bloodPressureDiastolic: 76,
        examinationFindings: 'الحمل طبيعي',
      },
    }),
  ]);

  const [visit1, visit2, visit3, visit4, visit5, visit6] = visits;
  console.log(`✅ تم إنشاء ${visits.length} زيارة طبية\n`);

  // ====================================
  // 🔟 إنشاء متابعة الحمل
  // ====================================
  console.log('📊 إنشاء متابعة الحمل...');
  const pregnancyFollowups = await Promise.all([
    prisma.pregnancyFollowup.create({
      data: {
        pregnancyId: pregnancy1.id,
        visitId: visit1.id,
        visitDate: new Date('2024-12-15'),
        gestationalAgeWeeks: 32.5,
        maternalWeight: 65.5,
        weightGain: 2.5,
        bloodPressure: '120/80',
        notes: 'متابعة أسبوعية',
        nextVisitDate: new Date('2024-12-22'),
      },
    }),
    prisma.pregnancyFollowup.create({
      data: {
        pregnancyId: pregnancy2.id,
        visitId: visit2.id,
        visitDate: new Date('2024-12-10'),
        gestationalAgeWeeks: 28.0,
        maternalWeight: 58.0,
        weightGain: 1.8,
        bloodPressure: '115/75',
        notes: 'سونار تطمئن عن صحة الجنين',
        nextVisitDate: new Date('2024-12-17'),
      },
    }),
    prisma.pregnancyFollowup.create({
      data: {
        pregnancyId: pregnancy3.id,
        visitId: visit4.id,
        visitDate: new Date('2024-12-11'),
        gestationalAgeWeeks: 30.5,
        maternalWeight: 70.0,
        weightGain: 3.0,
        bloodPressure: '118/78',
        notes: 'متابعة منتظمة',
        nextVisitDate: new Date('2024-12-18'),
      },
    }),
    prisma.pregnancyFollowup.create({
      data: {
        pregnancyId: pregnancy4.id,
        visitId: visit6.id,
        visitDate: new Date('2024-12-14'),
        gestationalAgeWeeks: 26.0,
        maternalWeight: 61.0,
        weightGain: 2.0,
        bloodPressure: '115/76',
        notes: 'متابعة الحمل الثاني',
        nextVisitDate: new Date('2024-12-21'),
      },
    }),
  ]);

  console.log(`✅ تم إنشاء ${pregnancyFollowups.length} متابعة حمل\n`);

  // ====================================
  // 1️⃣1️⃣ إنشاء التشخيصات
  // ====================================
  console.log('🔍 إنشاء التشخيصات...');
  const diagnoses = await Promise.all([
    prisma.diagnosis.create({
      data: {
        visitId: visit1.id,
        patientId: patient1.id,
        diagnosisName: 'حمل طبيعي',
        diagnosisDate: new Date('2024-12-15'),
        isChronic: false,
        isHighRisk: false,
      },
    }),
    prisma.diagnosis.create({
      data: {
        visitId: visit2.id,
        patientId: patient2.id,
        diagnosisName: 'حمل سليم',
        diagnosisDate: new Date('2024-12-10'),
        isChronic: false,
        isHighRisk: false,
      },
    }),
    prisma.diagnosis.create({
      data: {
        visitId: visit3.id,
        patientId: patient3.id,
        diagnosisName: 'ارتفاع ضغط الدم',
        diagnosisDate: new Date('2024-12-12'),
        isChronic: true,
        isHighRisk: true,
      },
    }),
    prisma.diagnosis.create({
      data: {
        visitId: visit4.id,
        patientId: patient4.id,
        diagnosisName: 'حمل متعدد',
        diagnosisDate: new Date('2024-12-11'),
        isChronic: false,
        isHighRisk: true,
      },
    }),
    prisma.diagnosis.create({
      data: {
        visitId: visit5.id,
        patientId: patient5.id,
        diagnosisName: 'سكري الحمل',
        diagnosisDate: new Date('2024-12-13'),
        isChronic: true,
        isHighRisk: true,
      },
    }),
    prisma.diagnosis.create({
      data: {
        visitId: visit6.id,
        patientId: patient6.id,
        diagnosisName: 'حمل طبيعي',
        diagnosisDate: new Date('2024-12-14'),
        isChronic: false,
        isHighRisk: false,
      },
    }),
  ]);

  console.log(`✅ تم إنشاء ${diagnoses.length} تشخيص\n`);

  // ====================================
  // 1️⃣2️⃣ إنشاء الأدوية
  // ====================================
  console.log('💊 إنشاء الأدوية...');
  const medications = await Promise.all([
    prisma.medication.create({
      data: {
        medicationName: 'فيروجلوبين',
        scientificName: 'Ferrous Fumarate',
        form: 'أقراص',
        pregnancyCategory: 'A',
        breastfeedingSafe: 'SAFE',
        price: 45.0,
        isActive: true,
      },
    }),
    prisma.medication.create({
      data: {
        medicationName: 'فوليك أسيد',
        scientificName: 'Folic Acid',
        form: 'أقراص',
        pregnancyCategory: 'A',
        breastfeedingSafe: 'SAFE',
        price: 25.0,
        isActive: true,
      },
    }),
    prisma.medication.create({
      data: {
        medicationName: 'فيتامين د3',
        scientificName: 'Vitamin D3',
        form: 'قطرات',
        pregnancyCategory: 'A',
        breastfeedingSafe: 'SAFE',
        price: 50.0,
        isActive: true,
      },
    }),
    prisma.medication.create({
      data: {
        medicationName: 'كالسيوم كاربونيت',
        scientificName: 'Calcium Carbonate',
        form: 'أقراص',
        pregnancyCategory: 'A',
        breastfeedingSafe: 'SAFE',
        price: 30.0,
        isActive: true,
      },
    }),
    prisma.medication.create({
      data: {
        medicationName: 'مغنيسيوم',
        scientificName: 'Magnesium',
        form: 'أقراص',
        pregnancyCategory: 'A',
        breastfeedingSafe: 'SAFE',
        price: 35.0,
        isActive: true,
      },
    }),
    prisma.medication.create({
      data: {
        medicationName: 'يود بوتاسيوم',
        scientificName: 'Potassium Iodide',
        form: 'أقراص',
        pregnancyCategory: 'A',
        breastfeedingSafe: 'SAFE',
        price: 20.0,
        isActive: true,
      },
    }),
    prisma.medication.create({
      data: {
        medicationName: 'أوميجا 3',
        scientificName: 'Omega-3 Fatty Acids',
        form: 'كبسولات',
        pregnancyCategory: 'A',
        breastfeedingSafe: 'SAFE',
        price: 60.0,
        isActive: true,
      },
    }),
    prisma.medication.create({
      data: {
        medicationName: 'بارسيتامول',
        scientificName: 'Paracetamol',
        form: 'أقراص',
        pregnancyCategory: 'A',
        breastfeedingSafe: 'SAFE',
        price: 15.0,
        isActive: true,
      },
    }),
  ]);

  const [med1, med2, med3, med4, med5, med6, med7, med8] = medications;
  console.log(`✅ تم إنشاء ${medications.length} دواء\n`);

  // ====================================
  // 1️⃣3️⃣ إنشاء الروشتات
  // ====================================
  console.log('📝 إنشاء الروشتات...');
  const prescriptions = await Promise.all([
    prisma.prescription.create({
      data: {
        visitId: visit1.id,
        notes: 'يؤخذ بعد الأكل',
        items: {
          create: [
            {
              medicationName: med1.medicationName,
              dosage: 'قرص واحد',
              frequency: 'مرة واحدة يومياً',
              duration: '30 يوم',
              instructions: 'يؤخذ بعد الأكل لتجنب اضطراب المعدة',
            },
            {
              medicationName: med2.medicationName,
              dosage: 'قرص واحد',
              frequency: 'مرة واحدة يومياً',
              duration: '30 يوم',
            },
          ],
        },
      },
    }),
    prisma.prescription.create({
      data: {
        visitId: visit2.id,
        notes: 'روشتة مكملات غذائية',
        items: {
          create: [
            {
              medicationName: med3.medicationName,
              dosage: 'قطرات',
              frequency: 'يومياً',
              duration: '3 أشهر',
              instructions: 'للصحة العامة',
            },
            {
              medicationName: med4.medicationName,
              dosage: 'قرص واحد',
              frequency: 'مرتين يومياً',
              duration: 'مستمر',
            },
          ],
        },
      },
    }),
    prisma.prescription.create({
      data: {
        visitId: visit3.id,
        notes: 'روشتة لعلاج أعراض',
        items: {
          create: [
            {
              medicationName: med8.medicationName,
              dosage: 'قرص واحد',
              frequency: 'عند الحاجة',
              duration: '10 أيام',
              instructions: 'للألم والحمى',
            },
            {
              medicationName: med5.medicationName,
              dosage: 'قرص واحد',
              frequency: 'مرة واحدة يومياً',
              duration: 'مستمر',
            },
          ],
        },
      },
    }),
    prisma.prescription.create({
      data: {
        visitId: visit4.id,
        notes: 'روشتة متابعة حمل',
        items: {
          create: [
            {
              medicationName: med1.medicationName,
              dosage: 'قرص واحد',
              frequency: 'مرة واحدة يومياً',
              duration: '30 يوم',
            },
            {
              medicationName: med2.medicationName,
              dosage: 'قرص واحد',
              frequency: 'مرة واحدة يومياً',
              duration: '30 يوم',
            },
            {
              medicationName: med6.medicationName,
              dosage: 'قرص واحد',
              frequency: 'مرة واحدة يومياً',
              duration: 'مستمر',
            },
          ],
        },
      },
    }),
    prisma.prescription.create({
      data: {
        visitId: visit5.id,
        notes: 'روشتة للحالات الخاصة',
        items: {
          create: [
            {
              medicationName: med4.medicationName,
              dosage: 'قرص واحد',
              frequency: 'مرتين يومياً',
              duration: 'مستمر',
            },
            {
              medicationName: med7.medicationName,
              dosage: 'كبسولة واحدة',
              frequency: 'مرة واحدة يومياً',
              duration: '3 أشهر',
            },
          ],
        },
      },
    }),
  ]);

  console.log(`✅ تم إنشاء ${prescriptions.length} روشتة\n`);

  // ====================================
  // 1️⃣4️⃣ إنشاء الفواتير
  // ====================================
  console.log('🧾 إنشاء الفواتير...');
  const invoices = await Promise.all([
    prisma.invoice.create({
      data: {
        invoiceNumber: 'INV-2024-001',
        patientId: patient1.id,
        doctorId: doctor1.id,
        visitId: visit1.id,
        invoiceDate: new Date('2024-12-15'),
        subtotal: 700,
        discount: 0,
        totalAmount: 700,
        paidAmount: 150,
        remainingAmount: 550,
        paymentStatus: PaymentStatus.PARTIAL,
        items: {
          create: [
            {
              itemType: 'CONSULTATION',
              description: 'كشف متابعة',
              quantity: 1,
              unitPrice: 300,
              totalPrice: 300,
            },
            {
              itemType: 'ULTRASOUND',
              description: 'سونار',
              quantity: 1,
              unitPrice: 400,
              totalPrice: 400,
            },
          ],
        },
      },
    }),
    prisma.invoice.create({
      data: {
        invoiceNumber: 'INV-2024-002',
        patientId: patient2.id,
        doctorId: doctor2.id,
        visitId: visit2.id,
        invoiceDate: new Date('2024-12-10'),
        subtotal: 500,
        discount: 50,
        totalAmount: 450,
        paidAmount: 450,
        remainingAmount: 0,
        paymentStatus: PaymentStatus.PAID,
        items: {
          create: [
            {
              itemType: 'CONSULTATION',
              description: 'كشف دوري',
              quantity: 1,
              unitPrice: 300,
              totalPrice: 300,
            },
            {
              itemType: 'ULTRASOUND',
              description: 'سونار شامل',
              quantity: 1,
              unitPrice: 200,
              totalPrice: 200,
            },
          ],
        },
      },
    }),
    prisma.invoice.create({
      data: {
        invoiceNumber: 'INV-2024-003',
        patientId: patient3.id,
        doctorId: doctor1.id,
        visitId: visit3.id,
        invoiceDate: new Date('2024-12-12'),
        subtotal: 350,
        discount: 0,
        totalAmount: 350,
        paidAmount: 0,
        remainingAmount: 350,
        paymentStatus: PaymentStatus.UNPAID,
        items: {
          create: [
            {
              itemType: 'CONSULTATION',
              description: 'كشف أول',
              quantity: 1,
              unitPrice: 350,
              totalPrice: 350,
            },
          ],
        },
      },
    }),
    prisma.invoice.create({
      data: {
        invoiceNumber: 'INV-2024-004',
        patientId: patient4.id,
        doctorId: doctor2.id,
        visitId: visit4.id,
        invoiceDate: new Date('2024-12-11'),
        subtotal: 600,
        discount: 100,
        totalAmount: 500,
        paidAmount: 200,
        remainingAmount: 300,
        paymentStatus: PaymentStatus.PARTIAL,
        items: {
          create: [
            {
              itemType: 'CONSULTATION',
              description: 'كشف متابعة',
              quantity: 1,
              unitPrice: 300,
              totalPrice: 300,
            },
            {
              itemType: 'TESTS',
              description: 'فحوصات مخبرية',
              quantity: 1,
              unitPrice: 300,
              totalPrice: 300,
            },
          ],
        },
      },
    }),
    prisma.invoice.create({
      data: {
        invoiceNumber: 'INV-2024-005',
        patientId: patient5.id,
        doctorId: doctor3.id,
        visitId: visit5.id,
        invoiceDate: new Date('2024-12-13'),
        subtotal: 550,
        discount: 50,
        totalAmount: 500,
        paidAmount: 500,
        remainingAmount: 0,
        paymentStatus: PaymentStatus.PAID,
        items: {
          create: [
            {
              itemType: 'CONSULTATION',
              description: 'كشف فحص دوري',
              quantity: 1,
              unitPrice: 300,
              totalPrice: 300,
            },
            {
              itemType: 'ULTRASOUND',
              description: 'سونار',
              quantity: 1,
              unitPrice: 250,
              totalPrice: 250,
            },
          ],
        },
      },
    }),
  ]);

  const [invoice1, invoice2, invoice3, invoice4, invoice5] = invoices;
  console.log(`✅ تم إنشاء ${invoices.length} فاتورة\n`);

  // ====================================
  // 1️⃣5️⃣ إنشاء المدفوعات
  // ====================================
  console.log('💳 إنشاء المدفوعات...');
  const payments = await Promise.all([
    prisma.payment.create({
      data: {
        invoiceId: invoice1.id,
        paymentNumber: 'PAY-2024-001',
        paymentDate: new Date('2024-12-15'),
        paymentTime: new Date('2024-12-15T14:30:00'),
        amount: 150,
        paymentMethod: PaymentMethod.CASH,
        receivedById: receptionUser.id,
      },
    }),
    prisma.payment.create({
      data: {
        invoiceId: invoice2.id,
        paymentNumber: 'PAY-2024-002',
        paymentDate: new Date('2024-12-10'),
        paymentTime: new Date('2024-12-10T15:00:00'),
        amount: 450,
        paymentMethod: PaymentMethod.CARD,
        receivedById: receptionUser2.id,
      },
    }),
    prisma.payment.create({
      data: {
        invoiceId: invoice4.id,
        paymentNumber: 'PAY-2024-003',
        paymentDate: new Date('2024-12-11'),
        paymentTime: new Date('2024-12-11T16:00:00'),
        amount: 200,
        paymentMethod: PaymentMethod.CASH,
        receivedById: receptionUser.id,
      },
    }),
    prisma.payment.create({
      data: {
        invoiceId: invoice5.id,
        paymentNumber: 'PAY-2024-004',
        paymentDate: new Date('2024-12-13'),
        paymentTime: new Date('2024-12-13T17:00:00'),
        amount: 500,
        paymentMethod: PaymentMethod.BANK_TRANSFER,
        receivedById: receptionUser3.id,
      },
    }),
  ]);

  console.log(`✅ تم إنشاء ${payments.length} دفعة\n`);

  // ====================================
  // 1️⃣6️⃣ إنشاء القوالب
  // ====================================
  console.log('📄 إنشاء القوالب...');
  const templates = await Promise.all([
    prisma.template.create({
      data: {
        doctorId: doctor1.id,
        templateType: 'روشتة',
        templateName: 'روشتة مكملات غذائية',
        category: 'حمل',
        content: JSON.stringify({
          items: [
            { medicationName: 'فيروجلوبين', dosage: 'قرص واحد', frequency: 'مرة واحدة يومياً', duration: '30 يوم' },
            { medicationName: 'فوليك أسيد', dosage: 'قرص واحد', frequency: 'مرة واحدة يومياً', duration: '30 يوم' },
          ],
        }),
        isActive: true,
        isFavorite: true,
      },
    }),
    prisma.template.create({
      data: {
        doctorId: doctor2.id,
        templateType: 'ملاحظات طبية',
        templateName: 'تقرير فحص روتيني',
        category: 'عام',
        content: JSON.stringify({
          template: 'الفحص البدني: طبيعي / غير طبيعي. التوصيات: متابعة دورية.',
        }),
        isActive: true,
        isFavorite: false,
      },
    }),
    prisma.template.create({
      data: {
        doctorId: doctor3.id,
        templateType: 'روشتة',
        templateName: 'روشتة مكملات متقدمة',
        category: 'حالات خاصة',
        content: JSON.stringify({
          items: [
            { medicationName: 'فيتامين د3', dosage: 'قطرات', frequency: 'يومياً' },
            { medicationName: 'كالسيوم كاربونيت', dosage: 'قرص واحد', frequency: 'مرتين يومياً' },
            { medicationName: 'أوميجا 3', dosage: 'كبسولة واحدة', frequency: 'مرة واحدة يومياً' },
          ],
        }),
        isActive: true,
        isFavorite: true,
      },
    }),
    prisma.template.create({
      data: {
        doctorId: doctor4.id,
        templateType: 'استشارة',
        templateName: 'نصائح للحوامل',
        category: 'تثقيف صحي',
        content: JSON.stringify({
          recommendations: [
            'تناول وجبات صحية منتظمة',
            'شرب كمية كافية من الماء',
            'ممارسة رياضة خفيفة',
            'الحصول على قسط كافي من النوم',
            'تجنب الضغوط النفسية',
          ],
        }),
        isActive: true,
        isFavorite: false,
      },
    }),
    prisma.template.create({
      data: {
        doctorId: doctor1.id,
        templateType: 'نموذج متابعة',
        templateName: 'نموذج متابعة حمل أسبوعي',
        category: 'متابعة',
        content: JSON.stringify({
          fields: [
            'العمر الحملي بالأسابيع',
            'وزن الأم',
            'ضغط الدم',
            'الأعراض والشكاوى',
            'الفحوصات المطلوبة',
          ],
        }),
        isActive: true,
        isFavorite: true,
      },
    }),
  ]);

  console.log(`✅ تم إنشاء ${templates.length} قالب\n`);

  console.log('✅ تم إدخال جميع البيانات بنجاح! 🎉\n');
  console.log('📊 ملخص البيانات:');
  console.log(`   - ${4} أطباء`);
  console.log(`   - ${7} مستخدمين (كلمة المرور: 123456)`);
  console.log(`   - ${13} جدول عمل`);
  console.log(`   - ${10} مريضات`);
  console.log(`   - ${4} تأمين`);
  console.log(`   - ${10} تاريخ مرضي`);
  console.log(`   - ${6} سجل حمل`);
  console.log(`   - ${10} موعد`);
  console.log(`   - ${6} زيارات طبية`);
  console.log(`   - ${4} متابعات حمل`);
  console.log(`   - ${6} تشخيصات`);
  console.log(`   - ${8} أدوية`);
  console.log(`   - ${5} روشتات`);
  console.log(`   - ${5} فواتير`);
  console.log(`   - ${4} دفعات`);
  console.log(`   - ${5} قوالب`);
}

main()
  .catch((e) => {
    console.error('❌ خطأ في إدخال البيانات:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
