const cds = require("@sap/cds");
const { SELECT } = cds.ql;
const validator = require("validator");

const validateDepartment = async (req, Departments,Buildings) => {
  const tx = cds.tx(req);

  // Extract target ID for draft or active UPDATE checks
  const targetID =
    req.data?.ID ||
    (typeof req.params?.[0] === "object"
      ? req.params?.[0]?.ID
      : req.params?.[0]);

  // =========================================================
  // 1. DEPARTMENT CODE VALIDATION
  // =========================================================
  if (req.data.Department_Code != null) {
    const deptCode = req.data.Department_Code.toString().trim().toUpperCase();
    req.data.Department_Code = deptCode;

    if (validator.isEmpty(deptCode)) {
      req.error(400, "Department Code is mandatory.", "in/Department_Code");
    } else if (!validator.isLength(deptCode, { min: 2, max: 10 })) {
      req.error(
        400,
        "Department Code must be between 2 and 10 characters.",
        "in/Department_Code",
      );
    } else if (!validator.isAlphanumeric(deptCode, "en-US")) {
      req.error(
        400,
        "Department Code must contain only letters and numbers.",
        "in/Department_Code",
      );
    }

    const existing = await tx.run(
      SELECT.one.from(Departments).where({
        Department_Code: deptCode,
        IsActiveEntity: true,
      }),
    );

    if (existing && !(req.event === "UPDATE" && existing.ID === targetID)) {
      req.error(
        400,
        `Department Code '${deptCode}' already exists.`,
        "in/Department_Code",
      );
    }
  } else if (req.event === "CREATE") {
    req.error(400, "Department Code is mandatory.", "in/Department_Code");
  }

  // =========================================================
  // 2. DEPARTMENT NAME VALIDATION
  // =========================================================
  if (req.data.Department_Name != null) {
    const deptName = req.data.Department_Name.toString().trim();
    req.data.Department_Name = deptName;

    if (validator.isEmpty(deptName)) {
      req.error(400, "Department Name is mandatory.", "in/Department_Name");
    } else if (!validator.isLength(deptName, { min: 2, max: 100 })) {
      req.error(
        400,
        "Department Name must be between 2 and 100 characters.",
        "in/Department_Name",
      );
    } else if (!validator.isAlpha(deptName, "en-US", { ignore: " -" })) {
      req.error(
        400,
        "Department Name should contain only letters, spaces and hyphens.",
        "in/Department_Name",
      );
    }

    const existing = await tx.run(
      SELECT.one.from(Departments).where({
        Department_Name: deptName,
        IsActiveEntity: true,
      }),
    );

    if (existing && !(req.event === "UPDATE" && existing.ID === targetID)) {
      req.error(
        400,
        `Department Name '${deptName}' already exists.`,
        "in/Department_Name",
      );
    }
  } else if (req.event === "CREATE") {
    req.error(400, "Department Name is mandatory.", "in/Department_Name");
  }
  // =========================================================
  // 3. PHONE EXTENSION VALIDATION
  // =========================================================
  if (req.data.Phone_Extension != null) {
    const phoneExt = req.data.Phone_Extension.toString().trim();
    req.data.Phone_Extension = phoneExt;

    if (validator.isEmpty(phoneExt)) {
      req.error(400, "Phone Extension is mandatory.", "in/Phone_Extension");
    } else if (!validator.isNumeric(phoneExt, { no_symbols: true })) {
      req.error(
        400,
        "Phone Extension must be a valid number.",
        "in/Phone_Extension",
      );
    } else if (!validator.isLength(phoneExt, { min: 3, max: 5 })) {
      req.error(
        400,
        "Phone Extension must be between 3 and 5 digits.",
        "in/Phone_Extension",
      );
    }

    const existing = await tx.run(
      SELECT.one
        .from(Departments)
        .where({ Phone_Extension: phoneExt, IsActiveEntity: true }),
    );
    if (existing && !(req.event === "UPDATE" && existing.ID === targetID)) {
      req.error(
        400,
        `Phone Extension '${phoneExt}' is already registered.`,
        "in/Phone_Extension",
      );
    }
  } else if (req.event === "CREATE") {
    req.error(400, "Phone Extension is mandatory.", "in/Phone_Extension");
  }

  // =========================================================
  // 4. HEAD OF DEPARTMENT VALIDATION
  // =========================================================
  if (req.data.Head_of_Department != null) {
    const hod = req.data.Head_of_Department.toString().trim();
    req.data.Head_of_Department = hod;

    if (validator.isEmpty(hod)) {
      req.error(
        400,
        "Head of Department is mandatory.",
        "in/Head_of_Department",
      );
    } else if (!validator.isLength(hod, { min: 3, max: 50 })) {
      req.error(
        400,
        "Head of Department must be between 3 and 50 characters.",
        "in/Head_of_Department",
      );
    } else if (!validator.isAlpha(hod, "en-US", { ignore: " -'" })) {
      req.error(
        400,
        "Head of Department should contain only letters, spaces, hyphens and apostrophes.",
        "in/Head_of_Department",
      );
    }

    const existing = await tx.run(
      SELECT.one.from(Departments).where({
        Head_of_Department: hod,
        IsActiveEntity: true,
      }),
    );

    if (existing && !(req.event === "UPDATE" && existing.ID === targetID)) {
      req.error(
        400,
        `Head of Department '${hod}' is already assigned to another department.`,
        "in/Head_of_Department",
      );
    }
  } else if (req.event === "CREATE") {
    req.error(400, "Head of Department is mandatory.", "in/Head_of_Department");
  }

  // =========================================================
  // 5. BUILDING ASSOCIATION VALIDATION
  // =========================================================
  // Handle both raw foreign key 'Building_ID' and expanded object 'Building.ID'
  const buildingId = req.data.Building_ID || req.data.Building?.ID;

  if (buildingId) {
    const existingBuilding = await tx.run(
      SELECT.one.from(Buildings).where({ ID: buildingId }),
    );

    if (!existingBuilding) {
      req.error(400, "Selected Building does not exist.", "in/Building_ID");
    } else if (existingBuilding.Status === "Inactive") {
      req.error(
        400,
        "Selected Building is currently Inactive.",
        "in/Building_ID",
      );
    }
  } else if (req.event === "CREATE") {
    req.error(400, "Building is mandatory.", "in/Building_ID");
  }

  // =========================================================
  // 6. FLOOR VALIDATION
  // =========================================================
  if (req.data.floor != null) {
    const floorVal = req.data.floor.toString().trim();
    req.data.floor = floorVal;

    if (validator.isEmpty(floorVal)) {
      req.error(400, "Floor is mandatory.", "in/floor");
    } else if (!validator.isLength(floorVal, { min: 1, max: 10 })) {
      req.error(400, "Floor must be between 1 and 10 characters.", "in/floor");
    } else if (!validator.isAlphanumeric(floorVal, "en-US")) {
      req.error(
        400,
        "Floor must contain only letters, numbers, hyphens, or underscores.",
        "in/floor",
      );
    }
  } else if (req.event === "CREATE") {
    req.error(400, "Floor is mandatory.", "in/floor");
  }
};

module.exports = validateDepartment;
