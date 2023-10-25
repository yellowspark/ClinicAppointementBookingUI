import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/enviroments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private _httpClient: HttpClient) {}

  AddAppointment(data: any) {
    return this._httpClient.post(
      environment.BEServer.DevEnviroment + `Appointment/AddAppointment`,
      data
    );
  }

  UpdateAppointment(data: any) {
    return this._httpClient.put(
      environment.BEServer.DevEnviroment + `Appointment/UpdateAppointment`,
      data
    );
  }

  GetAppointment(data: string) {
    return this._httpClient.get(
      environment.BEServer.DevEnviroment +
        `Appointment/GetAppointment?userID=` +
        data
    );
  }

  DeleteAppointment(data: any) {
    return this._httpClient.delete(
      environment.BEServer.DevEnviroment +
        `Appointment/DeleteAppointment?Id=` +
        data
    );
  }

  GetServicesList() {
    return this._httpClient.get(
      environment.BEServer.DevEnviroment +
        `Appointment/GetServicesList`
    );
  }
}
