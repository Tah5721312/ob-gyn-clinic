-- CreateTable
CREATE TABLE "patients" (
    "id" SERIAL NOT NULL,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "birthDate" DATE NOT NULL,
    "bloodType" VARCHAR(10),
    "phone" VARCHAR(15) NOT NULL,
    "phone2" VARCHAR(15),
    "address" VARCHAR(200),
    "maritalStatus" VARCHAR(20),
    "emergencyContactName" VARCHAR(100),
    "emergencyContactPhone" VARCHAR(15),
    "emergencyContactRelation" VARCHAR(50),
    "registrationDate" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctors" (
    "id" SERIAL NOT NULL,
    "nationalId" VARCHAR(14) NOT NULL,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "specialization" VARCHAR(100) NOT NULL,
    "licenseNumber" VARCHAR(50) NOT NULL,
    "phone" VARCHAR(15) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "doctors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "role" VARCHAR(20) NOT NULL,
    "doctorId" INTEGER,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100),
    "phone" VARCHAR(15) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "working_schedules" (
    "id" SERIAL NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "dayName" VARCHAR(20) NOT NULL,
    "startTime" TIME NOT NULL,
    "endTime" TIME NOT NULL,
    "slotDurationMinutes" INTEGER NOT NULL DEFAULT 30,
    "maxPatientsPerSlot" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "breakStartTime" TIME,
    "breakEndTime" TIME,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "working_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "appointmentDate" DATE NOT NULL,
    "appointmentTime" TIME NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'BOOKED',
    "durationMinutes" INTEGER NOT NULL DEFAULT 30,
    "visitReason" VARCHAR(100),
    "receptionNotes" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical_visits" (
    "id" SERIAL NOT NULL,
    "appointmentId" INTEGER NOT NULL,
    "patientId" INTEGER NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "visitDate" DATE NOT NULL,
    "visitStartTime" TIMESTAMP(3),
    "visitEndTime" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "isDraft" BOOLEAN NOT NULL DEFAULT true,
    "chiefComplaint" TEXT,
    "symptoms" TEXT,
    "weight" DECIMAL(5,2),
    "bloodPressureSystolic" INTEGER,
    "bloodPressureDiastolic" INTEGER,
    "temperature" DECIMAL(4,2),
    "pulse" INTEGER,
    "examinationFindings" TEXT,
    "treatmentPlan" TEXT,
    "recommendations" TEXT,
    "nextVisitDate" DATE,
    "referredTo" VARCHAR(200),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medical_visits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical_history" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "chronicDiseases" TEXT,
    "previousSurgeries" TEXT,
    "allergies" TEXT,
    "currentMedications" TEXT,
    "familyHistory" TEXT,
    "gynecologicalHistory" TEXT,
    "ageOfMenarche" INTEGER,
    "lastMenstrualPeriod" DATE,
    "menstrualCycleLength" INTEGER,
    "menstrualNotes" TEXT,
    "contraceptionMethod" VARCHAR(100),
    "contraceptionStartDate" DATE,
    "gravida" INTEGER NOT NULL DEFAULT 0,
    "para" INTEGER NOT NULL DEFAULT 0,
    "abortion" INTEGER NOT NULL DEFAULT 0,
    "livingChildren" INTEGER NOT NULL DEFAULT 0,
    "sexualHistory" TEXT,
    "smokingStatus" VARCHAR(50),
    "alcoholConsumption" VARCHAR(50),
    "exerciseFrequency" VARCHAR(50),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medical_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pregnancy_records" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "pregnancyNumber" INTEGER NOT NULL,
    "lmpDate" DATE NOT NULL,
    "eddDate" DATE,
    "eddByUltrasound" DATE,
    "deliveryDate" DATE,
    "deliveryType" VARCHAR(50),
    "gestationalAgeAtDelivery" DECIMAL(4,1),
    "deliveryMethod" VARCHAR(100),
    "babyGender" VARCHAR(10),
    "medicationsDuringPregnancy" TEXT,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pregnancy_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pregnancy_followup" (
    "id" SERIAL NOT NULL,
    "pregnancyId" INTEGER NOT NULL,
    "visitId" INTEGER NOT NULL,
    "visitDate" DATE NOT NULL,
    "gestationalAgeWeeks" DECIMAL(3,1),
    "maternalWeight" DECIMAL(5,2),
    "weightGain" DECIMAL(5,2),
    "bloodPressure" VARCHAR(20),
    "edema" VARCHAR(50),
    "urineAnalysis" VARCHAR(200),
    "bloodSugarLevel" DECIMAL(5,2),
    "hemoglobinLevel" DECIMAL(4,2),
    "ultrasoundFindings" TEXT,
    "placentalLocation" VARCHAR(100),
    "complications" TEXT,
    "medicationsPrescribed" TEXT,
    "nextVisitDate" DATE,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pregnancy_followup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diagnoses" (
    "id" SERIAL NOT NULL,
    "visitId" INTEGER NOT NULL,
    "patientId" INTEGER NOT NULL,
    "diagnosisName" VARCHAR(200) NOT NULL,
    "diagnosisDate" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isChronic" BOOLEAN NOT NULL DEFAULT false,
    "isHighRisk" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "diagnoses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medications" (
    "id" SERIAL NOT NULL,
    "medicationName" VARCHAR(200) NOT NULL,
    "scientificName" VARCHAR(200),
    "form" VARCHAR(50),
    "pregnancyCategory" VARCHAR(5),
    "breastfeedingSafe" VARCHAR(20),
    "notes" TEXT,
    "sideEffects" TEXT,
    "price" DECIMAL(10,2),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prescriptions" (
    "id" SERIAL NOT NULL,
    "visitId" INTEGER,
    "followupId" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prescriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prescription_items" (
    "id" SERIAL NOT NULL,
    "prescriptionId" INTEGER NOT NULL,
    "medicationName" VARCHAR(200) NOT NULL,
    "dosage" VARCHAR(100) NOT NULL,
    "frequency" VARCHAR(100) NOT NULL,
    "duration" VARCHAR(100) NOT NULL,
    "instructions" TEXT,

    CONSTRAINT "prescription_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "templates" (
    "id" SERIAL NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "templateType" VARCHAR(100) NOT NULL,
    "templateName" VARCHAR(200) NOT NULL,
    "category" VARCHAR(100),
    "content" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" SERIAL NOT NULL,
    "invoiceNumber" VARCHAR(50) NOT NULL,
    "visitId" INTEGER,
    "appointmentId" INTEGER,
    "patientId" INTEGER NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "invoiceDate" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" DATE,
    "subtotal" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "discount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "paidAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "remainingAmount" DECIMAL(10,2) NOT NULL,
    "paymentStatus" VARCHAR(20) NOT NULL DEFAULT 'UNPAID',
    "notes" TEXT,
    "isCancelled" BOOLEAN NOT NULL DEFAULT false,
    "cancelledAt" TIMESTAMP(3),
    "cancelReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_items" (
    "id" SERIAL NOT NULL,
    "invoiceId" INTEGER NOT NULL,
    "itemType" VARCHAR(50) NOT NULL,
    "description" VARCHAR(200) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "totalPrice" DECIMAL(10,2) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoice_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,
    "invoiceId" INTEGER NOT NULL,
    "paymentNumber" VARCHAR(50) NOT NULL,
    "paymentDate" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentTime" TIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DECIMAL(10,2) NOT NULL,
    "paymentMethod" VARCHAR(50) NOT NULL,
    "referenceNumber" VARCHAR(100),
    "bankName" VARCHAR(100),
    "checkNumber" VARCHAR(50),
    "receivedById" INTEGER,
    "notes" TEXT,
    "isRefunded" BOOLEAN NOT NULL DEFAULT false,
    "refundedAt" TIMESTAMP(3),
    "refundReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "patients_phone_idx" ON "patients"("phone");

-- CreateIndex
CREATE INDEX "patients_firstName_lastName_idx" ON "patients"("firstName", "lastName");

-- CreateIndex
CREATE INDEX "patients_isActive_idx" ON "patients"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_nationalId_key" ON "doctors"("nationalId");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_licenseNumber_key" ON "doctors"("licenseNumber");

-- CreateIndex
CREATE INDEX "doctors_nationalId_idx" ON "doctors"("nationalId");

-- CreateIndex
CREATE INDEX "doctors_licenseNumber_idx" ON "doctors"("licenseNumber");

-- CreateIndex
CREATE INDEX "doctors_isActive_idx" ON "doctors"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_doctorId_key" ON "users"("doctorId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_username_idx" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "working_schedules_doctorId_dayOfWeek_idx" ON "working_schedules"("doctorId", "dayOfWeek");

-- CreateIndex
CREATE INDEX "working_schedules_doctorId_isActive_idx" ON "working_schedules"("doctorId", "isActive");

-- CreateIndex
CREATE INDEX "appointments_patientId_idx" ON "appointments"("patientId");

-- CreateIndex
CREATE INDEX "appointments_doctorId_idx" ON "appointments"("doctorId");

-- CreateIndex
CREATE INDEX "appointments_appointmentDate_doctorId_idx" ON "appointments"("appointmentDate", "doctorId");

-- CreateIndex
CREATE INDEX "appointments_status_idx" ON "appointments"("status");

-- CreateIndex
CREATE UNIQUE INDEX "medical_visits_appointmentId_key" ON "medical_visits"("appointmentId");

-- CreateIndex
CREATE INDEX "medical_visits_patientId_idx" ON "medical_visits"("patientId");

-- CreateIndex
CREATE INDEX "medical_visits_doctorId_idx" ON "medical_visits"("doctorId");

-- CreateIndex
CREATE INDEX "medical_visits_visitDate_idx" ON "medical_visits"("visitDate");

-- CreateIndex
CREATE INDEX "medical_visits_isDraft_idx" ON "medical_visits"("isDraft");

-- CreateIndex
CREATE UNIQUE INDEX "medical_history_patientId_key" ON "medical_history"("patientId");

-- CreateIndex
CREATE INDEX "pregnancy_records_patientId_idx" ON "pregnancy_records"("patientId");

-- CreateIndex
CREATE INDEX "pregnancy_records_lmpDate_idx" ON "pregnancy_records"("lmpDate");

-- CreateIndex
CREATE INDEX "pregnancy_records_eddDate_idx" ON "pregnancy_records"("eddDate");

-- CreateIndex
CREATE INDEX "pregnancy_records_isActive_idx" ON "pregnancy_records"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "pregnancy_records_patientId_pregnancyNumber_key" ON "pregnancy_records"("patientId", "pregnancyNumber");

-- CreateIndex
CREATE INDEX "pregnancy_followup_pregnancyId_idx" ON "pregnancy_followup"("pregnancyId");

-- CreateIndex
CREATE INDEX "pregnancy_followup_visitId_idx" ON "pregnancy_followup"("visitId");

-- CreateIndex
CREATE INDEX "pregnancy_followup_visitDate_idx" ON "pregnancy_followup"("visitDate");

-- CreateIndex
CREATE INDEX "diagnoses_patientId_idx" ON "diagnoses"("patientId");

-- CreateIndex
CREATE INDEX "diagnoses_visitId_idx" ON "diagnoses"("visitId");

-- CreateIndex
CREATE INDEX "diagnoses_diagnosisDate_idx" ON "diagnoses"("diagnosisDate");

-- CreateIndex
CREATE INDEX "diagnoses_isChronic_idx" ON "diagnoses"("isChronic");

-- CreateIndex
CREATE INDEX "medications_medicationName_idx" ON "medications"("medicationName");

-- CreateIndex
CREATE INDEX "medications_form_idx" ON "medications"("form");

-- CreateIndex
CREATE INDEX "medications_isActive_idx" ON "medications"("isActive");

-- CreateIndex
CREATE INDEX "prescriptions_visitId_idx" ON "prescriptions"("visitId");

-- CreateIndex
CREATE INDEX "prescriptions_followupId_idx" ON "prescriptions"("followupId");

-- CreateIndex
CREATE INDEX "prescription_items_prescriptionId_idx" ON "prescription_items"("prescriptionId");

-- CreateIndex
CREATE INDEX "templates_doctorId_idx" ON "templates"("doctorId");

-- CreateIndex
CREATE INDEX "templates_doctorId_isFavorite_idx" ON "templates"("doctorId", "isFavorite");

-- CreateIndex
CREATE INDEX "templates_doctorId_usageCount_idx" ON "templates"("doctorId", "usageCount");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoiceNumber_key" ON "invoices"("invoiceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_visitId_key" ON "invoices"("visitId");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_appointmentId_key" ON "invoices"("appointmentId");

-- CreateIndex
CREATE INDEX "invoices_invoiceNumber_idx" ON "invoices"("invoiceNumber");

-- CreateIndex
CREATE INDEX "invoices_patientId_idx" ON "invoices"("patientId");

-- CreateIndex
CREATE INDEX "invoices_doctorId_idx" ON "invoices"("doctorId");

-- CreateIndex
CREATE INDEX "invoices_invoiceDate_idx" ON "invoices"("invoiceDate");

-- CreateIndex
CREATE INDEX "invoices_paymentStatus_idx" ON "invoices"("paymentStatus");

-- CreateIndex
CREATE INDEX "invoices_isCancelled_idx" ON "invoices"("isCancelled");

-- CreateIndex
CREATE INDEX "invoice_items_invoiceId_idx" ON "invoice_items"("invoiceId");

-- CreateIndex
CREATE INDEX "invoice_items_itemType_idx" ON "invoice_items"("itemType");

-- CreateIndex
CREATE UNIQUE INDEX "payments_paymentNumber_key" ON "payments"("paymentNumber");

-- CreateIndex
CREATE INDEX "payments_invoiceId_idx" ON "payments"("invoiceId");

-- CreateIndex
CREATE INDEX "payments_paymentDate_idx" ON "payments"("paymentDate");

-- CreateIndex
CREATE INDEX "payments_paymentMethod_idx" ON "payments"("paymentMethod");

-- CreateIndex
CREATE INDEX "payments_isRefunded_idx" ON "payments"("isRefunded");

-- CreateIndex
CREATE INDEX "payments_receivedById_idx" ON "payments"("receivedById");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "working_schedules" ADD CONSTRAINT "working_schedules_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_visits" ADD CONSTRAINT "medical_visits_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_visits" ADD CONSTRAINT "medical_visits_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_visits" ADD CONSTRAINT "medical_visits_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_history" ADD CONSTRAINT "medical_history_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pregnancy_records" ADD CONSTRAINT "pregnancy_records_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pregnancy_followup" ADD CONSTRAINT "pregnancy_followup_pregnancyId_fkey" FOREIGN KEY ("pregnancyId") REFERENCES "pregnancy_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pregnancy_followup" ADD CONSTRAINT "pregnancy_followup_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "medical_visits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagnoses" ADD CONSTRAINT "diagnoses_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "medical_visits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagnoses" ADD CONSTRAINT "diagnoses_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "medical_visits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_followupId_fkey" FOREIGN KEY ("followupId") REFERENCES "pregnancy_followup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescription_items" ADD CONSTRAINT "prescription_items_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "prescriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "templates" ADD CONSTRAINT "templates_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "medical_visits"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_receivedById_fkey" FOREIGN KEY ("receivedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
