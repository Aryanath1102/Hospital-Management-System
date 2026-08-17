using DoctorService from '../Doctor_Service';

annotate DoctorService.DoctorSchedules with @(
    UI.HeaderInfo: {
        TypeName      : 'Doctor Schedule',
        TypeNamePlural: 'Doctor Schedules',
        Title         : { Value: Day },
        Description   : { Value: Start_Time }
    },
    
    UI.SelectionFields: [
        Day
    ],
    
    UI.LineItem: [
        { $Type: 'UI.DataField', Value: Day },
        { $Type: 'UI.DataField', Value: Start_Time },
        { $Type: 'UI.DataField', Value: End_Time }
    ],
    
    UI.Identification: [
        { $Type: 'UI.DataField', Value: Day },
        { $Type: 'UI.DataField', Value: Start_Time },
        { $Type: 'UI.DataField', Value: End_Time }
    ],
    
    UI.Facets: [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Schedule Details',
            Target: '@UI.FieldGroup#ScheduleDetails'
        }
    ],
    
    UI.FieldGroup #ScheduleDetails: {
        Label: 'Schedule Details',
        Data : [
            { $Type: 'UI.DataField', Value: Day },
            { $Type: 'UI.DataField', Value: Start_Time },
            { $Type: 'UI.DataField', Value: End_Time }
        ]
    }
);

/* Element-Level Annotations (Labels) */
annotate DoctorService.DoctorSchedules with {
    Day        @Common.Label: 'Day of Week';
    Start_Time @Common.Label: 'Start Time';
    End_Time   @Common.Label: 'End Time';
};