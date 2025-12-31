-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "patients" (
    "id" SERIAL NOT NULL,
    "nationalId" VARCHAR(14) NOT NULL,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "birthDate" DATE NOT NULL,
    "bloodType" VARCHAR(10),
    "phone" VARCHAR(15) NOT NULL,
    "phone2" VARCHAR(15),
    "email" VARCHAR(100),
    "address" VARCHAR(200),
    "city" VARCHAR(50),
    "maritalStatus" VARCHAR(20),
    "occupation" VARCHAR(100),
    "emergencyContactName" VARCHAR(100),
    "emergencyContactPhone" VARCHAR(15),
    "emergencyContactRelation" VARCHAR(50),
    "registrationDate" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" INTEGER,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctors" (
    "id" SERIAL NOT NULL,
    "nationalId" VARCHAR(14) NOT NULL,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "specialization" VARCHAR(100) NOT NULL,
    "subSpecialization" VARCHAR(100),
    "licenseNumber" VARCHAR(50) NOT NULL,
    "phone" VARCHAR(15) NOT NULL,
    "email" VARCHAR(100),
    "consultationFee" DECIMAL(10,2) NOT NULL,
    "followupFee" DECIMAL(10,2),
    "emergencyFee" DECIMAL(10,2),
    "surgeryBaseFee" DECIMAL(10,2),
    "yearsOfExperience" INTEGER,
    "qualification" VARCHAR(200),
    "bio" TEXT,
    "profileImage" VARCHAR(500),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "doctors_pkey" PRIMARY KEY ("id")
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
    "notes" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "working_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor_leaves" (
    "id" SERIAL NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "leaveStartDate" DATE NOT NULL,
    "leaveEndDate" DATE NOT NULL,
    "leaveType" VARCHAR(30) NOT NULL,
    "reason" VARCHAR(500),
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "approvedBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "doctor_leaves_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "appointmentDate" DATE NOT NULL,
    "appointmentTime" TIME NOT NULL,
    "appointmentType" VARCHAR(30) NOT NULL,
    "status" VARCHAR(30) NOT NULL DEFAULT 'محجوز',
    "priority" VARCHAR(20) NOT NULL DEFAULT 'عادي',
    "durationMinutes" INTEGER NOT NULL DEFAULT 30,
    "cancellationReason" VARCHAR(200),
    "cancelledBy" INTEGER,
    "cancelledAt" TIMESTAMP(3),
    "reminderSent" BOOLEAN NOT NULL DEFAULT false,
    "reminderSentAt" TIMESTAMP(3),
    "arrivalTime" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" INTEGER,

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
    "chiefComplaint" TEXT,
    "symptoms" TEXT,
    "symptomsDuration" VARCHAR(100),
    "weight" DECIMAL(5,2),
    "height" DECIMAL(5,2),
    "bloodPressureSystolic" INTEGER,
    "bloodPressureDiastolic" INTEGER,
    "temperature" DECIMAL(4,2),
    "pulse" INTEGER,
    "respiratoryRate" INTEGER,
    "oxygenSaturation" DECIMAL(5,2),
    "visitType" VARCHAR(50),
    "examinationFindings" TEXT,
    "treatmentPlan" TEXT,
    "recommendations" TEXT,
    "nextVisitDate" DATE,
    "visitStatus" VARCHAR(30) NOT NULL DEFAULT 'جارية',
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
    "menstrualCycleRegularity" VARCHAR(30),
    "menstrualFlow" VARCHAR(20),
    "dysmenorrhea" VARCHAR(50),
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
    "updatedBy" INTEGER,

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
    "conceptionMethod" VARCHAR(30),
    "pregnancyType" VARCHAR(30),
    "pregnancyStatus" VARCHAR(30) NOT NULL,
    "riskLevel" VARCHAR(20),
    "deliveryDate" DATE,
    "deliveryType" VARCHAR(50),
    "deliveryLocation" VARCHAR(100),
    "gestationalAgeAtDelivery" DECIMAL(4,1),
    "deliveryMethod" VARCHAR(100),
    "anesthesiaType" VARCHAR(50),
    "babyGender" VARCHAR(10),
    "babyWeight" DECIMAL(5,3),
    "babyLength" DECIMAL(4,1),
    "babyHeadCircumference" DECIMAL(4,1),
    "apgarScore1min" INTEGER,
    "apgarScore5min" INTEGER,
    "babyStatus" VARCHAR(30),
    "complications" TEXT,
    "medicationsDuringPregnancy" TEXT,
    "notes" TEXT,
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
    "visitNumber" INTEGER,
    "gestationalAgeWeeks" DECIMAL(3,1),
    "gestationalAgeDays" INTEGER,
    "fundalHeight" DECIMAL(4,2),
    "fetalHeartRate" INTEGER,
    "fetalMovement" VARCHAR(30),
    "fetalPosition" VARCHAR(50),
    "cervicalDilation" DECIMAL(3,1),
    "cervicalEffacement" INTEGER,
    "maternalWeight" DECIMAL(5,2),
    "weightGain" DECIMAL(5,2),
    "bloodPressure" VARCHAR(20),
    "edema" VARCHAR(50),
    "urineProtein" VARCHAR(50),
    "urineGlucose" VARCHAR(50),
    "urineAnalysis" VARCHAR(200),
    "bloodSugarLevel" DECIMAL(5,2),
    "hemoglobinLevel" DECIMAL(4,2),
    "ultrasoundFindings" TEXT,
    "estimatedFetalWeight" DECIMAL(6,3),
    "amnioticFluidIndex" DECIMAL(4,2),
    "placentalLocation" VARCHAR(100),
    "placentalGrade" VARCHAR(20),
    "complications" TEXT,
    "riskFactors" TEXT,
    "recommendations" TEXT,
    "medicationsPrescribed" TEXT,
    "nextVisitDate" DATE,
    "nextVisitType" VARCHAR(100),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pregnancy_followup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diagnoses" (
    "id" SERIAL NOT NULL,
    "visitId" INTEGER NOT NULL,
    "patientId" INTEGER NOT NULL,
    "icdCode" VARCHAR(10),
    "diagnosisName" VARCHAR(200) NOT NULL,
    "diagnosisNameEn" VARCHAR(200),
    "diagnosisType" VARCHAR(30) NOT NULL,
    "severity" VARCHAR(20),
    "diagnosisDate" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isChronic" BOOLEAN NOT NULL DEFAULT false,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "resolutionDate" DATE,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER,

    CONSTRAINT "diagnoses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medications" (
    "id" SERIAL NOT NULL,
    "medicationName" VARCHAR(200) NOT NULL,
    "genericName" VARCHAR(200),
    "scientificName" VARCHAR(200),
    "category" VARCHAR(100),
    "subcategory" VARCHAR(100),
    "form" VARCHAR(30),
    "strength" VARCHAR(50),
    "unit" VARCHAR(20),
    "manufacturer" VARCHAR(200),
    "pregnancyCategory" VARCHAR(5),
    "breastfeedingSafe" BOOLEAN,
    "sideEffects" TEXT,
    "contraindications" TEXT,
    "drugInteractions" TEXT,
    "storageConditions" VARCHAR(200),
    "price" DECIMAL(10,2),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prescriptions" (
    "id" SERIAL NOT NULL,
    "visitId" INTEGER NOT NULL,
    "patientId" INTEGER NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "prescriptionDate" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isEmergency" BOOLEAN NOT NULL DEFAULT false,
    "isChronicMedication" BOOLEAN NOT NULL DEFAULT false,
    "validUntil" DATE,
    "refillsAllowed" INTEGER NOT NULL DEFAULT 0,
    "refillsUsed" INTEGER NOT NULL DEFAULT 0,
    "pharmacyNotes" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prescriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prescription_details" (
    "id" SERIAL NOT NULL,
    "prescriptionId" INTEGER NOT NULL,
    "medicationId" INTEGER NOT NULL,
    "dosage" VARCHAR(100) NOT NULL,
    "frequency" VARCHAR(100) NOT NULL,
    "frequencyPerDay" INTEGER,
    "route" VARCHAR(30),
    "timing" VARCHAR(200),
    "durationDays" INTEGER,
    "startDate" DATE,
    "endDate" DATE,
    "totalQuantity" INTEGER,
    "instructions" TEXT,
    "isAsNeeded" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "prescription_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lab_tests" (
    "id" SERIAL NOT NULL,
    "testCode" VARCHAR(20) NOT NULL,
    "testName" VARCHAR(200) NOT NULL,
    "testNameEn" VARCHAR(200),
    "testCategory" VARCHAR(30) NOT NULL,
    "normalRangeMin" DECIMAL(10,2),
    "normalRangeMax" DECIMAL(10,2),
    "normalRangeText" VARCHAR(100),
    "unit" VARCHAR(50),
    "sampleType" VARCHAR(50),
    "fastingRequired" BOOLEAN NOT NULL DEFAULT false,
    "preparationInstructions" TEXT,
    "turnaroundTimeHours" INTEGER,
    "price" DECIMAL(10,2),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lab_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lab_orders" (
    "id" SERIAL NOT NULL,
    "visitId" INTEGER NOT NULL,
    "patientId" INTEGER NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "orderDate" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orderReason" VARCHAR(500),
    "priority" VARCHAR(20) NOT NULL DEFAULT 'عادي',
    "status" VARCHAR(30) NOT NULL DEFAULT 'معلق',
    "sampleCollectedAt" TIMESTAMP(3),
    "sampleReceivedAt" TIMESTAMP(3),
    "expectedResultDate" DATE,
    "labName" VARCHAR(100),
    "externalLabOrderId" VARCHAR(100),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lab_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lab_results" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "testId" INTEGER NOT NULL,
    "resultValue" VARCHAR(200),
    "resultNumeric" DECIMAL(10,2),
    "resultStatus" VARCHAR(30),
    "resultDate" DATE,
    "resultTime" TIMESTAMP(3),
    "performedBy" VARCHAR(100),
    "verifiedBy" VARCHAR(100),
    "isCritical" BOOLEAN NOT NULL DEFAULT false,
    "criticalNotified" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lab_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "radiology_orders" (
    "id" SERIAL NOT NULL,
    "visitId" INTEGER NOT NULL,
    "patientId" INTEGER NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "pregnancyId" INTEGER,
    "examType" VARCHAR(30) NOT NULL,
    "examArea" VARCHAR(100),
    "examReason" VARCHAR(500),
    "orderDate" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "examDate" DATE,
    "examTime" TIMESTAMP(3),
    "gestationalAgeAtScan" DECIMAL(3,1),
    "findings" TEXT,
    "impression" TEXT,
    "measurements" TEXT,
    "status" VARCHAR(30) NOT NULL DEFAULT 'معلق',
    "imagePath" VARCHAR(500),
    "reportPath" VARCHAR(500),
    "dicomStudyId" VARCHAR(100),
    "performedBy" VARCHAR(100),
    "reportedBy" VARCHAR(100),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "radiology_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "surgeries" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "anesthesiologistId" INTEGER,
    "surgeryName" VARCHAR(200) NOT NULL,
    "surgeryType" VARCHAR(30) NOT NULL,
    "surgeryCategory" VARCHAR(100),
    "plannedDate" DATE,
    "scheduledDate" DATE NOT NULL,
    "scheduledTime" TIMESTAMP(3),
    "expectedDurationMinutes" INTEGER,
    "actualSurgeryDate" DATE,
    "actualStartTime" TIMESTAMP(3),
    "actualEndTime" TIMESTAMP(3),
    "actualDurationMinutes" INTEGER,
    "preOpDiagnosis" VARCHAR(500),
    "postOpDiagnosis" VARCHAR(500),
    "procedureDetails" TEXT,
    "anesthesiaType" VARCHAR(30),
    "incisionType" VARCHAR(100),
    "surgicalApproach" VARCHAR(100),
    "surgicalFindings" TEXT,
    "specimensSent" TEXT,
    "bloodLossMl" INTEGER,
    "transfusionRequired" BOOLEAN NOT NULL DEFAULT false,
    "complications" TEXT,
    "postOpInstructions" TEXT,
    "medicationsPrescribed" TEXT,
    "followupSchedule" VARCHAR(500),
    "expectedRecoveryDays" INTEGER,
    "status" VARCHAR(30) NOT NULL,
    "cancellationReason" VARCHAR(500),
    "assistingDoctors" TEXT,
    "nursingStaff" TEXT,
    "operatingRoom" VARCHAR(50),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "surgeries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "surgery_followup" (
    "id" SERIAL NOT NULL,
    "surgeryId" INTEGER NOT NULL,
    "visitId" INTEGER,
    "followupDate" DATE NOT NULL,
    "daysPostSurgery" INTEGER,
    "woundCondition" VARCHAR(100),
    "painLevel" INTEGER,
    "complications" TEXT,
    "healingStatus" VARCHAR(20),
    "suturesRemoved" BOOLEAN NOT NULL DEFAULT false,
    "suturesRemovalDate" DATE,
    "medicationsContinued" TEXT,
    "recommendations" TEXT,
    "nextFollowupDate" DATE,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "surgery_followup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" SERIAL NOT NULL,
    "serviceCode" VARCHAR(20) NOT NULL,
    "serviceName" VARCHAR(200) NOT NULL,
    "serviceCategory" VARCHAR(30) NOT NULL,
    "description" VARCHAR(500),
    "basePrice" DECIMAL(10,2) NOT NULL,
    "insurancePrice" DECIMAL(10,2),
    "durationMinutes" INTEGER,
    "isTaxable" BOOLEAN NOT NULL DEFAULT true,
    "taxPercentage" DECIMAL(5,2) NOT NULL DEFAULT 14,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" SERIAL NOT NULL,
    "invoiceNumber" VARCHAR(50) NOT NULL,
    "patientId" INTEGER NOT NULL,
    "visitId" INTEGER,
    "invoiceDate" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" DATE,
    "subtotalAmount" DECIMAL(10,2) NOT NULL,
    "discountPercentage" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "discountAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "discountReason" VARCHAR(200),
    "taxAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "insuranceCoverage" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "patientResponsibility" DECIMAL(10,2) NOT NULL,
    "netAmount" DECIMAL(10,2) NOT NULL,
    "paymentStatus" VARCHAR(30) NOT NULL DEFAULT 'غير مدفوع',
    "paidAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "remainingAmount" DECIMAL(10,2),
    "insuranceId" INTEGER,
    "insuranceClaimNumber" VARCHAR(100),
    "billingNotes" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" INTEGER,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_details" (
    "id" SERIAL NOT NULL,
    "invoiceId" INTEGER NOT NULL,
    "serviceId" INTEGER,
    "itemType" VARCHAR(30) NOT NULL,
    "description" VARCHAR(200) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "discountAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "taxAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "totalPrice" DECIMAL(10,2) NOT NULL,
    "notes" VARCHAR(500),

    CONSTRAINT "invoice_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,
    "paymentNumber" VARCHAR(50),
    "invoiceId" INTEGER NOT NULL,
    "paymentDate" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentAmount" DECIMAL(10,2) NOT NULL,
    "paymentMethod" VARCHAR(30) NOT NULL,
    "referenceNumber" VARCHAR(100),
    "cardLast4Digits" VARCHAR(4),
    "bankName" VARCHAR(100),
    "checkNumber" VARCHAR(50),
    "checkDate" DATE,
    "processedBy" INTEGER,
    "receiptNumber" VARCHAR(50),
    "isRefund" BOOLEAN NOT NULL DEFAULT false,
    "refundReason" VARCHAR(500),
    "parentPaymentId" INTEGER,
    "notes" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insurance_companies" (
    "id" SERIAL NOT NULL,
    "companyCode" VARCHAR(20) NOT NULL,
    "companyName" VARCHAR(200) NOT NULL,
    "companyNameEn" VARCHAR(200),
    "contactPerson" VARCHAR(100),
    "phone" VARCHAR(15),
    "phone2" VARCHAR(15),
    "email" VARCHAR(100),
    "website" VARCHAR(200),
    "address" VARCHAR(200),
    "city" VARCHAR(50),
    "coveragePercentage" DECIMAL(5,2),
    "copayAmount" DECIMAL(10,2),
    "deductibleAmount" DECIMAL(10,2),
    "maxCoveragePerVisit" DECIMAL(10,2),
    "maxCoverageAnnual" DECIMAL(10,2),
    "approvalRequired" BOOLEAN NOT NULL DEFAULT true,
    "paymentTerms" VARCHAR(200),
    "paymentCycleDays" INTEGER,
    "contractStartDate" DATE,
    "contractEndDate" DATE,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "insurance_companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_insurance" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "insuranceId" INTEGER NOT NULL,
    "policyNumber" VARCHAR(100) NOT NULL,
    "memberId" VARCHAR(100),
    "groupNumber" VARCHAR(100),
    "policyHolderName" VARCHAR(100),
    "relationshipToHolder" VARCHAR(50),
    "startDate" DATE NOT NULL,
    "endDate" DATE,
    "coverageType" VARCHAR(100),
    "coverageDetails" TEXT,
    "preauthorizationRequired" BOOLEAN NOT NULL DEFAULT true,
    "isPrimary" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "verificationDate" DATE,
    "verifiedBy" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patient_insurance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff" (
    "id" SERIAL NOT NULL,
    "employeeNumber" VARCHAR(20) NOT NULL,
    "nationalId" VARCHAR(14) NOT NULL,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "position" VARCHAR(30) NOT NULL,
    "department" VARCHAR(100),
    "phone" VARCHAR(15) NOT NULL,
    "email" VARCHAR(100),
    "address" VARCHAR(200),
    "hireDate" DATE NOT NULL,
    "terminationDate" DATE,
    "employmentType" VARCHAR(30) NOT NULL,
    "salary" DECIMAL(10,2),
    "salaryCurrency" VARCHAR(3) NOT NULL DEFAULT 'EGP',
    "workingHoursPerWeek" INTEGER,
    "emergencyContactName" VARCHAR(100),
    "emergencyContactPhone" VARCHAR(15),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" SERIAL NOT NULL,
    "permissionName" VARCHAR(100) NOT NULL,
    "permissionCode" VARCHAR(50) NOT NULL,
    "description" VARCHAR(500),
    "module" VARCHAR(50),
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "roleName" VARCHAR(100) NOT NULL,
    "roleCode" VARCHAR(50) NOT NULL,
    "description" VARCHAR(500),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "id" SERIAL NOT NULL,
    "roleId" INTEGER NOT NULL,
    "permissionId" INTEGER NOT NULL,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "grantedBy" INTEGER,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "passwordHash" VARCHAR(200) NOT NULL,
    "passwordSalt" VARCHAR(100),
    "email" VARCHAR(100),
    "userType" VARCHAR(30) NOT NULL,
    "roleId" INTEGER,
    "doctorId" INTEGER,
    "staffId" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "mustChangePassword" BOOLEAN NOT NULL DEFAULT false,
    "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
    "accountLocked" BOOLEAN NOT NULL DEFAULT false,
    "lockedUntil" TIMESTAMP(3),
    "lastLogin" TIMESTAMP(3),
    "lastPasswordChange" TIMESTAMP(3),
    "passwordExpiryDate" DATE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "actionType" VARCHAR(30) NOT NULL,
    "tableName" VARCHAR(100),
    "recordId" INTEGER,
    "oldValue" TEXT,
    "newValue" TEXT,
    "ipAddress" VARCHAR(45),
    "userAgent" VARCHAR(500),
    "actionTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "patients_nationalId_key" ON "patients"("nationalId");

-- CreateIndex
CREATE INDEX "patients_nationalId_idx" ON "patients"("nationalId");

-- CreateIndex
CREATE INDEX "patients_phone_idx" ON "patients"("phone");

-- CreateIndex
CREATE INDEX "patients_firstName_lastName_idx" ON "patients"("firstName", "lastName");

-- CreateIndex
CREATE INDEX "patients_isActive_idx" ON "patients"("isActive");

-- CreateIndex
CREATE INDEX "patients_registrationDate_idx" ON "patients"("registrationDate");

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
CREATE INDEX "doctors_specialization_idx" ON "doctors"("specialization");

-- CreateIndex
CREATE INDEX "working_schedules_doctorId_dayOfWeek_idx" ON "working_schedules"("doctorId", "dayOfWeek");

-- CreateIndex
CREATE INDEX "working_schedules_doctorId_isActive_idx" ON "working_schedules"("doctorId", "isActive");

-- CreateIndex
CREATE INDEX "doctor_leaves_doctorId_leaveStartDate_leaveEndDate_idx" ON "doctor_leaves"("doctorId", "leaveStartDate", "leaveEndDate");

-- CreateIndex
CREATE INDEX "doctor_leaves_leaveStartDate_leaveEndDate_idx" ON "doctor_leaves"("leaveStartDate", "leaveEndDate");

-- CreateIndex
CREATE INDEX "doctor_leaves_isApproved_idx" ON "doctor_leaves"("isApproved");

-- CreateIndex
CREATE INDEX "appointments_patientId_idx" ON "appointments"("patientId");

-- CreateIndex
CREATE INDEX "appointments_doctorId_idx" ON "appointments"("doctorId");

-- CreateIndex
CREATE INDEX "appointments_appointmentDate_doctorId_idx" ON "appointments"("appointmentDate", "doctorId");

-- CreateIndex
CREATE INDEX "appointments_appointmentDate_appointmentTime_idx" ON "appointments"("appointmentDate", "appointmentTime");

-- CreateIndex
CREATE INDEX "appointments_status_idx" ON "appointments"("status");

-- CreateIndex
CREATE INDEX "appointments_appointmentType_idx" ON "appointments"("appointmentType");

-- CreateIndex
CREATE UNIQUE INDEX "medical_visits_appointmentId_key" ON "medical_visits"("appointmentId");

-- CreateIndex
CREATE INDEX "medical_visits_patientId_idx" ON "medical_visits"("patientId");

-- CreateIndex
CREATE INDEX "medical_visits_doctorId_idx" ON "medical_visits"("doctorId");

-- CreateIndex
CREATE INDEX "medical_visits_visitDate_idx" ON "medical_visits"("visitDate");

-- CreateIndex
CREATE UNIQUE INDEX "medical_history_patientId_key" ON "medical_history"("patientId");

-- CreateIndex
CREATE INDEX "pregnancy_records_patientId_idx" ON "pregnancy_records"("patientId");

-- CreateIndex
CREATE INDEX "pregnancy_records_pregnancyStatus_idx" ON "pregnancy_records"("pregnancyStatus");

-- CreateIndex
CREATE INDEX "pregnancy_records_lmpDate_idx" ON "pregnancy_records"("lmpDate");

-- CreateIndex
CREATE INDEX "pregnancy_records_eddDate_idx" ON "pregnancy_records"("eddDate");

-- CreateIndex
CREATE INDEX "pregnancy_records_deliveryDate_idx" ON "pregnancy_records"("deliveryDate");

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
CREATE INDEX "diagnoses_icdCode_idx" ON "diagnoses"("icdCode");

-- CreateIndex
CREATE INDEX "diagnoses_diagnosisDate_idx" ON "diagnoses"("diagnosisDate");

-- CreateIndex
CREATE INDEX "diagnoses_isChronic_idx" ON "diagnoses"("isChronic");

-- CreateIndex
CREATE INDEX "medications_medicationName_idx" ON "medications"("medicationName");

-- CreateIndex
CREATE INDEX "medications_category_idx" ON "medications"("category");

-- CreateIndex
CREATE INDEX "medications_isActive_idx" ON "medications"("isActive");

-- CreateIndex
CREATE INDEX "prescriptions_patientId_idx" ON "prescriptions"("patientId");

-- CreateIndex
CREATE INDEX "prescriptions_doctorId_idx" ON "prescriptions"("doctorId");

-- CreateIndex
CREATE INDEX "prescriptions_prescriptionDate_idx" ON "prescriptions"("prescriptionDate");

-- CreateIndex
CREATE INDEX "prescriptions_visitId_idx" ON "prescriptions"("visitId");

-- CreateIndex
CREATE INDEX "prescriptions_isChronicMedication_idx" ON "prescriptions"("isChronicMedication");

-- CreateIndex
CREATE INDEX "prescription_details_prescriptionId_idx" ON "prescription_details"("prescriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "lab_tests_testCode_key" ON "lab_tests"("testCode");

-- CreateIndex
CREATE INDEX "lab_tests_testCode_idx" ON "lab_tests"("testCode");

-- CreateIndex
CREATE INDEX "lab_tests_testCategory_idx" ON "lab_tests"("testCategory");

-- CreateIndex
CREATE INDEX "lab_tests_isActive_idx" ON "lab_tests"("isActive");

-- CreateIndex
CREATE INDEX "lab_orders_patientId_idx" ON "lab_orders"("patientId");

-- CreateIndex
CREATE INDEX "lab_orders_status_idx" ON "lab_orders"("status");

-- CreateIndex
CREATE INDEX "lab_orders_orderDate_idx" ON "lab_orders"("orderDate");

-- CreateIndex
CREATE INDEX "lab_orders_doctorId_idx" ON "lab_orders"("doctorId");

-- CreateIndex
CREATE INDEX "lab_orders_visitId_idx" ON "lab_orders"("visitId");

-- CreateIndex
CREATE INDEX "lab_results_orderId_idx" ON "lab_results"("orderId");

-- CreateIndex
CREATE INDEX "lab_results_testId_idx" ON "lab_results"("testId");

-- CreateIndex
CREATE INDEX "lab_results_resultDate_idx" ON "lab_results"("resultDate");

-- CreateIndex
CREATE INDEX "lab_results_resultStatus_idx" ON "lab_results"("resultStatus");

-- CreateIndex
CREATE INDEX "lab_results_isCritical_idx" ON "lab_results"("isCritical");

-- CreateIndex
CREATE INDEX "radiology_orders_patientId_idx" ON "radiology_orders"("patientId");

-- CreateIndex
CREATE INDEX "radiology_orders_pregnancyId_idx" ON "radiology_orders"("pregnancyId");

-- CreateIndex
CREATE INDEX "radiology_orders_orderDate_idx" ON "radiology_orders"("orderDate");

-- CreateIndex
CREATE INDEX "radiology_orders_status_idx" ON "radiology_orders"("status");

-- CreateIndex
CREATE INDEX "radiology_orders_doctorId_idx" ON "radiology_orders"("doctorId");

-- CreateIndex
CREATE INDEX "radiology_orders_visitId_idx" ON "radiology_orders"("visitId");

-- CreateIndex
CREATE INDEX "surgeries_patientId_idx" ON "surgeries"("patientId");

-- CreateIndex
CREATE INDEX "surgeries_doctorId_idx" ON "surgeries"("doctorId");

-- CreateIndex
CREATE INDEX "surgeries_scheduledDate_idx" ON "surgeries"("scheduledDate");

-- CreateIndex
CREATE INDEX "surgeries_status_idx" ON "surgeries"("status");

-- CreateIndex
CREATE INDEX "surgeries_surgeryType_idx" ON "surgeries"("surgeryType");

-- CreateIndex
CREATE INDEX "surgery_followup_surgeryId_idx" ON "surgery_followup"("surgeryId");

-- CreateIndex
CREATE INDEX "surgery_followup_visitId_idx" ON "surgery_followup"("visitId");

-- CreateIndex
CREATE INDEX "surgery_followup_followupDate_idx" ON "surgery_followup"("followupDate");

-- CreateIndex
CREATE UNIQUE INDEX "services_serviceCode_key" ON "services"("serviceCode");

-- CreateIndex
CREATE INDEX "services_serviceCode_idx" ON "services"("serviceCode");

-- CreateIndex
CREATE INDEX "services_serviceCategory_idx" ON "services"("serviceCategory");

-- CreateIndex
CREATE INDEX "services_isActive_idx" ON "services"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoiceNumber_key" ON "invoices"("invoiceNumber");

-- CreateIndex
CREATE INDEX "invoices_patientId_idx" ON "invoices"("patientId");

-- CreateIndex
CREATE INDEX "invoices_invoiceDate_idx" ON "invoices"("invoiceDate");

-- CreateIndex
CREATE INDEX "invoices_paymentStatus_idx" ON "invoices"("paymentStatus");

-- CreateIndex
CREATE INDEX "invoices_invoiceNumber_idx" ON "invoices"("invoiceNumber");

-- CreateIndex
CREATE INDEX "invoices_insuranceId_idx" ON "invoices"("insuranceId");

-- CreateIndex
CREATE INDEX "invoice_details_invoiceId_idx" ON "invoice_details"("invoiceId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_paymentNumber_key" ON "payments"("paymentNumber");

-- CreateIndex
CREATE INDEX "payments_invoiceId_idx" ON "payments"("invoiceId");

-- CreateIndex
CREATE INDEX "payments_paymentDate_idx" ON "payments"("paymentDate");

-- CreateIndex
CREATE INDEX "payments_paymentNumber_idx" ON "payments"("paymentNumber");

-- CreateIndex
CREATE INDEX "payments_paymentMethod_idx" ON "payments"("paymentMethod");

-- CreateIndex
CREATE UNIQUE INDEX "insurance_companies_companyCode_key" ON "insurance_companies"("companyCode");

-- CreateIndex
CREATE INDEX "patient_insurance_patientId_idx" ON "patient_insurance"("patientId");

-- CreateIndex
CREATE INDEX "patient_insurance_insuranceId_idx" ON "patient_insurance"("insuranceId");

-- CreateIndex
CREATE INDEX "patient_insurance_policyNumber_idx" ON "patient_insurance"("policyNumber");

-- CreateIndex
CREATE INDEX "patient_insurance_isActive_idx" ON "patient_insurance"("isActive");

-- CreateIndex
CREATE INDEX "patient_insurance_isPrimary_idx" ON "patient_insurance"("isPrimary");

-- CreateIndex
CREATE UNIQUE INDEX "staff_employeeNumber_key" ON "staff"("employeeNumber");

-- CreateIndex
CREATE UNIQUE INDEX "staff_nationalId_key" ON "staff"("nationalId");

-- CreateIndex
CREATE INDEX "staff_employeeNumber_idx" ON "staff"("employeeNumber");

-- CreateIndex
CREATE INDEX "staff_nationalId_idx" ON "staff"("nationalId");

-- CreateIndex
CREATE INDEX "staff_position_idx" ON "staff"("position");

-- CreateIndex
CREATE INDEX "staff_isActive_idx" ON "staff"("isActive");

-- CreateIndex
CREATE INDEX "staff_department_idx" ON "staff"("department");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_permissionName_key" ON "permissions"("permissionName");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_permissionCode_key" ON "permissions"("permissionCode");

-- CreateIndex
CREATE INDEX "permissions_permissionCode_idx" ON "permissions"("permissionCode");

-- CreateIndex
CREATE INDEX "permissions_module_idx" ON "permissions"("module");

-- CreateIndex
CREATE INDEX "permissions_isActive_idx" ON "permissions"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "roles_roleName_key" ON "roles"("roleName");

-- CreateIndex
CREATE UNIQUE INDEX "roles_roleCode_key" ON "roles"("roleCode");

-- CreateIndex
CREATE INDEX "roles_roleCode_idx" ON "roles"("roleCode");

-- CreateIndex
CREATE INDEX "roles_isActive_idx" ON "roles"("isActive");

-- CreateIndex
CREATE INDEX "role_permissions_roleId_idx" ON "role_permissions"("roleId");

-- CreateIndex
CREATE INDEX "role_permissions_permissionId_idx" ON "role_permissions"("permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_roleId_permissionId_key" ON "role_permissions"("roleId", "permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "system_users_username_key" ON "system_users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "system_users_email_key" ON "system_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "system_users_doctorId_key" ON "system_users"("doctorId");

-- CreateIndex
CREATE UNIQUE INDEX "system_users_staffId_key" ON "system_users"("staffId");

-- CreateIndex
CREATE INDEX "system_users_username_idx" ON "system_users"("username");

-- CreateIndex
CREATE INDEX "system_users_email_idx" ON "system_users"("email");

-- CreateIndex
CREATE INDEX "system_users_userType_idx" ON "system_users"("userType");

-- CreateIndex
CREATE INDEX "system_users_isActive_idx" ON "system_users"("isActive");

-- CreateIndex
CREATE INDEX "system_users_roleId_idx" ON "system_users"("roleId");

-- CreateIndex
CREATE INDEX "audit_log_userId_idx" ON "audit_log"("userId");

-- CreateIndex
CREATE INDEX "audit_log_tableName_recordId_idx" ON "audit_log"("tableName", "recordId");

-- CreateIndex
CREATE INDEX "audit_log_actionTimestamp_idx" ON "audit_log"("actionTimestamp");

-- CreateIndex
CREATE INDEX "audit_log_actionType_idx" ON "audit_log"("actionType");

-- AddForeignKey
ALTER TABLE "working_schedules" ADD CONSTRAINT "working_schedules_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_leaves" ADD CONSTRAINT "doctor_leaves_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "medical_visits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescription_details" ADD CONSTRAINT "prescription_details_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "prescriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescription_details" ADD CONSTRAINT "prescription_details_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "medications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lab_orders" ADD CONSTRAINT "lab_orders_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "medical_visits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lab_orders" ADD CONSTRAINT "lab_orders_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lab_orders" ADD CONSTRAINT "lab_orders_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lab_results" ADD CONSTRAINT "lab_results_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "lab_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lab_results" ADD CONSTRAINT "lab_results_testId_fkey" FOREIGN KEY ("testId") REFERENCES "lab_tests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "radiology_orders" ADD CONSTRAINT "radiology_orders_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "medical_visits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "radiology_orders" ADD CONSTRAINT "radiology_orders_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "radiology_orders" ADD CONSTRAINT "radiology_orders_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "radiology_orders" ADD CONSTRAINT "radiology_orders_pregnancyId_fkey" FOREIGN KEY ("pregnancyId") REFERENCES "pregnancy_records"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "surgeries" ADD CONSTRAINT "surgeries_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "surgeries" ADD CONSTRAINT "surgeries_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "surgeries" ADD CONSTRAINT "surgeries_anesthesiologistId_fkey" FOREIGN KEY ("anesthesiologistId") REFERENCES "doctors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "surgery_followup" ADD CONSTRAINT "surgery_followup_surgeryId_fkey" FOREIGN KEY ("surgeryId") REFERENCES "surgeries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "surgery_followup" ADD CONSTRAINT "surgery_followup_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "medical_visits"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "medical_visits"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_insuranceId_fkey" FOREIGN KEY ("insuranceId") REFERENCES "insurance_companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_details" ADD CONSTRAINT "invoice_details_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_details" ADD CONSTRAINT "invoice_details_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_parentPaymentId_fkey" FOREIGN KEY ("parentPaymentId") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_insurance" ADD CONSTRAINT "patient_insurance_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_insurance" ADD CONSTRAINT "patient_insurance_insuranceId_fkey" FOREIGN KEY ("insuranceId") REFERENCES "insurance_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_users" ADD CONSTRAINT "system_users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_users" ADD CONSTRAINT "system_users_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_users" ADD CONSTRAINT "system_users_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "system_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

