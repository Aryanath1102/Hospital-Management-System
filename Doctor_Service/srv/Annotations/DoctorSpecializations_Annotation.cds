using DoctorService from '../Doctor_Service';

annotate DoctorService.DoctorSpecializations with @(
    UI.HeaderInfo: {
        TypeName: 'Doctor Specialization',
        TypeNamePlural: 'Doctor Specializations',
        Title: { Value: Specializations.Name }
    },
    UI.LineItem: [
        { $Type: 'UI.DataField', Value: Specializations_ID },
        { $Type: 'UI.DataField', Value: Certification_Date },
        { $Type: 'UI.DataField', Value: Primary_Specialization },
        { $Type: 'UI.DataField', Value: Experience_In_Specialization },
        { $Type: 'UI.DataField', Value: Remarks }
    ],
    UI.Facets: [
        {
            $Type: 'UI.ReferenceFacet',
            Label: 'Specialization Details',
            Target: '@UI.FieldGroup#SpecializationDetails'
        }
    ],
    UI.FieldGroup #SpecializationDetails: {
        Label: 'Specialization Details',
        Data: [
            { $Type: 'UI.DataField', Value: Specializations_ID },
            { $Type: 'UI.DataField', Value: Certification_Date },
            { $Type: 'UI.DataField', Value: Primary_Specialization },
            { $Type: 'UI.DataField', Value: Experience_In_Specialization },
            { $Type: 'UI.DataField', Value: Remarks }
        ]
    }
);

annotate DoctorService.DoctorSpecializations with {
    Specializations @(
        Common.Label: 'Specialization',
        Common.Text: Specializations.Name,
        Common.TextArrangement: #TextOnly,
        Common.ValueList: {
            $Type: 'Common.ValueListType',
            CollectionPath: 'Specializations',
            Parameters: [
                { $Type: 'Common.ValueListParameterInOut', LocalDataProperty: Specializations_ID, ValueListProperty: 'ID' },
                { $Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'Name' }
            ]
        }
    );

    Certification_Date           @Common.Label: 'Certification Date';
    Primary_Specialization       @Common.Label: 'Primary Specialization';
    Experience_In_Specialization @Common.Label: 'Years of Experience';
    Remarks                      @Common.Label: 'Remarks';
};