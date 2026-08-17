using DoctorService as service from '../../srv/Doctor_Service';
annotate service.DoctorSchedules with @(
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Value : Day,
            Label : '{i18n>DayOfWeek}',
        },
        {
            $Type : 'UI.DataField',
            Value : Start_Time,
            Label : '{i18n>StartTime}',
        },
        {
            $Type : 'UI.DataField',
            Value : End_Time,
            Label : '{i18n>EndTime}',
        },
    ]
);

annotate service.DoctorSchedules with {
    Day @(
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'DoctorSchedules',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : Day,
                    ValueListProperty : 'Day',
                },
            ],
            Label : '{i18n>Scheduled}',
        },
        Common.ValueListWithFixedValues : true,
)};

annotate service.Doctors with @(
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Value : Doctor_Code,
            Label : '{i18n>DoctorId}',
        },
        {
            $Type : 'UI.DataField',
            Value : Full_Name,
            Label : '{i18n>DoctorName}',
        },
        {
            $Type : 'UI.DataField',
            Value : Gender,
            Label : '{i18n>Gender}',
        },
        {
            $Type : 'UI.DataField',
            Value : Department_ID,
            Label : '{i18n>Department}',
        },
        {
            $Type : 'UI.DataField',
            Value : Joining_Date,
            Label : '{i18n>JoiningDate}',
        },
        {
            $Type : 'UI.DataField',
            Value : Experience,
            Label : '{i18n>YearsOfExperience}',
        },
        {
            $Type : 'UI.DataField',
            Value : Qualification,
            Label : '{i18n>Qualification}',
        },
        {
            $Type : 'UI.DataField',
            Value : Registration_Number,
            Label : '{i18n>RegistrationNumber}',
        },
        {
            $Type : 'UI.DataField',
            Value : Phone,
            Label : '{i18n>PhoneNumber}',
        },
        {
            $Type : 'UI.DataField',
            Value : Email,
            Label : '{i18n>EmailAddress}',
        },
        {
            $Type : 'UI.DataField',
            Value : Consultation_Fee,
            Label : '{i18n>ConsultationFee}',
        },
        {
            $Type : 'UI.DataField',
            Value : Room_Number,
            Label : '{i18n>RoomNumber}',
        },
        {
            $Type : 'UI.DataField',
            Value : Availability,
            Label : '{i18n>CurrentAvailability}',
        },
        {
            $Type : 'UI.DataField',
            Value : Doctor_Status,
            Label : '{i18n>EmploymentStatus}',
        },
    ],
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : '{i18n>DoctorDetails}',
            Target : '@UI.FieldGroup#DoctorDetails',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : '{i18n>ProfessionalInformation}',
            Target : '@UI.FieldGroup#ProfessionalDetails',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : '{i18n>ContactInformation}',
            Target : '@UI.FieldGroup#ContactDetails',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : '{i18n>StatusAvailability}',
            Target : '@UI.FieldGroup#StatusDetails',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : '{i18n>Specializations}',
            Target : 'Doctor_Specializations/@UI.LineItem',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : '{i18n>Schedules}',
            Target : 'Doctor_Schedule/@UI.LineItem',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : '{i18n>Leaves}',
            Target : 'Doctor_Leaves/@UI.LineItem',
        },
    ],
    UI.FieldGroup #DoctorDetails : {
        Label : 'Doctor Details',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : First_Name,
                Label : '{i18n>FirstName}',
            },
            {
                $Type : 'UI.DataField',
                Value : Last_Name,
                Label : '{i18n>LastName}',
            },
            {
                $Type : 'UI.DataField',
                Value : Gender,
                Label : '{i18n>Gender}',
            },
        ],
    },
    UI.FieldGroup #ProfessionalDetails : {
        Label : 'Professional Information',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : Qualification,
                Label : '{i18n>Qualification}',
            },
            {
                $Type : 'UI.DataField',
                Value : Registration_Number,
                Label : '{i18n>RegistrationNumber}',
            },
            {
                $Type : 'UI.DataField',
                Value : Experience,
                Label : '{i18n>YearsOfExperience}',
            },
            {
                $Type : 'UI.DataField',
                Value : Joining_Date,
                Label : '{i18n>JoiningDate}',
            },
            {
                $Type : 'UI.DataField',
                Value : Department_ID,
                Label : '{i18n>Department}',
            },
        ],
    },
    UI.FieldGroup #ContactDetails : {
        Label : 'Contact Information',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : Phone,
                Label : '{i18n>PhoneNumber}',
            },
            {
                $Type : 'UI.DataField',
                Value : Email,
                Label : '{i18n>EmailAddress}',
            },
            {
                $Type : 'UI.DataField',
                Value : Room_Number,
                Label : '{i18n>RoomNumber}',
            },
            {
                $Type : 'UI.DataField',
                Value : Consultation_Fee,
                Label : '{i18n>ConsultationFee}',
            },
        ],
    },
    UI.FieldGroup #StatusDetails : {
        Label : 'Status & Availability',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : Doctor_Status,
                Label : '{i18n>EmploymentStatus}',
            },
            {
                $Type : 'UI.DataField',
                Value : Availability,
                Label : '{i18n>CurrentAvailability}',
            },
        ],
    },
    UI.HeaderInfo : {
        TypeName : '{i18n>Doctor}',
        TypeNamePlural : '{i18n>Doctors}',
        Title : {
            $Type : 'UI.DataField',
            Value : Full_Name,
        },
        Description : {
            $Type : 'UI.DataField',
            Value : Doctor_Code,
        },
    },
);

