const cds = require("@sap/cds");
const { SELECT } = cds.ql;
const validator = require("validator");

const validateDoctorSchedule = async (req, DoctorSchedules, Doctors) => {
  const tx = cds.tx(req);

  // Extract target ID for draft or active UPDATE checks
  const targetID =
    req.data?.ID ||
    (typeof req.params?.[0] === "object"
      ? req.params?.[0]?.ID
      : req.params?.[0]);

  // =========================================================
  // 1. DOCTOR VALIDATION
  // =========================================================
  const doctorId = req.data.Doctor_ID || req.data.Doctor?.ID;

  if (doctorId) {
    const existingDoctor = await tx.run(
      SELECT.one.from(Doctors).where({ ID: doctorId, IsActiveEntity: true })
    );

    if (!existingDoctor) {
      req.error(404, `Doctor with ID '${doctorId}' does not exist.`, "in/Doctor_ID");
    } else {
      const status = (existingDoctor.Doctor_Status || "").toUpperCase();

      if (status === "INACTIVE") {
        req.error(400, "Cannot assign schedule. Doctor is currently Inactive.", "in/Doctor_ID");
      } else if (status === "SUSPENDED") {
        req.error(400, "Cannot assign schedule. Doctor is currently Suspended.", "in/Doctor_ID");
      } else if (status === "RETIRED") {
        req.error(400, "Cannot assign schedule. Doctor is Retired.", "in/Doctor_ID");
      } else if (status !== "ACTIVE") {
        req.error(
          400,
          `Cannot assign schedule. Doctor status is '${existingDoctor.Doctor_Status}'. Doctor must be Active.`,
          "in/Doctor_ID"
        );
      }
    }
  } else if (req.event === "CREATE") {
    req.error(400, "Doctor selection is mandatory.", "in/Doctor_ID");
  }

  // =========================================================
  // 2. DAY VALIDATION
  // =========================================================
  if (req.data.Day != null) {
    const day = req.data.Day.toString().trim();
    req.data.Day = day;

    if (validator.isEmpty(day)) {
      req.error(400, "Day is mandatory.", "in/Day");
    }
  } else if (req.event === "CREATE") {
    req.error(400, "Day is mandatory.", "in/Day");
  }

  // =========================================================
  // 3. START TIME VALIDATION
  // =========================================================
  if (req.data.Start_Time != null) {
    const startTime = req.data.Start_Time.toString().trim();
    req.data.Start_Time = startTime;

    if (validator.isEmpty(startTime)) {
      req.error(400, "Start Time is mandatory.", "in/Start_Time");
    }
  } else if (req.event === "CREATE") {
    req.error(400, "Start Time is mandatory.", "in/Start_Time");
  }

  // =========================================================
  // 4. END TIME VALIDATION
  // =========================================================
  if (req.data.End_Time != null) {
    const endTime = req.data.End_Time.toString().trim();
    req.data.End_Time = endTime;

    if (validator.isEmpty(endTime)) {
      req.error(400, "End Time is mandatory.", "in/End_Time");
    }
  } else if (req.event === "CREATE") {
    req.error(400, "End Time is mandatory.", "in/End_Time");
  }


  // Resolve effective values for PATCH / UPDATE operations
  let effectiveDoctorID = doctorId;
  let effectiveDay = req.data.Day;
  let effectiveStart = req.data.Start_Time;
  let effectiveEnd = req.data.End_Time;

  if (req.event === "UPDATE" && targetID) {
    const existingRecord = await tx.run(
      SELECT.one.from(DoctorSchedules).where({ ID: targetID })
    );

    if (existingRecord) {
      effectiveDoctorID = effectiveDoctorID || existingRecord.Doctor_ID;
      effectiveDay = effectiveDay || existingRecord.Day;
      effectiveStart = effectiveStart || existingRecord.Start_Time;
      effectiveEnd = effectiveEnd || existingRecord.End_Time;
    }
  }

  // =========================================================
  // 5. END TIME > START TIME VALIDATION
  // =========================================================
  if (effectiveStart && effectiveEnd) {
    if (effectiveEnd <= effectiveStart) {
      req.error(
        400,
        `End Time (${effectiveEnd}) must be strictly after Start Time (${effectiveStart}).`,
        "in/End_Time"
      );
      return;
    }
  }

  if (!effectiveDoctorID || !effectiveDay || !effectiveStart || !effectiveEnd) {
    return;
  }

  // Fetch all active schedules for the same Doctor and Day
  const existingSchedules = await tx.run(
    SELECT.from(DoctorSchedules).where({
      Doctor_ID: effectiveDoctorID,
      Day: effectiveDay,
      IsActiveEntity: true,
    })
  );

  // Exclude current record when updating
  const otherSchedules = existingSchedules.filter((s) => s.ID !== targetID);

  // =========================================================
// 6. DUPLICATE SCHEDULE VALIDATION
// =========================================================

const isExactDuplicate = otherSchedules.some(
    (s) =>
        s.Start_Time === effectiveStart &&
        s.End_Time === effectiveEnd
);

if (isExactDuplicate) {
    req.error(
        400,
        `An identical schedule (${req.data.Start_Time} - ${req.data.End_Time}) already exists for this doctor on ${req.data.Day}.`,
        "in/Start_Time"
    );
    return;
}

// =========================================================
// 7. OVERLAPPING SCHEDULE VALIDATION
// =========================================================

const overlappingSchedule = otherSchedules.find(
    (s) =>
        effectiveStart < s.End_Time &&
        effectiveEnd > s.Start_Time
);

if (overlappingSchedule) {
    req.error(
        400,
        `Schedule (${req.data.Start_Time} - ${req.data.End_Time}) overlaps with an existing schedule (${overlappingSchedule.Start_Time} - ${overlappingSchedule.End_Time}) on ${req.data.Day}.`,
        "in/Start_Time"
    );
}
};

module.exports = validateDoctorSchedule;