
const cds=require('@sap/cds')

const NumberRangeService = require('../Services/NumberRangeService');

const generateDoctorCode = async (req, NumberRanges) => {

    if (req.data.Doctor_Code) {
        return;
    }

    const next = await NumberRangeService.getNextNumber(
        req,
        NumberRanges,
        'DOCTOR'
    );

    req.data.Doctor_Code = `DOC${String(next).padStart(3, '0')}`;

    const LOG = cds.log('doctor-service');
    LOG.info(`Generated Doctor Code: ${req.data.Doctor_Code}`);
};

module.exports = generateDoctorCode;