annotate service.Doctors with {
    Doctor_Code @Common.Label : '{i18n>DoctorId}'
};

annotate service.Doctors with {
    Full_Name @Common.Label : '{i18n>DoctorName}'
};

annotate service.Doctors with {
    Gender @Common.Label : '{i18n>Gender}'
};

annotate service.Doctors with {
    Department @Common.Label : '{i18n>Department}'
};

annotate service.Doctors with {
    Doctor_Status @Common.Label : '{i18n>EmploymentStatus}'
};

annotate service.Doctors with {
    Availability @Common.Label : '{i18n>CurrentAvailability}'
};

annotate service.Doctors with {
    Qualification @Common.Label : '{i18n>Qualification}'
};

annotate service.DoctorSpecializations with @(
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Value : Specializations_ID,
            Label : '{i18n>Specialization}',
        },
        {
            $Type : 'UI.DataField',
            Value : Certification_Date,
            Label : '{i18n>CertificationDate}',
        },
        {
            $Type : 'UI.DataField',
            Value : Primary_Specialization,
            Label : '{i18n>PrimarySpecialization}',
        },
        {
            $Type : 'UI.DataField',
            Value : Experience_In_Specialization,
            Label : '{i18n>YearsOfExperience}',
        },
        {
            $Type : 'UI.DataField',
            Value : Remarks,
            Label : '{i18n>Remarks}',
        },
    ],
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : '{i18n>SpecializationDetails}',
            Target : '@UI.FieldGroup#SpecializationDetails',
        },
    ],
    UI.FieldGroup #SpecializationDetails : {
        Label : 'Specialization Details',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : Specializations_ID,
                Label : '{i18n>Specialization}',
            },
            {
                $Type : 'UI.DataField',
                Value : Certification_Date,
                Label : '{i18n>CertificationDate}',
            },
            {
                $Type : 'UI.DataField',
                Value : Primary_Specialization,
                Label : '{i18n>PrimarySpecialization}',
            },
            {
                $Type : 'UI.DataField',
                Value : Experience_In_Specialization,
                Label : '{i18n>YearsOfExperience}',
            },
            {
                $Type : 'UI.DataField',
                Value : Remarks,
                Label : '{i18n>Remarks}',
            },
        ],
    },
    UI.HeaderInfo : {
        TypeName : '{i18n>DoctorSpecialization}',
        TypeNamePlural : '{i18n>DoctorSpecializations}',
        Title : {
            $Type : 'UI.DataField',
            Value : Specializations.Name,
        },
    },
);

annotate service.DoctorLeaves with @(
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Value : From_Date,
            Label : '{i18n>FromDate}',
        },
        {
            $Type : 'UI.DataField',
            Value : To_Date,
            Label : '{i18n>ToDate}',
        },
        {
            $Type : 'UI.DataField',
            Value : Reason,
            Label : '{i18n>Reason}',
        },
        {
            $Type : 'UI.DataField',
            Value : LeaveStatus,
            Label : '{i18n>LeaveStatus}',
        },
    ]
);

