const cds = require("@sap/cds");
const { SELECT } = cds.ql;
const validator = require("validator");

const validateDoctorSpecialization = async (
    req,
    DoctorSpecializations,
    Doctors,
    Specializations,
) => {
    const tx = cds.tx(req);
    const doctorID = req.data.Doctor_ID || req.data.Doctor?.ID;
    const specializationID =
        req.data.Specializations_ID || req.data.Specializations?.ID;

    const targetID =
        req.data?.ID ||
        req.params?.[0]?.ID ||
        req.params?.[0];
    let doctor = null;
    // ======================================================
    // Doctor Validation
    // ======================================================
    if ((req.event === "CREATE" || req.event === "UPDATE") && !doctorID) {
        return req.error(400, "Doctor is mandatory.", "in/Doctor");
    }
    if (doctorID) {
        doctor = await tx.run(
            SELECT.one.from(Doctors).where({ ID: doctorID, IsActiveEntity: true }),
        );

        if (!doctor) {
            req.error(400, "Selected Doctor does not exist.", "in/Doctor");
        } else {
            switch (doctor.Doctor_Status) {
                case "Retired":
                    req.error(400, "Selected Doctor is retired.", "in/Doctor");
                    break;

                case "Suspended":
                    req.error(400, "Selected Doctor is suspended.", "in/Doctor");
                    break;

                case "Inactive":
                    req.error(400, "Selected Doctor is inactive.", "in/Doctor");
                    break;

                default:
                    break;
            }
        }
    }

    // ======================================================
    // Specialization Validation
    // ======================================================

    if ((req.event === "CREATE" || req.event === "UPDATE") && !specializationID) {
        return req.error(400, "Specialization is mandatory.", "in/Specialization");
    }
    if (specializationID) {
        const specialization = await tx.run(
            SELECT.one
                .from(Specializations)
                .where({ ID: specializationID, IsActiveEntity: true }),
        );

        if (!specialization) {
            return req.error(
                400,
                "Selected Specialization does not exist.",
                "in/Specialization",
            );
        } else {
            if (specialization.Status === "Inactive") {
                req.error(
                    400,
                    "Selected Specialization is inactive.",
                    "in/Specialization",
                );
            }
        }
    }

    // ======================================================
    // Duplicate Validation
    // ======================================================

    if (doctorID && specializationID) {
        const existing = await tx.run(
            SELECT.one.from(DoctorSpecializations).where({
                Doctor_ID: doctorID,
                Specializations_ID: specializationID,
                IsActiveEntity: true,
            }),
        );
        if (existing && !(req.event === "UPDATE" && existing.ID === targetID)) {
            req.error(
                400,
                "This specialization is already assigned to the selected doctor.",
                "in/Specializations",
            );
        }
    }

    // ======================================================
    // Primary Specialization Validation
    // ======================================================

    if (req.data.Primary_Specialization === true) {
        const existingPrimary = await tx.run(
            SELECT.one.from(DoctorSpecializations).where({
                Doctor_ID: doctorID,
                Primary_Specialization: true,
                IsActiveEntity: true,
            }),
        );
        if (
            existingPrimary &&
            !(req.event === "UPDATE" && existingPrimary.ID === targetID)
        ) {
            req.error(
                400,
                "The selected doctor already has a Primary Specialization.",
                "in/Primary_Specialization",
            );
        }
    }
    // ======================================================
    // Certification Date Validation
    // ======================================================
    if (req.data.Certification_Date != null) {
        const certificationDateStr = req.data.Certification_Date.toString().trim();
        if (!validator.isISO8601(certificationDateStr, { strict: true })) {
            req.error(400, 'Certification Date must be a valid date format (YYYY-MM-DD).', 'in/Certification_Date.');
        } else {
            const certificationDate = new Date(certificationDateStr);
            certificationDate.setHours(0, 0, 0, 0);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const minAllowedDate = new Date(1950, 0, 1)

            if (certificationDate > today) {
                req.error(400, 'Certification Date cannot be in future.', 'in/Certification_Date');

            }

            if (certificationDate < minAllowedDate) {
                req.error(400, 'Certification Date is invalid or too far in the past.', 'in/Certification_Date');
            }
        }
    } else if (req.event === 'CREATE') {
        req.error(400, 'Certification Date is mandatory.', 'in/Certification_Date');
    }

    // ======================================================
    // Experience In Specialization Validation
    // ======================================================

    if (req.data.Experience_In_Specialization != null) {

        const exp = Number(req.data.Experience_In_Specialization);

        if (Number.isNaN(exp)) {
          return  req.error(400, "Experience in Specialization must be a valid number.", 'in/Experience_In_Specialization');

        }

        if (exp < 0) {
            req.error(400, "Experience in Specialization cannot be negative", 'in/Experience_In_Specialization');

        }
        if (exp > 60) {
            req.error(400, "Experience in Specialization cannot exceed 60 years.", 'in/Experience_In_Specialization');

        }



        if (doctor && exp > doctor.Experience) {
            req.error(
                400,
                "Experience in Specialization cannot exceed the doctor's total experience.",
                "in/Experience_In_Specialization"
            );
        }

    } else if (req.event === 'CREATE') {
        return req.error(400, "Experience in specialization is mandatory.", 'in/Experience_In_Specialization');

    }

    
    // ======================================================
    // Remarks Validation
    // ======================================================


    if(req.data.Remarks !=null){
        const remarks = req.data.Remarks.toString().trim();
        req.data.Remarks = remarks === ""? null : remarks;
        
    }

};
