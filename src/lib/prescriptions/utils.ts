import { calculateAge } from "@/lib/patients/utils";

interface PrescriptionForPrint {
  id: number;
  createdAt: Date | string;
  notes: string | null;
  items: Array<{
    medicationName: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string | null;
  }>;
  visit?: {
    patientId: number;
    visitDate: Date | string;
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

export function printPrescription(prescription: PrescriptionForPrint) {
  const dateStr = formatDate(prescription.createdAt);
  const patient = prescription?.visit?.patient || prescription?.followup?.pregnancy?.patient;
  const patientName = patient ? `${patient.firstName} ${patient.lastName}` : "غير محدد";
  const patientAge = patient?.birthDate ? calculateAge(new Date(patient.birthDate)) : null;
  const patientAddress = patient?.address || null;
  const doctor = prescription?.visit?.doctor;
  const doctorFullName = doctor ? `د/ ${doctor.firstName} ${doctor.lastName}` : "غير محدد";
  const notes = prescription.notes || "";

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
      
      ${prescription.items && prescription.items.length > 0 ? `
      <div class="section-header">
        <div class="section-icon">💊</div>
        <div class="section-title">الأدوية الموصوفة</div>
      </div>
      <div class="medications-list">
        ${prescription.items.map((item, index) => `
        <div class="medication-card">
          <div class="medication-header">
            <div class="medication-number">${index + 1}</div>
            <div class="medication-name">${item.medicationName}</div>
          </div>
          <div class="medication-details">
            <div class="detail-item">
              <div class="detail-label">الجرعة</div>
              <div class="detail-value">${item.dosage}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">التكرار</div>
              <div class="detail-value">${item.frequency}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">المدة</div>
              <div class="detail-value">${item.duration}</div>
            </div>
          </div>
          ${item.instructions ? `
          <div class="medication-instructions">${item.instructions}</div>
          ` : ''}
        </div>
        `).join('')}
      </div>
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
}

