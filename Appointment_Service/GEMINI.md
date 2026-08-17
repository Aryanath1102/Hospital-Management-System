# Appointment_Service Conventions

This service handles appointment scheduling and management.

## External Dependencies

- This service consumes `DoctorService` and `PatientService` via SAP Cloud SDK.
- Configurations for external destinations are handled in the `cds.requires` section in `package.json`.

## Architecture

- Follow root conventions for handler structure and CDS definitions.
- When calling external services, ensure proper error handling and resilience patterns (as supported by `@sap-cloud-sdk/resilience`).
