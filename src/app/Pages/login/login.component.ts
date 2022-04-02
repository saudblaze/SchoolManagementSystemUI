import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../Services/notification.service';

import { FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms";
import { Router } from '@angular/router';
import { LoginService } from 'src/app/Services/login.service';
import { AppService } from 'src/app/Services/app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  LoginForm: FormGroup;
  submitted = false;
  fieldTextType: boolean;
  StayLoggedIn:false;
  LoginFormModel = {
    Username: "",
    Password: ""    
  };
  errorMessage;
  SystemSettings: any;
  constructor(
    private router: Router,
    private loginservice:LoginService, 
    private appService: AppService,
    private notifyService : NotificationService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.LoginForm = this.formBuilder.group(
      {
        username: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required]], 
        LoginFormModel: ["", ""],
      },
      {
        // Used custom form validator name
        //validator: ComparePassword("Password", "ConfirmPassword")
      }
    );

  }

  // Getter function in order to get form controls value
  get f() {
    return this.LoginForm.controls;
  }

  SignIn()
  {
    this.submitted = true;

    // Returns false if form is invalid
    if (this.LoginForm.invalid) {
      return;
    }
    //this.notifyService.showSuccess("Data shown successfully !!", "ItSolutionStuff.com")
    //this.notifyService.showError("Something is wrong", "ItSolutionStuff.com")
    //this.notifyService.showInfo("This is info", "ItSolutionStuff.com")
    //this.notifyService.showWarning("This is warning", "ItSolutionStuff.com")
    let email = this.LoginFormModel.Username;
    let pass = this.LoginFormModel.Password;

    this.loginservice.login(email, pass)
      .subscribe(
        res => {
          if(this.StayLoggedIn)
          {
            localStorage.setItem('Username', email);
            localStorage.setItem('Password', pass);
          }          
          this.notifyService.showSuccess("User Login Successfully","")
          //this.router.navigate(['Dashboard']);
          this.SystemSettings = JSON.parse(localStorage.getItem("systemsettings"));
          if(this.SystemSettings.objDashboard.View)
          {
            window.location.replace('Dashboard');
          }
          else if(this.SystemSettings.objReviews.View)
          {
            window.location.replace('Reviews');
          }
          else if(this.SystemSettings.objMaintenance.View)
          {
            window.location.replace('Maintenance');
          }
          else if(this.SystemSettings.objFeedBack.View)
          {
            window.location.replace('Feedback');
          }
          else if(this.SystemSettings.objHotels.View)
          {
            window.location.replace('Hotels');
          }
          else if(this.SystemSettings.objUsers.View)
          {
            window.location.replace('Users');
          }
          else if(this.SystemSettings.objReviewReason.View)
          {
            window.location.replace('ReviewReason');
          }
          else if(this.SystemSettings.objRolePermissions.View)
          {
            window.location.replace('RolePermissions');
          }
          else if(this.SystemSettings.objState.View)
          {
            window.location.replace('State');
          }
          else if(this.SystemSettings.objStatus.View)
          {
            window.location.replace('Status');
          }
          else if(this.SystemSettings.objChangePassword.View)
          {
            window.location.replace('ChangePassword');
          }else
          {
            //dont have rights for any module please contact administrator.
            window.location.replace('NoRights');
          }
          
        },
        error => {
          this.errorMessage = <any>error
          //var jsonObject = JSON.stringify(this.errorMessage);
          this.notifyService.showError("Error#101: No user found.","")          
        });
    
  }

  toggleFieldTextType(){
    this.fieldTextType = !this.fieldTextType;
  }
}
