# Patient Service (`Patient_Service`) - Developer Instructions

This service manages patient master data, profile activations/deactivations, and detailed profile validation constraints.

---

## 📂 Project Structure

* **`db/schema.cds`**: Schema namespace `hospital`. Defines entities:
  * `Patients`: Primary entity containing medical and contact info.
  * `Genders` / `PatientStatus`: Helper entities for UI association dropdowns.
* **`srv/patient-service.cds`**: Defines OData services, actions, and custom events.
* **`srv/patient-service.js`**: Core handler with event listeners and validations.
* **`app/patientui/`**: Fiori Elements List Report & Object Page.

---

## 🔒 Business Logic & Validations

When writing handlers or extending `patient-service.js`, always respect the following strict validation rules enforced in `validatePatient`:

### 1. Mandatory & Field-Level Constraints (on `CREATE` / `UPDATE`)
* **Age**: Cannot be negative. Mandatory on `CREATE`.
* **First & Last Name**: Must contain letters only (A-Z, a-z, spaces, hyphens, and apostrophes allowed). Mandatory on `CREATE`.
* **Phone Number**: Must contain digits only, exactly 10 characters long, and must be globally unique across all patients. Mandatory on `CREATE`.
* **Email**: Must be a valid email format, and globally unique. Mandatory on `CREATE`.
* **Blood Group**: Mandatory on `CREATE`. Permitted uppercase values: `A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`.
* **Emergency Contact Name**: Mandatory on `CREATE`. Must contain letters only.
* **Emergency Phone**: Mandatory on `CREATE`. Must be exactly 10 digits long.
* **Emergency Match Prevention**: Patient phone number and Emergency phone number *cannot* be identical.
* **Gender Remark**: If gender is `'Other'`, `genderRemark` is mandatory and must not exceed 50 characters. If gender is not `'Other'`, `genderRemark` is cleared to null.

### 2. Primary Key & Read-Only Attributes
* **Patient Number (`patientNo`)**: Automatically generated during `CREATE` sequentially (e.g. `P1001`, `P1002`).
* **Immutable**: Once assigned, the `patientNo` attribute is strictly read-only and *cannot* be modified via `UPDATE`. Any attempt will trigger a `400 Bad Request` error.

### 3. Record Operations (Delete/Deactivation)
* **Active Status Protection**: Active patients *cannot* be deleted. A `DELETE` request on an active patient triggers a `405 Method Not Allowed` with instructions to deactivate the patient first.
* **Lifecycle Actions**:
  * `DeactivatePatient`: Sets `isActive` to `false`. Returns the updated patient record.
  * `ActivatePatient`: Sets `isActive` to `true`. Returns the updated patient record.

### 4. UI Virtual Fields
* **`statusCriticality`**: Dynamic field computed during `READ`. Evaluates to `3` (Green) if active and `1` (Red) if inactive.
* **`hideGenderRemark`**: Dynamically computed during `READ` to hide gender remarks in UI if gender is "Male" or "Female".

---

## 🔌 API Testing & Endpoint Details

* **Start locally**: Navigate to `Patient_Service/` and run `cds watch`.
* **Development Mock Users**:
  * Role `PatientAdmin`: username `admin`, password `admin123`
  * Role `Patient`: username `patient`, password `patient123`
