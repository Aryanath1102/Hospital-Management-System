const cds = require("@sap/cds");
const { SELECT, UPDATE } = cds.ql;

const cancelLeave = async (req) => {

    const tx = cds.tx(req);
    const DoctorLeaves = req.target;

    const leaveID = req.params?.[0]?.ID || req.params?.[0];

    if (!leaveID) {
        return req.error(400, "Leave Id is mandatory.")
    }

    const leave = await tx.run(
        SELECT.one
            .from(DoctorLeaves)
            .columns("ID", "Doctor_ID", "LeaveStatus", "From_Date", "To_Date")
            .where({ ID: leaveID })
    );

    if (!leave) {
        return req.error(404, "Leave not found.")
    }
   
    switch (leave.LeaveStatus) {
        case "Cancelled":
            return req.error(400, "Leave is already cancelled.");
            break;
        case "Rejected":
            return req.error(400, "Rejected leave cannot be cancelled.");
            break;
        case "Approved":
            return req.error(400, "Approved leave cannot be cancelled.");
            break;

        default: break;
    }

    await tx.run(UPDATE(DoctorLeaves).set({ LeaveStatus: "Cancelled" }).where({ ID: leaveID }));


    return req.notify("Leave cancelled successfully.");

}
module.exports = cancelLeave;