sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"patientui/test/integration/pages/PatientsList.gen",
	"patientui/test/integration/pages/PatientsObjectPage.gen"
], function (JourneyRunner, PatientsListGenerated, PatientsObjectPageGenerated) {
    'use strict';

    const runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('patientui') + '/test/flp.html#app-preview',
        pages: {
			onThePatientsListGenerated: PatientsListGenerated,
			onThePatientsObjectPageGenerated: PatientsObjectPageGenerated
        },
        async: true
    });

    return runner;
});

