const cds = require("@sap/cds");

const runDoctorAvailabilityJob =
    require("./Doctor_Availability_Job");

cds.on("served", () => {

    // Run once immediately
    cds.spawn(async (tx) => {

        await runDoctorAvailabilityJob(tx);

    });

    // Run every hour
    cds.spawn(
        {
            every: 60 * 60 * 1000
        },
        async (tx) => {

            await runDoctorAvailabilityJob(tx);

        }
    );

});