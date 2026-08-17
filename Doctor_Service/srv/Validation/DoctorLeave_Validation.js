const cds = require("@sap/cds");
const { SELECT } = cds.ql;
const validator = require("validator");

const validateDoctorLeave = async (
    req,
    DoctorLeaves,
    Doctors
) => {

    const tx = cds.tx(req);

    const doctorID =
        req.data.Doctor_ID ||
        req.data.Doctor?.ID;

    const targetID =
        req.data?.ID ||
        req.params?.[0]?.ID ||
        req.params?.[0];

    let doctor = null;

    // ======================================================
    // Doctor Validation
    // ======================================================

    if (
        (req.event === "CREATE" || req.event === "UPDATE") &&
        !doctorID
    ) {
        return req.error(
            400,
            "Doctor is mandatory.",
            "in/Doctor"
        );
    }

    if (doctorID) {

        doctor = await tx.run(
            SELECT.one
                .from(Doctors)
                .where({
                    ID: doctorID,
                    IsActiveEntity: true
                })
        );

        if (!doctor) {

            return req.error(
                400,
                "Selected Doctor does not exist.",
                "in/Doctor"
            );

        }

        switch (doctor.Doctor_Status) {

            case "Retired":

                req.error(
                    400,
                    "Selected Doctor is retired.",
                    "in/Doctor"
                );
                break;

            case "Suspended":

                req.error(
                    400,
                    "Selected Doctor is suspended.",
                    "in/Doctor"
                );
                break;

            case "Inactive":

                req.error(
                    400,
                    "Selected Doctor is inactive.",
                    "in/Doctor"
                );
                break;

            default:
                break;
        }
    }
    // ======================================================
    // From Date Validation
    // ======================================================

    if (req.data.From_Date != null) {

        const fromDateStr = req.data.From_Date.toString().trim();

        if (!validator.isISO8601(fromDateStr, { strict: true })) {

            req.error(
                400,
                "From Date must be a valid date (YYYY-MM-DD).",
                "in/From_Date"
            );

        } else {

            const fromDate = new Date(fromDateStr);
            fromDate.setHours(0, 0, 0, 0);

            const minAllowedDate = new Date(1950, 0, 1);

            if (fromDate < minAllowedDate) {

                req.error(
                    400,
                    "From Date is invalid or too far in the past.",
                    "in/From_Date"
                );

            }

        }

    } else if (req.event === "CREATE") {

        req.error(
            400,
            "From Date is mandatory.",
            "in/From_Date"
        );

    }
    // ======================================================
    // To Date Validation
    // ======================================================

    if (req.data.To_Date != null) {

        const toDateStr = req.data.To_Date.toString().trim();

        if (!validator.isISO8601(toDateStr, { strict: true })) {

            req.error(
                400,
                "To Date must be a valid date (YYYY-MM-DD).",
                "in/To_Date"
            );

        } else {

            const toDate = new Date(toDateStr);
            toDate.setHours(0, 0, 0, 0);

            const minAllowedDate = new Date(1950, 0, 1);

            if (toDate < minAllowedDate) {

                req.error(
                    400,
                    "To Date is invalid or too far in the past.",
                    "in/To_Date"
                );

            }

        }

    } else if (req.event === "CREATE") {

        req.error(
            400,
            "To Date is mandatory.",
            "in/To_Date"
        );

    }

    // ======================================================
    // Date Range Validation
    // ======================================================

    let effectiveFromDate = req.data.From_Date;
    let effectiveToDate = req.data.To_Date;

    if (req.event === "UPDATE" && targetID) {

        const existingLeave = await tx.run(
            SELECT.one
                .from(DoctorLeaves)
                .where({ ID: targetID })
        );

        if (existingLeave) {

            effectiveFromDate =
                effectiveFromDate || existingLeave.From_Date;

            effectiveToDate =
                effectiveToDate || existingLeave.To_Date;
        }
    }

    if (effectiveFromDate && effectiveToDate) {

        const fromDate = new Date(effectiveFromDate);
        const toDate = new Date(effectiveToDate);

        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(0, 0, 0, 0);

        if (toDate < fromDate) {

            req.error(
                400,
                "To Date cannot be earlier than From Date.",
                "in/To_Date"
            );

        }

    }
    // ======================================================
    // To Date Validation
    // ======================================================

    if (req.data.To_Date != null) {

        const toDateStr = req.data.To_Date.toString().trim();

        if (!validator.isISO8601(toDateStr, { strict: true })) {

            req.error(
                400,
                "To Date must be a valid date (YYYY-MM-DD).",
                "in/To_Date"
            );

        } else {

            const toDate = new Date(toDateStr);
            toDate.setHours(0, 0, 0, 0);

            const minAllowedDate = new Date(1950, 0, 1);

            if (toDate < minAllowedDate) {

                req.error(
                    400,
                    "To Date is invalid or too far in the past.",
                    "in/To_Date"
                );

            }

        }

    } else if (req.event === "CREATE") {

        req.error(
            400,
            "To Date is mandatory.",
            "in/To_Date"
        );

    }

    // ======================================================
    // Date Range Validation
    // ======================================================


    if (req.event === "UPDATE" && targetID) {

        const existingLeave = await tx.run(
            SELECT.one
                .from(DoctorLeaves)
                .where({ ID: targetID })
        );

        if (existingLeave) {

            effectiveFromDate =
                effectiveFromDate || existingLeave.From_Date;

            effectiveToDate =
                effectiveToDate || existingLeave.To_Date;
        }
    }

    if (effectiveFromDate && effectiveToDate) {

        const fromDate = new Date(effectiveFromDate);
        const toDate = new Date(effectiveToDate);

        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(0, 0, 0, 0);

        if (toDate < fromDate) {

            req.error(
                400,
                "To Date cannot be earlier than From Date.",
                "in/To_Date"
            );

        }

    }

    // ======================================================
    // Leave Overlap Validation
    // ======================================================

    if (doctorID && effectiveFromDate && effectiveToDate) {

        const overlappingLeave = await tx.run(
            SELECT.one
                .from(DoctorLeaves)
                .where({
                    Doctor_ID: doctorID,
                    LeaveStatus: "Approved"
                })
                .and(`From_Date <=`, effectiveToDate)
                .and(`To_Date >=`, effectiveFromDate)
        );

        if (
            overlappingLeave &&
            !(req.event === "UPDATE" && overlappingLeave.ID === targetID)
        ) {
            req.error(
                400,
                "The doctor already has an approved leave that overlaps with this date range.",
                "in/From_Date"
            );
        }
    }
    // ======================================================
    // Reason Validation
    // ======================================================

    if (req.data.Reason != null) {

        const reason = req.data.Reason.toString().trim();

        req.data.Reason = reason;

        if (validator.isEmpty(reason)) {

            req.error(
                400,
                "Reason is mandatory.",
                "in/Reason"
            );

        }
        else if (!validator.isLength(reason, { min: 5, max: 200 })) {

            req.error(
                400,
                "Reason must be between 5 and 200 characters.",
                "in/Reason"
            );

        }

    }
    else if (req.event === "CREATE") {

        req.error(
            400,
            "Reason is mandatory.",
            "in/Reason"
        );

    }    // ======================================================
    // Leave Status Validation
    // ======================================================

    if (
        req.data.LeaveStatus == null &&
        req.event === "CREATE"
    ) {

        req.error(
            400,
            "Leave Status is mandatory.",
            "in/LeaveStatus"
        );

    }

};

module.exports = validateDoctorLeave;