declare var $: any;

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from 'src/app/Services/app.service';
import { NotificationService } from 'src/app/Services/notification.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})          
export class StudentComponent  implements OnInit {
  @ViewChild('mydataTable', { static: false }) primarySampleComponent: ElementRef;
  dataTable: any;
  dtOption: any = {};

  StudentToBeDeleted = {
    StudentId: 0,
    StudentName: "",    
    StudentFatherName: "",   
    StudentSurName:"",
    StudentPhone:"",
    StudentWhatsapp:"",
    BatchId:0,
    FatherPhone:"",
    FatherWhatsapp:"",
    JoiningDate:"", 
    StudentFileName:"",
    StudentFolder:"",
    ByteData: undefined,
    StudentAddress1:"",
    StudentAddress2:"",
    StudentSchoolName:"",
    StudentStandard:"",
  };
  
  StateSearchForm = {
    SubjectName: ""    ,
    Abbreviations:""
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

  GetStudentById(Id) {
    this.router.navigate(['StudentAddEdit', Id]);
  }

  SearchHotel() {
    this.dDatatable.draw();
  }
  ClearSearch() {
    this.StateSearchForm = {
      SubjectName: ""      ,
      Abbreviations: ""      
    }
    this.dDatatable.draw();
  }

  DeleteStateConfirmation(data) {
    this.StudentToBeDeleted = data
    $('#myModal').modal('show');
  }
  CloseModal() {
    $('#myModal').modal('hide');
  }
  DeleteStudent() {
    this.appService.GetWithToken("Student", "DeleteStudentById?Id=" + this.StudentToBeDeleted.StudentId + "&UpdatedBy=" + localStorage.getItem("UserId"))

      .subscribe(
        (res: any) => {
          var objResult = res//.json()
          if (objResult && objResult.ErrorNumber == "0") {
            this.StudentToBeDeleted = {
              StudentId: 0,
              StudentName: "",    
              StudentFatherName: "",   
              StudentSurName:"",
              StudentPhone:"",
              StudentWhatsapp:"",
              BatchId:0,
              FatherPhone:"",
              FatherWhatsapp:"",
              JoiningDate:"", 
              StudentFileName:"",
              StudentFolder:"",
              ByteData: undefined,
              StudentAddress1:"",
              StudentAddress2:"",
              StudentSchoolName:"",
              StudentStandard:"",  
            };
            $('#myModal').modal('hide');
            this.notifyService.showError("Student successfully delete.", "")
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
          me.GetStudentById(data.StudentId);
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
        "url": environment.apiUrl + "api/Student/GetStudentList",
        "type": "POST",
        "data": function (data) {
          // data.StateName = me.StateSearchForm.StateName;
          // data.Abbreviations = me.StateSearchForm.Abbreviations;     

           data.SubjectName = me.StateSearchForm.SubjectName;
           data.Abbreviations = me.StateSearchForm.Abbreviations;             
        }
      },
      "columns": [
        {
          "title": "ID",
          "data": "StudentId",
          "class": "colwidth50"     
        },
        {
          "title": "Name",
          "data": "StudentName",
          "class": "colwidth300"      
        },
        {
          "title": "Father Name",
          "data": "StudentFatherName",
          "class": "colwidth300"      
        },
        {
          "title": "Action",
          "data": "StudentId",
          "render": function (data) {
            var ret = '';
            if (me.SystemSettings.objStudent.Update)
            {
              ret = "<button type='button' Id='" + data + "' class='btn btn-success btn-xs btnEdit'><i class='fa fa-edit'></i> Edit</button> ";
            }            
            if (me.SystemSettings.objStudent.Delete)
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
    this.router.navigate(['StudentAddEdit']);
  }

}
