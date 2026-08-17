const cds = require("@sap/cds");
const { SELECT, UPDATE } = cds.ql;

const activateDoctor = async (req) => {

    const tx = cds.tx(req);
    const Doctors = req.target;

    const doctorID =
        req.params?.[0]?.ID ||
        req.params?.[0];

    if (!doctorID) {
        return req.error(400, "Doctor ID is mandatory.");
    }

    // ======================================================
    // Fetch Doctor
    // ======================================================

    const doctor = await tx.run(
        SELECT.one
            .from(Doctors)
            .columns(
                "ID",
                "Doctor_Status",
                "Availability"
            )
            .where({ ID: doctorID})
    );

    if (!doctor) {
        return req.error(
            404,
            "Doctor not found."
        );
    }

    // ======================================================
    // Business Validations
    // ======================================================

    if (doctor.Doctor_Status === "Retired") {
        return req.error(
            400,
            "Retired doctor cannot be activated."
        );
    }

    if (doctor.Doctor_Status === "Active") {
        return req.error(
            400,
            "Doctor is already Active."
        );
    }
    if (
        doctor.Doctor_Status === "Inactive" &&
        doctor.Availability !== "Available"
    ) {
        return req.error(
            400,
            `Doctor cannot be activated because the current availability is '${doctor.Availability}'. Please correct the doctor's availability first.`
        );
    }
    // ======================================================
    // Activate Doctor
    // ======================================================

    await tx.run(
        UPDATE(Doctors)
            .set({
                Doctor_Status: "Active",
                Availability: "Available"
            })
            .where({ ID: doctorID })
    );

    return req.notify(
        "Doctor activated successfully."
    );

};

module.exports = activateDoctor;