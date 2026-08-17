const validator = require('validator');
const cds = require('@sap/cds');
const { SELECT } = require('@sap/cds/lib/ql/cds-ql');
const { message } = require('@sap/cds/lib/log/cds-error');

async function validatePatient(req, Patients) {

  const targetID = req.data?.ID || (req.params && (req.params[0]?.ID || req.params[0]));

  // 1. Age Validation
  if (req.data.age !== undefined && req.data.age !== null) {
    if (req.data.age < 0) return req.error(400, "Age cannot be negative.");
  } else if (req.event === 'CREATE') {
    return req.error(400, "Age is Mandatory.");
  }

  // 2. Phone Validation
  if (req.data.phone !== undefined && req.data.phone !== null) {
    const phone = req.data.phone.toString().trim();

    if (!phone || validator.isEmpty(phone))
      return req.error(400, "Phone Number is mandatory.");

    if (!validator.isNumeric(phone, { no_symbols: true }))
      return req.error(400, "Phone number must contain digits only.");

    if (!validator.isLength(phone, { min: 10, max: 10 }))
      return req.error(400, "Phone number must be exactly 10 digits long.");

    const existingPhone = await SELECT.one.from(Patients).where({ phone });

    // Compare with targetID instead of req.data.ID
    if (existingPhone && !(req.event === 'UPDATE' && existingPhone.ID === targetID)) {
      return req.error(400, `Phone number ${phone} is already registered.`);
    }
  } else if (req.event === 'CREATE') {
    return req.error(400, "Phone Number is mandatory.");
  }

  // 3. Email Validation
  if (req.data.email !== undefined && req.data.email !== null) {
    const emailID = req.data.email.toString().trim();

    if (!emailID || !validator.isEmail(emailID)) return req.error(400, "Email is not valid.");

    const existingEmail = await SELECT.one.from(Patients).where({ email: emailID });

    if (existingEmail && !(req.event === 'UPDATE' && existingEmail.ID === targetID)) {
      return req.error(400, `Email Id ${emailID} is already registered.`);
    }
  } else if (req.event === 'CREATE') {
    return req.error(400, "Email is required.");
  }

  //  =============== 4. FIRST NAME VALIDATION ===============
  if (req.data.firstName !== undefined && req.data.firstName !== null) {
    const firstName = req.data.firstName.toString().trim();

    if (!firstName) {
      return req.error(400, "First name is required.");
    }

    if (!validator.isAlpha(firstName, 'en-US', { ignore: " -'" })) {
      return req.error(400, "First name must contain letters only.");
    }
  } else if (req.event === 'CREATE') {
    return req.error(400, "First name is mandatory.");
  }

  // =============== 5. LAST NAME VALIDATION ===============
  if (req.data.lastName !== undefined && req.data.lastName !== null) {
    const lastName = req.data.lastName.toString().trim();

    if (!lastName || validator.isEmpty(lastName)) {
      return req.error(400, "Last name is mandatory.");
    }

    if (!validator.isAlpha(lastName, 'en-US', { ignore: " -'" })) {
      return req.error(400, "Last name must contain letters only.");
    }


  } else if (req.event === 'CREATE') {
    return req.error(400, "Last name is mandatory.");
  }


  // -----------6. Blood Group Validation----------
  const validBloodGroups = [
    "A+", "A-",
    "B+", "B-",
    "AB+", "AB-",
    "O+", "O-"
  ];
  if (req.data.bloodGroup !== undefined && req.data.bloodGroup !== null) {
    const bloodGroup = req.data.bloodGroup.toString().trim().toUpperCase();

    if (!bloodGroup) {
      return req.error(400, 'Blood Group is Mandatory.')
    }
    if (!validBloodGroups.includes(bloodGroup)) {
      return req.error(400, "Invalid Blood Group. Allowed values are A+, A-, B+, B-, AB+, AB-, O+, O-.")
    }
  } else if (req.event === 'CREATE') {
    return req.error(400, "Blood Group is mandatory.")
  }

  // =============== 7. EMERGENCY NAME VALIDATION ===============
  if (req.data.emergencyName !== undefined && req.data.emergencyName !== null) {

    const emergencyName = req.data.emergencyName.toString().trim();

    if (!emergencyName) {
      return req.error(400, "Emergency Contact Name is mandatory.");
    }

    if (!validator.isAlpha(emergencyName, 'en-US', { ignore: " -'" })) {
      return req.error(
        400,
        "Emergency Contact Name must contain letters only."
      );
    }

  } else if (req.event === 'CREATE') {
    return req.error(400, "Emergency Contact Name is mandatory.");
  }
  // =============== 8. EMERGENCY PHONE VALIDATION ===============
  if (req.data.emergencyPhone !== undefined && req.data.emergencyPhone !== null) {

    const emergencyPhone = req.data.emergencyPhone.toString().trim();

    if (!emergencyPhone) {
      return req.error(400, "Emergency Contact Number is mandatory.")
    }
    if (!validator.isNumeric(emergencyPhone, { no_symbols: true })) {
      return req.error(400, "Emergency Contact Number should only contains digits.")
    }
    if (!validator.isLength(emergencyPhone, { max: 10, min: 10 })) {
      return req.error(400, "Emergency Contact Number must be 10 digits")
    }
  } else if (req.event === 'CREATE') {
    return req.error(400, "Emergency Contact Number is mandatory.")
  }
  // =============== 9. PATIENT PHONE & EMERGENCY PHONE SHOULD NOT MATCH ===============
  if (req.data.phone && req.data.emergencyPhone &&
    req.data.phone.toString().trim() === req.data.emergencyPhone.toString().trim()) {
    return req.error(400, "Emergency Contact Number cannot be the same as Patient Phone Number."
    )
  }
// =============== 10. GENDER REMARK VALIDATION ===============
if (req.data.gender === "Other") {

  const remark = req.data.genderRemark?.toString().trim();

  if (!remark) {
    return req.error(
      400,
      "Gender Remark is mandatory when Gender is Other."
    );
  }

  if (remark.length > 50) {
    return req.error(
      400,
      "Gender Remark cannot exceed 50 characters."
    );
  }

}

}

