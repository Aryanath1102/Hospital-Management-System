# Doctor_Service Conventions

This service is part of the Hospital Management System, implementing the Doctor-related functionalities.

## Architecture

- **Annotations:** Keep all annotations in `srv/Annotations/` and include them in the main service definition.
- **Action/Validation:** Logic for actions (e.g., `ActivateDoctor`) and validations (e.g., `Doctor_Validation`) MUST be stored in dedicated files under `srv/Actions/` and `srv/Validation/` respectively.
- **Fiori:** The service supports Fiori UI with `@odata.draft.enabled`. Ensure new entities follow this pattern if needed for UI consumption.

## Configuration

- The service configuration resides in `package.json` under the `cds` section.
- Development auth uses mocked users (admin/doctor). Ensure production configuration in MTA remains distinct.
