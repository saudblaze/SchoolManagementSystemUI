declare var $: any;

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from 'src/app/Services/app.service';
import { NotificationService } from 'src/app/Services/notification.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css']
})
export class SubjectComponent implements OnInit {
  @ViewChild('mydataTable', { static: false }) primarySampleComponent: ElementRef;
  dataTable: any;
  dtOption: any = {};

  StateToBeDeleted = {
    SubjectId: 0,
    SubjectName: "",    
    Abbreviations:""
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

  GetStateById(Id) {
    this.router.navigate(['SubjectAddEdit', Id]);
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
    this.StateToBeDeleted = data
    $('#myModal').modal('show');
  }
  CloseModal() {
    $('#myModal').modal('hide');
  }
  DeleteHotel() {
    this.appService.GetWithToken("Subject", "DeleteSubjectById?Id=" + this.StateToBeDeleted.SubjectId + "&UpdatedBy=" + localStorage.getItem("UserId"))

      .subscribe(
        (res: any) => {
          var objResult = res//.json()
          if (objResult && objResult.ErrorNumber == "0") {
            this.StateToBeDeleted = {
              SubjectId: 0,
              SubjectName: "",   
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
          me.GetStateById(data.SubjectId);
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
        "url": environment.apiUrl + "api/Subject/GetStateList",
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
          "data": "SubjectId",
          "class": "colwidth50"     
        },
        {
          "title": "Subject Name",
          "data": "SubjectName",
          "class": "colwidth300"      
        },
        {
          "title": "Abbreviations",
          "data": "Abbreviations",
          "class": "colwidth300"      
        },
        {
          "title": "Action",
          "data": "SubjectId",
          "render": function (data) {
            var ret = '';
            if (me.SystemSettings.objSubject.Update)
            {
              ret = "<button type='button' Id='" + data + "' class='btn btn-success btn-xs btnEdit'><i class='fa fa-edit'></i> Edit</button> ";
            }            
            if (me.SystemSettings.objSubject.Delete)
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
    this.router.navigate(['SubjectAddEdit']);
  }

}
