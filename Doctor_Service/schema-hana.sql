----- hospital.Departments.hdbtable -----
COLUMN TABLE hospital_Departments (
  createdAt TIMESTAMP,
  createdBy NVARCHAR(255),
  modifiedAt TIMESTAMP,
  modifiedBy NVARCHAR(255),
  ID NVARCHAR(36) NOT NULL,
  Department_Code NVARCHAR(10),
  Department_Name NVARCHAR(100),
  Description NVARCHAR(100),
  Phone_Extension NVARCHAR(5),
  Head_of_Department NVARCHAR(50),
  Building_ID NVARCHAR(36),
  "FLOOR" NVARCHAR(10),
  Status NVARCHAR(5000) DEFAULT 'Active',
  PRIMARY KEY(ID)
)
----- hospital.Buildings.hdbtable -----
COLUMN TABLE hospital_Buildings (
  createdAt TIMESTAMP,
  createdBy NVARCHAR(255),
  modifiedAt TIMESTAMP,
  modifiedBy NVARCHAR(255),
  ID NVARCHAR(36) NOT NULL,
  Building_Code NVARCHAR(10),
  Building_Name NVARCHAR(100),
  Description NVARCHAR(100),
  Status NVARCHAR(5000) DEFAULT 'Active',
  PRIMARY KEY(ID)
)
----- hospital.Doctors.hdbtable -----
COLUMN TABLE hospital_Doctors (
  createdAt TIMESTAMP,
  createdBy NVARCHAR(255),
  modifiedAt TIMESTAMP,
  modifiedBy NVARCHAR(255),
  ID NVARCHAR(36) NOT NULL,
  Doctor_Code NVARCHAR(10),
  First_Name NVARCHAR(20),
  Last_Name NVARCHAR(20),
  Full_Name NVARCHAR(100),
  Gender NVARCHAR(5000),
  Department_ID NVARCHAR(36),
  Joining_Date DATE,
  Experience DECIMAL(4, 1),
  Qualification NVARCHAR(100),
  Registration_Number NVARCHAR(50),
  Phone NVARCHAR(20),
  Email NVARCHAR(100),
  Consultation_Fee INTEGER,
  Room_Number NVARCHAR(10),
  Availability NVARCHAR(5000),
  Doctor_Status NVARCHAR(5000) DEFAULT 'Active',
  PRIMARY KEY(ID)
)
----- hospital.DoctorSpecializations.hdbtable -----
COLUMN TABLE hospital_DoctorSpecializations (
  createdAt TIMESTAMP,
  createdBy NVARCHAR(255),
  modifiedAt TIMESTAMP,
  modifiedBy NVARCHAR(255),
  ID NVARCHAR(36) NOT NULL,
  Doctor_ID NVARCHAR(36),
  Specializations_ID NVARCHAR(36),
  Certification_Date DATE,
  Primary_Specialization BOOLEAN,
  Experience_In_Specialization DECIMAL(4, 1),
  Remarks NCLOB,
  PRIMARY KEY(ID)
)
----- hospital.Specializations.hdbtable -----
COLUMN TABLE hospital_Specializations (
  createdAt TIMESTAMP,
  createdBy NVARCHAR(255),
  modifiedAt TIMESTAMP,
  modifiedBy NVARCHAR(255),
  ID NVARCHAR(36) NOT NULL,
  Specialization_Code NVARCHAR(10),
  Name NVARCHAR(100),
  Normalized_Name NVARCHAR(100),
  Description NVARCHAR(100),
  Department_ID NVARCHAR(36),
  Status NVARCHAR(5000) DEFAULT 'Active',
  PRIMARY KEY(ID)
)
----- hospital.DoctorSchedules.hdbtable -----
COLUMN TABLE hospital_DoctorSchedules (
  createdAt TIMESTAMP,
  createdBy NVARCHAR(255),
  modifiedAt TIMESTAMP,
  modifiedBy NVARCHAR(255),
  ID NVARCHAR(36) NOT NULL,
  Doctor_ID NVARCHAR(36),
  Day NVARCHAR(5000),
  Start_Time TIME,
  End_Time TIME,
  PRIMARY KEY(ID)
)
----- hospital.DoctorLeaves.hdbtable -----
COLUMN TABLE hospital_DoctorLeaves (
  createdAt TIMESTAMP,
  createdBy NVARCHAR(255),
  modifiedAt TIMESTAMP,
  modifiedBy NVARCHAR(255),
  ID NVARCHAR(36) NOT NULL,
  Doctor_ID NVARCHAR(36),
  From_Date DATE,
  "TO_DATE" DATE,
  Reason NVARCHAR(200),
  LeaveStatus NVARCHAR(5000),
  PRIMARY KEY(ID)
)
----- hospital.NumberRanges.hdbtable -----
COLUMN TABLE hospital_NumberRanges (
  Object NVARCHAR(30) NOT NULL,
  CurrentNumber INTEGER,
  Version INTEGER DEFAULT 1,
  PRIMARY KEY(Object)
)
