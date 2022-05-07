declare var $: any;

import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as jquery from 'jquery';
//import * as jquery from 'jquery';
import { AppService } from 'src/app/Services/app.service';
import { NotificationService } from 'src/app/Services/notification.service';

@Component({
  selector: 'app-role-permissions-add-edit',
  templateUrl: './role-permissions-add-edit.component.html',
  styleUrls: ['./role-permissions-add-edit.component.css']
})
export class RolePermissionsAddEditComponent implements OnInit {

  RolePermissionsForm: FormGroup;
  errorMessage;
  RolePermissionsRegistrationForm = {
    Id: 0,
    HotelID: "",
    ModuleID: "",
    RoleID: "",
    View: false,
    Add: false,
    Update: false,
    Delete: false,
  };


  SelectedView = false;
  SelectedAdd = false;
  SelectedUpdate = false;
  SelectedDelete = false;


  submitted = false;
  Leadid: any;
  HotelList = [];
  SelectedHotelID = "";
  ModuleList = [];
  SelectedModuleID = "";
  RoleList = [];
  SelectedRoleID = "";
  constructor(public route: ActivatedRoute, private formBuilder: FormBuilder, private appService: AppService, private router: Router, private notifyService: NotificationService ) { }

  ngOnInit(): void {
    this.GetAllRolePermissionDropdown();

    this.Leadid = this.route.snapshot.paramMap.get("id");
    if (this.Leadid) {
      this.GetRolePermissionById(this.Leadid);
    }
    else {
      setTimeout(() => {
        //this.isVisible = true 
      }, 1000);
    }


    this.RolePermissionsForm = this.formBuilder.group(
      {
        SelectedHotelID: ["", [Validators.required]],
        SelectedModuleID: ["", [Validators.required]],
        SelectedRoleID: ["", [Validators.required]]
      },
      {
        // Used custom form validator name
        //validator: ComparePassword("Password", "ConfirmPassword")
      }
    );

    var that = this;
    jquery('.select2').select2();
  }
  // Getter function in order to get form controls value
  get f() {
    return this.RolePermissionsForm.controls;
  }

  BackToList() {
    this.router.navigate(['RolePermissions']);
  }


  SetChangeEvent() {
    var that = this;
    setTimeout(() => {
      jquery("#dropdownHotel").on("change", function () {
        setTimeout(() => {
          if ($(this).val()) {
            that.SelectedHotelID = $(this).val();
            that.f.SelectedHotelID.markAsTouched();
            that.f.SelectedHotelID.markAsDirty();
            that.f.SelectedHotelID.setValue('valid', true);
          }
          else {
            this.SelectedHotelID = "0";
          }
        }, 500);
      });

      jquery("#dropdownRole").on("change", function () {
        setTimeout(() => {
          if ($(this).val()) {
            that.SelectedRoleID = $(this).val();
            that.f.SelectedRoleID.markAsTouched();
            that.f.SelectedRoleID.markAsDirty();
            that.f.SelectedRoleID.setValue('valid', true);
          }
          else {
            this.SelectedRoleID = "0";
          }
        }, 500);
      });

      jquery("#dropdownModule").on("change", function () {
        setTimeout(() => {
          if ($(this).val()) {
            that.SelectedModuleID = $(this).val();
            that.f.SelectedModuleID.markAsTouched();
            that.f.SelectedModuleID.markAsDirty();
            that.f.SelectedModuleID.setValue('valid', true);
          }
          else {
            this.SelectedModuleID = "0";
          }
        }, 500);
      });
    }, 500);
  }

  ClearForm() {
    this.RolePermissionsRegistrationForm.HotelID = "";
  }

  GetRolePermissionById(Id) {
    this.appService.GetNoToken("RolePermissions", "GetRolePermissionById?Id=" + Id)

      .subscribe(
        (res: any) => {
          var objResult = res//.json()
          if (objResult && objResult.ErrorNumber == "0") {
            this.RolePermissionsRegistrationForm.Id = objResult.Data.Id;
            this.RolePermissionsRegistrationForm.HotelID = objResult.Data.HotelID;
            this.SelectedHotelID = objResult.Data.HotelID;

            this.RolePermissionsRegistrationForm.ModuleID = objResult.Data.ModuleID;
            this.SelectedModuleID = objResult.Data.ModuleID;

            this.RolePermissionsRegistrationForm.RoleID = objResult.Data.RoleID;
            this.SelectedRoleID = objResult.Data.RoleID;
            this.SelectedView = objResult.Data.View;
            this.SelectedAdd = objResult.Data.Add;
            this.SelectedUpdate = objResult.Data.Update;
            this.SelectedDelete = objResult.Data.Delete;

            this.SetDropdown();
          }
        },
        error =>
          this.errorMessage = <any>error

      );
  }

