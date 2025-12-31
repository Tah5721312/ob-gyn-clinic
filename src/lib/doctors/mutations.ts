// lib/doctors/mutations.ts

import { PrismaClient } from "@prisma/client";

export interface CreateDoctorData {
  nationalId: string;
  firstName: string;
  lastName: string;
  specialization: string;
  subSpecialization?: string;
  licenseNumber: string;
  phone: string;
  email?: string;
  consultationFee: number;
  followupFee?: number;
  emergencyFee?: number;
  surgeryBaseFee?: number;
  yearsOfExperience?: number;
  qualification?: string;
  bio?: string;
  profileImage?: string;
  isActive?: boolean;
}

export interface UpdateDoctorData {
  firstName?: string;
  lastName?: string;
  specialization?: string;
  subSpecialization?: string;
  phone?: string;
  email?: string;
  consultationFee?: number;
  followupFee?: number;
  emergencyFee?: number;
  surgeryBaseFee?: number;
  yearsOfExperience?: number;
  qualification?: string;
  bio?: string;
  profileImage?: string;
  isActive?: boolean;
}

export async function createDoctor(
  prisma: PrismaClient,
  data: CreateDoctorData
) {
  return await prisma.doctor.create({
    data: {
      isActive: data.isActive ?? true,
      ...data,
    },
  });
}

export async function updateDoctor(
  prisma: PrismaClient,
  doctorId: number,
  data: UpdateDoctorData
) {
  return await prisma.doctor.update({
    where: { id: doctorId },
    data,
  });
}

export async function deleteDoctor(
  prisma: PrismaClient,
  doctorId: number
) {
  return await prisma.doctor.delete({
    where: { id: doctorId },
  });
}

