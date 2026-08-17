using {hospital} from '../db/schema';

@title           : 'Hospital Patient Management API'
@Core.Description: 'REST API for Hospital Management System. Features: Patients, Genders, Patient Status, Patient Actions, Patient Draft Management.'

@requires        : 'authenticated-user'
service PatientService {

    entity Genders       as projection on hospital.Genders;

    entity PatientStatus as projection on hospital.PatientStatus;

    @odata.draft.enabled
    @restrict: [
        {
            grant: 'READ',
            to   : [
                'PatientAdmin',
                'PatientService.Read'
            ]
        },
        {
            grant: '*',
            to   : 'PatientAdmin'
        }
    ]
    entity Patients      as
        projection on hospital.Patients {
            *
        }
        actions {

            action DeactivatePatient();
            action ActivatePatient();

        };

    function getPatientNo() returns String;
}


annotate PatientService.Patients with {

    patientNo      @Common.Label          : 'Patient Number';

    firstName      @Common.Label          : 'First Name';
    lastName       @Common.Label          : 'Last Name';
    gender         @Common.Label          : 'Gender';
    genderRemark   @Common.Label          : 'Gender Remark';

    age            @Common.Label          : 'Age';
    bloodGroup     @Common.Label          : 'Blood Group';

    phone          @Common.Label          : 'Phone';
    email          @Common.Label          : 'Email';

    address        @Common.Label          : 'Address';
    city           @Common.Label          : 'City';
    state          @Common.Label          : 'State';
    country        @Common.Label          : 'Country';
    pincode        @Common.Label          : 'Pincode';

    emergencyName  @Common.Label          : 'Emergency Name';
    emergencyPhone @Common.Label          : 'Emergency Contact';

    isActive       @Common.Label          : 'Status';
    isActive       @Common.Text           : statusMaster.text;
    isActive       @Common.TextArrangement: #TextOnly;

    gender         @Common.ValueListWithFixedValues;

    gender         @Common.ValueList      : {
        CollectionPath: 'Genders',
        Parameters    : [{
            $Type            : 'Common.ValueListParameterInOut',
            LocalDataProperty: gender,
            ValueListProperty: 'code'
        }]
    };

    genderRemark   @UI.Hidden             : (hideGenderRemark == true);
}


annotate PatientService.Patients with @(UI: {

    HeaderInfo           : {
        TypeName      : 'Patient',
        TypeNamePlural: 'Patients',
        Title         : {Value: firstName}
    },

    SelectionFields      : [
        patientNo,
        firstName,
        phone,
        bloodGroup,
        isActive
    ],

    LineItem             : [
        {Value: patientNo},
        {Value: firstName},
        {Value: lastName},
        {Value: gender},
        {Value: age},
        {Value: phone},
        {
            Value      : isActive,
            Criticality: statusCriticality
        }
    ],

    Facets               : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'General Information',
            Target: '@UI.FieldGroup#General'
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Contact Information',
            Target: '@UI.FieldGroup#Contact'
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Emergency Contact',
            Target: '@UI.FieldGroup#Emergency'
        }
    ],

    FieldGroup #General  : {Data: [
        {Value: firstName},
        {Value: lastName},
        {Value: gender},
        {Value: genderRemark},
        {Value: age},
        {Value: bloodGroup},
        {
            Value      : isActive,
            Criticality: statusCriticality
        }
    ]},

    FieldGroup #Contact  : {Data: [
        {Value: phone},
        {Value: email},
        {Value: address},
        {Value: city},
        {Value: state},
        {Value: country},
        {Value: pincode}
    ]},

    FieldGroup #Emergency: {Data: [
        {Value: emergencyName},
        {Value: emergencyPhone}
    ]},

    Identification       : [
        {
            $Type : 'UI.DataFieldForAction',
            Action: 'PatientService.DeactivatePatient',
            Label : 'Deactivate Patient'
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action: 'PatientService.ActivatePatient',
            Label : 'Activate Patient'
        }
    ]

});
