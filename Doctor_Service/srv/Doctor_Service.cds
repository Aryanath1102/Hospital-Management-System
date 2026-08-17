using {hospital} from '../db/Schema';

using from './Annotations/Doctors_Annotation';
using from './Annotations/Departments_Annotations';
using from './Annotations/Specializations_Annotation';
using from './Annotations/Buildings_Annotation';
using from './Annotations/DoctorSpecializations_Annotation';
using from './Annotations/DoctorSchedules_Annotation';
using from './Annotations/DoctorLeaves_Annotation';

@title : 'Hospital Management API'
@Core.Description: ```
REST API for Hospital Management System.

Features:
- Buildings
- Departments
- Doctors
- Specializations
- Doctor Schedules
- Doctor Leaves
- Doctor Actions
```

@requires : 'authenticated-user'
service DoctorService {
    entity Buildings as projection on hospital.Buildings;

entity Departments as projection on hospital.Departments;

entity Specializations as projection on hospital.Specializations;

@odata.draft.enabled
@restrict: [
    {
        grant: ['READ'],
        to   : ['DoctorServiceReader','admin', 'doctor']
    },
    {
        grant: ['CREATE', 'UPDATE', 'DELETE'],
        to   : ['admin']
    }
]
entity Doctors as projection on hospital.Doctors {
    *
} actions {
    action ActivateDoctor();
    action SuspendDoctor();
    action RetireDoctor();
};

@restrict: [
    {
        grant: ['READ'],
        to   : ['DoctorServiceReader','admin', 'doctor']
    },
    {
        grant: ['CREATE', 'UPDATE', 'DELETE'],
        to   : ['admin']
    }
    ]
entity DoctorSpecializations as projection on hospital.DoctorSpecializations;

@restrict: [
    {
        grant: ['READ'],
        to   : ['DoctorServiceReader','admin', 'doctor']
    },
    {
        grant: ['CREATE', 'UPDATE', 'DELETE'],
        to   : ['admin']
    }
]
entity DoctorSchedules as projection on hospital.DoctorSchedules;

@restrict: [
    {
        grant: ['READ'],
        to   : ['DoctorServiceReader','admin', 'doctor']
    },
    {
        grant: ['CREATE', 'UPDATE', 'DELETE'],
        to   : ['admin']
    }
]
entity DoctorLeaves as projection on hospital.DoctorLeaves actions {
    action ApproveLeave();
    action RejectLeave();
    action CancelLeave();
};

}