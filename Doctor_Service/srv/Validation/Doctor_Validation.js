const cds = require("@sap/cds");
const { SELECT } = cds.ql;
const validator = require("validator");

// =====================================================
// Actual DB Entity
// =====================================================

const {
    Doctors: DoctorDB
} = cds.entities("hospital");


// =====================================================
// Doctor Validation
// =====================================================

const validateDoctor = async (req, Doctors) => {

    const targetID =
        req.data?.ID ||
        req.params?.[0]?.ID ||
        req.params?.[0];

    const tx = cds.tx(req);


    // =================================================
    // Email Validation
    // =================================================

    if (req.data.Email != null) {

        const email =
            req.data.Email
                .toString()
                .trim()
                .toLowerCase();

        req.data.Email = email;


        // Email format
        if (!validator.isEmail(email)) {

            req.error(
                400,
                "Email is not valid.",
                "in/Email"
            );
        }


        // Check duplicate email
        // IMPORTANT:
        // Query actual DB entity, not draft service entity.
        const existingEmail = await tx.run(
            SELECT.one
                .from(DoctorDB)
                .where({
                    Email: email
                })
        );


        if (
            existingEmail &&
            !(
                req.event === "UPDATE" &&
                existingEmail.ID === targetID
            )
        ) {

            req.error(
                400,
                `Email ID ${email} is already registered.`,
                "in/Email"
            );
        }
    }


    // =================================================
    // Phone Validation
    // =================================================

    if (req.data.Phone != null) {

        const phone =
            req.data.Phone
                .toString()
                .trim();

        req.data.Phone = phone;


        // Mandatory
        if (validator.isEmpty(phone)) {

            req.error(
                400,
                "Phone Number is mandatory.",
                "in/Phone"
            );
        }


        // Only digits
        if (
            !validator.isNumeric(
                phone,
                { no_symbols: true }
            )
        ) {

            req.error(
                400,
                "Phone Number must contain only digits.",
                "in/Phone"
            );
        }


        // Length
        if (
            !validator.isLength(
                phone,
                {
                    min: 10,
                    max: 20
                }
            )
        ) {

            req.error(
                400,
                "Phone Number must be between 10 and 20 digits.",
                "in/Phone"
            );
        }


        // Check duplicate phone
        const existingPhone = await tx.run(
            SELECT.one
                .from(DoctorDB)
                .where({
                    Phone: phone
                })
        );


        if (
            existingPhone &&
            !(
                req.event === "UPDATE" &&
                existingPhone.ID === targetID
            )
        ) {

            req.error(
                400,
                `Phone Number ${phone} is already registered.`,
                "in/Phone"
            );
        }
    }


    // =================================================
    // Joining Date Validation
    // =================================================

    if (req.data.Joining_Date != null) {

        const joiningDateStr =
            req.data.Joining_Date
                .toString()
                .trim();


        // Validate date format
        if (
            !validator.isISO8601(
                joiningDateStr,
                { strict: true }
            )
        ) {

            req.error(
                400,
                "Joining Date must be a valid date format (YYYY-MM-DD).",
                "in/Joining_Date"
            );

        } else {

            const joiningDate =
                new Date(joiningDateStr);

            joiningDate.setHours(
                0,
                0,
                0,
                0
            );


            const today = new Date();

            today.setHours(
                0,
                0,
                0,
                0
            );


            // Maximum future date = 60 days
            const maxFutureDate =
                new Date(today);

            maxFutureDate.setDate(
                today.getDate() + 60
            );


            // Minimum historical date
            const minAllowedDate =
                new Date(
                    1950,
                    0,
                    1
                );


            if (joiningDate > maxFutureDate) {

                req.error(
                    400,
                    "Joining Date cannot be more than 60 days in the future.",
                    "in/Joining_Date"
                );
            }


            if (joiningDate < minAllowedDate) {

                req.error(
                    400,
                    "Joining Date is invalid or too far in the past.",
                    "in/Joining_Date"
                );
            }
        }

    } else if (req.event === "CREATE") {

        req.error(
            400,
            "Joining Date is mandatory.",
            "in/Joining_Date"
        );
    }


    // =================================================
    // Experience Validation
    // =================================================

    if (req.data.Experience != null) {

        const exp =
            Number(req.data.Experience);


        if (Number.isNaN(exp)) {

            return req.error(
                400,
                "Experience must be valid Number.",
                "in/Experience"
            );
        }


        if (exp < 0) {

            return req.error(
                400,
                "Experience can not be negative.",
                "in/Experience"
            );
        }


        if (exp > 60) {

            return req.error(
                400,
                "Experience can not exceed 60 years.",
                "in/Experience"
            );
        }
    }


    // =================================================
    // First Name Validation
    // =================================================

    if (req.data.First_Name != null) {

        const firstName =
            req.data.First_Name
                .toString()
                .trim();


        if (!firstName) {

            return req.error(
                400,
                "First Name is Mandatory.",
                "in/First_Name"
            );
        }


        if (!validator.isAlpha(firstName)) {

            return req.error(
                400,
                "First Name should be Alphabet.",
                "in/First_Name"
            );
        }

    } else if (
        req.event === "CREATE" ||
        req.event === "UPDATE"
    ) {

        return req.error(
            400,
            "First Name is Mandatory.",
            "in/First_Name"
        );
    }


    // =================================================
    // Last Name Validation
    // =================================================

    if (req.data.Last_Name != null) {

        const lastName =
            req.data.Last_Name
                .toString()
                .trim();


        if (!lastName) {

            return req.error(
                400,
                "Last Name is Mandatory.",
                "in/Last_Name"
            );
        }


        if (!validator.isAlpha(lastName)) {

            return req.error(
                400,
                "Last Name should be Alphabet.",
                "in/Last_Name"
            );
        }

    } else if (
        req.event === "CREATE" ||
        req.event === "UPDATE"
    ) {

        return req.error(
            400,
            "Last Name is Mandatory.",
            "in/Last_Name"
        );
    }


    // =================================================
    // Consultation Fee Validation
    // =================================================

    if (req.data.Consultation_Fee != null) {

        const fees =
            Number(req.data.Consultation_Fee);


        if (Number.isNaN(fees)) {

            return req.error(
                400,
                "Consultation Fees must be Number.",
                "in/Consultation_Fee"
            );
        }


        if (fees <= 0) {

            return req.error(
                400,
                "Consultation Fee must be greater than zero.",
                "in/Consultation_Fee"
            );
        }
    }


    // =================================================
    // Qualification Validation
    // =================================================

    if (req.data.Qualification != null) {

        const qualification =
            req.data.Qualification
                .toString()
                .trim();


        if (
            validator.isEmpty(
                qualification
            )
        ) {

            return req.error(
                400,
                "Qualification is Mandatory.",
                "in/Qualification"
            );
        }


        if (
            !validator.isLength(
                qualification,
                {
                    min: 2,
                    max: 100
                }
            )
        ) {

            return req.error(
                400,
                "Qualification must be between 2 and 100 characters.",
                "in/Qualification"
            );
        }


        if (
            validator.isNumeric(
                qualification
            )
        ) {

            return req.error(
                400,
                "Qualification must be letters.",
                "in/Qualification"
            );
        }
    }


    // =================================================
    // Registration Number Validation
    // =================================================

    if (req.data.Registration_Number != null) {

        const registrationNumber =
            req.data.Registration_Number
                .toString()
                .trim()
                .toUpperCase();

        req.data.Registration_Number =
            registrationNumber;


        // Mandatory
        if (
            validator.isEmpty(
                registrationNumber
            )
        ) {

            req.error(
                400,
                "Registration Number is mandatory.",
                "in/Registration_Number"
            );
        }


        // Length
        else if (
            !validator.isLength(
                registrationNumber,
                {
                    min: 5,
                    max: 50
                }
            )
        ) {

            req.error(
                400,
                "Registration Number must be between 5 and 50 characters.",
                "in/Registration_Number"
            );
        }


        // Allowed characters
        else if (
            !/^[A-Z0-9/-]+$/.test(
                registrationNumber
            )
        ) {

            req.error(
                400,
                "Registration Number may contain only letters, numbers, '/' and '-'.",
                "in/Registration_Number"
            );
        }


        // Duplicate check
        const existingRegistration =
            await tx.run(
                SELECT.one
                    .from(DoctorDB)
                    .where({
                        Registration_Number:
                            registrationNumber
                    })
            );


        if (
            existingRegistration &&
            !(
                req.event === "UPDATE" &&
                existingRegistration.ID === targetID
            )
        ) {

            req.error(
                400,
                `Registration Number '${registrationNumber}' is already registered.`,
                "in/Registration_Number"
            );
        }

    } else if (
        req.event === "CREATE"
    ) {

        req.error(
            400,
            "Registration Number is mandatory.",
            "in/Registration_Number"
        );
    }
};


// =====================================================
// Export
// =====================================================

module.exports = validateDoctor;