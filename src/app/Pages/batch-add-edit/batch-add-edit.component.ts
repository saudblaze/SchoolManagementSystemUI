declare var $: any;
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/Services/app.service';
import { NotificationService } from 'src/app/Services/notification.service';
import * as moment from 'moment';

@Component({
  selector: 'app-batch-add-edit',
  templateUrl: './batch-add-edit.component.html',
  styleUrls: ['./batch-add-edit.component.css']
})
export class BatchAddEditComponent implements OnInit {
  BatchForm: FormGroup;
  errorMessage;
  BatchRegistrationForm = {
    BatchId: 0,
    BatchName: "",    
    StartDate: "",
    EndDate: "",  
    Fees: 0,     
  };
  submitted = false;
  Leadid: any;
  minDate: Date;
  maxDate: Date;
  StartDate:Date;
  EndDate:Date;
  constructor(
    public route: ActivatedRoute,
    private formBuilder: FormBuilder, 
    private appService: AppService, 
    private router: Router, 
    private notifyService: NotificationService
    ) { 

      this.minDate = new Date();
      this.minDate.setDate(this.minDate.getDate());

      this.maxDate = new Date();
      this.maxDate.setDate(this.maxDate.getDate() + 15);

      this.StartDate = new Date();
      this.EndDate = new Date();
    }

    ngOnInit(): void {
      this.Leadid = this.route.snapshot.paramMap.get("id");
      if (this.Leadid) {
        this.GetBatchById(this.Leadid);
      }
      else{
        setTimeout(() => { 
          //this.isVisible = true 
        }, 1000);  
      }
  
      this.BatchForm = this.formBuilder.group(
        {
          BatchName: ["", [Validators.required]] ,          
          Fees: ["", [Validators.required]] ,     
        },
        {
          // Used custom form validator name
          //validator: ComparePassword("Password", "ConfirmPassword")
        }
      );
      
    }
    // Getter function in order to get form controls value
    get f() {
      return this.BatchForm.controls;
    }
  
    BackToList() {
      this.router.navigate(['Batch']);
    }
  
    
    ClearForm() {
      this.BatchRegistrationForm.BatchName = "";    
      this.BatchRegistrationForm.StartDate = ""; 
      this.BatchRegistrationForm.EndDate = ""; 
      this.BatchRegistrationForm.Fees = 0;        
    }
  
    GetBatchById(Id){
      this.appService.GetWithToken("Batch", "GetBatchById?Id="+Id)
  
        .subscribe(
          (res: any) => {          
            var objResult = res//.json()
            if (objResult && objResult.ErrorNumber == "0") {
              this.BatchRegistrationForm.BatchId = objResult.Data.BatchId;
              this.BatchRegistrationForm.BatchName = objResult.Data.BatchName; 
             
              var StartDate =  moment(objResult.Data.StartDate).format('MM/DD/YYYY');              
              $('#StartDate').data({date: StartDate});

              var EndDate =  moment(objResult.Data.EndDate).format('MM/DD/YYYY');              
              $('#EndDate').data({date: EndDate});  
              
              this.BatchRegistrationForm.Fees = objResult.Data.Fees;    
            }
          },
          error =>
            this.errorMessage = <any>error
  
        );
    }  
  
    SubmitHotel() {
      this.submitted = true;
      // Returns false if form is invalid
      if (this.BatchForm.invalid) {
        return;
      }
      var objHotel = {
        "BatchId": this.BatchRegistrationForm.BatchId,
        "BatchName": this.BatchRegistrationForm.BatchName,
        "StartDate": this.StartDate,
        "EndDate": this.EndDate,
        "Fees": this.BatchRegistrationForm.Fees,
        "CreatedBy":localStorage.getItem("UserId")  ,
        "UpdatedBy":localStorage.getItem("UserId")  
      };
  
      this.appService.PostToken("Batch", "SaveBatch", objHotel)
        .subscribe(
          (res: any) => {
            if (res) {
              var resultbody = res//.json()
              if (resultbody.ErrorNumber == 0) {
                this.notifyService.showSuccess("Batch successfully added.", "")
                this.router.navigate(['Batch']);
              }
              else if (resultbody.ErrorNumber == 1) {
                this.notifyService.showSuccess("Batch successfully updated.", "")
                this.router.navigate(['Batch']);
              }
              else
              {
                this.notifyService.showError(resultbody.ErrorMessage, "Error");  
              }
              
            } else {
              this.notifyService.showError(this.errorMessage.statusText, "An error occured while registering Batch.")
            }
  
          },
          error => {
            this.errorMessage = <any>error
            //var jsonObject = JSON.stringify(this.errorMessage);
            this.notifyService.showError(this.errorMessage.statusText, "An error occured while registering Batch.")
          });
  
  
    }

}
