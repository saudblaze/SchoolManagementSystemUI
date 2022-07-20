declare var $: any;
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/Services/app.service';
import { NotificationService } from 'src/app/Services/notification.service';

@Component({
  selector: 'app-role-add-edit',
  templateUrl: './role-add-edit.component.html',
  styleUrls: ['./role-add-edit.component.css']
})
export class RoleAddEditComponent implements OnInit {
  UserRoleForm: FormGroup;
  errorMessage;
  UserRegistrationForm = {
    Id: 0,
    RoleName: "",    
        
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
        this.GetUserRoleById(this.Leadid);
      }
      else{
        setTimeout(() => { 
          //this.isVisible = true 
        }, 1000);  
      }
  
      this.UserRoleForm = this.formBuilder.group(
        {
          RoleName: ["", [Validators.required]]           
        },
        {
          // Used custom form validator name
          //validator: ComparePassword("Password", "ConfirmPassword")
        }
      );
      
    }
    // Getter function in order to get form controls value
    get f() {
      return this.UserRoleForm.controls;
    }
  
    BackToList() {
      this.router.navigate(['Roles']);
    }
  
    
    ClearForm() {
      this.UserRegistrationForm.RoleName = "";    
            
    }
  
    GetUserRoleById(Id){
      this.appService.GetWithToken("UserRole", "GetUsersRoleById?Id="+Id)
  
        .subscribe(
          (res: any) => {          
            var objResult = res//.json()
            if (objResult && objResult.ErrorNumber == "0") {
              this.UserRegistrationForm.Id = objResult.Data.Id;
              this.UserRegistrationForm.RoleName = objResult.Data.RoleName;                   
            }
          },
          error =>
            this.errorMessage = <any>error
  
        );
    }  
  
    SubmitHotel() {
      this.submitted = true;
      // Returns false if form is invalid
      if (this.UserRoleForm.invalid) {
        return;
      }
      var objHotel = {
        "Id": this.UserRegistrationForm.Id,
        "RoleName": this.UserRegistrationForm.RoleName,        
        "CreatedBy":localStorage.getItem("UserId")  ,
        "UpdatedBy":localStorage.getItem("UserId")  
      };
  
      this.appService.PostToken("UserRole", "SaveUserRole", objHotel)
        .subscribe(
          (res: any) => {
            if (res) {
              var resultbody = res//.json()
              if (resultbody.ErrorNumber == 0) {
                this.notifyService.showSuccess("Roles successfully added.", "")
                this.router.navigate(['Roles']);
              }
              else if (resultbody.ErrorNumber == 1) {
                this.notifyService.showSuccess("Roles successfully updated.", "")
                this.router.navigate(['Roles']);
              }
              else
              {
                this.notifyService.showError(resultbody.ErrorMessage, "Error");  
              }
              
            } else {
              this.notifyService.showError(this.errorMessage.statusText, "An error occured while registering Roles.")
            }
  
          },
          error => {
            this.errorMessage = <any>error
            //var jsonObject = JSON.stringify(this.errorMessage);
            this.notifyService.showError(this.errorMessage.statusText, "An error occured while registering Roles.")
          });
  
  
    }

}
