const cds = require("@sap/cds");
const { SELECT, UPDATE } = cds.ql;

const retireDoctor = async (req) => {

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
            .where({ ID: doctorID })
    );

    if (!doctor) {
        return req.error(
            404,
            "Doctor not found."
        );
    }

    if (doctor.Doctor_Status === 'Retired') {
        return req.error(400, "Doctor is already retired.")
    }
    await tx.run(UPDATE(Doctors).set({
        Doctor_Status: 'Retired',
        Availability: 'On_Leave'
    }).where({ ID: doctorID }))
    return req.notify(
        "Doctor retired successfully.");
}
module.exports = retireDoctor;