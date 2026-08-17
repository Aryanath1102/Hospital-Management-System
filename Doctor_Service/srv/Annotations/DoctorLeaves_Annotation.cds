using DoctorService from '../Doctor_Service';

annotate DoctorService.DoctorLeaves with @(
    UI.HeaderInfo: {
        TypeName      : 'Doctor Leave',
        TypeNamePlural: 'Doctor Leaves',
        Title         : { Value: LeaveStatus },
        Description   : { Value: Reason }
    },
    
    UI.SelectionFields: [
        From_Date,
        To_Date,
        LeaveStatus
    ],
    
    UI.LineItem: [
        { $Type: 'UI.DataField', Value: From_Date },
        { $Type: 'UI.DataField', Value: To_Date },
        { $Type: 'UI.DataField', Value: Reason },
        { $Type: 'UI.DataField', Value: LeaveStatus }
    ],
    
    UI.Identification: [
        { $Type: 'UI.DataField', Value: From_Date },
        { $Type: 'UI.DataField', Value: To_Date },
        { $Type: 'UI.DataField', Value: LeaveStatus },
        { $Type: 'UI.DataField', Value: Reason }
    ],
    
    UI.Facets: [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Leave Details',
            Target: '@UI.FieldGroup#LeaveDetails'
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Leave Period',
            Target: '@UI.FieldGroup#LeavePeriod'
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Leave Status',
            Target: '@UI.FieldGroup#LeaveStatusDetails'
        }
    ],
    
    UI.FieldGroup #LeaveDetails: {
        Label: 'Leave Details',
        Data : [
            { $Type: 'UI.DataField', Value: From_Date },
            { $Type: 'UI.DataField', Value: To_Date },
            { $Type: 'UI.DataField', Value: Reason },
            { $Type: 'UI.DataField', Value: LeaveStatus }
        ]
    },
    
    UI.FieldGroup #LeavePeriod: {
        Label: 'Leave Period',
        Data : [
            { $Type: 'UI.DataField', Value: From_Date },
            { $Type: 'UI.DataField', Value: To_Date }
        ]
    },
    
    UI.FieldGroup #LeaveStatusDetails: {
        Label: 'Leave Status',
        Data : [
            { $Type: 'UI.DataField', Value: LeaveStatus },
            { $Type: 'UI.DataField', Value: Reason }
        ]
    }
);

/* Element-Level Annotations (Labels) */
annotate DoctorService.DoctorLeaves with {
    From_Date   @Common.Label: 'From Date';
    To_Date     @Common.Label: 'To Date';
    Reason      @Common.Label: 'Reason';
    LeaveStatus @Common.Label: 'Leave Status';
};