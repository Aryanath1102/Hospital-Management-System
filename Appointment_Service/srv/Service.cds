using {hospital} from '../db/Schema';


service ProcessorService {
    @odata.draft.enabled
    entity Appointments as projection on hospital.Appointments;
    
    @readonly
    entity AppointmentTypes as projection on hospital.AppointmentTypes;

    @readonly
    entity AppointmentStatus  as projection on hospital.AppointmentStatus ;

}

service AdminService {
    entity Appointments as projection on hospital.Appointments;

}
