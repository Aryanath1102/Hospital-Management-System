const cds = require("@sap/cds");
const { SELECT } = cds.ql;
const validator = require("validator");

const toTitleCase = (value) => {
  if (value == null) {
    return value;
  }

  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const validateSpecialization = async (req, Specializations, Departments) => {
  const tx = cds.tx(req);

  const targetID = req.data?.ID || req.params?.[0]?.ID || req.params?.[0];

  // ======================================================
  // Specialization Code
  // ======================================================

  if (
    (req.event === "CREATE" || req.event === "UPDATE") &&
    req.data.Specialization_Code == null
  ) {
    req.error(
      400,
      "Specialization Code is mandatory.",
      "in/Specialization_Code",
    );
  }

  if (req.data.Specialization_Code != null) {
    const code = req.data.Specialization_Code.toString().trim().toUpperCase();

    req.data.Specialization_Code = code;

    if (validator.isEmpty(code)) {
      req.error(
        400,
        "Specialization Code is mandatory.",
        "in/Specialization_Code",
      );
    }

    if (!validator.isLength(code, { min: 2, max: 10 })) {
      req.error(
        400,
        "Specialization Code must be between 2 and 10 characters.",
        "in/Specialization_Code",
      );
    }

    const codePattern = /^[A-Z0-9-]+$/;

    if (!codePattern.test(code)) {
      req.error(
        400,
        "Specialization Code may contain only letters, numbers and hyphens.",
        "in/Specialization_Code",
      );
    }

    const existingCode = await tx.run(
      SELECT.one.from(Specializations).where({
        Specialization_Code: code,
        IsActiveEntity: true,
      }),
    );

    if (
      existingCode &&
      !(req.event === "UPDATE" && existingCode.ID === targetID)
    ) {
      req.error(
        400,
        `Specialization Code '${code}' is already registered.`,
        "in/Specialization_Code",
      );
    }
  }

  // ======================================================
  // Name Validation
  // ======================================================

  if (
    (req.event === "CREATE" || req.event === "UPDATE") &&
    req.data.Name == null
  ) {
    req.error(400, "Specialization Name is mandatory.", "in/Name");
  }

  let normalizedName = null;

  if (req.data.Name != null) {
    const name = toTitleCase(req.data.Name);

    req.data.Name = name;
    req.data.Normalized_Name = name.toLowerCase();

    normalizedName = req.data.Normalized_Name;

    if (validator.isEmpty(name)) {
      req.error(400, "Specialization Name is mandatory.", "in/Name");
    }

    if (!validator.isLength(name, { min: 2, max: 100 })) {
      req.error(
        400,
        "Specialization Name must be between 2 and 100 characters.",
        "in/Name",
      );
    }
  }

  // ======================================================
  // Department
  // ======================================================

  const departmentID = req.data.Department_ID || req.data.Department?.ID;

  if ((req.event === "CREATE" || req.event === "UPDATE") && !departmentID) {
    req.error(400, "Department is mandatory.", "in/Department");
  }

  if (departmentID) {
    const department = await tx.run(
      SELECT.one.from(Departments).where({
        ID: departmentID,
        IsActiveEntity: true,
      }),
    );

    if (!department) {
      req.error(400, "Selected Department does not exist.", "in/Department");
    }

    if (department.Status !== "Active") {
      req.error(400, "Selected Department is inactive.", "in/Department");
    }

    // ==========================================
    // Duplicate Name inside same Department
    // ==========================================

    if (normalizedName) {
      const duplicate = await tx.run(
        SELECT.one.from(Specializations).columns("ID").where({
          Department_ID: departmentID,
          Normalized_Name: normalizedName,
          IsActiveEntity: true,
        }),
      );

      if (duplicate && !(req.event === "UPDATE" && duplicate.ID === targetID)) {
        req.error(
          400,
          `Specialization '${req.data.Name}' already exists in this department.`,
          "in/Name",
        );
      }
    }
  }

  // ======================================================
  // Description
  // ======================================================

  if (req.data.Description != null) {
    const description = req.data.Description.toString().trim();

    req.data.Description = description === "" ? null : description;

    if (
      req.data.Description &&
      !validator.isLength(req.data.Description, { max: 100 })
    ) {
      req.error(
        400,
        "Description cannot exceed 100 characters.",
        "in/Description",
      );
    }
  }
};

module.exports = validateSpecialization;
