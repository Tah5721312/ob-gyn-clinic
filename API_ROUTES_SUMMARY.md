# API Routes - CRUD Operations Summary

## ✅ Completed CRUD Operations

### 1. **Patients** (`/api/patients`)
- ✅ `GET /api/patients` - List with filters
- ✅ `POST /api/patients` - Create
- ✅ `GET /api/patients/[id]` - Get by ID
- ✅ `PUT /api/patients/[id]` - Update
- ✅ `DELETE /api/patients/[id]` - Delete

### 2. **Appointments** (`/api/appointments`)
- ✅ `GET /api/appointments` - List with filters
- ✅ `POST /api/appointments` - Create
- ✅ `GET /api/appointments/[id]` - Get by ID
- ✅ `PUT /api/appointments/[id]` - Update
- ✅ `DELETE /api/appointments/[id]` - Delete
- ✅ `PATCH /api/appointments/[id]` - Cancel (special action)

### 3. **Visits** (`/api/visits`)
- ✅ `GET /api/visits` - List with filters
- ✅ `GET /api/visits/[id]` - Get by ID
- ⏳ `POST /api/visits` - Create (needs implementation)
- ⏳ `PUT /api/visits/[id]` - Update (needs implementation)
- ⏳ `DELETE /api/visits/[id]` - Delete (needs implementation)

### 4. **Doctors** (`/api/doctors`)
- ✅ `GET /api/doctors` - List with filters
- ✅ `GET /api/doctors/[id]` - Get by ID
- ⏳ `POST /api/doctors` - Create (needs implementation)
- ⏳ `PUT /api/doctors/[id]` - Update (needs implementation)
- ⏳ `DELETE /api/doctors/[id]` - Delete (needs implementation)

### 5. **Invoices** (`/api/invoices`)
- ✅ `GET /api/invoices` - List with filters
- ✅ `GET /api/invoices/[id]` - Get by ID
- ⏳ `POST /api/invoices` - Create (needs implementation)
- ⏳ `PUT /api/invoices/[id]` - Update (needs implementation)
- ⏳ `DELETE /api/invoices/[id]` - Delete (needs implementation)
- ⏳ `POST /api/invoices/[id]/payments` - Add Payment (needs implementation)

### 6. **Prescriptions** (`/api/prescriptions`)
- ✅ `GET /api/prescriptions` - List with filters
- ✅ `GET /api/prescriptions/[id]` - Get by ID
- ⏳ `POST /api/prescriptions` - Create (needs implementation)
- ⏳ `PUT /api/prescriptions/[id]` - Update (needs implementation)
- ⏳ `DELETE /api/prescriptions/[id]` - Delete (needs implementation)

### 7. **Labs** (`/api/labs`)
- ✅ `GET /api/labs` - List with filters
- ✅ `GET /api/labs/[id]` - Get by ID with results
- ⏳ `POST /api/labs` - Create Order (needs implementation)
- ⏳ `PUT /api/labs/[id]` - Update Order (needs implementation)
- ⏳ `DELETE /api/labs/[id]` - Delete Order (needs implementation)
- ⏳ `POST /api/labs/[id]/results` - Add Result (needs implementation)

### 8. **Pregnancies** (`/api/pregnancies`)
- ✅ `GET /api/pregnancies` - List with filters
- ✅ `GET /api/pregnancies/[id]` - Get by ID
- ⏳ `POST /api/pregnancies` - Create (needs implementation)
- ⏳ `PUT /api/pregnancies/[id]` - Update (needs implementation)
- ⏳ `DELETE /api/pregnancies/[id]` - Delete (needs implementation)

### 9. **Services** (`/api/services`)
- ✅ `GET /api/services` - List with filters
- ✅ `GET /api/services/[id]` - Get by ID
- ⏳ `POST /api/services` - Create (needs implementation)
- ⏳ `PUT /api/services/[id]` - Update (needs implementation)
- ⏳ `DELETE /api/services/[id]` - Delete (needs implementation)

## 📝 Notes

- All mutations functions are created in `lib/*/mutations.ts`
- All routes follow the same pattern
- Error handling is consistent across all routes
- Type safety is maintained with TypeScript interfaces

