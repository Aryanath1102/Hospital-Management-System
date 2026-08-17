# Project Conventions

This project utilizes the SAP Cloud Application Programming Model (CAP) with Node.js and CDS.

## Development Standards

- **CDS Modeling:** Follow standard CAP naming conventions for entities and associations. Maintain clear separation between service definitions and annotations.
- **Handler Logic:** Keep handlers lean. Delegate business logic to dedicated helper modules within `srv/` (e.g., `srv/Validation/`, `srv/Actions/`).
- **Testing:** New features or bug fixes must be accompanied by relevant tests.
- **Build/Deploy:** Use project-defined scripts:
  - `npm run build`: Build for deployment using `mbt`.
  - `npm run deploy`: Deploy to Cloud Foundry.
- **Documentation:** Maintain README.md files for each service to describe its functionality and configuration.

## Interaction Guidelines

- When proposing changes, prioritize idiomatic CAP patterns.
- Always check `package.json` for available scripts before running commands.
