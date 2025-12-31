// lib/medical-history/queries.ts

import { PrismaClient } from "@prisma/client";

export async function getMedicalHistoryByPatientId(
  prisma: PrismaClient,
  patientId: number
) {
  return await prisma.medicalHistory.findUnique({
    where: { patientId },
    include: {
      patient: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
}

