// types/next-auth.d.ts

import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string; // DOCTOR, RECEPTIONIST, ADMIN
      doctorId: number | null;
      firstName: string;
      lastName: string;
      phone: string;
    };
  }

  interface User {
    id: string;
    role: string;
    doctorId: number | null;
    firstName: string;
    lastName: string;
    phone: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    doctorId: number | null;
    firstName: string;
    lastName: string;
    phone: string;
  }
}