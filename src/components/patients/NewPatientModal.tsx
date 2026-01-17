'use client';
import { apiFetch } from '@/lib/api';

import { useState, useEffect } from 'react';
import { X, User } from 'lucide-react';
import {
  BloodType,
  MaritalStatus,
  emergencyContactRelation,
  emergencyContactRelationLabels,
} from '@/lib/enumdb';

interface NewPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  patientToEdit?: {
    id: number;
    firstName: string;
    lastName: string;
    birthDate: string | Date;
    bloodType?: string | null;
    phone: string;
    phone2?: string | null;
    address?: string | null;
    maritalStatus?: string | null;
    emergencyContactName?: string | null;
    emergencyContactPhone?: string | null;
    emergencyContactRelation?: string | null;
    notes?: string | null;
  } | null;
}

export function NewPatientModal({
  isOpen,
  onClose,
  onSuccess,
  patientToEdit,
}: NewPatientModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    bloodType: '',
    phone: '',
    phone2: '',
    address: '',
    maritalStatus: '',
    isPregnant: false,
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    notes: '',
  });

  // تعبئة النموذج عند التعديل
  useEffect(() => {
    if (isOpen && patientToEdit) {
      const birthDate = patientToEdit.birthDate 
        ? (typeof patientToEdit.birthDate === 'string' 
            ? patientToEdit.birthDate.split('T')[0] 
            : new Date(patientToEdit.birthDate).toISOString().split('T')[0])
        : '';

      setFormData({
        firstName: patientToEdit.firstName || '',
        lastName: patientToEdit.lastName || '',
        birthDate: birthDate,
        bloodType: patientToEdit.bloodType || '',
        phone: patientToEdit.phone || '',
        phone2: patientToEdit.phone2 || '',
        address: patientToEdit.address || '',
        maritalStatus: patientToEdit.maritalStatus || '',
        isPregnant: false, // لا نستخدمه بعد الآن
        emergencyContactName: patientToEdit.emergencyContactName || '',
        emergencyContactPhone: patientToEdit.emergencyContactPhone || '',
        emergencyContactRelation: patientToEdit.emergencyContactRelation || '',
        notes: patientToEdit.notes || '',
      });
    } else if (!isOpen) {
      // إعادة تعيين النموذج عند الإغلاق
      setFormData({
        firstName: '',
        lastName: '',
        birthDate: '',
        bloodType: '',
        phone: '',
        phone2: '',
        address: '',
        maritalStatus: '',
        isPregnant: false,
        emergencyContactName: '',
        emergencyContactPhone: '',
        emergencyContactRelation: '',
        notes: '',
      });
    }
  }, [isOpen, patientToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.phone) {
      alert('يرجى ملء الحقول المطلوبة');
      return;
    }

    setLoading(true);
    try {
      const isEditMode = !!patientToEdit;
      const url = isEditMode 
        ? `/api/patients/${patientToEdit.id}`
        : '/api/patients';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          birthDate: formData.birthDate || new Date().toISOString(),
          bloodType: formData.bloodType || null,
          phone: formData.phone,
          phone2: formData.phone2 || null,
          address: formData.address || null,
          maritalStatus: formData.maritalStatus || null,
          isPregnant: formData.isPregnant,
          emergencyContactName: formData.emergencyContactName || null,
          emergencyContactPhone: formData.emergencyContactPhone || null,
          emergencyContactRelation: formData.emergencyContactRelation || null,
          notes: formData.notes || null,
          ...(isEditMode ? {} : { isActive: true }),
        }),
      });

      const result = await response.json();
      if (result.success) {
        onClose();
        if (onSuccess) {
          onSuccess();
        }
      } else {
        alert(result.error || (isEditMode ? 'حدث خطأ أثناء تعديل المريضة' : 'حدث خطأ أثناء إضافة المريضة'));
      }
    } catch (error: any) {
      console.error('Error saving patient:', error);
      alert(patientToEdit ? 'حدث خطأ أثناء تعديل المريضة' : 'حدث خطأ أثناء إضافة المريضة');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* Backdrop with blur */}
      <div
        className='absolute inset-0 bg-black/30 backdrop-blur-sm'
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className='bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-10'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='sticky top-0 bg-blue-600 border-b border-gray-200 px-6 py-4 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-white/20 rounded-lg'>
              <User size={24} className='text-white' />
            </div>
            <h2 className='text-2xl font-bold text-white'>
              {patientToEdit ? 'تعديل بيانات المريضة' : 'إضافة مريضة جديدة'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className='text-gray-100 hover:text-red-400 transition-colors'
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className='p-6 space-y-6'>
          {/* البيانات الأساسية */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                الاسم الأول *
              </label>
              <input
                type='text'
                required
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                الاسم الأخير *
              </label>
              <input
                type='text'
                required
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                تاريخ الميلاد *
              </label>
              <input
                type='date'
                required
                value={formData.birthDate}
                onChange={(e) =>
                  setFormData({ ...formData, birthDate: e.target.value })
                }
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                فصيلة الدم
              </label>
              <select
                value={formData.bloodType}
                onChange={(e) =>
                  setFormData({ ...formData, bloodType: e.target.value })
                }
                className='w-full px-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
              >
                <option value=''>اختر فصيلة الدم</option>
                {Object.values(BloodType).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                الحالة الاجتماعية
              </label>
              <select
                value={formData.maritalStatus}
                onChange={(e) =>
                  setFormData({ ...formData, maritalStatus: e.target.value })
                }
                className='w-full px-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
              >
                <option value=''>اختر الحالة</option>
                {Object.values(MaritalStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div> */}

            {/* <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                هل المريضة حامل؟
              </label>
              <select
                value={formData.isPregnant ? 'true' : 'false'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    isPregnant: e.target.value === 'true',
                  })
                }
                className='w-full px-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
              >
                <option value='false'>لا</option>
                <option value='true'>نعم</option>
              </select>
            </div>
             */}
          </div>

          {/* معلومات الاتصال */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                رقم الهاتف *
              </label>
              <input
                type='tel'
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                رقم هاتف إضافي
              </label>
              <input
                type='tel'
                value={formData.phone2}
                onChange={(e) =>
                  setFormData({ ...formData, phone2: e.target.value })
                }
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
              />
            </div>

            <div className='md:col-span-2'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                العنوان
              </label>
              <input
                type='text'
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
              />
            </div>
          </div>

          {/* جهة الاتصال في الطوارئ */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                اسم جهة الاتصال في الطوارئ
              </label>
              <input
                type='text'
                value={formData.emergencyContactName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    emergencyContactName: e.target.value,
                  })
                }
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                رقم الهاتف
              </label>
              <input
                type='tel'
                value={formData.emergencyContactPhone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    emergencyContactPhone: e.target.value,
                  })
                }
                className='w-full px-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                صلة القرابة
              </label>
              <select
                value={formData.emergencyContactRelation}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    emergencyContactRelation: e.target.value,
                  })
                }
                className='w-full px-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
              >
                <option value=''>اختر صلة القرابة</option>
                {Object.values(emergencyContactRelation).map((relation) => (
                  <option key={relation} value={relation}>
                    {emergencyContactRelationLabels[relation]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* الملاحظات */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              ملاحظات (اختياري)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
              placeholder='أي ملاحظات إضافية...'
            />
          </div>

          {/* الأزرار */}
          <div className='flex gap-4 pt-4 border-t border-gray-200'>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors'
            >
              إلغاء
            </button>
            <button
              type='submit'
              disabled={loading}
              className='flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              {loading ? 'جاري الحفظ...' : (patientToEdit ? 'حفظ التعديلات' : 'إضافة مريضة')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
