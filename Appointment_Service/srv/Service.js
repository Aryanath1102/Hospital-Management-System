const cds = require("@sap/cds");
const { SELECT } = cds.ql;

module.exports = cds.service.impl(async function () {



    const PatientService = await cds.connect.to("PatientService");
    const DoctorService = await cds.connect.to("DoctorService");

    this.before("NEW", this.entities.Appointments.drafts, async (req) => {

        console.log(">>> PATIENT & DOCTOR VALIDATION HANDLER CALLED");
        console.log(">>> Patient_ID:", req.data.Patient_ID);
        console.log(">>> Doctor_ID:", req.data.Doctor_ID);


        // Patient Validation
        const { Patient_ID } = req.data;

        if (!Patient_ID) {
            req.error(400, "Patient_ID is required");
        }

        const Patient = await PatientService.run(
            SELECT.one
                .from("Patients")
                .where({ ID: Patient_ID })
        );

        console.log(">>> PATIENT RESULT:", Patient);

        if (!Patient) {
          return  req.error(404, "Patient not found.");
        }

        if (!Patient.isActive) {
          return  req.error(400, "Patient is inactive.");
        }


        // Doctor Validation

        const {Doctor_ID}=req.data;

        if(!Doctor_ID){
           return req.error(400,"Doctor ID required");
        }

        const doctor =await DoctorService.run(SELECT.one.from("Doctors").where({ID:Doctor_ID}))
        if(!doctor){
            return req.error(404,"Doctor not found");
        }
        if(doctor.Availability!="Available"){
            return req.error(400,"Doctor not available");
        }

    });

});