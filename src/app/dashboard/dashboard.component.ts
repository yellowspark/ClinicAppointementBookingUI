import { Component } from '@angular/core';
declare var $: any; // Use same as jquery
import * as bootstrap from 'bootstrap';
import { NgForm } from '@angular/forms';
import {
  AppointmentInterface,
  ServiceDataInterface,
  UserDetailsInterface,
} from 'src/app/Interface/Interface';
import { AuthenticationService } from 'src/services/authentication.service';
import { DashboardService } from 'src/services/dashboard.service';

const NameRegex = /^[a-zA-Z ]*$/;
const EmailRegex = /^\S+@\S+\.\S+$/;
const MobileRegex = /^\d{10}$/;
const PANRegex = /^[A-Z0-9]{12}$/;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  displayedColumns: string[] = [
    'id',
    // 'createdDate',
    'clientName',
    'appointmentDate',
    'appointmentTime',
    'clinicName',
    'service',
    'status',
    'setting',
  ];

  ServiceDataColumns: string[] = [
    'id',
    'clinicName',
    'clinicAddress',
    'setting',
  ];

  List: AppointmentInterface[] = [];
  UserDetails = <UserDetailsInterface>{};
  ServiceDataList: ServiceDataInterface[] = [];
  _ServiceDataList: ServiceDataInterface[] = [];

  _userID = localStorage.getItem('admin-user-id') || '{}';

  id: String = '';
  userID: String = '';

  IsHome: Boolean = true;
  IsEdit: Boolean = false;
  IsSaved: Boolean = false;

  clinicId = 0;
  clinicName = '';
  clinicAddress = '';

  constructor(private _dashboardServices: DashboardService) {}

  //
  async ngOnInit() {
    console.log(localStorage.getItem('admin-jwt-token'));
    if (localStorage.getItem('admin-jwt-token') === null) {
      window.location.href = '/';
    }
    if (localStorage.getItem('admin-home') === 'true') {
      await this.handleHome();
    }
    await this.GetAppointment();
    this.GetServiceDataList();
  }

  //
  GetServiceDataList() {
    this._dashboardServices.GetServicesList().subscribe(
      (result: any) => {
        console.log('GetAppointment Data : ', result);
        if (result.isSuccess) {
          this.ServiceDataList = result.data as ServiceDataInterface[];
        }
      },
      (error: any) => {
        $('.toast-title').text('Error');
        $('.toast-body').text('Something went wrong');
        $('#ToastOperation').addClass('bg-danger').toast('show');
      }
    );
  }

  //
  GetAppointment() {
    this._dashboardServices.GetAppointment(this._userID).subscribe(
      (result: any) => {
        console.log('GetAppointment Data : ', result);
        if (result.isSuccess) {
          this.List = result.data as AppointmentInterface[];
        }
      },
      (error: any) => {
        $('.toast-title').text('Error');
        $('.toast-body').text('Something went wrong');
        $('#ToastOperation').addClass('bg-danger').toast('show');
      }
    );
  }

  //
  async handleHome() {
    this.IsHome = true;
    $('#home-menu').addClass('active');
    await this.GetClaimList();

    //set local storage flag
    localStorage.setItem('admin-home', 'true');
  }

  //
  handleUpdateProfile() {
    $('#exampleEditProfileModal').modal('show');
  }

  //
  handleAddAppointment() {
    $('._header').html('Add Appointment');
    $('#patientName').val('');
    $('#appointmentDate').val('');
    $('#appointmentTime').val('');
    $('#clinicAddress').val('');
    $('#appointmentService').val('');

    $('#buttonOperation').html('Save');

    this.IsEdit = false;
    $('#exampleModal').modal('show');
  }

  //
  GetClaimList() {
    // this._dashboardServices.GetClaim(this._userID).subscribe(
    //   (result: any) => {
    //     debugger;
    //     console.log('GetClaimList Data : ', result);
    //     this.List = [];
    //     if (result.isSuccess) {
    //       this.List = result.data;
    //     }
    //   },
    //   (error: any) => {
    //     $('.toast-title').text('Error');
    //     $('.toast-body').text('Something went wrong');
    //     $('#ToastOperation').addClass('bg-danger').toast('show');
    //   }
    // );
  }

  handleServiceDataList() {
    debugger;
    let ServiceName = $('#appointmentService').val();
    $('#clinicName').val('');
    $('#clinicAddress').val('');
    this._ServiceDataList = [];
    this.IsSaved = false;
    if (ServiceName) {
      this._ServiceDataList = this.ServiceDataList.filter(
        (x) => x.serviceName.toLowerCase() === ServiceName.toLowerCase()
      );
      $('#ServiceBlock').show();
    }
  }

  //
  handleSubmit(formData: NgForm) {
    console.log('formData : ', formData);
    if (this.Validation()) {
      debugger;
      if (!this.IsEdit) {
        this.AddAppointment();
      } else {
        this.UpdateAppointment();
      }
    } else {
      $('.toast-title').text('Error');
      $('.toast-body').text('Please Enter Required Field');
      $('#ToastOperation').addClass('bg-danger').toast('show');
    }
  }

  //
  prepareDataBody() {
    return {
      id: this.id,
      userID: this._userID,
      clientName: $('#patientName').val(),
      appointmentDate: $('#appointmentDate').val(),
      appointmentTime: $('#appointmentTime').val(),
      clinicName: $('#clinicName').val(),
      clinicAddress: $('#clinicAddress').val(),
      service: $('#appointmentService').val(),
    };
  }

  //
  AddAppointment() {
    let _data = this.prepareDataBody();
    this._dashboardServices.AddAppointment(_data).subscribe(
      (result: any) => {
        console.log('AddAppointment Data : ', result);
        $('.toast-body').text(result.message);
        $('.toast-title').text(result.isSuccess ? 'Success' : 'Error');
        $('#ToastOperation')
          .addClass(result.isSuccess ? 'bg-success' : 'bg-danger')
          .toast('show');
        if (result.isSuccess) {
          $('#exampleModal').modal('hide');
          this.handleClearData();
          this.GetAppointment();
          this.handleHome();
        }
      },
      (error: any) => {
        $('.toast-title').text('Error');
        $('.toast-body').text('Something went wrong');
        $('#ToastOperation').addClass('bg-danger').toast('show');
      }
    );
  }
  //
  UpdateAppointment() {
    let _data = this.prepareDataBody();
    this._dashboardServices.UpdateAppointment(_data).subscribe(
      (result: any) => {
        console.log('UpdateAppointment Data : ', result);
        $('.toast-body').text(result.message);
        $('.toast-title').text(result.isSuccess ? 'Success' : 'Error');
        $('#ToastOperation')
          .addClass(result.isSuccess ? 'bg-success' : 'bg-danger')
          .toast('show');
        if (result.isSuccess) {
          $('#exampleModal').modal('hide');
          this.handleClearData();
          this.GetAppointment();
          this.handleHome();
        }
      },
      (error: any) => {
        $('.toast-title').text('Error');
        $('.toast-body').text('Something went wrong');
        $('#ToastOperation').addClass('bg-danger').toast('show');
      }
    );
  }

  //
  handleDelete(id: String) {
    this._dashboardServices.DeleteAppointment(id).subscribe((result: any) => {
      console.log('handle Delete Appointment : ', result);
      $('.toast-title').text(result?.isSuccess ? 'Success' : 'Error');
      $('.toast-body').text(result?.message);
      $('#ToastOperation')
        .addClass(result?.isSuccess ? 'bg-success' : 'bg-danger')
        .toast('show');
      this.GetAppointment();
    });
  }

  //
  handleEdit(data: any) {
    console.log(' Editing Data : ', data);

    this.id = data.id;
    this.userID = data.userID;
    this.IsSaved = true;

    debugger;
    $('._header').html('Update Appointment');
    $('#patientName').val(data.clientName);
    $('#appointmentDate').val(data.appointmentDate);
    $('#appointmentTime').val(data.appointmentTime);
    $('#clinicName').val(data.clinicName);
    $('#clinicAddress').val(data.clinicAddress);
    $('#appointmentService').val(data.service);

    $('#buttonOperation').html('Update');

    this.IsEdit = true;
    $('#exampleModal').modal('show');
  }

  //
  handleClearData() {
    this.id = '';

    $('#patientName').val('');
    $('#appointmentDate').val('');
    $('#appointmentTime').val('');
    $('#clinicAddress').val('');
    $('#appointmentService').val('');

    this.IsEdit = false;
  }

  //
  Validation() {
    $('#patientNameText').hide();
    $('#appointmentDateText').hide();
    $('#appointmentTimeText').hide();
    $('#clinicAddressText').hide();
    $('#clinicNameText').hide();
    $('#appointmentServiceText').hide();
    debugger;
    let Value = true;
    let patientName = $('#patientName').val();
    if (!$('#patientName').val()) {
      $('#patientNameText').show();
      $('#patientName').addClass('ng-invalid ng-touched');
      Value = false;
    }
    let appointmentDate = $('#appointmentDate').val();
    if (!$('#appointmentDate').val()) {
      $('#appointmentDateText').show();
      $('#appointmentDate').addClass('ng-invalid ng-touched');
      Value = false;
    }
    let appointmentTime = $('#appointmentTime').val();
    if (!$('#appointmentTime').val()) {
      $('#appointmentTimeText').show();
      $('#appointmentTime').addClass('ng-invalid ng-touched');
      Value = false;
    }
    let clinicName = $('#clinicName').val();
    if (!$('#clinicName').val()) {
      $('#clinicNameText').show();
      $('#clinicName').addClass('ng-invalid ng-touched');
      Value = false;
    }

    let clinicAddress = $('#clinicAddress').val();
    if (!$('#clinicAddress').val()) {
      $('#clinicAddressText').show();
      $('#clinicAddress').addClass('ng-invalid ng-touched');
      Value = false;
    }
    let ServiceValue = $('#appointmentService').val();
    if (ServiceValue === '') {
      $('#appointmentServiceText').show();
      $('#appointmentService').addClass('ng-invalid ng-touched');
      Value = false;
    }

    return Value;
  }

  commonClearErrorjQuery(_id: string) {
    $('#' + _id).removeClass('ng-invalid ng-touched');
    $('#' + _id + 'Text').hide();
  }

  commonErrorjQuery(_id: string, _message: string) {
    $('#' + _id).addClass('ng-invalid ng-touched');
    $('#' + _id + 'Text')
      .text(_message)
      .css('color', 'red')
      .show();
  }

  handleSelectClinic(data: any) {
    $('#clinicName').val(data.clinicName);
    $('#clinicAddress').val(data.clinicAddress);

    this.clinicId = data.id;
    this.clinicName = data.clinicName;
    this.clinicAddress = data.clinicAddress;
    this.IsSaved = true;
  }

  handleSignOut() {
    localStorage.removeItem('admin-user-id');
    localStorage.removeItem('admin-email');
    localStorage.removeItem('admin-jwt-token');
    localStorage.removeItem('admin-home');
    localStorage.removeItem('admin-order');
    if (localStorage.getItem('user-jwt-token') === null) {
      localStorage.removeItem('common-jwt-token');
    }
    window.location.href = '/';
  }
}
