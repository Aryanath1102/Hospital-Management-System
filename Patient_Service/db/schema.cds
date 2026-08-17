namespace hospital;

using {managed} from '@sap/cds/common';

entity Patients : managed {
    key ID                        : UUID;

        patientNo                 : String(10);

        firstName                 : String(50);
        lastName                  : String(50);

        gender                    : String(10);

        genderMaster              : Association to Genders on genderMaster.code = gender;

        genderRemark              : String(50);
        virtual hideGenderRemark : Boolean;


        age                       : Integer;

        bloodGroup                : String(5);

        phone                     : String(15);
        email                     : String(100);

        address                   : String(200);
        city                      : String(50);
        state                     : String(50);
        country                   : String(50);
        pincode                   : String(10);

        emergencyName             : String(50);
        emergencyPhone            : String(15);

        isActive                  : Boolean default true;

        statusMaster              : Association to PatientStatus
                                        on statusMaster.code = isActive;
        virtual statusCriticality : Integer;


}

entity Genders {
    key code : String(100);
        name : String(100);
}

entity PatientStatus {

    key code : Boolean;

        text : String(20);

}
