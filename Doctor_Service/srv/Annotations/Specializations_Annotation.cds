using DoctorService from '../Doctor_Service';

annotate DoctorService.Specializations with @UI.LineItem: [
    {
        $Type: 'UI.DataField',
        Value: Specialization_Code
    },
    {
        $Type: 'UI.DataField',
        Value: Name
    },
    {
        $Type: 'UI.DataField',
        Value: Normalized_Name
    },
    {
        $Type: 'UI.DataField',
        Value: Description
    },
    {
        $Type: 'UI.DataField',
        Value: Department
    },
    {
        $Type: 'UI.DataField',
        Value: Status
    }
];

annotate DoctorService.Specializations with @UI.SelectionFields: [
    Specialization_Code,
    Name,
    Department,
    Status
];

annotate DoctorService.Specializations with @UI.HeaderInfo: {
    TypeName: 'Specialization',
    TypeNamePlural: 'Specializations',

    Title: {
        Value: Name
    },

    Description: {
        Value: Specialization_Code
    }
};

annotate DoctorService.Specializations with @UI.FieldGroup #SpecializationDetails: {
    Label: 'Specialization Details',

    Data: [
        {
            $Type: 'UI.DataField',
            Value: Specialization_Code
        },
        {
            $Type: 'UI.DataField',
            Value: Name
        },
        {
            $Type: 'UI.DataField',
            Value: Normalized_Name
        },
        {
            $Type: 'UI.DataField',
            Value: Description
        },
        {
            $Type: 'UI.DataField',
            Value: Department
        },
        {
            $Type: 'UI.DataField',
            Value: Status
        }
    ]
};

annotate DoctorService.Specializations with @UI.FieldGroup #Classification: {
    Label: 'Classification',

    Data: [
        {
            $Type: 'UI.DataField',
            Value: Department
        },
        {
            $Type: 'UI.DataField',
            Value: Status
        }
    ]
};

annotate DoctorService.Specializations with @UI.Facets: [
    {
        $Type: 'UI.ReferenceFacet',
        Label: 'Specialization Details',
        Target: '@UI.FieldGroup#SpecializationDetails'
    },
    {
        $Type: 'UI.ReferenceFacet',
        Label: 'Classification',
        Target: '@UI.FieldGroup#Classification'
    }
];

annotate DoctorService.Specializations with @UI.Identification: [
    {
        $Type: 'UI.DataField',
        Value: Specialization_Code
    },
    {
        $Type: 'UI.DataField',
        Value: Name
    },
    {
        $Type: 'UI.DataField',
        Value: Department
    },
    {
        $Type: 'UI.DataField',
        Value: Status
    }
];

annotate DoctorService.Specializations with {
    Department @Common: {
        Text: Department.Department_Name,
        TextArrangement: #TextOnly
    };
};