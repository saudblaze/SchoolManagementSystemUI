declare var $: any;


import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import * as jquery from 'jquery';
//import * as jquery from 'jquery';
import { AppService } from 'src/app/Services/app.service';
import { NotificationService } from 'src/app/Services/notification.service';
//import * as jquery from 'jquery';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-role-permissions',
  templateUrl: './role-permissions.component.html',
  styleUrls: ['./role-permissions.component.css']
})
export class RolePermissionsComponent implements OnInit {

  @ViewChild('mydataTable', { static: false }) primarySampleComponent: ElementRef;
  dataTable: any;
  dtOption: any = {};

  RolePermissionsToBeDeleted = {
    Id: 0,    
  };

  RolePermissionsSearchForm = {
    ModuleID: "",
    RoleID: ""
  }
  errorMessage;

  submitted = false;
  dDatatable: any;


  
  ModuleList = [];
  SelectedModuleID = "";
  RoleList = [];
  SelectedRoleID = "";

  constructor(private router: Router, private notifyService: NotificationService, private formBuilder: FormBuilder, private appService: AppService, ) { }

  ngOnInit() {
    this.GetAllRolePermissionDropdown();

    jquery('.select2').select2();
  }

  GetAllRolePermissionDropdown() {
    this.appService.GetWithToken("RolePermissions", "GetAllRolePermissionDropdown?Role=" + localStorage.getItem("Role").replace(" ","_") )
      .subscribe(
        (res: any) => {
          var objResult = res//.json()
          if (objResult && objResult.ErrorNumber == "0") {
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

  SetChangeEvent() {
    var that = this;
    setTimeout(() => {
      jquery("#dropdownRole").on("change", function () {
        setTimeout(() => {
          if ($(this).val()) {
            that.SelectedRoleID = $(this).val();
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
          }
          else {
            this.SelectedModuleID = "0";
          }
        }, 500);
      });
    }, 500);
  }

  GetRolePermissionsById(Id) {
    this.router.navigate(['RolePermissionsAddEdit', Id]);
  }

  SearchHotel() {
    this.dDatatable.draw();
  }
  ClearSearch() {
    location.reload();
    //this.router.navigate(['RolePermissions']);

    
    // this.RolePermissionsSearchForm.ModuleID = "";
    // this.RolePermissionsSearchForm.RoleID = "";
    // this.SelectedModuleID = "";
    // this.SelectedRoleID = "";
    

    // this.dDatatable.draw();
  }

  DeleteRolePermissionsConfirmation(data) {
    this.RolePermissionsToBeDeleted = data
    $('#myModal').modal('show');
  }
  CloseModal() {
    $('#myModal').modal('hide');
  }
  DeleteMaintenanceStatus() {
    this.appService.GetNoToken("RolePermissions", "DeleteRolePermissionById?Id=" + this.RolePermissionsToBeDeleted.Id + "&UpdatedBy=" + localStorage.getItem("UserId"))

      .subscribe(
        (res: any) => {
          var objResult = res//.json()
          if (objResult && objResult.ErrorNumber == "0") {
            this.RolePermissionsToBeDeleted = {
              Id: 0              
            };
            $('#myModal').modal('hide');
            this.notifyService.showError("Maintenance status successfully delete.", "")
            this.dDatatable.draw();
          }
        },
        error =>
          this.errorMessage = <any>error

      );
  }

  ngAfterViewInit() {
    this.GetHotelList();
  }

  GetHotelList() {
    let me = this;
    this.dtOption = {
      "searching": false,
      "serverSide": true,
      "ordering": false,
      "drawCallback": this.InitStaffControl(),
      // "fnDrawCallback": function( oSettings ) {
      //   alert( 'DataTables has redrawn the table' );
      // },
      "createdRow": function (row, data, dataIndex) {
        $(".btnEdit", $(row)).click(() => {
          me.GetRolePermissionsById(data.Id);
        });
        $(".btnDelete", $(row)).click(() => {
          me.DeleteRolePermissionsConfirmation(data);
        });

      },
      "dom": '<"pull-right"B><"clear">ltip',
      "buttons": [
        {

          "extend": 'excelHtml5',
          "title": 'Staffs',
          "exportOptions": {
            columns: "thead th:not(.noExport)"
          }
        },
        {
          "extend": 'csvHtml5',
          "title": 'Staffs',
          "exportOptions": {
            columns: "thead th:not(.noExport)"
          }
        }
      ],
      "ajax": {
        "url": environment.apiUrl + "api/RolePermissions/GetRolePermissionList",
        "type": "POST",
        "data": function (data) {
          
          data.ModuleID = me.SelectedModuleID;
          data.RoleID = me.SelectedRoleID;
        }
      },
      "columns": [
        // {
        //   "title": "ID",
        //   "data": "Id"
        // },
        
        {
          "title": "Module",
          "data": "ModuleName"
        },
        {
          "title": "Role",
          "data": "RoleName"
        },
        {
          "title": "View",
          "data": "View",
          "render": function (data) {
            var ret = '';
            if (data) {
              ret = '<i class="fa fa-check" style="color: green;"></i>';
            }
            else {
              ret = '<i class="fa fa-times" style="color: red;"></i>';
            }
            return ret;
          },
          "class": "tabletdPermisionRole"
        },
        {
          "title": "Add",
          "data": "Add",
          "render": function (data) {
            var ret = '';
            if (data) {
              ret = '<i class="fa fa-check" style="color: green;"></i>';
            }
            else {
              ret = '<i class="fa fa-times" style="color: red;"></i>';
            }
            return ret;
          },
          "class": "tabletdPermisionRole"
        },
        {
          "title": "Update",
          "data": "Update",
          "render": function (data) {
            var ret = '';
            if (data) {
              ret = '<i class="fa fa-check" style="color: green;"></i>';
            }
            else {
              ret = '<i class="fa fa-times" style="color: red;"></i>';
            }
            return ret;
          },
          "class": "tabletdPermisionRole"
        },
        {
          "title": "Delete",
          "data": "Delete",
          "render": function (data) {
            var ret = '';
            if (data) {
              ret = '<i class="fa fa-check" style="color: green;"></i>';
            }
            else {
              ret = '<i class="fa fa-times" style="color: red;"></i>';
            }
            return ret;
          },
          "class": "tabletdPermisionRole"
        },

        {
          "title": "Action",
          "data": "Id",
          "render": function (data) {
            var ret = '';
            if (data != 0) //remember to remove this static id
            {
              //if ($filter("filter")($rootScope.UserRights, { ModuleName: 'Staff', Edit: true }, true).length > 0 || $rootScope.Validate === false)
              ret = "<button type='button' Id='" + data + "' class='btn btn-success btn-xs btnEdit'><i class='fa fa-edit'></i> Edit</button> ";
              //if ($filter("filter")($rootScope.UserRights, { ModuleName: 'Staff', Delete: true }, true).length > 0 || $rootScope.Validate === false)
              ret += "<button type='button' Id='" + data + "' class='btn btn-danger btn-xs btnDelete'><i class='fas fa-trash'></i> Delete</button>";
            }


            return ret;
          },
          "class": "noExport"
        }
      ]
    };
    this.dataTable = $(this.primarySampleComponent.nativeElement);
    this.dDatatable = this.dataTable.DataTable(this.dtOption);
  }

  InitStaffControl() {
    // $(".btnEdit").click(() => {      
    // });
  }

  AddNew() {
    this.router.navigate(['RolePermissionsAddEdit']);
  }

}
