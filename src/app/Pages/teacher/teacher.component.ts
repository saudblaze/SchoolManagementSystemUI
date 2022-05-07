declare var $: any;

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from 'src/app/Services/app.service';
import { NotificationService } from 'src/app/Services/notification.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-subject',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent  implements OnInit {
  @ViewChild('mydataTable', { static: false }) primarySampleComponent: ElementRef;
  dataTable: any;
  dtOption: any = {};

  StateToBeDeleted = {
    TeacherID: 0,
    TeacherName: "",    
    Abbreviations:""
  };
  
  StateSearchForm = {
    TeacherName: ""    ,
    PhoneNumber:"",
    WhatsAppNumber:"",
    Email:"",
    Subjects:""
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

  GetTeacherById(Id) {
    this.router.navigate(['TeacherAddEdit', Id]);
  }

  SearchHotel() {
    this.dDatatable.draw();
  }
  ClearSearch() {
    this.StateSearchForm = {
      TeacherName: ""      ,
      PhoneNumber: ""  ,
      WhatsAppNumber: ""  ,   
      Email: ""  , 
      Subjects: ""  
    }
    this.dDatatable.draw();
  }

  DeleteTeacherConfirmation(data) {
    this.StateToBeDeleted = data
    $('#myModal').modal('show');
  }
  CloseModal() {
    $('#myModal').modal('hide');
  }
  DeleteTeacher() {
    this.appService.GetWithToken("Teacher", "DeleteTeacherById?Id=" + this.StateToBeDeleted.TeacherID + "&UpdatedBy=" + localStorage.getItem("UserId"))

      .subscribe(
        (res: any) => {
          var objResult = res//.json()
          if (objResult && objResult.ErrorNumber == "0") {
            this.StateToBeDeleted = {
              TeacherID: 0,
              TeacherName: "",   
              Abbreviations:""  
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
          me.GetTeacherById(data.TeacherID);
        });
        $(".btnDelete", $(row)).click(() => {
          me.DeleteTeacherConfirmation(data);
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
        "url": environment.apiUrl + "api/Teacher/GetTeacherList",
        "type": "POST",
        "data": function (data) {         

           data.TeacherName = me.StateSearchForm.TeacherName;
           data.PhoneNumber = me.StateSearchForm.PhoneNumber;  
           data.WhatsAppNumber = me.StateSearchForm.WhatsAppNumber;  
           data.Email = me.StateSearchForm.Email;  
           data.Subjects = me.StateSearchForm.Subjects;            
        }
      },
      "columns": [
        {
          "title": "ID",
          "data": "TeacherID",
          "class": "colwidth50"     
        },
        {
          "title": "Teacher Name",
          "data": "TeacherName",
          "class": "colwidth300"      
        },
        {
          "title": "Phone Number",
          "data": "PhoneNumber",
          "class": "colwidth300"      
        },
        {
          "title": "WhatsApp Number",
          "data": "WhatsAppNumber",
          "class": "colwidth300"      
        },
        {
          "title": "Email",
          "data": "Email",
          "class": "colwidth300"      
        },
        {
          "title": "Subjects",
          "data": "Subjects",
          "class": "colwidth300"      
        },
        {
          "title": "Action",
          "data": "TeacherID",
          "render": function (data) {
            var ret = '';
            if (me.SystemSettings.objTeacher.Update)
            {
              ret = "<button type='button' Id='" + data + "' class='btn btn-success btn-xs btnEdit'><i class='fa fa-edit'></i> Edit</button> ";
            }            
            if (me.SystemSettings.objTeacher.Delete)
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
    this.router.navigate(['TeacherAddEdit']);
  }

}
