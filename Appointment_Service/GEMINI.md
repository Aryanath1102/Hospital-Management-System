# Appointment Service (`Appointment_Service`) - Developer Instructions

The `Appointment_Service` acts as an orchestrator and gateway. It integrates and executes cross-service queries against both `Patient_Service` and `Doctor_Service` to schedule appointments.

---

## 📂 Project Structure

* **`db/Schema.cds`**: Schema namespace `hospital`. Defines:
  * `Appointments`: Main transactional entity. Uses standard `cuid` and `managed` aspects.
  * `AppointmentTypes` & `AppointmentStatus`: Associations mapping to enum types (e.g., `Consultation`, `Follow-up`, `Emergency`, `Scheduled`, `Confirmed`, `Completed`, `Cancelled`).
* **`srv/Service.cds`**: Service boundary definition.
* **`srv/Service.js`**: Core orchestration handler implementing cross-service logic.
* **`srv/external/`**:
  * `PatientService.cds`: Projected definitions representing the remote Patient Service OData API.
  * `DoctorService.cds`: Projected definitions representing the remote Doctor Service OData API.

---

## 🔗 Cross-Service Integrations

The service communicates with two upstream microservices. These connections are configured in `package.json` under `"cds.requires"`:

1. **`PatientService`**: Connects via OData proxy to the remote Patient Service.
2. **`DoctorService`**: Connects via OData proxy to the remote Doctor Service.

To connect programmatically inside custom handlers, use:
```js
const PatientService = await cds.connect.to("PatientService");
const DoctorService = await cds.connect.to("DoctorService");
```

---

## 🔒 Business Logic & Integration Validations

A critical custom draft validator is implemented on `before("NEW", Appointments.drafts)` to intercept draft initialization and modification:

### 1. Patient Verification
* The system checks the `Patient_ID` from the incoming request.
* It performs a remote OData query against the `PatientService`'s `Patients` entity.
* **Validations**:
  * If `Patient_ID` is missing: returns `400 Patient_ID is required`.
  * If no record matches the `Patient_ID` in the remote service: returns `404 Patient not found.`.
  * If the patient profile is found but is marked inactive (`isActive === false`): returns `400 Patient is inactive.`.

### 2. Doctor Verification
* The system checks the `Doctor_ID` from the incoming request.
* It performs a remote OData query against the `DoctorService`'s `Doctors` entity.
* **Validations**:
  * If `Doctor_ID` is missing: returns `400 Doctor ID required`.
  * If no record matches the `Doctor_ID` in the remote service: returns `404 Doctor not found`.
  * If the doctor profile is found but their availability status is not `'Available'`: returns `400 Doctor not available`.

---

## 🚀 Testing locally

1. **Start all services**: In a multi-root workspace environment, run each dependent service (`Patient_Service` and `Doctor_Service`) in their respective ports, and then start `Appointment_Service`.
2. **OData Service Mocking**: For local sandbox testing without live endpoints, CAP automatically mocks remote services declared under destinations if running with SQLite mock profiles.
