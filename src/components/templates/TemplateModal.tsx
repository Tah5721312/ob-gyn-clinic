"use client";

import { useState, useEffect } from "react";
import { X, AlertCircle } from "lucide-react";
import { TemplateListItem } from "@/lib/templates/types";

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  doctorId: number;
  template?: TemplateListItem | null;
}

export function TemplateModal({
  isOpen,
  onClose,
  onSuccess,
  doctorId,
  template,
}: TemplateModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    templateName: "",
    templateType: "زيارة",
    category: "",
    content: "",
    isActive: true,
    isFavorite: false,
  });

  // تحميل بيانات القالب عند التعديل
  useEffect(() => {
    if (template) {
      setFormData({
        templateName: template.templateName,
        templateType: template.templateType,
        category: template.category || "",
        content:
          typeof template.content === "string"
            ? template.content
            : JSON.stringify(template.content, null, 2),
        isActive: template.isActive,
        isFavorite: template.isFavorite,
      });
    } else {
      // إعادة تعيين النموذج
      setFormData({
        templateName: "",
        templateType: "زيارة",
        category: "",
        content: "",
        isActive: true,
        isFavorite: false,
      });
    }
    setError("");
  }, [template, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("Submitting template:", { template, formData });
      
      // التحقق من أن المحتوى غير فارغ
      if (!formData.content || formData.content.trim() === "") {
        setError("يرجى إدخال محتوى القالب");
        setLoading(false);
        return;
      }
      
      // محاولة تحويل المحتوى إلى JSON
      let parsedContent;
      const cleanedContent = formData.content.trim();
      
      // إذا كان المحتوى يبدأ بـ { فهو JSON، وإلا نحوله إلى JSON
      if (cleanedContent.startsWith("{") && cleanedContent.endsWith("}")) {
        // محاولة تحليل JSON
        try {
          parsedContent = JSON.parse(cleanedContent);
          console.log("Parsed content:", parsedContent);
        } catch (e: any) {
          console.error("JSON parse error:", e);
          const errorMessage = e.message || "خطأ في تحليل JSON";
          let exampleText = "";
          if (formData.templateType === "روشتة") {
            exampleText = 'مثال: {"medications": [{"medicationName": "فيتامين د", "dosage": "1000", "frequency": "يومياً", "duration": "شهر"}], "generalInstructions": "تناول مع الطعام"}';
          } else {
            exampleText = 'مثال: {"notes": "ملاحظات", "chiefComplaint": "شكوى"}';
          }
          setError(`محتوى القالب يجب أن يكون JSON صحيح (ابدأ بـ { وانتهي بـ }).\nالخطأ: ${errorMessage}\n\n${exampleText}`);
          setLoading(false);
          return;
        }
      } else {
        // إذا كان نص عادي، نحوله إلى JSON تلقائياً
        if (formData.templateType === "روشتة") {
          // للروشتات، نحول النص إلى generalInstructions
          parsedContent = {
            generalInstructions: cleanedContent,
            medications: []
          };
        } else {
          // للزيارات، نحول النص إلى notes
          parsedContent = {
            notes: cleanedContent
          };
        }
        console.log("Converted plain text to JSON:", parsedContent);
      }

      const url = template
        ? `/api/templates/${template.id}`
        : "/api/templates";
      const method = template ? "PUT" : "POST";

      const requestBody = {
        doctorId,
        templateName: formData.templateName,
        templateType: formData.templateType,
        category: formData.category || null,
        content: JSON.stringify(parsedContent),
        isActive: formData.isActive,
        isFavorite: formData.isFavorite,
      };

      console.log("Request:", { url, method, body: requestBody });

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      console.log("Response status:", response.status);
      const result = await response.json();
      console.log("Response result:", result);

      if (result.success) {
        console.log("Template saved successfully");
        setLoading(false);
        onClose();
        if (onSuccess) {
          onSuccess();
        }
      } else {
        console.error("API error:", result.error);
        setError(result.error || "حدث خطأ أثناء حفظ القالب");
        setLoading(false);
      }
    } catch (err: any) {
      console.error("Error saving template:", err);
      setError(err.message || "حدث خطأ غير متوقع");
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-900">
            {template ? "تعديل قالب" : "قالب جديد"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-r-4 border-red-500 p-4 text-red-800 flex items-center gap-3 mx-6 mt-4 rounded-md">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* الاسم */}
          <div>
            <label
              htmlFor="templateName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              اسم القالب *
            </label>
            <input
              type="text"
              id="templateName"
              name="templateName"
              value={formData.templateName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="مثال: متابعة حمل"
            />
          </div>

          {/* النوع */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="templateType"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                نوع القالب *
              </label>
              <input
                type="text"
                id="templateType"
                name="templateType"
                value={formData.templateType}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="مثال: زيارة، روشتة، تشخيص"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                الفئة (اختياري)
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="مثال: حمل، التهاب"
              />
            </div>
          </div>

          {/* المحتوى (JSON) */}
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              المحتوى * (يمكنك كتابة JSON أو نص عادي)
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={12}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder={
                formData.templateType === "روشتة"
                  ? '{"medications": [{"medicationName": "فيتامين د", "dosage": "1000 وحدة", "frequency": "مرة يومياً", "duration": "شهر"}], "generalInstructions": "تناول مع الطعام"}'
                  : '{"chiefComplaint": "متابعة حمل", "notes": "...", "treatmentPlan": "..."}'
              }
            />
            <p className="text-xs text-gray-500 mt-1">
              💡 يمكنك كتابة JSON (يبدأ بـ {"{"}) أو نص عادي (سيتم تحويله تلقائياً)
            </p>
            {formData.templateType === "روشتة" && (
              <p className="text-xs text-blue-600 mt-1">
                مثال للروشتة: {`{"medications": [{"medicationName": "...", "dosage": "...", "frequency": "...", "duration": "..."}], "generalInstructions": "..."}`}
              </p>
            )}
          </div>

          {/* الخيارات */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">نشط</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isFavorite"
                checked={formData.isFavorite}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">مفضل</span>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "جاري الحفظ..." : template ? "تحديث" : "حفظ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

