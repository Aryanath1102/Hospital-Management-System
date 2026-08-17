const cds = require("@sap/cds");
const { SELECT } = cds.ql;

const activateDoctor = require("./Actions/ActivateDoctor");
const suspendDoctor = require("./Actions/SuspendDoctor");
const retireDoctor = require("./Actions/RetireDoctor");
const approveLeave = require("./Actions/ApproveLeave");
const rejectLeave = require("./Actions/RejectLeave");
const cancelLeave = require("./Actions/CancelLeave");

// ---------------- Validators ----------------
const validateBuildings = require("./Validation/Buildings_Validation");
const validateDepartment = require("./Validation/Department_Validation");
const validateSpecialization = require("./Validation/Specialization_Validation");
const validateDoctor = require("./Validation/Doctor_Validation");
const validateDoctorSpecialization = require("./Validation/DoctorSpecialization_Validation");
const validateDoctorSchedule = require("./Validation/DoctorSchedule_Validation");
const validateDoctorLeave = require("./Validation/DoctorLeave_Validation");

// ---------------- Generators ----------------
const generateDoctorCode = require("./Generators/Doctor_Code_Generator");


module.exports = cds.service.impl(function () {

    const {
        Buildings,
        Departments,
        Specializations,
        Doctors,
        DoctorSpecializations,
        DoctorSchedules,
        DoctorLeaves
    } = this.entities;

    const { NumberRanges } = cds.entities("hospital");


    // =====================================================
    // Buildings
    // =====================================================

    this.before("CREATE", Buildings, async (req) => {
        await validateBuildings(req, Buildings);
    });

    this.before("UPDATE", Buildings, async (req) => {
        await validateBuildings(req, Buildings);
    });


    // =====================================================
    // Departments
    // =====================================================

    this.before("CREATE", Departments, async (req) => {
        await validateDepartment(
            req,
            Departments,
            Buildings
        );
    });

    this.before("UPDATE", Departments, async (req) => {
        await validateDepartment(
            req,
            Departments,
            Buildings
        );
    });


    // =====================================================
    // Specializations
    // =====================================================

    this.before("CREATE", Specializations, async (req) => {
        await validateSpecialization(
            req,
            Specializations,
            Departments
        );
    });

    this.before("UPDATE", Specializations, async (req) => {
        await validateSpecialization(
            req,
            Specializations,
            Departments
        );
    });


   // =====================================================
// Doctors - DEBUG
// =====================================================

this.before("CREATE", Doctors, async (req) => {

    console.log("======================================");
    console.log("CREATE Doctors");
    console.log("REQ DATA:", JSON.stringify(req.data, null, 2));

    await validateDoctor(req, Doctors);

    const firstName = (req.data.First_Name || "").trim();
    const lastName = (req.data.Last_Name || "").trim();

    if (firstName || lastName) {
        req.data.Full_Name = `Dr. ${firstName} ${lastName}`.trim();
    }

    console.log("GENERATED FULL_NAME:", req.data.Full_Name);

    if (!req.data.Doctor_Code) {
        await generateDoctorCode(req, NumberRanges);
    }

    console.log("FINAL CREATE DATA:", JSON.stringify(req.data, null, 2));
    console.log("======================================");
});


this.before("UPDATE", Doctors, async (req) => {

    console.log("======================================");
    console.log("UPDATE Doctors");
    console.log("REQ DATA:", JSON.stringify(req.data, null, 2));

    await validateDoctor(req, Doctors);

    const doctorID =
        req.data.ID ||
        req.params?.[0]?.ID;

    if (!doctorID) {
        return;
    }

    const existingDoctor = await cds.run(
        SELECT.one
            .from(Doctors)
            .where({ ID: doctorID })
    );

    console.log(
        "EXISTING DOCTOR:",
        JSON.stringify(existingDoctor, null, 2)
    );

    if (!existingDoctor) {
        return;
    }

    const firstName =
        (
            req.data.First_Name !== undefined
                ? req.data.First_Name
                : existingDoctor.First_Name
        || ""
        ).trim();

    const lastName =
        (
            req.data.Last_Name !== undefined
                ? req.data.Last_Name
                : existingDoctor.Last_Name
        || ""
        ).trim();

    if (firstName || lastName) {
        req.data.Full_Name =
            `Dr. ${firstName} ${lastName}`.trim();
    }

    console.log("GENERATED FULL_NAME:", req.data.Full_Name);
    console.log("FINAL UPDATE DATA:", JSON.stringify(req.data, null, 2));
    console.log("======================================");
});


// =====================================================
// Draft PATCH
// =====================================================

this.before("PATCH", Doctors.drafts, async (req) => {

    console.log("======================================");
    console.log("PATCH Doctors.drafts");
    console.log("REQ DATA:", JSON.stringify(req.data, null, 2));
    console.log("PARAMS:", JSON.stringify(req.params, null, 2));
    console.log("======================================");
});

    // =====================================================
    // Doctor Specializations
    // =====================================================

    this.before("CREATE", DoctorSpecializations, async (req) => {
        await validateDoctorSpecialization(
            req,
            DoctorSpecializations,
            Doctors,
            Specializations
        );
    });

    this.before("UPDATE", DoctorSpecializations, async (req) => {
        await validateDoctorSpecialization(
            req,
            DoctorSpecializations,
            Doctors,
            Specializations
        );
    });


    // =====================================================
    // Doctor Schedules
    // =====================================================

    this.before("CREATE", DoctorSchedules, async (req) => {
        await validateDoctorSchedule(
            req,
            DoctorSchedules,
            Doctors
        );
    });

    this.before("UPDATE", DoctorSchedules, async (req) => {
        await validateDoctorSchedule(
            req,
            DoctorSchedules,
            Doctors
        );
    });


    // =====================================================
    // Doctor Leaves
    // =====================================================

    this.before("CREATE", DoctorLeaves, async (req) => {
        await validateDoctorLeave(
            req,
            DoctorLeaves,
            Doctors
        );
    });

    this.before("UPDATE", DoctorLeaves, async (req) => {
        await validateDoctorLeave(
            req,
            DoctorLeaves,
            Doctors
        );
    });


    // =====================================================
    // Doctor Actions
    // =====================================================

    this.on(
        "ActivateDoctor",
        Doctors,
        activateDoctor
    );

    this.on(
        "SuspendDoctor",
        Doctors,
        suspendDoctor
    );

    this.on(
        "RetireDoctor",
        Doctors,
        retireDoctor
    );


    // =====================================================
    // Leave Actions
    // =====================================================

    this.on(
        "ApproveLeave",
        DoctorLeaves,
        approveLeave
    );

    this.on(
        "RejectLeave",
        DoctorLeaves,
        rejectLeave
    );

    this.on(
        "CancelLeave",
        DoctorLeaves,
        cancelLeave
    );

});