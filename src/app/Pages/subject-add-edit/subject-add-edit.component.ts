declare var $: any;
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/Services/app.service';
import { NotificationService } from 'src/app/Services/notification.service';

@Component({
  selector: 'app-subject-add-edit',
  templateUrl: './subject-add-edit.component.html',
  styleUrls: ['./subject-add-edit.component.css']
})
export class SubjectAddEditComponent implements OnInit {
  StateForm: FormGroup;
  errorMessage;
  StateRegistrationForm = {
    SubjectId: 0,
    SubjectName: "",    
    Abbreviations: "",    
  };
  submitted = false;
  Leadid: any;
  constructor(
    public route: ActivatedRoute,
    private formBuilder: FormBuilder, 
    private appService: AppService, 
    private router: Router, 
    private notifyService: NotificationService
    ) { }

    ngOnInit(): void {
      debugger
      this.Leadid = this.route.snapshot.paramMap.get("id");
      if (this.Leadid) {
        this.GetStateById(this.Leadid);
      }
      else{
        setTimeout(() => { 
          //this.isVisible = true 
        }, 1000);  
      }
  
      this.StateForm = this.formBuilder.group(
        {
          SubjectName: ["", [Validators.required]] ,
          Abbreviations: ["", [Validators.required]]       
        },
        {
          // Used custom form validator name
          //validator: ComparePassword("Password", "ConfirmPassword")
        }
      );
      
    }
    // Getter function in order to get form controls value
    get f() {
      return this.StateForm.controls;
    }
  
    BackToList() {
      this.router.navigate(['Teacher']);
    }
  
    
    ClearForm() {
      this.StateRegistrationForm.SubjectName = "";    
      this.StateRegistrationForm.Abbreviations = "";        
    }
  
    GetStateById(Id){
      this.appService.GetWithToken("Subject", "GetSubjectById?Id="+Id)
  
        .subscribe(
          (res: any) => {          
            var objResult = res//.json()
            if (objResult && objResult.ErrorNumber == "0") {
              this.StateRegistrationForm.SubjectId = objResult.Data.SubjectId;
              this.StateRegistrationForm.SubjectName = objResult.Data.SubjectName; 
              this.StateRegistrationForm.Abbreviations = objResult.Data.Abbreviations;     
            }
          },
          error =>
            this.errorMessage = <any>error
  
        );
    }  
  
    SubmitHotel() {
      debugger
      this.submitted = true;
      // Returns false if form is invalid
      if (this.StateForm.invalid) {
        return;
      }
      var objHotel = {
        "SubjectId": this.StateRegistrationForm.SubjectId,
        "SubjectName": this.StateRegistrationForm.SubjectName,
        "Abbreviations": this.StateRegistrationForm.Abbreviations,
        "CreatedBy":localStorage.getItem("UserId")  ,
        "UpdatedBy":localStorage.getItem("UserId")  
      };
  
      this.appService.PostToken("Subject", "SaveSubject", objHotel)
        .subscribe(
          (res: any) => {
            if (res) {
              var resultbody = res//.json()
              if (resultbody.ErrorNumber == 0) {
                this.notifyService.showSuccess("Subject successfully added.", "")
                this.router.navigate(['Subject']);
              }
              else if (resultbody.ErrorNumber == 1) {
                this.notifyService.showSuccess("Subject successfully updated.", "")
                this.router.navigate(['Subject']);
              }
              else
              {
                this.notifyService.showError(resultbody.ErrorMessage, "Error");  
              }
              
            } else {
              this.notifyService.showError(this.errorMessage.statusText, "An error occured while registering Subject.")
            }
  
          },
          error => {
            this.errorMessage = <any>error
            //var jsonObject = JSON.stringify(this.errorMessage);
            this.notifyService.showError(this.errorMessage.statusText, "An error occured while registering Subject.")
          });
  
  
    }

}
