"use client";
import { apiFetch } from "@/lib/api";
import { calculateAge } from "@/lib/patients/utils";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  FileText,
  Save,
  Trash2,
  Plus,
  X,
  User,
  Calendar,
  ArrowRight,
  Edit,
  ArrowLeft,
  Printer,
} from "lucide-react";

interface Medication {
  id?: number;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface Prescription {
  id: number;
  visitId: number | null;
  followupId: number | null;
  notes: string | null;
  createdAt: Date;
  items: Medication[];
  visit?: {
    patientId: number;
    visitDate: Date;
    patient?: {
      id: number;
      firstName: string;
      lastName: string;
      birthDate: Date | string;
      address: string | null;
    };
    doctor?: {
      id: number;
      firstName: string;
      lastName: string;
      specialization?: string | null;
      degree?: string | null;
      university?: string | null;
      phone?: string;
      enwan?: string | null;
      ReceptionPhone?: string | null;
    };
  };
  followup?: {
    pregnancy?: {
      patientId: number;
      patient?: {
        id: number;
        firstName: string;
        lastName: string;
        birthDate: Date | string;
        address: string | null;
      };
    };
  };
}

export default function PrescriptionDetailClient() {
  const router = useRouter();
  const params = useParams();
  const prescriptionId = parseInt(params.id as string);

  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState("");
  const [medications, setMedications] = useState<Medication[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // جلب الروشتة
  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        const response = await apiFetch(`/api/prescriptions/${prescriptionId}`);
        const result = await response.json();

        if (result.success && result.data) {
          const data = result.data;
          setPrescription(data);
          setNotes(data.notes || "");
          setMedications(
            data.items.map((item: any) => ({
              id: item.id,
              medicationName: item.medicationName,
              dosage: item.dosage,
              frequency: item.frequency,
              duration: item.duration,
              instructions: item.instructions || "",
            }))
          );
        } else {
          alert("الروشتة غير موجودة");
          router.push("/prescriptions");
        }
      } catch (error) {
        console.error("Error fetching prescription:", error);
        alert("حدث خطأ أثناء جلب الروشتة");
        router.push("/prescriptions");
      } finally {
        setLoading(false);
      }
    };

