using DoctorService from '../Doctor_Service';

annotate DoctorService.Departments with @UI.LineItem: [
    {
        $Type: 'UI.DataField',
        Value: Department_Code
    },
    {
        $Type: 'UI.DataField',
        Value: Department_Name
    },
    {
        $Type: 'UI.DataField',
        Value: Description
    },
    {
        $Type: 'UI.DataField',
        Value: Phone_Extension
    },
    {
        $Type: 'UI.DataField',
        Value: Head_of_Department
    },
    {
        $Type: 'UI.DataField',
        Value: Building
    },
    {
        $Type: 'UI.DataField',
        Value: floor
    },
    {
        $Type: 'UI.DataField',
        Value: Status
    }
];

annotate DoctorService.Departments with @UI.SelectionFields: [
    Department_Code,
    Department_Name,
    Status,
    Building
];

annotate DoctorService.Departments with @UI.HeaderInfo: {
    TypeName: 'Department',
    TypeNamePlural: 'Departments',

    Title: {
        Value: Department_Name
    },

    Description: {
        Value: Department_Code
    }
};

annotate DoctorService.Departments with @UI.FieldGroup #DepartmentDetails: {
    Label: 'Department Details',

    Data: [
        {
            $Type: 'UI.DataField',
            Value: Department_Code
        },
        {
            $Type: 'UI.DataField',
            Value: Department_Name
        },
        {
            $Type: 'UI.DataField',
            Value: Description
        },
        {
            $Type: 'UI.DataField',
            Value: Phone_Extension
        },
        {
            $Type: 'UI.DataField',
            Value: Head_of_Department
        },
        {
            $Type: 'UI.DataField',
            Value: Building
        },
        {
            $Type: 'UI.DataField',
            Value: floor
        },
        {
            $Type: 'UI.DataField',
            Value: Status
        }
    ]
};

annotate DoctorService.Departments with @UI.Facets: [
    {
        $Type: 'UI.ReferenceFacet',
        Label: 'Department Details',
        Target: '@UI.FieldGroup#DepartmentDetails'
    }
];

annotate DoctorService.Departments with @UI.Identification: [
    {
        $Type: 'UI.DataField',
        Value: Department_Code
    },
    {
        $Type: 'UI.DataField',
        Value: Department_Name
    },
    {
        $Type: 'UI.DataField',
        Value: Head_of_Department
    },
    {
        $Type: 'UI.DataField',
        Value: Status
    }
];