module.exports = cds.service.impl(function () {
  const { Patients } = this.entities;
  console.log("******** CREATE CALLED ********");
  this.before(['CREATE', 'UPDATE'], Patients, async (req) => {


    // Validation

    await validatePatient(req, Patients);


    // Automatic Patient Number 
    if (!req.data.patientNo) {

      const tx = cds.transaction(req);

      const patients = await tx.run(
        SELECT.from(Patients).columns('patientNo')
      );

      let max = 1000;

      for (const p of patients) {
        if (p.patientNo) {
          const n = Number(p.patientNo.replace('P', ''));
          if (n > max) max = n;
        }
      }

      req.data.patientNo = `P${max + 1}`;
      console.log("Generated:", req.data.patientNo);

    }

    if (req.event === 'UPDATE') {
      const targetID = req.data?.ID || (req.params && (req.params[0]?.ID || req.params[0]));
      const ID = req.data?.ID || req.params?.[0]?.ID;
      if (req.data.patientNo !== undefined) {

        const existingPatient = await SELECT.one
          .from(Patients)
          .where({ ID });

        if (!existingPatient) {
          return req.error(404, "Patient not found.");
        }


        if (req.data.patientNo !== undefined && existingPatient.patientNo !== req.data.patientNo) {
          return req.error(400, "Patient Number cannot be modified.");
        }
      }
    }

    if (req.data.gender && req.data.gender !== "Other") {
      req.data.genderRemark = null;
    }

  })
this.after('CREATE', Patients, async (data, req) => {

  req.info({
    message: `Patient ${data.patientNo} has been created successfully.`
  });

});
  this.on('getPatientNo', async (req) => {

    const patients = await SELECT.from(Patients).columns('patientNo');
    let max = 1000;

    for (const p of patients) {
      if (p.patientNo) {
        const n = Number(p.patientNo.replace('P', ''));
        if (n > max) max = n;
      }
    }
    return `P${max + 1}`;


  })

  this.on('DeactivatePatient', async req => {
    const { ID } = req.params[0];
    const patient = await SELECT.one.from(Patients).where({ ID })

    if (!patient) {
      return req.error(404, "Patient not found.");
    }
    if (!patient.isActive) {
      return req.error(400, "Patient is already inactive.")
    }

    await UPDATE(Patients).set({ isActive: false }).where({ ID });
    req.info({
      message: `Patient ${patient.patientNo} has been deactivated successfully.`
    });
    return await SELECT.one
      .from(Patients)
      .where({ ID });

  })


  this.on('ActivatePatient', async req => {
    const { ID } = req.params[0];
    const patient = await SELECT.one.from(Patients).where({ ID })

    if (!patient) {
      return req.error(404, "Patient not found.");
    }
    if (patient.isActive) {
      return req.error(400, "Patient is already active.")
    }


    await UPDATE(Patients)
      .set({ isActive: true })
      .where({ ID });

    req.info({
      message: `Patient ${patient.patientNo} has been activated successfully.`
    });

    return await SELECT.one
      .from(Patients)
      .where({ ID });

  })

  this.before('DELETE', Patients, async (req) => {

    const { ID } = req.params[0];

    const patients = await SELECT.one.from(Patients).where({ ID });

    if (!patients) {
      return req.error(404, "Patient Not Found.")
    }

    if (patients.isActive) {
      req.error(405, "Active Patients records cannot be deleted. Please deactivate the patient instead.")

    }
  })

this.after('READ', Patients, (data) => {
  const patients = Array.isArray(data) ? data : [data];

  for (const patient of patients) {
    if (!patient) continue;
    patient.statusCriticality = patient.isActive ? 3 : 1;

     patient.hideGenderRemark =
            patient.gender === "Male" || patient.gender === "Female";

        console.log(patient.gender, patient.hideGenderRemark);
  }
 
});
  

})

