// lib/doctor-leaves/mutations.ts

import { PrismaClient } from "@prisma/client";
import { CreateDoctorLeaveData, UpdateDoctorLeaveData } from "./types";

export async function createDoctorLeave(
  prisma: PrismaClient,
  data: CreateDoctorLeaveData
) {
  return await prisma.doctorLeave.create({
    data: {
      isApproved: data.isApproved ?? false,
      ...data,
      leaveStartDate: new Date(data.leaveStartDate),
      leaveEndDate: new Date(data.leaveEndDate),
    },
  });
}

export async function updateDoctorLeave(
  prisma: PrismaClient,
  leaveId: number,
  data: UpdateDoctorLeaveData
) {
  return await prisma.doctorLeave.update({
    where: { id: leaveId },
    data: {
      ...data,
      leaveStartDate: data.leaveStartDate ? new Date(data.leaveStartDate) : undefined,
      leaveEndDate: data.leaveEndDate ? new Date(data.leaveEndDate) : undefined,
    },
  });
}

export async function deleteDoctorLeave(
  prisma: PrismaClient,
  leaveId: number
) {
  return await prisma.doctorLeave.delete({
    where: { id: leaveId },
  });
}

