'use client';
import { apiFetch } from '@/lib/api';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  User,
  Phone,
  Calendar,
  MapPin,
  Edit,
  Trash2,
  Plus,
  FileText,
  Stethoscope,
  Pill,
  ArrowRight,
  Shield,
  Baby,
} from 'lucide-react';

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: Date | string;
  bloodType: string | null;
  phone: string;
  phone2: string | null;
  address: string | null;
  maritalStatus: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  emergencyContactRelation: string | null;
  registrationDate: Date | string;
  isActive: boolean;
  notes: string | null;
  pregnancyRecords?: Array<{
    id: number;
    lmpDate: Date | string;
    edd: Date | string | null;
    isActive: boolean;
  }>;
  medicalHistory?: {
    allergies: string | null;
    chronicDiseases: string | null;
    previousSurgeries: string | null;
    familyHistory: string | null;
  } | null;
  appointments?: Array<{
    id: number;
    appointmentDate: Date | string;
    appointmentTime: Date | string;
    status: string;
    doctor: {
      id: number;
      firstName: string;
      lastName: string;
    };
  }>;
  visits?: Array<{
    id: number;
    visitDate: Date | string;
    chiefComplaint: string | null;
    doctor: {
      id: number;
      firstName: string;
      lastName: string;
    };
    prescriptions: Array<{
      id: number;
      createdAt: Date | string;
      items: Array<{
        id: number;
        medicationName: string;
      }>;
    }>;
  }>;
  diagnoses?: Array<{
    id: number;
    diagnosis: string;
    createdAt: Date | string;
  }>;
}

