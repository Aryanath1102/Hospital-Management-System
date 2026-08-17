const cds = require("@sap/cds");
const { SELECT } = cds.ql;

const updateDoctorAvailability =
    require("../Actions/Doctor_Availability");

const runDoctorAvailabilityJob = async (tx) => {

    const Doctors = cds.entities("hospital").Doctors;

    const doctors = await tx.run(
        SELECT.from(Doctors)
            .columns(
                "ID",
                "Doctor_Status",
                "Availability"
            )
            .where({
                Doctor_Status: "Active"
            })
    );

    for (const doctor of doctors) {

        await updateDoctorAvailability(
            doctor.ID,
            tx
        );

    }
};

module.exports = runDoctorAvailabilityJob;