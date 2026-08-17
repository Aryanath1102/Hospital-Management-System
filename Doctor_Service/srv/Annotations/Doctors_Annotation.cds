using DoctorService from '../Doctor_Service';

annotate DoctorService.Doctors with @(
    UI.CreateHidden:false,
    UI.UpdateHidden:false,
    Capabilities.DeleteRestrictions:{
        Deletable:true
    },
    UI.HeaderInfo                     : {
        TypeName      : 'Doctor',
        TypeNamePlural: 'Doctors',
        Title         : {Value: Full_Name},
        Description   : {Value: Doctor_Code}
    },

    UI.SelectionFields                : [
        Doctor_Code,
        Full_Name,
        Gender,
        Department_ID,
        Doctor_Status,
        Availability,
        Qualification
    ],

    // Use Full_Name in the list report table for a cleaner view
    UI.LineItem                       : [
        {
            $Type: 'UI.DataField',
            Value: Doctor_Code
        },
        {
            $Type: 'UI.DataField',
            Value: Full_Name
        },
        {
            $Type: 'UI.DataField',
            Value: Gender
        },
        {
            $Type: 'UI.DataField',
            Value: Department_ID
        },
        {
            $Type: 'UI.DataField',
            Value: Joining_Date
        },
        {
            $Type: 'UI.DataField',
            Value: Experience
        },
        {
            $Type: 'UI.DataField',
            Value: Qualification
        },
        {
            $Type: 'UI.DataField',
            Value: Registration_Number
        },
        {
            $Type: 'UI.DataField',
            Value: Phone
        },
        {
            $Type: 'UI.DataField',
            Value: Email
        },
        {
            $Type: 'UI.DataField',
            Value: Consultation_Fee
        },
        {
            $Type: 'UI.DataField',
            Value: Room_Number
        },
        {
            $Type: 'UI.DataField',
            Value: Availability
        },
        {
            $Type: 'UI.DataField',
            Value: Doctor_Status
        }
    ],

    // Identification is used in the Header area of the Object Page
    UI.Identification                 : [
        {
            $Type: 'UI.DataField',
            Value: Doctor_Code
        },
        {
            $Type: 'UI.DataField',
            Value: Full_Name
        },
        {
            $Type: 'UI.DataField',
            Value: Department_ID
        },
        {
            $Type: 'UI.DataField',
            Value: Doctor_Status
        },
        {
            $Type: 'UI.DataField',
            Value: Availability
        }
    ],

    UI.Facets                         : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Doctor Details',
            Target: '@UI.FieldGroup#DoctorDetails'
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Professional Information',
            Target: '@UI.FieldGroup#ProfessionalDetails'
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Contact Information',
            Target: '@UI.FieldGroup#ContactDetails'
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Status & Availability',
            Target: '@UI.FieldGroup#StatusDetails'
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Specializations',
            Target: 'Doctor_Specializations/@UI.LineItem'
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Schedules',
            Target: 'Doctor_Schedule/@UI.LineItem'
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Leaves',
            Target: 'Doctor_Leaves/@UI.LineItem'
        }
    ],

    // Provide First_Name and Last_Name here so the user can input data
    UI.FieldGroup #DoctorDetails      : {
        Label: 'Doctor Details',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: First_Name
            },
            {
                $Type: 'UI.DataField',
                Value: Last_Name
            },
            {
                $Type: 'UI.DataField',
                Value: Gender
            }
        ]
    },

    UI.FieldGroup #ProfessionalDetails: {
        Label: 'Professional Information',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: Qualification
            },
            {
                $Type: 'UI.DataField',
                Value: Registration_Number
            },
            {
                $Type: 'UI.DataField',
                Value: Experience
            },
            {
                $Type: 'UI.DataField',
                Value: Joining_Date
            },
            {
                $Type: 'UI.DataField',
                Value: Department_ID
            }
        ]
    },

    UI.FieldGroup #ContactDetails     : {
        Label: 'Contact Information',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: Phone
            },
            {
                $Type: 'UI.DataField',
                Value: Email
            },
            {
                $Type: 'UI.DataField',
                Value: Room_Number
            },
            {
                $Type: 'UI.DataField',
                Value: Consultation_Fee
            }
        ]
    },

    UI.FieldGroup #StatusDetails      : {
        Label: 'Status & Availability',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: Doctor_Status
            },
            {
                $Type: 'UI.DataField',
                Value: Availability
            }
        ]
    }
);

annotate DoctorService.Doctors with {
    // Hide the automatically generated ID field from the UI entirely
    ID                  @UI.Hidden;

    Doctor_Code         @(
        Common.Label       : 'Doctor ID',
        Common.FieldControl: #ReadOnly
    );
    First_Name          @Common.Label: 'First Name';
    Last_Name           @Common.Label: 'Last Name';
    Full_Name           @(
        Common.Label       : 'Doctor Name',
        Common.FieldControl: #ReadOnly
    );
    Gender              @Common.Label: 'Gender';
    Joining_Date        @Common.Label: 'Joining Date';
    Experience          @Common.Label: 'Years of Experience';
    Qualification       @Common.Label: 'Qualification';
    Registration_Number @Common.Label: 'Registration Number';
    Phone               @Common.Label: 'Phone Number';
    Email               @Common.Label: 'Email Address';
    Consultation_Fee    @Common.Label: 'Consultation Fee';
    Room_Number         @Common.Label: 'Room Number';
    Availability        @Common.Label: 'Current Availability';
    Doctor_Status       @Common.Label: 'Employment Status';

    Department          @(
        Common.Label          : 'Department',
        Common.Text           : Department.Department_Name,
        Common.TextArrangement: #TextOnly,
        Common.ValueList      : {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'Departments',
            Parameters    : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: Department_ID,
                    ValueListProperty: 'ID'
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'Department_Name'
                }
            ]
        }
    );
};
