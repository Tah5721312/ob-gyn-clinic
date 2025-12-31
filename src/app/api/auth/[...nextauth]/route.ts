// app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { authenticateSystemUser, getRedirectUrl } from "@/lib/auth-helpers";

export const authOptions: NextAuthOptions = {
  // لا حاجة لـ PrismaAdapter عند استخدام JWT strategy مع CredentialsProvider
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "اسم المستخدم", type: "text" },
        password: { label: "كلمة المرور", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("اسم المستخدم وكلمة المرور مطلوبة");
        }

        try {
          const user = await authenticateSystemUser(
            credentials.username,
            credentials.password
          );

          if (!user) {
            throw new Error("اسم المستخدم أو كلمة المرور غير صحيحة");
          }

          return {
            id: user.id.toString(),
            name: user.username,
            email: user.username + "@system.local", // للتوافق مع NextAuth
            userType: user.userType,
            roleId: user.roleId,
            roleName: user.roleName,
            doctorId: user.doctorId,
            staffId: user.staffId,
            permissions: user.permissions,
            mustChangePassword: user.mustChangePassword,
          };
        } catch (error: any) {
          throw new Error(error.message || "حدث خطأ أثناء تسجيل الدخول");
        }
      }
    }),
  ],
  
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 ساعات
  },
  
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.userType = user.userType;
        token.roleId = user.roleId;
        token.roleName = user.roleName;
        token.doctorId = user.doctorId;
        token.staffId = user.staffId;
        token.permissions = user.permissions;
        token.mustChangePassword = user.mustChangePassword;
      }
      return token;
    },
    
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.userType = token.userType as string;
        session.user.roleId = token.roleId as number | null;
        session.user.roleName = token.roleName as string | null;
        session.user.doctorId = token.doctorId as number | null;
        session.user.staffId = token.staffId as number | null;
        session.user.permissions = token.permissions as string[];
        session.user.mustChangePassword = token.mustChangePassword as boolean;
      }
      return session;
    },
    
    async redirect({ url, baseUrl }) {
      // إذا كان المستخدم يريد تغيير كلمة المرور، توجهه إلى /change-password
      // (سيتم التحقق من ذلك في صفحة signin بعد signIn)
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  
  events: {
    async signIn({ user }) {
      // Log audit trail
      if (user.id) {
        await prisma.auditLog.create({
          data: {
            userId: parseInt(user.id),
            actionType: "LOGIN",
            actionTimestamp: new Date(),
          },
        });
      }
    },
  },
  
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };