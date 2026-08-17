const cds = require("@sap/cds");
const { SELECT, UPDATE } = cds.ql;

const approveLeave = async (req) => {
  const tx = cds.tx(req);
  const DoctorLeaves = req.target;

  const leaveId = req.params?.[0]?.ID || req.params?.[0];

  if (!leaveId) {
    return req.error(400, "Leave ID is mandatory.");
  }

  const leave = await tx.run(
    SELECT.one
      .from(DoctorLeaves)
      .columns("ID", "Doctor_ID", "LeaveStatus", "From_Date", "To_Date")
      .where({ ID: leaveId }),
  );

  if (!leave) {
    return req.error(404, "Leave not found.");
  }

  const Doctors = cds.entities("hospital").Doctors;
  const doctor = await tx.run(
    SELECT.one
      .from(Doctors)
      .columns("ID", "Doctor_Status", "Availability")
      .where({ ID: leave.Doctor_ID }),
  );

  if (!doctor) {
    return req.error(404, "Doctor not found.");
  }

  switch (doctor.Doctor_Status) {
    case "Retired":
      return req.error(400, "Cannot approve leave for a retired doctor.");

    case "Suspended":
      return req.error(400, "Cannot approve leave for a suspended doctor.");

    case "Inactive":
      return req.error(400, "Cannot approve leave for an inactive doctor.");

    default:
      break;
  }
  switch (leave.LeaveStatus) {
    case "Approved":
      return req.error(400, "Leave is already approved.");

    case "Rejected":
      return req.error(400, "Rejected leave cannot be approved.");

    case "Cancelled":
      return req.error(400, "Cancelled leave cannot be approved.");

    default:
      break;
  }
  await tx.run(
    UPDATE(DoctorLeaves)
      .set({ LeaveStatus: "Approved" })
      .where({ ID: leaveId }),
  );
 

  return req.notify("Leave approved successfully.");
};
module.exports=approveLeave;