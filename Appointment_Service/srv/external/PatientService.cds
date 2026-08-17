@cds.external
service PatientService  {

       entity Patients{
        key ID:UUID;
        patientNo:String(50);
        firstName:String(50);
        lastName:String(50);
        gender:String(10);
        isActive:Boolean;
       }
}