@cds.external

service DoctorService {
    entity Doctors{
        key ID:UUID;
        Doctor_Status   :String;
        Availability    :String;    
    }
    

}