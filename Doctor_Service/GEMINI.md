# Doctor Service (`Doctor_Service`) - Developer Instructions

This is a highly modularized SAP CAP service that manages doctor registries, specializations, schedules, leaves, departments, and buildings.

---

## 📂 Project Structure

* **`db/Schema.cds`**: Defines database schemas, Enums, and structures:
  * Entities: `Doctors`, `Specializations`, `DoctorSpecializations`, `DoctorSchedules`, `DoctorLeaves`, `Departments`, `Buildings`, and `NumberRanges`.
* **`srv/`**: Contains the main service entry files and specialized sub-directories:
  * **`Doctor_Service.cds`**: Declares OData service endpoints, actions, and bounds.
  * **`Doctor_Service.js`**: Orchestrates event handlers and wires validation/action modules.
  * **`server.js`**: Custom server bootstrap that integrates **Swagger UI** for API exploration via `cds-swagger-ui-express` and triggers background schedulers.
  * **`Actions/`**: Individual JS modules for lifecycle transitions:
    * `ActivateDoctor`, `SuspendDoctor`, `RetireDoctor`, `ApproveLeave`, `RejectLeave`, `CancelLeave`.
  * **`Validation/`**: Separate validation classes for each entity:
    * `Buildings_Validation.js`, `Department_Validation.js`, `Doctor_Validation.js`, `DoctorLeave_Validation.js`, `DoctorSchedule_Validation.js`, `DoctorSpecialization_Validation.js`, `Specialization_Validation.js`.
  * **`Generators/`**: Multi-use number-range custom generators (e.g., `Doctor_Code_Generator.js`).
  * **`Jobs/`**: Background schedulers and task runners (e.g., `Scheduler.js` and `Doctor_Availability_Job.js`).
  * **`Services/`**: System utilities like `NumberRangeService.js`.
  * **`Annotations/`**: Modular Fiori Elements annotation files organized by entity, consolidated under `index.cds`.

---

## 📏 Architecture & Coding Guidelines

### 1. Naming & Case Conventions
* This service uses **PascalCase with snake_case** initials for database properties.
* **Examples**: `First_Name`, `Doctor_Code`, `Availability`, `Doctor_Status`, `LeaveStatus`. Always verify the casing inside `db/Schema.cds` to avoid Draft engine mapping failures.

### 2. Full Name Auto-population
* The field `Full_Name` is modeled as a standard persistent String (instead of a virtual/computed field) to prevent Fiori elements Draft Engine synchronization errors.
* It must be dynamically populated and updated in `Doctor_Service.js` before saving.

### 3. Modularization Rules
* **No Inline Validations**: All validation rules must reside under the `srv/Validation/` directory. They must accept `(req, Entity)` parameters and use standard CAP error bubbling (`req.error(...)`).
* **No Inline Actions**: All bound/unbound actions must reside under the `srv/Actions/` directory as single-responsibility functions.

---

## ⏱ Jobs and Scheduling

* Background job processing is initiated in `srv/server.js` by requiring `./Jobs/Scheduler`.
* Active job: `Doctor_Availability_Job.js` which manages automatic doctor state transitions based on scheduled leave periods, vacation windows, or clinic shifts.

---

## 🔌 API Testing & Interactive Docs

* **Swagger UI Documentation**: Available at `/` or `/$metadata` or `/api-docs` when running locally on your server.
* **Start command**: Navigate to `Doctor_Service/` and run `cds watch`.
* **Mock Users Configuration**:
  * Role `admin`: username `admin`, password `admin123`
  * Role `doctor`: username `doctor`, password `doctor123`