    if (prescriptionId) {
      fetchPrescription();
    }
  }, [prescriptionId, router]);

  const handleSave = async () => {
    if (medications.length === 0) {
      alert("يجب إضافة على الأقل دواء واحد");
      return;
    }

    setSaving(true);
    try {
      const response = await apiFetch(`/api/prescriptions/${prescriptionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notes,
          items: medications.map((m) => ({
            medicationName: m.medicationName,
            dosage: m.dosage,
            frequency: m.frequency,
            duration: m.duration,
            instructions: m.instructions,
          })),
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsEditing(false);
        // تحديث البيانات المحلية
        if (prescription) {
          setPrescription({
            ...prescription,
            notes,
            items: medications,
          });
        }
        alert("تم حفظ التعديلات بنجاح");
      } else {
        alert(result.error || "حدث خطأ أثناء حفظ التعديلات");
      }
    } catch (error) {
      console.error("Error saving prescription:", error);
      alert("حدث خطأ أثناء حفظ التعديلات");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await apiFetch(`/api/prescriptions/${prescriptionId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        alert("تم حذف الروشتة بنجاح");
        router.push("/prescriptions");
      } else {
        alert(result.error || "حدث خطأ أثناء حذف الروشتة");
      }
    } catch (error) {
      console.error("Error deleting prescription:", error);
      alert("حدث خطأ أثناء حذف الروشتة");
    }
  };

  const addMedication = () => {
    setMedications([
      ...medications,
      {
        medicationName: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      },
    ]);
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const updateMedication = (index: number, field: keyof Medication, value: string) => {
    const updated = [...medications];
    updated[index] = { ...updated[index], [field]: value };
    setMedications(updated);
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPatientName = () => {
    const patient =
      prescription?.visit?.patient || prescription?.followup?.pregnancy?.patient;
    return patient ? `${patient.firstName} ${patient.lastName}` : "غير محدد";
  };

  const getPatientId = () => {
    return (
      prescription?.visit?.patientId ||
      prescription?.followup?.pregnancy?.patientId ||
      null
    );
  };

  const getDoctorName = () => {
    const doctor = prescription?.visit?.doctor;
    if (doctor) {
      return `${doctor.firstName} ${doctor.lastName}`;
    }
    return "غير محدد";
  };

  const handlePrintPDF = () => {
    if (!prescription) return;

    const dateStr = formatDate(prescription.createdAt);
    const patient = prescription?.visit?.patient || prescription?.followup?.pregnancy?.patient;
    const patientName = getPatientName();
    const patientAge = patient?.birthDate ? calculateAge(new Date(patient.birthDate)) : null;
    const patientAddress = patient?.address || null;
    const doctor = prescription?.visit?.doctor;
    const doctorFullName = doctor ? `د/ ${doctor.firstName} ${doctor.lastName}` : "غير محدد";

    // إنشاء محتوى HTML للطباعة بحجم A5
    const htmlContent = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>روشتة طبية #${prescription.id}</title>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A5 portrait;
      margin: 5mm;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Cairo', 'Arial', 'Tahoma', sans-serif;
      font-size: 11px;
      line-height: 1.7;
      color: #1a1a1a;
      background: #ffffff;
      padding: 0;
      margin: 0;
      width: 100%;
      max-width: 148mm;
    }
    
    .prescription-container {
      border: 3px solid #6a94efff;
      border-radius: 12px;
      overflow: hidden;
      background: white;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 100%;
    }
    
    .header {
      background: #6a94efff;
      color: white;
      padding: 20px;
      text-align: center;
      position: relative;
      page-break-after: avoid;
    }
    
    .header::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 0;
      right: 0;
      height: 10px;
     background: #6a94efff;
      clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 50%, 0 100%);
    }
    
    .header-content {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .clinic-logo {
      width: 140px;
      height: 140px;
      object-fit: contain;
      background: white;
      border-radius: 50%;
      padding: 8px;
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
    }
    
    .doctor-info {
      flex: 1;
      text-align: right;
      color: #0d0d0dff;
      padding-right: 10px;
    }
    
    .doctor-name {
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 4px;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      letter-spacing: 0.3px;
    }
    
    .doctor-specialization {
      font-size: 13px;
      font-weight: 600;
      margin-top: 3px;
      opacity: 0.95;
      letter-spacing: 0.2px;
    }
    
    .doctor-degree {
      font-size: 10px;
      margin-top: 4px;
      opacity: 0.9;
    }
    
    .doctor-contact {
      display: flex;
justify-content:right;
      text-align: right;
      direction: rtl;
      margin-top: 4px;
      font-size: 10px;
      opacity: 0.9;
      padding-right: 15px;
    }
    
    .contact-label {
        font-weight: bold;
        margin-left: 5px;
    }
    
    .rx-symbol {
      position: absolute;
      top: 15px;
      right: 15px;
      font-size: 32px;
      font-weight: 700;
      opacity: 0.15;
      font-style: italic;
    }
    
    .content {
      padding: 15px;
    }
    
    .info-card {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border: 2px solid #bae6fd;
      border-radius: 8px;
      padding: 8px 15px;
      margin-bottom: 18px;
      page-break-inside: avoid;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }
    
    .info-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    .info-icon {
      width: 16px;
      height: 16px;
      background: #2563eb;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 10px;
      font-weight: 700;
      flex-shrink: 0;
    }
    
    .info-label {
      font-weight: 600;
      color: #1e40af;
      font-size: 10px;
    }
    
    .info-value {
      color: #1a1a1a;
      font-size: 10px;
    }
    
    .section-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 20px 0 12px 0;
      padding-bottom: 8px;
      border-bottom: 2px solid #2563eb;
      page-break-after: avoid;
    }
    
    .section-icon {
      width: 24px;
      height: 24px;
      background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 14px;
      font-weight: 700;
    }
    
    .section-title {
      font-size: 14px;
      font-weight: 700;
      color: #1e40af;
      letter-spacing: 0.3px;
    }
    
    .notes-box {
      background: #fffbeb;
      border: 2px solid #fcd34d;
      border-radius: 8px;
      padding: 12px 15px;
      margin: 12px 0;
      white-space: pre-wrap;
      font-size: 11px;
      line-height: 1.8;
      color: #78350f;
      page-break-inside: avoid;
      position: relative;
    }
    
    .notes-box::before {
      content: '📝';
      position: absolute;
      top: 10px;
      left: 10px;
      font-size: 18px;
      opacity: 0.3;
    }
    
    .medications-list {
      margin: 12px 0;
    }
    
    .medication-card {
      background: white;
      border: 2px solid #b8babfff;
      border-right: 4px solid #2563eb;
      border-radius: 8px;
      padding: 12px 15px;
      margin-bottom: 12px;
      page-break-inside: avoid;
      transition: all 0.3s ease;
    }
    
    .medication-card:hover {
      box-shadow: 0 2px 8px rgba(37, 99, 235, 0.15);
    }
    
    .medication-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
      padding-bottom: 8px;
      border-bottom: 1px dashed #d1d5db;
    }
    
    .medication-number {
      width: 24px;
      height: 24px;
      background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 11px;
      font-weight: 700;
      flex-shrink: 0;
    }
    
    .medication-name {
      font-size: 13px;
      font-weight: 700;
      color: #1e40af;
      flex: 1;
    }
    
    .medication-details {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      margin-bottom: 8px;
    }
    
    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    
    .detail-label {
      font-size: 9px;
      font-weight: 600;
      color: #484a4fff;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    
    .detail-value {
      font-size: 11px;
      color: #1a1a1a;
      font-weight: 500;
    }
    
    .medication-instructions {
      margin-top: 10px;
      padding: 8px 10px;
      background: #f0f9ff;
      border-radius: 6px;
      font-size: 10px;
      color: #1e40af;
      line-height: 1.6;
    }
    
    .medication-instructions::before {
      content: '💡 ';
      margin-left: 4px;
    }
    
    .footer {
      margin-top: 20px;
      padding: 15px 20px;
      background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
      border-top: 2px solid #e5e7eb;
      text-align: center;
      page-break-inside: avoid;
    }
    
    .footer-content {
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 9px;
      color: #484a4fff;
    }
    
    .footer-divider {
      width: 60px;
      height: 2px;
      background: linear-gradient(90deg, transparent, #2563eb, transparent);
      margin: 8px auto;
    }

    
    @media print {
      body {
        width: 100%;
        max-width: 100%;
        margin: 0;
        padding: 0;
      }
      
      .prescription-container {
        box-shadow: none;
        border-radius: 0;
        width: 100%;
        max-width: 100%;
      }
      
      .medication-card:hover {
        box-shadow: none;
      }
      
      .no-print {
        display: none;
      }
    }
  </style>
</head>
<body>
  <div class="prescription-container">
    <div class="header">
      <div class="header-content">
        <div class="doctor-info">
          <div class="doctor-name">${doctorFullName}</div>
          ${doctor?.specialization ? `<div class="doctor-specialization">${doctor.specialization}</div>` : ''}
          ${doctor?.degree || doctor?.university ? `
          <div class="doctor-degree">
            ${doctor.degree || ''} ${doctor.degree && doctor.university ? '–' : ''} ${doctor.university || ''}
          </div>
          ` : ''}
          <div class="doctor-contact">
        'العنوان : '    ${doctor?.enwan ? `<div class="contact-item">📍 ${doctor.enwan}</div>` : ''}
          </div>
          <div class="doctor-contact">
         'للحجز و الاستفسار : '   ${doctor?.ReceptionPhone ? `<div class="contact-item">📅 ${doctor.ReceptionPhone}</div>` : ''}
          </div>
             <div class="doctor-contact">
          'للطوارئ : '  ${doctor?.phone ? `<div class="contact-item">📞 ${doctor.phone}</div>` : ''}
          </div>
        </div>

         ${doctor ? `<img src="/favicon/icon1.png" alt="لوجو العيادة" class="clinic-logo" onerror="this.style.display='none'">` : ''}

      </div>
    </div>
    
    <div class="content">
      <div class="info-card">
        <div class="info-grid">
          <div class="info-item">
            <div class="info-icon">👤</div>
            <div>
              <div class="info-label">الاسم</div>
              <div class="info-value">${patientName}</div>
            </div>
          </div>
          <div class="info-item">
            <div class="info-icon">🎂</div>
            <div>
              <div class="info-label">السن</div>
              <div class="info-value">${patientAge ? `${patientAge} سنة` : 'غير محدد'}</div>
            </div>
          </div>
          ${patientAddress ? `
          <div class="info-item">
            <div class="info-icon">📍</div>
            <div>
              <div class="info-label">العنوان</div>
              <div class="info-value">${patientAddress}</div>
            </div>
          </div>
          ` : ''}
          <div class="info-item">
            <div class="info-icon">📅</div>
            <div>
              <div class="info-label">التاريخ</div>
              <div class="info-value">${dateStr}</div>
            </div>
          </div>
        </div>
      </div>
      
      ${notes && notes.trim() !== "" ? `
      <div class="section-header">
        <div class="section-icon">💊</div>
        <div class="section-title">الأدوية الموصوفة</div>
      </div>
      <div class="notes-box">${notes.replace(/\n/g, '<br>')}</div>
      ` : ''}
      
      
    </div>
    
    <div class="footer">
      <div class="footer-content">
        <div>🏥 روشتة طبية إلكترونية</div>
        <div class="footer-divider"></div>
        <div>تم إصدار هذه الروشتة بتاريخ ${dateStr}</div>
        <div style="font-size: 8px; margin-top: 4px; opacity: 0.7;">
          يُرجى الالتزام بتعليمات الطبيب وعدم تناول أي دواء دون استشارة طبية
        </div>
      </div>
    </div>
  </div>
</body>
</html>
    `;

    // فتح صفحة جديدة وطباعة المحتوى
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // انتظار تحميل الصفحة ثم طباعتها
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 250);
      };
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-500">جاري التحميل...</div>
    );
  }

  if (!prescription) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">الروشتة غير موجودة</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">روشتة #{prescription.id}</h1>
          <p className="text-gray-600 mt-2">{formatDate(prescription.createdAt)}</p>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <button
                onClick={handlePrintPDF}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Printer className="w-5 h-5" />
                طباعة PDF
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-5 h-5" />
                تعديل
              </button>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
                حذف
              </button>
              <button
                onClick={() => router.push(`/prescriptions`)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                العودة للروشتات
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setIsEditing(false);
                  // استعادة البيانات الأصلية
                  if (prescription) {
                    setNotes(prescription.notes || "");
                    setMedications(
                      prescription.items.map((item: any) => ({
                        id: item.id,
                        medicationName: item.medicationName,
                        dosage: item.dosage,
                        frequency: item.frequency,
                        duration: item.duration,
                        instructions: item.instructions || "",
                      }))
                    );
                  }
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                <Save className="w-5 h-5" />
                {saving ? "جاري الحفظ..." : "حفظ"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Patient Info */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-4">
          <User className="w-5 h-5 text-gray-400" />
          <div>
            <p className="font-medium text-gray-900">{getPatientName()}</p>
            {getPatientId() && (
              <button
                onClick={() => router.push(`/patients/${getPatientId()}`)}
                className="text-sm text-blue-600 hover:text-blue-800 mt-1 flex items-center gap-1"
              >
                عرض الملف الشخصي
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">ملاحظات</h2>
        {isEditing ? (
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="ملاحظات..."
          />
        ) : (
          <p className="text-gray-700 whitespace-pre-wrap">
            {notes || "لا توجد ملاحظات"}
          </p>
        )}
      </div>

      {/* Medications */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">الأدوية</h2>
          {isEditing && (
            <button
              onClick={addMedication}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              إضافة دواء
            </button>
          )}
        </div>

        {medications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p>لا توجد أدوية</p>
          </div>
        ) : (
          <div className="space-y-4">
            {medications.map((medication, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                {isEditing && (
                  <div className="flex justify-end mb-2">
                    <button
                      onClick={() => removeMedication(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      اسم الدواء
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={medication.medicationName}
                        onChange={(e) =>
                          updateMedication(index, "medicationName", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="اسم الدواء"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">
                        {medication.medicationName || "غير محدد"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الجرعة
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={medication.dosage}
                        onChange={(e) =>
                          updateMedication(index, "dosage", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="الجرعة"
                      />
                    ) : (
                      <p className="text-gray-900">{medication.dosage || "غير محدد"}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      التكرار
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={medication.frequency}
                        onChange={(e) =>
                          updateMedication(index, "frequency", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="التكرار"
                      />
                    ) : (
                      <p className="text-gray-900">{medication.frequency || "غير محدد"}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      المدة
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={medication.duration}
                        onChange={(e) =>
                          updateMedication(index, "duration", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="المدة"
                      />
                    ) : (
                      <p className="text-gray-900">{medication.duration || "غير محدد"}</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      تعليمات
                    </label>
                    {isEditing ? (
                      <textarea
                        value={medication.instructions}
                        onChange={(e) =>
                          updateMedication(index, "instructions", e.target.value)
                        }
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="تعليمات الاستخدام"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {medication.instructions || "لا توجد تعليمات"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div
            className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">تأكيد الحذف</h3>
            <p className="text-gray-600 mb-6">
              هل أنت متأكد من حذف الروشتة #{prescription.id}؟ لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
