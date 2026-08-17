    namespace hospital;

    using {managed} from '@sap/cds/common';

    type Status        : String enum {
        Active   = 'Active';
        Inactive = 'Inactive';
    }

    type Doctor_Status : String enum {
        Active    = 'Active';
        Inactive  = 'Inactive';
        Suspended = 'Suspended';
        Retired   = 'Retired';
    }

    type Gender        : String enum {
        Male   = 'Male';
        Female = 'Female';
        Others = 'Others';
    }

    type Availability  : String enum {
        Available      = 'Available';
        On_Leave       = 'On_Leave';
        In_Surgery     = 'In_Surgery';
        Emergency_Duty = 'Emergency_Duty';
        Vacation       = 'Vacation';
        Training       = 'Training';
    }

    type WeekDay       : String enum {
        Monday    = 'Monday';
        Tuesday   = 'Tuesday';
        Wednesday = 'Wednesday';
        Thursday  = 'Thursday';
        Friday    = 'Friday';
        Saturday  = 'Saturday';
        Sunday    = 'Sunday';
    }

    type LeaveStatus   : String enum {
        Pending   = 'Pending';
        Approved  = 'Approved';
        Rejected  = 'Rejected';
        Cancelled = 'Cancelled';
    }

    entity Departments : managed {
        key ID                 : UUID;
            Department_Code    : String(10);
            Department_Name    : String(100);
            Description        : String(100);
            Phone_Extension    : String(5);
            Head_of_Department : String(50);
            Building           : Association to Buildings;
            floor              : String(10);
            Status             : Status default 'Active';
    }

    entity Doctors : managed {
        key ID                     : UUID;
            Doctor_Code            : String(10);
            First_Name             : String(20);
            Last_Name              : String(20);
            
            /* 
            Maintained as a standard string to prevent Draft Engine errors. 
            Will be populated dynamically via Doctor_Service.js during SAVE. 
            */
            Full_Name              : String(100);
            
            Gender                 : Gender;
            Department             : Association to Departments;
            Joining_Date           : Date;
            Experience             : Decimal(4, 1);
            Qualification          : String(100);
            Registration_Number    : String(50);
            
            Doctor_Specializations : Composition of many DoctorSpecializations on Doctor_Specializations.Doctor = $self;
            Doctor_Schedule        : Composition of many DoctorSchedules on Doctor_Schedule.Doctor = $self;
            Doctor_Leaves          : Composition of many DoctorLeaves on Doctor_Leaves.Doctor = $self;
            
            Phone                  : String(20);
            Email                  : String(100);
            Consultation_Fee       : Integer;
            Room_Number            : String(10);
            Availability           : Availability;
            Doctor_Status          : Doctor_Status default 'Active';
    }

    entity Specializations : managed {
        key ID                  : UUID;
            Specialization_Code : String(10);
            Name                : String(100);
            Normalized_Name     : String(100);
            Description         : String(100);
            Department          : Association to Departments;
            Status              : Status default 'Active';
    }

    entity DoctorSpecializations : managed {
        key ID                           : UUID;
            Doctor                       : Association to Doctors;
            Specializations              : Association to Specializations;
            Certification_Date           : Date;
            Primary_Specialization       : Boolean;
            Experience_In_Specialization : Decimal(4, 1);
            Remarks                      : LargeString;
    }

    entity DoctorSchedules : managed {
        key ID         : UUID;
            Doctor     : Association to Doctors;
            Day        : WeekDay;
            Start_Time : Time;
            End_Time   : Time;
    }

    entity DoctorLeaves : managed {
        key ID          : UUID;
            Doctor      : Association to Doctors;
            From_Date   : Date;
            To_Date     : Date;
            Reason      : String(200);
            LeaveStatus : LeaveStatus;
    }

    entity NumberRanges {
        key Object        : String(30);
            CurrentNumber : Integer;
            Version       : Integer default 1;
    }

    entity Buildings : managed {
        key ID            : UUID;
            Building_Code : String(10);
            Building_Name : String(100);
            Description   : String(100);
            Status        : Status default 'Active';
    }