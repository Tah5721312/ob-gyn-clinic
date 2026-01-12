"use client";
import { apiFetch } from "@/lib/api";

import { useState, useEffect } from "react";
import { X, User, Mail, Phone, Shield, Lock } from "lucide-react";
import { UserListItem } from "@/lib/users/types";
import { UserRole, UserRoleLabels } from "@/lib/enumdb";

interface NewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  userToEdit?: UserListItem | null;
}

export function NewUserModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  userToEdit 
}: NewUserModalProps) {
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState<{ id: number; name: string }[]>([]);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: UserRole.RECEPTIONIST,
    doctorId: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    isActive: true,
  });

  // جلب الأطباء
  useEffect(() => {
    if (isOpen) {
      apiFetch("/api/doctors")
        .then(res => res.json())
        .then(result => {
          if (result.success && result.data) {
            setDoctors(result.data.map((d: any) => ({
              id: d.id,
              name: `${d.firstName} ${d.lastName}`
            })));
          }
        });
    }
  }, [isOpen]);

  // تعبئة البيانات عند التعديل
  useEffect(() => {
    if (userToEdit && isOpen) {
      setFormData({
        username: userToEdit.username,
        password: "", // لا نعرض كلمة المرور
        role: userToEdit.role as UserRole,
        doctorId: userToEdit.doctorId?.toString() || "",
        firstName: userToEdit.firstName,
        lastName: userToEdit.lastName,
        email: userToEdit.email || "",
        phone: userToEdit.phone,
        isActive: userToEdit.isActive,
      });
    } else if (!userToEdit && isOpen) {
      // إعادة تعيين النموذج
      setFormData({
        username: "",
        password: "",
        role: UserRole.RECEPTIONIST,
        doctorId: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        isActive: true,
      });
    }
  }, [userToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = userToEdit 
        ? `/api/users/${userToEdit.id}`
        : '/api/users';
      
      const method = userToEdit ? 'PUT' : 'POST';

      const body: any = {
        username: formData.username,
        role: formData.role,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email || null,
        isActive: formData.isActive,
      };

      // إضافة كلمة المرور فقط عند الإنشاء أو إذا تم تغييرها
      if (!userToEdit || formData.password) {
        if (!formData.password) {
          alert("يرجى إدخال كلمة المرور");
          setLoading(false);
          return;
        }
        body.password = formData.password;
      }

      // إضافة doctorId فقط إذا كان الدور DOCTOR
      if (formData.role === UserRole.DOCTOR && formData.doctorId) {
        body.doctorId = parseInt(formData.doctorId);
      } else {
        body.doctorId = null;
      }

      const response = await apiFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (result.success) {
        onSuccess?.();
        onClose();
      } else {
        alert(result.error || "حدث خطأ أثناء الحفظ");
      }
    } catch (error) {
      console.error("Error saving user:", error);
      alert("حدث خطأ أثناء الحفظ");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" dir="rtl">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {userToEdit ? "تعديل مستخدم" : "إضافة مستخدم جديد"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* البيانات الأساسية */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline ml-1" />
                الاسم الأول *
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline ml-1" />
                الاسم الأخير *
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* اسم المستخدم وكلمة المرور */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline ml-1" />
                اسم المستخدم *
              </label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4 inline ml-1" />
                كلمة المرور {userToEdit ? "(اتركها فارغة إذا لم تريد تغييرها)" : "*"}
              </label>
              <input
                type="password"
                required={!userToEdit}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* الدور والطبيب */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Shield className="w-4 h-4 inline ml-1" />
                الدور *
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole, doctorId: e.target.value === UserRole.DOCTOR ? formData.doctorId : "" })}
                className="w-full px-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {Object.values(UserRole).map((role) => (
                  <option key={role} value={role}>
                    {UserRoleLabels[role]}
                  </option>
                ))}
              </select>
            </div>

            {formData.role === UserRole.DOCTOR && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline ml-1" />
                  الطبيب
                </label>
                <select
                  value={formData.doctorId}
                  onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                  className="w-full px-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">اختر الطبيب</option>
                  {doctors.map(doctor => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* البريد الإلكتروني والهاتف */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline ml-1" />
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline ml-1" />
                رقم الهاتف *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* حالة النشاط */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              نشط
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-end pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "جاري الحفظ..." : userToEdit ? "تحديث" : "حفظ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

