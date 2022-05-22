declare var $: any;
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/Services/app.service';
import { NotificationService } from 'src/app/Services/notification.service';
import * as jquery from 'jquery';
import * as moment from 'moment';
@Component({
  selector: 'app-student-add-edit',
  templateUrl: './student-add-edit.component.html',
  styleUrls: ['./student-add-edit.component.css']
})
export class StudentAddEditComponent implements OnInit {
  StudentForm: FormGroup;
  errorMessage;
  SelectedBatchID = '';
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
  BatchList = [];
  JoiningDate:Date;
  minDate: Date;
  imageSrc: string;
  imgBlob;
  constructor(
    public route: ActivatedRoute,
    private formBuilder: FormBuilder, 
    private appService: AppService, 
    private router: Router, 
    private notifyService: NotificationService
    ) { 
      this.minDate = new Date();
      this.minDate.setDate(this.minDate.getDate());
      this.JoiningDate = new Date();

    }

    ngOnInit(): void {
      this.GetBatchList();

      this.Leadid = this.route.snapshot.paramMap.get("id");
      if (this.Leadid) {
        this.GetStudentById(this.Leadid);
      }
      else{
        setTimeout(() => { 
          //this.isVisible = true 
        }, 1000);  
      }

      var that = this;
      jquery('.select2').select2();
      


      this.StudentForm = this.formBuilder.group(
        {
          StudentName: ["", [Validators.required]] ,
          StudentFatherName: ["", [Validators.required]] ,
          StudentSurName:["", [Validators.required]] ,
          StudentPhone:["", [Validators.required]] ,
          StudentWhatsapp:["", [Validators.required]] ,
          SelectedBatchID: ["", Validators.required],
          //BatchId:["", [Validators.required]] ,
          FatherPhone:["", [Validators.required]] ,
          FatherWhatsapp:["", [Validators.required]] ,
          //JoiningDate:["", [Validators.required]] ,
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

    ClearImage() {
      this.StudentRegistrationForm.StudentFileName = "";
      this.StudentRegistrationForm.StudentFolder = "";
    }

    _arrayBufferToBase64(buffer) {
      var binary = '';
      var bytes = new Uint8Array(buffer);
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return window.btoa(binary);
    }
  
    onFileChange(event) {
      const reader = new FileReader();
  
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        if(file.type != "image/jpeg" && file.type != "image/jpg" && file.type != "image/png")
        {
          this.notifyService.showError("Format not supported please upload jpeg,jpg,png only.","");  
          return false;
        }
        reader.readAsDataURL(file);
  
        reader.onload = (e) => {
          this.imageSrc = reader.result as string;
          var imageData = null;
          imageData = e.target.result;
          var partsOfStr = imageData.split(',');
          this.StudentRegistrationForm.ByteData = partsOfStr[1];
  
          //this.HotelRegistrationForm.HotelLogoFolder = this.imageSrc;
          //this.HotelRegistrationForm.HotelLogoFolder = this._arrayBufferToBase64(reader.result);
  
          this.imgBlob = new Blob([reader.result], {
            type: file.type
          });
          
          var d = new Date();
          var dd = this.addZero(d.getDay());
          var mm = this.addZero(d.getMonth());
          var yyyy = this.addZero(d.getFullYear());
          var h = this.addZero(d.getHours());
          var m = this.addZero(d.getMinutes());
          var s = this.addZero(d.getSeconds());
  
          //this.HotelRegistrationForm.HotelLogoFileName = dd + mm + yyyy + h + m + s + "_" + file.name ;        
          this.StudentRegistrationForm.StudentFileName = file.name ;        
  
        };
  
      }
    }
    addZero(items) {
      if (items < 10) {
        items = "0" + items;
      }
      return items;
    }

    GetBatchList() {
      this.appService.GetNoToken("Student", "GetBatchDropdown")  
        .subscribe(
          (res: any) => {
            var objResult = res//.json()
            if (objResult && objResult.ErrorNumber == "0") {
              this.BatchList = objResult.Data.objBatch;  
              this.SetChangeEvent();             
            }
          },
          error =>
            this.errorMessage = <any>error  
        );
    }
  
    SetChangeEvent() {
      var that = this;
      setTimeout(() => {
        jquery("#dropdownBatch").on("change", function () {
          setTimeout(() => {
            if ($(this).val()) {
              that.SelectedBatchID = $(this).val();
              that.f.SelectedBatchID.markAsTouched();
              that.f.SelectedBatchID.markAsDirty();
              that.f.SelectedBatchID.setValue('valid', true);
            }
            else {
              this.SelectedBatchID = "0";
            }
          }, 500);
        });  
        
      }, 500);
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
              this.SelectedBatchID = objResult.Data.BatchId;
              //this.SetBatchSelect();

              this.SetDropdown();
              
              this.StudentRegistrationForm.FatherPhone = objResult.Data.FatherPhone;     
              this.StudentRegistrationForm.FatherWhatsapp = objResult.Data.FatherWhatsapp; 

              var JoiningDate =  moment(objResult.Data.JoiningDate).format('MM/DD/YYYY');    
              this.StudentRegistrationForm.JoiningDate = JoiningDate;   
              this.JoiningDate = new Date(JoiningDate);

              $('#JoiningDate').data({date: JoiningDate});

                
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

    SetBatchSelect(){
      debugger
      setTimeout(() => {
        debugger
        jquery('#dropdownBatch').select2();
      }, 1000);
    }
    SetDropdown() {
      setTimeout(() => {
        jquery('.select2').select2();
      }, 500);
    }
  
    SubmitHotel() {
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
        "BatchId": this.SelectedBatchID,
        "FatherPhone": this.StudentRegistrationForm.FatherPhone,
        "FatherWhatsapp": this.StudentRegistrationForm.FatherWhatsapp,
        "JoiningDate": this.JoiningDate,
        "StudentFileName": this.StudentRegistrationForm.StudentFileName,
        "StudentFolder": this.StudentRegistrationForm.StudentFolder,
        "StudentAddress1": this.StudentRegistrationForm.StudentAddress1,
        "StudentAddress2": this.StudentRegistrationForm.StudentAddress2,
        "StudentSchoolName": this.StudentRegistrationForm.StudentSchoolName,
        "StudentStandard": this.StudentRegistrationForm.StudentStandard,
        "ByteData": this.StudentRegistrationForm.ByteData,
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
