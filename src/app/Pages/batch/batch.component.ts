declare var $: any;

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { AppService } from 'src/app/Services/app.service';
import { NotificationService } from 'src/app/Services/notification.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-batch',
  templateUrl: './batch.component.html',
  styleUrls: ['./batch.component.css']
})
export class BatchComponent implements OnInit {
  @ViewChild('mydataTable', { static: false }) primarySampleComponent: ElementRef;
  dataTable: any;
  dtOption: any = {};

  StateToBeDeleted = {
    BatchId: 0,
    BatchName: "",    
    StartDate:"",
    EndDate:"",
    Fees:0
  };
  
  StateSearchForm = {
    BatchName: ""    ,
    StartDate:"",
    EndDate:"",
    Fees:0
  }
  errorMessage;
  
  submitted = false;
  dDatatable: any;
  SystemSettings;
  minDate: Date;
  constructor(
    private router: Router, 
    private notifyService: NotificationService, 
    private formBuilder: FormBuilder, 
    private appService: AppService
  ) { 

    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate());

  }

  ngOnInit() {
    this.SystemSettings = JSON.parse(localStorage.getItem("systemsettings"));
  }

  GetBatchById(Id) {
    this.router.navigate(['BatchAddEdit', Id]);
  }

  SearchHotel() {
    this.dDatatable.draw();
  }
  ClearSearch() {
    this.StateSearchForm = {
      BatchName: ""      ,
      StartDate:"",
      EndDate:"",
      Fees:0     
    }
    this.dDatatable.draw();
  }

  DeleteBatchConfirmation(data) {
    this.StateToBeDeleted = data
    $('#myModal').modal('show');
  }
  CloseModal() {
    $('#myModal').modal('hide');
  }
  DeleteHotel() {
    this.appService.GetWithToken("Batch", "DeleteBatchById?Id=" + this.StateToBeDeleted.BatchId + "&UpdatedBy=" + localStorage.getItem("UserId"))

      .subscribe(
        (res: any) => {
          var objResult = res//.json()
          if (objResult && objResult.ErrorNumber == "0") {
            this.StateToBeDeleted = {
              BatchId: 0,
              BatchName: "",   
              StartDate:"" ,
              EndDate:"" ,
              Fees:0 
            };
            $('#myModal').modal('hide');
            this.notifyService.showError("Batch successfully delete.", "")
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
          me.GetBatchById(data.BatchId);
        });
        $(".btnDelete", $(row)).click(() => {
          me.DeleteBatchConfirmation(data);
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
        "url": environment.apiUrl + "api/Batch/GetBatchList",
        "type": "POST",
        "data": function (data) {
          data.BatchName = me.StateSearchForm.BatchName;
          //data.StartDate = me.StateSearchForm.StartDate;
          //data.EndDate = me.StateSearchForm.EndDate; 
          //data.Fees = me.StateSearchForm.Fees;              
        }
      },
      "columns": [
        {
          "title": "ID",
          "data": "BatchId",
          "class": "colwidth50"     
        },
        {
          "title": "Batch Name",
          "data": "BatchName",
          "class": "colwidth300"      
        },
        {
          "title": "StartDate",
          "data": "StartDate",
          "class": "colwidth300",
          "render": function (data) { 
            var ret = '';
            if(data)
            {
              ret = moment(data).format('DD/MM/YYYY');
            }
            return ret;
          }      
        },
        {
          "title": "EndDate",
          "data": "EndDate",
          "class": "colwidth300",
          "render": function (data) { 
            var ret = '';
            if(data)
            {
              ret = moment(data).format('DD/MM/YYYY');
            }
            return ret;
          }
        },
        {
          "title": "Fees",
          "data": "Fees",
          "class": "colwidth300"      
        },
        {
          "title": "Action",
          "data": "BatchId",
          "render": function (data) {
            var ret = '';
            if (me.SystemSettings.objBatch.Update)
            {
              ret = "<button type='button' Id='" + data + "' class='btn btn-success btn-xs btnEdit'><i class='fa fa-edit'></i> Edit</button> ";
            }            
            if (me.SystemSettings.objBatch.Delete)
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
    this.router.navigate(['BatchAddEdit']);
  }

}
