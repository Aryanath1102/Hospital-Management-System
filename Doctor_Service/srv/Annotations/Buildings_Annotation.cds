using DoctorService from '../Doctor_Service';

annotate DoctorService.Buildings with @UI.LineItem: [
    {
        $Type: 'UI.DataField',
        Value: Building_Code
    },
    {
        $Type: 'UI.DataField',
        Value: Building_Name
    },
    {
        $Type: 'UI.DataField',
        Value: Description
    },
    {
        $Type: 'UI.DataField',
        Value: Status
    }
];

annotate DoctorService.Buildings with @UI.SelectionFields: [
    Building_Code,
    Building_Name,
    Status
];

annotate DoctorService.Buildings with @UI.HeaderInfo: {
    TypeName: 'Building',
    TypeNamePlural: 'Buildings',

    Title: {
        Value: Building_Name
    },

    Description: {
        Value: Building_Code
    }
};

annotate DoctorService.Buildings with @UI.FieldGroup #BuildingDetails: {
    Label: 'Building Details',

    Data: [
        {
            $Type: 'UI.DataField',
            Value: Building_Code
        },
        {
            $Type: 'UI.DataField',
            Value: Building_Name
        },
        {
            $Type: 'UI.DataField',
            Value: Description
        },
        {
            $Type: 'UI.DataField',
            Value: Status
        }
    ]
};

annotate DoctorService.Buildings with @UI.Facets: [
    {
        $Type: 'UI.ReferenceFacet',
        Label: 'Building Details',
        Target: '@UI.FieldGroup#BuildingDetails'
    }
];

annotate DoctorService.Buildings with @UI.Identification: [
    {
        $Type: 'UI.DataField',
        Value: Building_Code
    },
    {
        $Type: 'UI.DataField',
        Value: Building_Name
    },
    {
        $Type: 'UI.DataField',
        Value: Status
    }
];