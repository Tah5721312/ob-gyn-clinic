// types/next-auth.d.ts

import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      userType: string;
      roleId: number | null;
      roleName: string | null;
      doctorId: number | null;
      staffId: number | null;
      permissions: string[];
      mustChangePassword: boolean;
    };
  }

  interface User {
    id: string;
    userType: string;
    roleId: number | null;
    roleName: string | null;
    doctorId: number | null;
    staffId: number | null;
    permissions: string[];
    mustChangePassword: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    userType: string;
    roleId: number | null;
    roleName: string | null;
    doctorId: number | null;
    staffId: number | null;
    permissions: string[];
    mustChangePassword: boolean;
  }
}