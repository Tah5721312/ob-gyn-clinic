import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/dashboard/stats
 * جلب جميع الإحصائيات المطلوبة للوحة التحكم
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const month = searchParams.get("month") ? new Date(searchParams.get("month")!) : new Date();

    // بداية الشهر الحالي
    const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
    // نهاية الشهر الحالي
    const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    // نهاية اليوم
    endOfMonth.setHours(23, 59, 59, 999);

    // جلب جميع الإحصائيات بالتوازي
    const [
      totalPatients,
      monthlyAppointments,
      monthlyInvoices,
      pendingInvoices,
      totalVisits,
      newPatients,
      pregnancyFollowups,
      ultrasounds
    ] = await Promise.all([
      // إجمالي المرضى
      prisma.patient.count({
        where: { isActive: true }
      }),

      // مواعيد الشهر
      prisma.appointment.count({
        where: {
          appointmentDate: {
            gte: startOfMonth,
            lte: endOfMonth
          }
        }
      }),

      // فواتير الشهر
      prisma.invoice.findMany({
        where: {
          invoiceDate: {
            gte: startOfMonth,
            lte: endOfMonth
          }
        },
        include: {
          payments: true
        }
      }),

      // الفواتير المعلقة
      prisma.invoice.count({
        where: {
          paymentStatus: {
            in: ['UNPAID', 'PARTIAL']
          }
        }
      }),

      // إجمالي الزيارات
      prisma.medicalVisit.count({
        where: {
          isDraft: false
        }
      }),

      // مرضى جدد (في الشهر الحالي)
      prisma.patient.count({
        where: {
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth
          },
          isActive: true
        }
      }),

      // متابعات الحمل
      prisma.pregnancyFollowup.count({
        where: {
          visitDate: {
            gte: startOfMonth,
            lte: endOfMonth
          }
        }
      }),

      // حالات السونار (زيارات تحتوي على سونار)
      prisma.medicalVisit.count({
        where: {
          visitDate: {
            gte: startOfMonth,
            lte: endOfMonth
          },
          isDraft: false,
          diagnoses: {
            some: {
              diagnosisName: {
                contains: 'سونار',
                mode: 'insensitive'
              }
            }
          }
        }
      })
    ]);

    // حساب الإيرادات الشهرية
    const monthlyRevenue = monthlyInvoices.reduce((sum: number, invoice: any) =>
      sum + Number(invoice.totalAmount), 0
    );

    // حساب الملخص المالي
    const totalRevenue = monthlyInvoices.reduce((sum: number, invoice: any) =>
      sum + Number(invoice.totalAmount), 0
    );
    const totalPaid = monthlyInvoices.reduce((sum: number, invoice: any) => {
      const paidAmount = invoice.payments.reduce((paymentSum: number, payment: any) =>
        paymentSum + Number(payment.amount), 0
      );
      return sum + paidAmount;
    }, 0);

    // تقسيم المدفوعات بين نقداً وكارت (يمكن تحسينه لاحقاً بناءً على بيانات حقيقية)
    const cashPaid = totalPaid * 0.7; // تقدير 70% نقداً
    const cardPaid = totalPaid * 0.3;  // تقدير 30% كارت
    const remaining = totalRevenue - totalPaid;

    const stats = {
      totalPatients,
      monthlyAppointments,
      monthlyRevenue,
      pendingInvoices,
      financialSummary: {
        totalRevenue,
        cash: cashPaid,
        card: cardPaid,
        remaining
      },
      quickStats: {
        visits: totalVisits,
        newPatients,
        pregnancyFollowups,
        ultrasounds
      }
    };

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error: any) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء جلب الإحصائيات",
      },
      { status: 500 }
    );
  }
}