export default function PatientDetailClient() {
  const router = useRouter();
  const params = useParams();
  const patientId = parseInt(params.id as string);

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await apiFetch(`/api/patients/${patientId}`);
        const result = await response.json();

        if (result.success && result.data) {
          setPatient(result.data);
        } else {
          alert('المريض غير موجود');
          router.push('/patients');
        }
      } catch (error) {
        console.error('Error fetching patient:', error);
        alert('حدث خطأ أثناء جلب بيانات المريض');
        router.push('/patients');
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchPatient();
    }
  }, [patientId, router]);

  const handleDelete = async () => {
    try {
      const response = await apiFetch(`/api/patients/${patientId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        alert('تم حذف المريض بنجاح');
        router.push('/patients');
      } else {
        alert(result.error || 'حدث خطأ أثناء حذف المريض');
      }
    } catch (error) {
      console.error('Error deleting patient:', error);
      alert('حدث خطأ أثناء حذف المريض');
    }
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return 'غير محدد';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (date: Date | string | null) => {
    if (!date) return 'غير محدد';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateAge = (birthDate: Date | string) => {
    const birth =
      typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className='text-center py-12 text-gray-500'>جاري التحميل...</div>
    );
  }

  if (!patient) {
    return (
      <div className='text-center py-12'>
        <p className='text-gray-600'>المريض غير موجود</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>
            {patient.firstName} {patient.lastName}
          </h1>
        </div>
        <div className='flex gap-2'>
          <button
            onClick={() =>
              router.push(`/appointments/new?patientId=${patient.id}`)
            }
            className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            <Plus className='w-5 h-5' />
            موعد جديد
          </button>
          <button
            onClick={() => router.push(`/visits/new?patientId=${patient.id}`)}
            className='flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'
          >
            <Stethoscope className='w-5 h-5' />
            زيارة جديدة
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className='flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'
          >
            <Trash2 className='w-5 h-5' />
            حذف
          </button>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Left Column - Main Info */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Personal Information */}
          <div className='bg-white rounded-lg shadow-md p-6'>
            <h2 className='text-xl font-bold text-gray-900 mb-4 flex items-center gap-2'>
              <User className='w-5 h-5' />
              المعلومات الشخصية
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <p className='text-sm text-gray-600'>الاسم الكامل</p>
                <p className='text-lg font-medium text-gray-900'>
                  {patient.firstName} {patient.lastName}
                </p>
              </div>
              <div>
                <p className='text-sm text-gray-600'>تاريخ الميلاد</p>
                <p className='text-lg font-medium text-gray-900'>
                  {formatDate(patient.birthDate)} (
                  {calculateAge(patient.birthDate)} سنة)
                </p>
              </div>
              <div>
                <p className='text-sm text-gray-600'>فصيلة الدم</p>
                <p className='text-lg font-medium text-gray-900'>
                  {patient.bloodType || 'غير محدد'}
                </p>
              </div>
              <div>
                <p className='text-sm text-gray-600 flex items-center gap-1'>
                  <Phone className='w-4 h-4' />
                  الهاتف
                </p>
                <p className='text-lg font-medium text-gray-900'>
                  {patient.phone}
                </p>
              </div>
              {patient.phone2 && (
                <div>
                  <p className='text-sm text-gray-600 flex items-center gap-1'>
                    <Phone className='w-4 h-4' />
                    الهاتف الثاني
                  </p>
                  <p className='text-lg font-medium text-gray-900'>
                    {patient.phone2}
                  </p>
                </div>
              )}
              {patient.address && (
                <div className='md:col-span-2'>
                  <p className='text-sm text-gray-600 flex items-center gap-1'>
                    <MapPin className='w-4 h-4' />
                    العنوان
                  </p>
                  <p className='text-lg font-medium text-gray-900'>
                    {patient.address}
                  </p>
                </div>
              )}
              {patient.maritalStatus && (
                <div>
                  <p className='text-sm text-gray-600'>الحالة الاجتماعية</p>
                  <p className='text-lg font-medium text-gray-900'>
                    {patient.maritalStatus}
                  </p>
                </div>
              )}
              <div>
                <p className='text-sm text-gray-600'>تاريخ التسجيل</p>
                <p className='text-lg font-medium text-gray-900'>
                  {formatDate(patient.registrationDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          {(patient.emergencyContactName || patient.emergencyContactPhone) && (
            <div className='bg-white rounded-lg shadow-md p-6'>
              <h2 className='text-xl font-bold text-gray-900 mb-4'>
                جهة الاتصال في الطوارئ
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {patient.emergencyContactName && (
                  <div>
                    <p className='text-sm text-gray-600'>الاسم</p>
                    <p className='text-lg font-medium text-gray-900'>
                      {patient.emergencyContactName}
                    </p>
                  </div>
                )}
                {patient.emergencyContactPhone && (
                  <div>
                    <p className='text-sm text-gray-600'>الهاتف</p>
                    <p className='text-lg font-medium text-gray-900'>
                      {patient.emergencyContactPhone}
                    </p>
                  </div>
                )}
                {patient.emergencyContactRelation && (
                  <div>
                    <p className='text-sm text-gray-600'>العلاقة</p>
                    <p className='text-lg font-medium text-gray-900'>
                      {patient.emergencyContactRelation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Medical History */}
          {patient.medicalHistory && (
            <div className='bg-white rounded-lg shadow-md p-6'>
              <h2 className='text-xl font-bold text-gray-900 mb-4'>
                التاريخ الطبي
              </h2>
              <div className='space-y-4'>
                {patient.medicalHistory.allergies && (
                  <div>
                    <p className='text-sm font-medium text-gray-700'>
                      الحساسيات
                    </p>
                    <p className='text-gray-900'>
                      {patient.medicalHistory.allergies}
                    </p>
                  </div>
                )}
                {patient.medicalHistory.chronicDiseases && (
                  <div>
                    <p className='text-sm font-medium text-gray-700'>
                      الأمراض المزمنة
                    </p>
                    <p className='text-gray-900'>
                      {patient.medicalHistory.chronicDiseases}
                    </p>
                  </div>
                )}
                {patient.medicalHistory.previousSurgeries && (
                  <div>
                    <p className='text-sm font-medium text-gray-700'>
                      العمليات السابقة
                    </p>
                    <p className='text-gray-900'>
                      {patient.medicalHistory.previousSurgeries}
                    </p>
                  </div>
                )}
                {patient.medicalHistory.familyHistory && (
                  <div>
                    <p className='text-sm font-medium text-gray-700'>
                      التاريخ العائلي
                    </p>
                    <p className='text-gray-900'>
                      {patient.medicalHistory.familyHistory}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Visits */}
          {patient.visits && patient.visits.length > 0 && (
            <div className='bg-white rounded-lg shadow-md p-6'>
              <h2 className='text-xl font-bold text-gray-900 mb-4 flex items-center gap-2'>
                <Stethoscope className='w-5 h-5' />
                الزيارات ({patient.visits.length})
              </h2>
              <div className='space-y-3'>
                {patient.visits.map((visit) => (
                  <div
                    key={visit.id}
                    className='border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors'
                    onClick={() => router.push(`/visits/${visit.id}`)}
                  >
                    <div className='flex items-center justify-between'>
                      <div className='flex-1'>
                        <p className='font-medium text-gray-900'>
                          {formatDate(visit.visitDate)}
                        </p>
                        {visit.chiefComplaint && (
                          <p className='text-sm text-gray-600 mt-1'>
                            {visit.chiefComplaint}
                          </p>
                        )}
                        <p className='text-xs text-gray-500 mt-1'>
                          د. {visit.doctor.firstName} {visit.doctor.lastName}
                        </p>
                        {visit.prescriptions &&
                          visit.prescriptions.length > 0 && (
                            <p className='text-xs text-purple-600 mt-1 flex items-center gap-1'>
                              <Pill className='w-3 h-3' />
                              {visit.prescriptions.length} روشتة
                            </p>
                          )}
                      </div>
                      <ArrowRight className='w-5 h-5 text-gray-400' />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Appointments */}
          {patient.appointments && patient.appointments.length > 0 && (
            <div className='bg-white rounded-lg shadow-md p-6'>
              <h2 className='text-xl font-bold text-gray-900 mb-4 flex items-center gap-2'>
                <Calendar className='w-5 h-5' />
                المواعيد ({patient.appointments.length})
              </h2>
              <div className='space-y-3'>
                {patient.appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className='border border-gray-200 rounded-lg p-4'
                  >
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='font-medium text-gray-900'>
                          {formatDateTime(appointment.appointmentDate)}
                        </p>
                        <p className='text-sm text-gray-600 mt-1'>
                          {appointment.status}
                        </p>
                        <p className='text-xs text-gray-500 mt-1'>
                          د. {appointment.doctor.firstName}{' '}
                          {appointment.doctor.lastName}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Diagnoses */}
          {patient.diagnoses && patient.diagnoses.length > 0 && (
            <div className='bg-white rounded-lg shadow-md p-6'>
              <h2 className='text-xl font-bold text-gray-900 mb-4 flex items-center gap-2'>
                <FileText className='w-5 h-5' />
                التشخيصات ({patient.diagnoses.length})
              </h2>
              <div className='space-y-3'>
                {patient.diagnoses.map((diagnosis) => (
                  <div
                    key={diagnosis.id}
                    className='border border-gray-200 rounded-lg p-4'
                  >
                    <p className='font-medium text-gray-900'>
                      {diagnosis.diagnosis}
                    </p>
                    <p className='text-xs text-gray-500 mt-1'>
                      {formatDate(diagnosis.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className='space-y-6'>

          {/* Pregnancy Records */}
          {patient.pregnancyRecords && patient.pregnancyRecords.length > 0 && (
            <div className='bg-white rounded-lg shadow-md p-6'>
              <h2 className='text-xl font-bold text-gray-900 mb-4 flex items-center gap-2'>
                <Baby className='w-5 h-5' />
                سجلات الحمل
              </h2>
              <div className='space-y-3'>
                {patient.pregnancyRecords.map((pregnancy) => (
                  <div
                    key={pregnancy.id}
                    className='border border-gray-200 rounded-lg p-4'
                  >
                    <p className='text-sm text-gray-600'>تاريخ آخر دورة</p>
                    <p className='font-medium text-gray-900'>
                      {formatDate(pregnancy.lmpDate)}
                    </p>
                    {pregnancy.edd && (
                      <>
                        <p className='text-sm text-gray-600 mt-2'>
                          تاريخ الولادة المتوقع
                        </p>
                        <p className='font-medium text-gray-900'>
                          {formatDate(pregnancy.edd)}
                        </p>
                      </>
                    )}
                    <span
                      className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                        pregnancy.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {pregnancy.isActive ? 'نشط' : 'منتهي'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {patient.notes && (
            <div className='bg-white rounded-lg shadow-md p-6'>
              <h2 className='text-xl font-bold text-gray-900 mb-4'>ملاحظات</h2>
              <p className='text-gray-700 whitespace-pre-wrap'>
                {patient.notes}
              </p>
            </div>
          )}

          {/* Quick Actions */}
          <div className='bg-white rounded-lg shadow-md p-6'>
            <h2 className='text-xl font-bold text-gray-900 mb-4'>
              إجراءات سريعة
            </h2>
            <div className='space-y-2'>
              <button
                onClick={() =>
                  router.push(`/prescriptions/new?patientId=${patient.id}`)
                }
                className='w-full flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors'
              >
                <Pill className='w-5 h-5' />
                روشتة جديدة
              </button>
              <button
                onClick={() =>
                  router.push(`/appointments/new?patientId=${patient.id}`)
                }
                className='w-full flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
              >
                <Calendar className='w-5 h-5' />
                موعد جديد
              </button>
              <button
                onClick={() =>
                  router.push(`/visits/new?patientId=${patient.id}`)
                }
                className='w-full flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'
              >
                <Stethoscope className='w-5 h-5' />
                زيارة جديدة
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
          <div
            className='absolute inset-0 bg-black/30 backdrop-blur-sm'
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div
            className='bg-white rounded-lg shadow-xl p-6 max-w-md w-full relative'
            onClick={(e) => e.stopPropagation()}
            dir='rtl'
          >
            <h3 className='text-xl font-bold text-gray-900 mb-4'>
              تأكيد الحذف
            </h3>
            <p className='text-gray-600 mb-6'>
              هل أنت متأكد من حذف المريض {patient.firstName} {patient.lastName}؟
              لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className='flex gap-4'>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className='flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors'
              >
                إلغاء
              </button>
              <button
                onClick={handleDelete}
                className='flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
