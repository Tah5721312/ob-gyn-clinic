"use client";
import { apiFetch } from "@/lib/api";

import { useState, useEffect } from "react";
import { Plus, Search, Star, StarOff, Edit, Trash2, FileText } from "lucide-react";
import { TemplateListItem } from "@/lib/templates/types";
import { TemplateModal } from "./TemplateModal";

interface TemplateListProps {
  initialTemplates?: TemplateListItem[];
  doctorId: number;
}

export function TemplateList({ initialTemplates = [], doctorId }: TemplateListProps) {
  const [templates, setTemplates] = useState<TemplateListItem[]>(initialTemplates);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<TemplateListItem | null>(null);

  const refreshTemplates = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("doctorId", doctorId.toString());
      if (search) params.append("search", search);
      if (filterType) params.append("templateType", filterType);

      const response = await apiFetch(`/api/templates?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setTemplates(result.data);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      refreshTemplates();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [search, filterType, doctorId]);

  const handleToggleFavorite = async (templateId: number) => {
    try {
      const response = await apiFetch(`/api/templates/favorites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId }),
      });
      const result = await response.json();

      if (result.success) {
        refreshTemplates();
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleDelete = async (templateId: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا القالب؟")) return;

    try {
      const response = await apiFetch(`/api/templates/${templateId}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (result.success) {
        refreshTemplates();
      } else {
        alert(result.error || "حدث خطأ أثناء حذف القالب");
      }
    } catch (error) {
      console.error("Error deleting template:", error);
      alert("حدث خطأ أثناء حذف القالب");
    }
  };

  const handleEdit = (template: TemplateListItem) => {
    setEditingTemplate(template);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTemplate(null);
  };

  const handleSuccess = () => {
    refreshTemplates();
    handleCloseModal();
  };

  const filteredTemplates = templates.filter((template) => {
    if (filterType && template.templateType !== filterType) return false;
    return true;
  });

  const uniqueTypes = Array.from(new Set(templates.map((t) => t.templateType)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">القوالب</h1>
          <p className="text-gray-600 mt-2">
            {loading ? "جاري التحميل..." : `${filteredTemplates.length} قالب`}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          قالب جديد
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="ابحث عن قالب..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">كل الأنواع</option>
              {uniqueTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {template.templateName}
                </h3>
                <p className="text-sm text-gray-600">{template.templateType}</p>
                {template.category && (
                  <p className="text-xs text-gray-500 mt-1">{template.category}</p>
                )}
              </div>
              <button
                onClick={() => handleToggleFavorite(template.id)}
                className="text-yellow-500 hover:text-yellow-600 transition-colors"
              >
                {template.isFavorite ? (
                  <Star className="w-5 h-5 fill-current" />
                ) : (
                  <StarOff className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
              <span>استخدام: {template.usageCount}</span>
              <span
                className={`px-2 py-1 rounded ${
                  template.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {template.isActive ? "نشط" : "غير نشط"}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(template)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Edit className="w-4 h-4" />
                تعديل
              </button>
              <button
                onClick={() => handleDelete(template.id)}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && !loading && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">لا توجد قوالب</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            إنشاء قالب جديد
          </button>
        </div>
      )}

      {/* Template Modal */}
      <TemplateModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        doctorId={doctorId}
        template={editingTemplate}
      />
    </div>
  );
}

