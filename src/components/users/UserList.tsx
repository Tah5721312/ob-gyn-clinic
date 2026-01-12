"use client";
import { apiFetch } from "@/lib/api";

import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, CheckCircle, XCircle, User, Mail, Phone, Shield, Users } from "lucide-react";
import { UserListItem } from "@/lib/users/types";
import { NewUserModal } from "./NewUserModal";
import { UserRole, UserRoleLabels } from "@/lib/enumdb";

interface UserListProps {
  initialUsers?: UserListItem[];
}

export function UserList({ initialUsers = [] }: UserListProps) {
  const [users, setUsers] = useState<UserListItem[]>(initialUsers);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserListItem | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  // جلب المستخدمين
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (roleFilter) params.append("role", roleFilter);
      if (statusFilter !== "") params.append("isActive", statusFilter);

      const response = await apiFetch(`/api/users?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setUsers(result.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [search, roleFilter, statusFilter]);

  const handleEdit = (user: UserListItem) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (userId: number) => {
    try {
      const response = await apiFetch(`/api/users/${userId}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (result.success) {
        setUsers(users.filter(u => u.id !== userId));
        setShowDeleteConfirm(null);
      } else {
        alert(result.error || "حدث خطأ أثناء الحذف");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("حدث خطأ أثناء الحذف");
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    fetchUsers();
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "—";
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">المستخدمون</h1>
          <p className="text-gray-600 mt-1 text-sm">
            {loading ? "جاري التحميل..." : `إجمالي ${users.length} مستخدم`}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
        >
          <Plus size={18} />
          إضافة مستخدم جديد
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="ابحث بالاسم، اسم المستخدم، البريد الإلكتروني، أو رقم الهاتف..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-right"
          >
            <option value="">جميع الأدوار</option>
            {Object.values(UserRole).map((role) => (
              <option key={role} value={role}>
                {UserRoleLabels[role]}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-right"
          >
            <option value="">جميع الحالات</option>
            <option value="true">نشط</option>
            <option value="false">غير نشط</option>
          </select>
        </div>
      </div>

      {/* Users List */}
      {loading ? (
        <div className="p-8 text-center text-gray-500">جاري التحميل...</div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">لا توجد مستخدمين</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">الاسم</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">اسم المستخدم</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">الدور</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">البريد الإلكتروني</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">الهاتف</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">آخر تسجيل دخول</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">الحالة</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-gray-400" />
                        <span className="font-semibold text-gray-900">{user.fullName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{user.username}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                        <Shield className="w-4 h-4" />
                        {UserRoleLabels[user.role as UserRole] || user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.email ? (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">{user.email}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{user.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(user.lastLogin)}
                    </td>
                    <td className="px-6 py-4">
                      {user.isActive ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          <CheckCircle className="w-4 h-4" />
                          نشط
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                          <XCircle className="w-4 h-4" />
                          غير نشط
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 justify-start">
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="تعديل"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(user.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="حذف"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with blur */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(null)}
          />

          {/* Dialog */}
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative z-10">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 rounded-t-2xl">
              <h3 className="text-xl font-bold">تأكيد الحذف</h3>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-gray-700 text-center font-medium">
                هل أنت متأكد من حذف هذا المستخدم؟
              </p>
              <p className="text-gray-500 text-sm text-center mt-2">
                هذا الإجراء لا يمكن التراجع عنه
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
              >
                إلغاء
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New/Edit User Modal */}
      <NewUserModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        userToEdit={editingUser}
      />
    </div>
  );
}

