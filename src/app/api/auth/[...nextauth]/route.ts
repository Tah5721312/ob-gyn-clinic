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
            email: user.email || user.username + "@system.local", // للتوافق مع NextAuth
            role: user.role,
            doctorId: user.doctorId,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
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
    signIn: "/signin",
    error: "/auth/error",
  },
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.doctorId = (user as any).doctorId;
        token.firstName = (user as any).firstName;
        token.lastName = (user as any).lastName;
        token.phone = (user as any).phone;
      }
      return token;
    },
    
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.doctorId = token.doctorId as number | null;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.phone = token.phone as string;
      }
      return session;
    },
    
    async redirect({ url, baseUrl }) {
      // إذا كان المستخدم يريد تغيير كلمة المرور، توجهه إلى /change-password
      // (سيتم التحقق من ذلك في صفحة signin بعد signIn)
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  
  // تم حذف events.signIn لأن auditLog model غير موجود في الـ schema الجديد
  
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };