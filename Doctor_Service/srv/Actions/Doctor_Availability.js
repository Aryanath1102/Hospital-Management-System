const cds = require("@sap/cds");
const { SELECT, UPDATE } = cds.ql;

const updateDoctorAvailability = async (doctorID, tx) => {

    if (!doctorID) {
        return;
    }

    const Doctors = cds.entities("hospital").Doctors;
    const DoctorLeaves = cds.entities("hospital").DoctorLeaves;

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
        return;
    }

    // ======================================================
    // Doctor Status Validation
    // ======================================================

    if (
        doctor.Doctor_Status === "Inactive" ||
        doctor.Doctor_Status === "Suspended" ||
        doctor.Doctor_Status === "Retired"
    ) {
        return;
    }

    // ======================================================
    // Current Date
    // ======================================================

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ======================================================
    // Fetch Approved Leaves
    // ======================================================

    const approvedLeaves = await tx.run(
        SELECT.from(DoctorLeaves)
            .columns(
                "ID",
                "From_Date",
                "To_Date",
                "LeaveStatus"
            )
            .where({
                Doctor_ID: doctorID,
                LeaveStatus: "Approved"
            })
    );

    // ======================================================
    // Check Active Leave
    // ======================================================

    const activeLeave = approvedLeaves.find((leave) => {

        const fromDate = new Date(leave.From_Date);
        const toDate = new Date(leave.To_Date);

        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(0, 0, 0, 0);

        return today >= fromDate && today <= toDate;
    });

    // ======================================================
    // Doctor is currently on approved leave
    // ======================================================

    if (activeLeave) {

        if (doctor.Availability !== "On_Leave") {

            await tx.run(
                UPDATE(Doctors)
                    .set({
                        Availability: "On_Leave"
                    })
                    .where({ ID: doctorID })
            );
        }

        return;
    }

    // ======================================================
    // No Active Leave
    // ======================================================

    if (doctor.Availability === "On_Leave") {

        await tx.run(
            UPDATE(Doctors)
                .set({
                    Availability: "Available"
                })
                .where({ ID: doctorID })
        );
    }
};

module.exports = updateDoctorAvailability;