  SubmitRolePermissions() {
    this.submitted = true;
    // Returns false if form is invalid
    if (this.RolePermissionsForm.invalid) {
      return;
    }
    var objStatus = {
      "Id": this.RolePermissionsRegistrationForm.Id,
      "HotelID": this.SelectedHotelID,
      "ModuleID": this.SelectedModuleID,
      "RoleID": this.SelectedRoleID,
      "View": this.SelectedView,
      "Add": this.SelectedAdd,
      "Update": this.SelectedUpdate,
      "Delete": this.SelectedDelete,
      "CreatedBy": localStorage.getItem("UserId"),
      "UpdatedBy": localStorage.getItem("UserId")
    };

    this.appService.PostToken("RolePermissions", "SaveRolePermission", objStatus)
      .subscribe(
        (res: any) => {
          if (res) {
            var resultbody = res//.json()
            if (resultbody.ErrorNumber == 0) {
              this.notifyService.showSuccess("Maintenance status successfully added.", "")
              this.router.navigate(['RolePermissions']);
            }
            else if (resultbody.ErrorNumber == 1) {
              this.notifyService.showSuccess("Maintenance status successfully updated.", "")
              this.router.navigate(['RolePermissions']);
            }
            else {
              this.notifyService.showError("Error#" + resultbody.ErrorNumber + " : " + resultbody.ErrorMessage, "");
            }

          } else {
            this.notifyService.showError("An error occured while registering role permissions.", "")
          }

        },
        error => {
          this.errorMessage = <any>error
          //var jsonObject = JSON.stringify(this.errorMessage);
          this.notifyService.showError(this.errorMessage.statusText, "An error occured while registering role permissions.")
        });


  }

  SetDropdown() {
    setTimeout(() => {
      jquery('.select2').select2();
    }, 500);
  }

  GetAllRolePermissionDropdown() {
    this.appService.GetNoToken("RolePermissions", "GetAllRolePermissionDropdown?Role=" + localStorage.getItem("Role").replace(" ","_") + "&HotelID=" + localStorage.getItem("HotelID"))
      .subscribe(
        (res: any) => {
          var objResult = res//.json()
          if (objResult && objResult.ErrorNumber == "0") {
            this.HotelList = objResult.Data.objHotel;
            this.ModuleList = objResult.Data.objModule;
            this.RoleList = objResult.Data.objRole;
            this.SetChangeEvent();
          }
          else {
            this.notifyService.showError("Error#" + objResult.ErrorNumber + " : " + objResult.ErrorMessage, "Error");
          }
        },
        error =>
          this.errorMessage = <any>error
      );
  }

  changeAdd() {
    if (this.SelectedAdd) {
      this.RolePermissionsRegistrationForm.Add = false;
      this.SelectedAdd = false;
    } else {
      this.RolePermissionsRegistrationForm.Add = true;
      this.SelectedAdd = true;
    }
  }
  changeView() {
    if (this.SelectedView) {
      this.RolePermissionsRegistrationForm.View = false;
      this.SelectedView = false;
    } else {
      this.RolePermissionsRegistrationForm.View = true;
      this.SelectedView = true;
    }
  }
  changeUpdate() {
    if (this.SelectedUpdate) {
      this.RolePermissionsRegistrationForm.Update = false;
      this.SelectedUpdate = false;
    } else {
      this.RolePermissionsRegistrationForm.Update = true;
      this.SelectedUpdate = true;
    }
  }
  changeDelete() {
    if (this.SelectedDelete) {
      this.RolePermissionsRegistrationForm.Delete = false;
      this.SelectedDelete = false;
    } else {
      this.RolePermissionsRegistrationForm.Delete = true;
      this.SelectedDelete = true;
    }
  }

}
