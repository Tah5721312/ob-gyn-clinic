# نظام المصادقة والصلاحيات (Authentication & Authorization System)

## 🔹 الفرق بين `userType` و `role`

### `userType` - نوع الحساب

يحدد **نوع الحساب** في النظام:

- `ADMIN` - مدير النظام
- `DOCTOR` - طبيب
- `STAFF` - موظف

### `role` - الصلاحيات الفعلية

يحدد **الصلاحيات الفعلية** التي يمتلكها المستخدم:

- `SUPER_ADMIN` - مدير النظام (صلاحيات كاملة)
- `DOCTOR` - طبيب (إدارة المرضى، المواعيد، الزيارات، الروشتات)
- `RECEPTION` - استقبال (إدارة المواعيد والمرضى)
- `ACCOUNTANT` - محاسب (إدارة الفواتير والمدفوعات)
- `NURSE` - ممرضة (إدارة المرضى والتحاليل)

## 📡 Login API

### Endpoint

```
POST /api/auth/login
```

### Request

```json
{
  "username": "ahmed",
  "password": "••••••"
}
```

### Response (Success)

```json
{
  "success": true,
  "userId": 12,
  "username": "ahmed",
  "userType": "DOCTOR",
  "role": "طبيب",
  "roleCode": "DOCTOR",
  "doctorId": 5,
  "staffId": null,
  "mustChangePassword": false,
  "permissions": ["VISIT_CREATE", "PRESCRIPTION_WRITE", "PATIENT_MANAGE"],
  "redirectUrl": "/dashboard"
}
```

### Response (Error)

```json
{
  "success": false,
  "error": "اسم المستخدم أو كلمة المرور غير صحيحة"
}
```

## 🔁 Redirect Logic

بعد تسجيل الدخول الناجح، يتم التوجيه حسب القواعد التالية:

```typescript
if (user.mustChangePassword) {
  redirect('/change-password');
}

if (user.userType === 'DOCTOR') {
  redirect('/dashboard');
}

if (role === 'RECEPTION') {
  redirect('/appointments');
}

if (role === 'ACCOUNTANT') {
  redirect('/billing');
}

if (role === 'NURSE') {
  redirect('/patients');
}

// افتراضي
redirect('/dashboard');
```

## 📝 مثال على الاستخدام في Frontend

```typescript
// app/signin/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginRequest, LoginResponse } from '@/types/auth';

export default function SignInPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password } as LoginRequest),
      });

      const data: LoginResponse = await response.json();

      if (data.success) {
        // حفظ بيانات المستخدم في Session/Context
        // ...

        // Redirect Logic
        if (data.mustChangePassword) {
          router.push('/change-password');
        } else {
          router.push(data.redirectUrl || '/dashboard');
        }
      } else {
        setError(data.error || 'حدث خطأ أثناء تسجيل الدخول');
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال');
    }
  };

  return <form onSubmit={handleLogin}>{/* Form fields */}</form>;
}
```

## 🔐 الصلاحيات (Permissions)

### قائمة الصلاحيات المتاحة:

- `PATIENT_MANAGE` - إدارة المرضى
- `APPOINTMENT_MANAGE` - إدارة المواعيد
- `INVOICE_MANAGE` - إدارة الفواتير
- `VISIT_CREATE` - إنشاء زيارة
- `PRESCRIPTION_WRITE` - كتابة روشتة
- `SYSTEM_MANAGE` - إدارة النظام

## 👥 المستخدمين التجريبيين

بعد تشغيل `npx prisma db seed`، يمكنك تسجيل الدخول بـ:

| Username     | Password | UserType | Role        | Redirect        |
| ------------ | -------- | -------- | ----------- | --------------- |
| `admin`      | `123456` | ADMIN    | SUPER_ADMIN | `/dashboard`    |
| `doctor1`    | `123456` | DOCTOR   | DOCTOR      | `/dashboard`    |
| `reception`  | `123456` | STAFF    | RECEPTION   | `/appointments` |
| `accountant` | `123456` | STAFF    | ACCOUNTANT  | `/billing`      |
| `nurse`      | `123456` | STAFF    | NURSE       | `/patients`     |
