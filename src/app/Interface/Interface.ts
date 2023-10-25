export interface UserDetailsInterface {
  id: string;
  createdDate: string;
  memberID: string;
  name: string;
  emailID: string;
  address: string;
  state: string;
  country: string;
  panNumber: string;
  contactNumber: string;
  dateOfBirth: string;
  age: Number;
  isActive: Boolean;
}

export interface AppointmentInterface {
  id: string;
  createdDate: string;
  patientName: string;
  appointmentDate: string;
  appointmentTime: string;
  clinicName: string;
  clinicAddress: string;
  service: string;
  status: string;
}

export interface ServiceDataInterface {
  id: string;
  serviceName: string;
  clinicName: string;
  clinicAddress: string;
}
