# Patient_Service Conventions

This service handles patient data and management.

## Architecture

- Follow root conventions for handler structure and CDS definitions.
- This service includes a Fiori UI application.
- UI development uses `cds-plugin-ui5` for integration.

## Configuration

- Service configuration, including authentication and database settings, resides in `package.json` (or `.cdsrc.json` if used).
- Development auth uses mocked users (admin/patient).
