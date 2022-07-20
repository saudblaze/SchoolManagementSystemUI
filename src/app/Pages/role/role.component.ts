declare var $: any;

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from 'src/app/Services/app.service';
import { NotificationService } from 'src/app/Services/notification.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {
  @ViewChild('mydataTable', { static: false }) primarySampleComponent: ElementRef;
  dataTable: any;
  dtOption: any = {};

  StateToBeDeleted = {
    Id: 0,
    RoleName: ""    
  };
  
  UserRoleSearchForm = {
    RoleName: ""        
  }
  errorMessage;
  
  submitted = false;
  dDatatable: any;
  SystemSettings;
  constructor(
    private router: Router, 
    private notifyService: NotificationService, 
    private formBuilder: FormBuilder, 
    private appService: AppService
  ) { }

  ngOnInit() {
    this.SystemSettings = JSON.parse(localStorage.getItem("systemsettings"));
  }

  GetStateById(Id) {
    this.router.navigate(['RolesAddEdit', Id]);
  }

  SearchHotel() {
    this.dDatatable.draw();
  }
  ClearSearch() {
    this.UserRoleSearchForm = {
      RoleName: ""            
    }
    this.dDatatable.draw();
  }

  DeleteStateConfirmation(data) {
    this.StateToBeDeleted = data
    $('#myModal').modal('show');
  }
  CloseModal() {
    $('#myModal').modal('hide');
  }
  DeleteHotel() {
    this.appService.GetWithToken("UserRole", "DeleteUsersRoleById?Id=" + this.StateToBeDeleted.Id + "&UpdatedBy=" + localStorage.getItem("UserId"))

      .subscribe(
        (res: any) => {
          var objResult = res//.json()
          if (objResult && objResult.ErrorNumber == "0") {
            this.StateToBeDeleted = {
              Id: 0,
              RoleName: "",                 
            };
            $('#myModal').modal('hide');
            this.notifyService.showError("State successfully delete.", "")
            this.dDatatable.draw();
          }
        },
        error =>
          this.errorMessage = <any>error

      );
  }

  ngAfterViewInit() {
    this.GetStateList();
  }

  GetStateList() {

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
          me.GetStateById(data.Id);
        });
        $(".btnDelete", $(row)).click(() => {
          me.DeleteStateConfirmation(data);
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
        "url": environment.apiUrl + "api/UserRole/GetUserRoleList",
        "type": "POST",
        "data": function (data) {
           data.RoleName = me.UserRoleSearchForm.RoleName;                       
        }
      },
      "columns": [
        {
          "title": "ID",
          "data": "Id",
          "class": "colwidth50"     
        },
        {
          "title": "Role Name",
          "data": "RoleName",
          "class": "colwidth300"      
        },        
        {
          "title": "Action",
          "data": "Id",
          "render": function (data) {
            var ret = '';
            if (me.SystemSettings.objRole.Update)
            {
              ret = "<button type='button' Id='" + data + "' class='btn btn-success btn-xs btnEdit'><i class='fa fa-edit'></i> Edit</button> ";
            }            
            if (me.SystemSettings.objRole.Delete)
            {
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
    this.router.navigate(['RolesAddEdit']);
  }

}
