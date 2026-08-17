const cds = require("@sap/cds");
const { SELECT } = cds.ql;
const validator = require("validator");
const validateBuildings = async (req, Buildings) => {
    const targetID =
        req.data?.ID ||
        (typeof req.params?.[0] === "object"
            ? req.params?.[0]?.ID
            : req.params?.[0]);
const tx = cds.tx(req);



    // =========================================================
    // 1. Building Code VALIDATION
    // =========================================================

    if (req.data.Building_Code != null) {
        const buildCode = req.data.Building_Code.toString().trim().toUpperCase();
        req.data.Building_Code = buildCode;

        if (validator.isEmpty(buildCode)) {
            req.error(400, "Building Code is mandatory.", "in/Building_Code");
        }
        if (!validator.isLength(buildCode, { min: 2, max: 10 })) {
            req.error(400, "Building Code must be between 2 and 10 characters", "in/Building_Code");
        } else if (!validator.isAlphanumeric(buildCode, "en-US")) {
            req.error(
                400,
                "Building Code must contain only letters and numbers.",
                "in/Building_Code",
            );
        }
        const existing = await tx.run(
            SELECT.one.from(Buildings).where({
                Building_Code: buildCode,
                IsActiveEntity: true,
            }),
        );
        if (existing && !(req.event === "UPDATE" && existing.ID === targetID)) {
            req.error(
                400,
                `Building Code '${buildCode}' already exists.`,
                "in/Building_Code",
            );
        }

    }
    else if (req.event === "CREATE") {
        req.error(400, "Building Code is mandatory.", "in/Building_Code");
    }

    // =========================================================
    // 2. Building Name VALIDATION
    // =========================================================
    if (req.data.Building_Name != null) {
        const buildName = req.data.Building_Name.toString().trim();
        req.data.Building_Name = buildName;

         if (validator.isEmpty(buildName)) {
            req.error(400, "Building Name is mandatory.", "in/Building_Name");
        }
        if (!validator.isLength(buildName, { min: 2, max: 100 })) {
            req.error(400, "Building Name must be between 2 and 100 characters", "in/Building_Name");
        } 
        const existing = await tx.run(
            SELECT.one.from(Buildings).where({
                Building_Name: buildName,
                IsActiveEntity: true,
            }),
        );
        if (existing && !(req.event === "UPDATE" && existing.ID === targetID)) {
            req.error(
                400,
                `Building Name '${buildName}' already exists.`,
                "in/Building_Name",
            );
        }

    }
    else if (req.event === "CREATE") {
        req.error(400, "Building Name is mandatory.", "in/Building_Name");
    }

    // =========================================================
    // 3. Description VALIDATION
    // =========================================================
    if (req.data.Description != null) {

    const desc = req.data.Description.toString().trim();
    req.data.Description = desc;

    if(!validator.isLength(desc,{max:100})){
        req.error(400,"Description cannot exceed 100 characters..")
    }
    
    }

}
