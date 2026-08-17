namespace hospital;

using {
                           cuid,
                           managed,
    sap.common.CodeList as CodeList
} from '@sap/cds/common';

entity AppointmentTypes : CodeList {
    key code : String enum {
            Consultation = 'Consultation';
            Follow_up = 'Follow-up';
            Emergency = 'Emergency';
        }
}

entity AppointmentStatus : CodeList {
    key code : String enum {
            Scheduled = 'Scheduled';
            Confirmed = 'Confirmed';
            Completed = 'Completed';
            Cancelled = 'Cancelled';
        }
}


entity Appointments : cuid, managed {
    Appointment_Code : String(10);
    Patient_ID       : UUID;
    Doctor_ID        : UUID;
    Appointment_Date : Date;
    Start_Time       : Time;
    End_Time         : Time;
    Type             : Association to AppointmentTypes;
    Status           : Association to AppointmentStatus;
    Reason           : String(200);

}
