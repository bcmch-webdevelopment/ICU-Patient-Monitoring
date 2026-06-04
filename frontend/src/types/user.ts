export type Designation = 
  | 'ICU Doctor' 
  | 'Duty Doctor' 
  | 'Consultant Doctor' 
  | 'ICU Nurse' 
  | 'Senior Nurse' 
  | 'Chief Nurse' 
  | 'ICU Administrator' 
  | 'Hospital Administrator' 
  | 'Reception Staff';

export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  designation: Designation;
}
