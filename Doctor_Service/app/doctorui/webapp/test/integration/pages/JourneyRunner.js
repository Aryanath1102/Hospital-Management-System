sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"doctorui/test/integration/pages/DoctorsList.gen",
	"doctorui/test/integration/pages/DoctorsObjectPage.gen",
	"doctorui/test/integration/pages/DoctorSpecializationsObjectPage.gen"
], function (JourneyRunner, DoctorsListGenerated, DoctorsObjectPageGenerated, DoctorSpecializationsObjectPageGenerated) {
    'use strict';

    const runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('doctorui') + '/test/flp.html#app-preview',
        pages: {
			onTheDoctorsListGenerated: DoctorsListGenerated,
			onTheDoctorsObjectPageGenerated: DoctorsObjectPageGenerated,
			onTheDoctorSpecializationsObjectPageGenerated: DoctorSpecializationsObjectPageGenerated
        },
        async: true
    });

    return runner;
});

