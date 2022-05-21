declare var $: any;
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/Services/app.service';
import { NotificationService } from 'src/app/Services/notification.service';

@Component({
  selector: 'app-student-add-edit',
  templateUrl: './student-add-edit.component.html',
  styleUrls: ['./student-add-edit.component.css']
})
export class StudentAddEditComponent implements OnInit {
  StudentForm: FormGroup;
  errorMessage;
  StudentRegistrationForm = {
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
      this.Leadid = this.route.snapshot.paramMap.get("id");
      if (this.Leadid) {
        this.GetStudentById(this.Leadid);
      }
      else{
        setTimeout(() => { 
          //this.isVisible = true 
        }, 1000);  
      }
  
      this.StudentForm = this.formBuilder.group(
        {
          StudentName: ["", [Validators.required]] ,
          StudentFatherName: ["", [Validators.required]] ,
          StudentSurName:["", [Validators.required]] ,
          StudentPhone:["", [Validators.required]] ,
          StudentWhatsapp:["", [Validators.required]] ,
          BatchId:["", [Validators.required]] ,
          FatherPhone:["", [Validators.required]] ,
          FatherWhatsapp:["", [Validators.required]] ,
          JoiningDate:["", [Validators.required]] ,
          //StudentFileName:["", [Validators.required]] ,         
          
          StudentAddress1:["", [Validators.required]] ,
          StudentAddress2:["", [Validators.required]] ,
          StudentSchoolName:["", [Validators.required]] ,
          StudentStandard:["", [Validators.required]] ,      
        },
        {
          // Used custom form validator name
          //validator: ComparePassword("Password", "ConfirmPassword")
        }
      );
      
    }
    // Getter function in order to get form controls value
    get f() {
      return this.StudentForm.controls;
    }
  
    BackToList() {
      this.router.navigate(['Student']);
    }
  
    
    ClearForm() {
      this.StudentRegistrationForm.StudentName = "";    
      this.StudentRegistrationForm.StudentFatherName = "";        
    }
  
    GetStudentById(Id){
      this.appService.GetWithToken("Student", "GetStudentById?Id="+Id)
  
        .subscribe(
          (res: any) => {          
            var objResult = res//.json()
            if (objResult && objResult.ErrorNumber == "0") {
              this.StudentRegistrationForm.StudentId = objResult.Data.StudentId;
              this.StudentRegistrationForm.StudentName = objResult.Data.StudentName; 
              this.StudentRegistrationForm.StudentFatherName = objResult.Data.StudentFatherName;
              this.StudentRegistrationForm.StudentSurName = objResult.Data.StudentSurName; 
              this.StudentRegistrationForm.StudentPhone = objResult.Data.StudentPhone;     
              this.StudentRegistrationForm.StudentWhatsapp = objResult.Data.StudentWhatsapp;     
              this.StudentRegistrationForm.BatchId = objResult.Data.BatchId;     
              this.StudentRegistrationForm.FatherPhone = objResult.Data.FatherPhone;     
              this.StudentRegistrationForm.FatherWhatsapp = objResult.Data.FatherWhatsapp;     
              this.StudentRegistrationForm.JoiningDate = objResult.Data.JoiningDate;     
              this.StudentRegistrationForm.StudentFileName = objResult.Data.StudentFileName;     
              this.StudentRegistrationForm.StudentAddress1 = objResult.Data.StudentAddress1;     
              this.StudentRegistrationForm.StudentAddress2 = objResult.Data.StudentAddress2;     
              this.StudentRegistrationForm.StudentSchoolName = objResult.Data.StudentSchoolName;     
              this.StudentRegistrationForm.StudentStandard = objResult.Data.StudentStandard;     
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
      if (this.StudentForm.invalid) {
        return;
      }
      var objHotel = {
        "StudentId": this.StudentRegistrationForm.StudentId,
        "StudentName": this.StudentRegistrationForm.StudentName,
        "StudentFatherName": this.StudentRegistrationForm.StudentFatherName,
        "StudentSurName": this.StudentRegistrationForm.StudentSurName,
        "StudentPhone": this.StudentRegistrationForm.StudentPhone,
        "StudentWhatsapp": this.StudentRegistrationForm.StudentWhatsapp,
        "BatchId": this.StudentRegistrationForm.BatchId,
        "FatherPhone": this.StudentRegistrationForm.FatherPhone,
        "FatherWhatsapp": this.StudentRegistrationForm.FatherWhatsapp,
        "JoiningDate": this.StudentRegistrationForm.JoiningDate,
        "StudentFileName": this.StudentRegistrationForm.StudentFileName,
        "StudentFolder": this.StudentRegistrationForm.StudentFolder,
        "StudentAddress1": this.StudentRegistrationForm.StudentAddress1,
        "StudentAddress2": this.StudentRegistrationForm.StudentAddress2,
        "StudentSchoolName": this.StudentRegistrationForm.StudentSchoolName,
        "StudentStandard": this.StudentRegistrationForm.StudentStandard,
        "CreatedBy":localStorage.getItem("UserId")  ,
        "UpdatedBy":localStorage.getItem("UserId")  
      };
  
      this.appService.PostToken("Student", "SaveStudent", objHotel)
        .subscribe(
          (res: any) => {
            if (res) {
              var resultbody = res//.json()
              if (resultbody.ErrorNumber == 0) {
                this.notifyService.showSuccess("Student successfully added.", "")
                this.router.navigate(['Student']);
              }
              else if (resultbody.ErrorNumber == 1) {
                this.notifyService.showSuccess("Student successfully updated.", "")
                this.router.navigate(['Student']);
              }
              else
              {
                this.notifyService.showError(resultbody.ErrorMessage, "Error");  
              }
              
            } else {
              this.notifyService.showError(this.errorMessage.statusText, "An error occured while registering Student.")
            }
  
          },
          error => {
            this.errorMessage = <any>error
            //var jsonObject = JSON.stringify(this.errorMessage);
            this.notifyService.showError(this.errorMessage.statusText, "An error occured while registering Subject.")
          });
  
  
    }

}
