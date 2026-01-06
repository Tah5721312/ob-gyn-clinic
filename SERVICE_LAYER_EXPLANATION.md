# 🧠 Service Layer - شرح بسيط

## إيه هو Service Layer؟

**Service Layer = العقل المحاسبي للنظام**

مش Database (قاعدة البيانات)
ومش UI (واجهة المستخدم)

**مسؤول عن:**

- ✅ حساب الفاتورة
- ✅ التحقق من القيم
- ✅ تحديث الحالات (Paid / Partially Paid)

---

## 🎯 ليه مهم؟

### ❌ **بدون Service Layer:**

```
الحسابات مبعثرة في:
- شوية في API
- شوية في UI
- شوية في Database

❌ خطر
❌ سهل يتكسر
❌ صعب يتراجع
```

### ✅ **مع Service Layer:**

```
كل الحسابات في مكان واحد:
src/services/invoice.service.ts

✅ آمن
✅ موثوق
✅ سهل التعديل
```

---

## 📁 البنية

```
src/
├── services/
│   └── invoice.service.ts  ← هنا كل الحسابات
│
├── lib/
│   ├── invoices/
│   │   └── mutations.ts    ← يستخدم Service Layer
│   └── invoice-items/
│       └── mutations.ts    ← يستخدم Service Layer
│
└── app/
    └── api/                ← يستخدم mutations
```

---

## 🔧 كيف بيشتغل؟

### 1️⃣ **عند إضافة بند للفاتورة:**

```typescript
// في mutations.ts
createInvoiceItem() {
  // 1. حساب البند
  const calculatedItem = calculateInvoiceItem({...})

  // 2. حفظ في Database
  await prisma.invoiceItem.create({...})

  // 3. إعادة حساب الفاتورة
  await recalculateInvoiceTotals(invoiceId)
}
```

**ماذا يحدث؟**

- ✅ يحسب `totalPrice` للبند
- ✅ يجمع كل البنود ويحسب `subtotalAmount`
- ✅ يحسب `totalAmount`, `netAmount`
- ✅ يحدّث `remainingAmount` و `paymentStatus`

---

### 2️⃣ **عند إضافة دفعة:**

```typescript
// في mutations.ts
createPayment() {
  // 1. التحقق من المبلغ
  await validatePaymentAmount(invoiceId, amount)

  // 2. حفظ الدفعة
  await prisma.payment.create({...})

  // 3. تحديث حالة الدفع
  await updateInvoicePaymentStatus(invoiceId)
}
```

**ماذا يحدث؟**

- ✅ يتحقق أن المبلغ لا يتجاوز المستحق
- ✅ يجمع كل المدفوعات → `paidAmount`
- ✅ يحسب `remainingAmount = netAmount - paidAmount`
- ✅ يحدّث `paymentStatus` تلقائياً

---

## 🧮 الحسابات الأساسية

### **حساب بند واحد:**

```typescript
totalPrice = (quantity × unitPrice) - discountAmount + taxAmount
```

### **حساب الفاتورة:**

```typescript
subtotalAmount = مجموع totalPrice لكل البنود
discountAmount = subtotal × discountPercentage / 100
totalAmount = subtotal - discount + tax
netAmount = totalAmount - insuranceCoverage
```

### **حساب حالة الدفع:**

```typescript
if (paidAmount == 0) → "غير مدفوع"
if (paidAmount < netAmount) → "مدفوع جزئياً"
if (paidAmount >= netAmount) → "مدفوع"
```

---

## 💡 مثال عملي

### **سيناريو: زيارة مريض**

```
1. إنشاء فاتورة
   POST /api/invoices
   ↓
2. إضافة بنود
   POST /api/invoice-items
   - كشف: 200 جنيه
   - سونار: 300 جنيه
   - تحليل: 150 جنيه
   ↓
3. Service Layer يحسب تلقائياً:
   subtotalAmount = 650
   taxAmount = 91 (14%)
   totalAmount = 741
   netAmount = 741
   ↓
4. المريض دفع 500 جنيه
   POST /api/invoices/1/payments
   ↓
5. Service Layer يحدّث:
   paidAmount = 500
   remainingAmount = 241
   paymentStatus = "مدفوع جزئياً"
```

---

## ✅ المميزات

1. **منع الأخطاء:** التحقق من القيم قبل الحفظ
2. **موثوق:** كل الحسابات في مكان واحد
3. **سهل التعديل:** تغيير القاعدة من مكان واحد
4. **مناسب للتأمين:** حساب تلقائي للتأمين
5. **مناسب للتقارير:** بيانات دقيقة

---

## 🎓 الخلاصة

**Service Layer = العقل المحاسبي**

- الـ Database تخزن البيانات
- الـ UI تعرض البيانات
- الـ Service يحسب ويفرض القواعد

**كل الحسابات في مكان واحد → آمن وموثوق ✅**
