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
      <div className='flex items-center justify-center py-20'>
        <div className='text-center'>
          <div className='inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4'></div>
          <p className='text-gray-600 text-lg'>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className='flex items-center justify-center py-20'>
        <div className='text-center bg-white rounded-xl shadow-lg p-8'>
          <div className='bg-red-100 p-4 rounded-full inline-block mb-4'>
            <User className='w-12 h-12 text-red-600' />
          </div>
          <p className='text-gray-900 text-xl font-bold mb-2'>المريض غير موجود</p>
          <p className='text-gray-600'>لم يتم العثور على بيانات المريض المطلوب</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <div className='bg-white/20 backdrop-blur-sm rounded-full p-4'>
              <User className='w-8 h-8' />
            </div>
            <div>
              <h1 className='text-3xl font-bold'>
                {patient.firstName} {patient.lastName}
              </h1>
              <p className='text-blue-100 mt-1 flex items-center gap-2'>
                <Calendar className='w-4 h-4' />
                {calculateAge(patient.birthDate)} سنة
                {patient.bloodType && (
                  <>
                    <span className='mx-2'>•</span>
                    <Shield className='w-4 h-4' />
                    فصيلة الدم: {patient.bloodType}
                  </>
                )}
              </p>
            </div>
          </div>
          <div className='flex gap-2'>
            <button
              onClick={() => router.push(`/patients/${patient.id}/edit`)}
              className='flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors'
            >
              <Edit className='w-5 h-5' />
              تعديل
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className='flex items-center gap-2 px-4 py-2 bg-red-500/80 backdrop-blur-sm text-white rounded-lg hover:bg-red-600 transition-colors'
            >
              <Trash2 className='w-5 h-5' />
              حذف
            </button>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Left Column - Main Info */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Personal Information */}
          <div className='bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow'>
            <h2 className='text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 pb-3 border-b border-gray-200'>
              <div className='bg-blue-100 p-2 rounded-lg'>
                <User className='w-5 h-5 text-blue-600' />
              </div>
              المعلومات الشخصية
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='bg-gray-50 rounded-lg p-4'>
                <p className='text-sm text-gray-600 mb-1'>الاسم الكامل</p>
                <p className='text-lg font-semibold text-gray-900'>
                  {patient.firstName} {patient.lastName}
                </p>
              </div>
              <div className='bg-gray-50 rounded-lg p-4'>
                <p className='text-sm text-gray-600 mb-1'>تاريخ الميلاد</p>
                <p className='text-lg font-semibold text-gray-900'>
                  {formatDate(patient.birthDate)}
                </p>
                <p className='text-sm text-blue-600 mt-1'>
                  {calculateAge(patient.birthDate)} سنة
                </p>
              </div>
              <div className='bg-gray-50 rounded-lg p-4'>
                <p className='text-sm text-gray-600 mb-1'>فصيلة الدم</p>
                <p className='text-lg font-semibold text-gray-900'>
                  {patient.bloodType || 'غير محدد'}
                </p>
              </div>
              <div className='bg-gray-50 rounded-lg p-4'>
                <p className='text-sm text-gray-600 mb-1 flex items-center gap-1'>
                  <Phone className='w-4 h-4' />
                  الهاتف
                </p>
                <p className='text-lg font-semibold text-gray-900 direction-ltr text-right'>
                  {patient.phone}
                </p>
              </div>
              {patient.phone2 && (
                <div className='bg-gray-50 rounded-lg p-4'>
                  <p className='text-sm text-gray-600 mb-1 flex items-center gap-1'>
                    <Phone className='w-4 h-4' />
                    الهاتف الثاني
                  </p>
                  <p className='text-lg font-semibold text-gray-900 direction-ltr text-right'>
                    {patient.phone2}
                  </p>
                </div>
              )}
              {patient.address && (
                <div className='md:col-span-2 bg-gray-50 rounded-lg p-4'>
                  <p className='text-sm text-gray-600 mb-1 flex items-center gap-1'>
                    <MapPin className='w-4 h-4' />
                    العنوان
                  </p>
                  <p className='text-lg font-semibold text-gray-900'>
                    {patient.address}
                  </p>
                </div>
              )}
              <div className='bg-gray-50 rounded-lg p-4'>
                <p className='text-sm text-gray-600 mb-1'>تاريخ التسجيل</p>
                <p className='text-lg font-semibold text-gray-900'>
                  {formatDate(patient.registrationDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          {(patient.emergencyContactName || patient.emergencyContactPhone) && (
            <div className='bg-white rounded-xl shadow-md p-6 border border-red-100 hover:shadow-lg transition-shadow'>
              <h2 className='text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 pb-3 border-b border-red-200'>
                <div className='bg-red-100 p-2 rounded-lg'>
                  <Shield className='w-5 h-5 text-red-600' />
                </div>
                جهة الاتصال في الطوارئ
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {patient.emergencyContactName && (
                  <div className='bg-red-50 rounded-lg p-4'>
                    <p className='text-sm text-gray-600 mb-1'>الاسم</p>
                    <p className='text-lg font-semibold text-gray-900'>
                      {patient.emergencyContactName}
                    </p>
                  </div>
                )}
                {patient.emergencyContactPhone && (
                  <div className='bg-red-50 rounded-lg p-4'>
                    <p className='text-sm text-gray-600 mb-1'>الهاتف</p>
                    <p className='text-lg font-semibold text-gray-900 direction-ltr text-right'>
                      {patient.emergencyContactPhone}
                    </p>
                  </div>
                )}
                {patient.emergencyContactRelation && (
                  <div className='bg-red-50 rounded-lg p-4'>
                    <p className='text-sm text-gray-600 mb-1'>العلاقة</p>
                    <p className='text-lg font-semibold text-gray-900'>
                      {patient.emergencyContactRelation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Medical History */}
          {patient.medicalHistory && (
            <div className='bg-white rounded-xl shadow-md p-6 border border-green-100 hover:shadow-lg transition-shadow'>
              <h2 className='text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 pb-3 border-b border-green-200'>
                <div className='bg-green-100 p-2 rounded-lg'>
                  <FileText className='w-5 h-5 text-green-600' />
                </div>
                التاريخ الطبي
              </h2>
              <div className='space-y-4'>
                {patient.medicalHistory.allergies && (
                  <div className='bg-green-50 rounded-lg p-4 border-r-4 border-green-500'>
                    <p className='text-sm font-semibold text-green-700 mb-2'>
                      الحساسيات
                    </p>
                    <p className='text-gray-900'>
                      {patient.medicalHistory.allergies}
                    </p>
                  </div>
                )}
                {patient.medicalHistory.chronicDiseases && (
                  <div className='bg-green-50 rounded-lg p-4 border-r-4 border-green-500'>
                    <p className='text-sm font-semibold text-green-700 mb-2'>
                      الأمراض المزمنة
                    </p>
                    <p className='text-gray-900'>
                      {patient.medicalHistory.chronicDiseases}
                    </p>
                  </div>
                )}
                {patient.medicalHistory.previousSurgeries && (
                  <div className='bg-green-50 rounded-lg p-4 border-r-4 border-green-500'>
                    <p className='text-sm font-semibold text-green-700 mb-2'>
                      العمليات السابقة
                    </p>
                    <p className='text-gray-900'>
                      {patient.medicalHistory.previousSurgeries}
                    </p>
                  </div>
                )}
                {patient.medicalHistory.familyHistory && (
                  <div className='bg-green-50 rounded-lg p-4 border-r-4 border-green-500'>
                    <p className='text-sm font-semibold text-green-700 mb-2'>
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
            <div className='bg-white rounded-xl shadow-md p-6 border border-purple-100 hover:shadow-lg transition-shadow'>
              <h2 className='text-xl font-bold text-gray-900 mb-6 flex items-center justify-between pb-3 border-b border-purple-200'>
                <div className='flex items-center gap-2'>
                  <div className='bg-purple-100 p-2 rounded-lg'>
                    <Stethoscope className='w-5 h-5 text-purple-600' />
                  </div>
                  الزيارات
                </div>
                <span className='bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold'>
                  {patient.visits.length}
                </span>
              </h2>
              <div className='space-y-3'>
                {patient.visits.map((visit) => (
                  <div
                    key={visit.id}
                    className='border-2 border-gray-200 rounded-xl p-4 hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-all duration-200 hover:shadow-md'
                    onClick={() => router.push(`/visits/${visit.id}`)}
                  >
                    <div className='flex items-center justify-between'>
                      <div className='flex-1'>
                        <div className='flex items-center gap-2 mb-2'>
                          <Calendar className='w-4 h-4 text-purple-600' />
                          <p className='font-semibold text-gray-900'>
                            {formatDate(visit.visitDate)}
                          </p>
                        </div>
                        {visit.chiefComplaint && (
                          <p className='text-sm text-gray-700 mt-2 bg-gray-50 p-2 rounded-lg'>
                            {visit.chiefComplaint}
                          </p>
                        )}
                        <div className='flex items-center gap-4 mt-3'>
                          <p className='text-xs text-gray-600 flex items-center gap-1'>
                            <User className='w-3 h-3' />
                            د. {visit.doctor.firstName} {visit.doctor.lastName}
                          </p>
                          {visit.prescriptions &&
                            visit.prescriptions.length > 0 && (
                              <p className='text-xs text-purple-600 flex items-center gap-1 bg-purple-100 px-2 py-1 rounded-full'>
                                <Pill className='w-3 h-3' />
                                {visit.prescriptions.length} روشتة
                              </p>
                            )}
                        </div>
                      </div>
                      <ArrowRight className='w-5 h-5 text-purple-400' />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Appointments */}
          {patient.appointments && patient.appointments.length > 0 && (
            <div className='bg-white rounded-xl shadow-md p-6 border border-blue-100 hover:shadow-lg transition-shadow'>
              <h2 className='text-xl font-bold text-gray-900 mb-6 flex items-center justify-between pb-3 border-b border-blue-200'>
                <div className='flex items-center gap-2'>
                  <div className='bg-blue-100 p-2 rounded-lg'>
                    <Calendar className='w-5 h-5 text-blue-600' />
                  </div>
                  المواعيد
                </div>
                <span className='bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold'>
                  {patient.appointments.length}
                </span>
              </h2>
              <div className='space-y-3'>
                {patient.appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className='border-2 border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200'
                  >
                    <div className='flex items-center justify-between'>
                      <div className='flex-1'>
                        <div className='flex items-center gap-2 mb-2'>
                          <Calendar className='w-4 h-4 text-blue-600' />
                          <p className='font-semibold text-gray-900'>
                            {formatDateTime(appointment.appointmentDate)}
                          </p>
                        </div>
                        <div className='flex items-center gap-3 mt-2'>
                          <span className='text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium'>
                            {appointment.status}
                          </span>
                          <p className='text-xs text-gray-600 flex items-center gap-1'>
                            <User className='w-3 h-3' />
                            د. {appointment.doctor.firstName}{' '}
                            {appointment.doctor.lastName}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Diagnoses */}
          {patient.diagnoses && patient.diagnoses.length > 0 && (
            <div className='bg-white rounded-xl shadow-md p-6 border border-orange-100 hover:shadow-lg transition-shadow'>
              <h2 className='text-xl font-bold text-gray-900 mb-6 flex items-center justify-between pb-3 border-b border-orange-200'>
                <div className='flex items-center gap-2'>
                  <div className='bg-orange-100 p-2 rounded-lg'>
                    <FileText className='w-5 h-5 text-orange-600' />
                  </div>
                  التشخيصات
                </div>
                <span className='bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold'>
                  {patient.diagnoses.length}
                </span>
              </h2>
              <div className='space-y-3'>
                {patient.diagnoses.map((diagnosis) => (
                  <div
                    key={diagnosis.id}
                    className='border-2 border-gray-200 rounded-xl p-4 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200'
                  >
                    <p className='font-semibold text-gray-900 mb-2'>
                      {diagnosis.diagnosis}
                    </p>
                    <p className='text-xs text-gray-500 flex items-center gap-1'>
                      <Calendar className='w-3 h-3' />
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
            <div className='bg-white rounded-xl shadow-md p-6 border border-pink-100 hover:shadow-lg transition-shadow'>
              <h2 className='text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 pb-3 border-b border-pink-200'>
                <div className='bg-pink-100 p-2 rounded-lg'>
                  <Baby className='w-5 h-5 text-pink-600' />
                </div>
                سجلات الحمل
              </h2>
              <div className='space-y-3'>
                {patient.pregnancyRecords.map((pregnancy) => (
                  <div
                    key={pregnancy.id}
                    className='border-2 border-gray-200 rounded-xl p-4 hover:border-pink-300 hover:bg-pink-50 transition-all duration-200'
                  >
                    <div className='bg-pink-50 rounded-lg p-3 mb-3'>
                      <p className='text-sm text-pink-700 font-medium mb-1'>
                        تاريخ آخر دورة
                      </p>
                      <p className='font-semibold text-gray-900'>
                        {formatDate(pregnancy.lmpDate)}
                      </p>
                    </div>
                    {pregnancy.edd && (
                      <div className='bg-pink-50 rounded-lg p-3 mb-3'>
                        <p className='text-sm text-pink-700 font-medium mb-1'>
                          تاريخ الولادة المتوقع
                        </p>
                        <p className='font-semibold text-gray-900'>
                          {formatDate(pregnancy.edd)}
                        </p>
                      </div>
                    )}
                    <span
                      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${pregnancy.isActive
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
            <div className='bg-white rounded-xl shadow-md p-6 border border-yellow-100 hover:shadow-lg transition-shadow'>
              <h2 className='text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 pb-3 border-b border-yellow-200'>
                <div className='bg-yellow-100 p-2 rounded-lg'>
                  <FileText className='w-5 h-5 text-yellow-600' />
                </div>
                ملاحظات
              </h2>
              <div className='bg-yellow-50 rounded-lg p-4'>
                <p className='text-gray-700 whitespace-pre-wrap leading-relaxed'>
                  {patient.notes}
                </p>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className='bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 text-white sticky top-20'>
            <h2 className='text-xl font-bold mb-6 flex items-center gap-2'>
              <div className='bg-white/20 backdrop-blur-sm p-2 rounded-lg'>
                <Plus className='w-5 h-5' />
              </div>
              إجراءات سريعة
            </h2>
            <div className='space-y-3'>
              <button
                onClick={() =>
                  router.push(`/prescriptions/new?patientId=${patient.id}`)
                }
                className='w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-200 font-medium hover:scale-105 transform'
              >
                <Pill className='w-5 h-5' />
                روشتة جديدة
              </button>
              <button
                onClick={() =>
                  router.push(`/appointments/new?patientId=${patient.id}`)
                }
                className='w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-200 font-medium hover:scale-105 transform'
              >
                <Calendar className='w-5 h-5' />
                موعد جديد
              </button>
              <button
                onClick={() =>
                  router.push(`/visits/new?patientId=${patient.id}`)
                }
                className='w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-200 font-medium hover:scale-105 transform'
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
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
          <div
            className='absolute inset-0 bg-black/50 backdrop-blur-sm'
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div
            className='bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative transform transition-all'
            onClick={(e) => e.stopPropagation()}
            dir='rtl'
          >
            <div className='flex items-center justify-center mb-6'>
              <div className='bg-red-100 p-4 rounded-full'>
                <Trash2 className='w-8 h-8 text-red-600' />
              </div>
            </div>
            <h3 className='text-2xl font-bold text-gray-900 mb-3 text-center'>
              تأكيد الحذف
            </h3>
            <p className='text-gray-600 mb-8 text-center leading-relaxed'>
              هل أنت متأكد من حذف المريض{' '}
              <span className='font-bold text-gray-900'>
                {patient.firstName} {patient.lastName}
              </span>
              ؟<br />
              <span className='text-red-600 text-sm'>
                لا يمكن التراجع عن هذا الإجراء.
              </span>
            </p>
            <div className='flex gap-3'>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className='flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium hover:scale-105 transform'
              >
                إلغاء
              </button>
              <button
                onClick={handleDelete}
                className='flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 font-medium hover:scale-105 transform shadow-lg'
              >
                حذف نهائياً
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
