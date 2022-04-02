declare var $: any;

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import * as jquery from 'jquery';

import { AppService } from 'src/app/Services/app.service';
import { CommonService } from 'src/app/Services/common.service';
import { NotificationService } from 'src/app/Services/notification.service';
import { ComparePassword } from 'src/app/_Helper/customvalidator.validator/customvalidator.validator';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  
  
  

  registerForm: FormGroup;
  submitted = false;

  


  
  errorMessage;
  RegistrationForm = {
    FirstName: "",
    LastName: "",
    Email: "",
    Role: 0,
    // UserName: "",
    Password: "",
    ConfirmPassword: "",
    PhoneNumber: ""    
  };
  

  HotelRegistrationForm = {
    Id: 0,
    HotelName: "",
    Address1: "",
    Address2: "",
    Addresstwo: "",
    CityName: "",
    StateID: "",
    Zipcode: "",
    Phone: "",
    SubscriptionID: 0,
    SubscriptionSelection: "",
    HotelLogo: "",
    HotelLogoFileName: "",
    ByteData: undefined,
    SelectedHotelCategory: ""    
  };

  constructor(
    //protected changeDetectorRef: ChangeDetectorRef, 
    private notifyService: NotificationService, 
    private formBuilder: FormBuilder, 
    private router: Router, 
    private appService: AppService, 
    private commonService: CommonService
    ) { }

    ngOnInit(): void {  
      var that = this;  
      
      this.registerForm = this.formBuilder.group(
        {
          firstName: ["", [Validators.required]],
          LastName: ["", [Validators.required]],
          Email: ["", [Validators.required, Validators.email]],
          
          //UserName: ["", Validators.required],
          PhoneNumber: ["", Validators.required],
  
          Password: ["", [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}')]],
          ConfirmPassword: ["", Validators.required]
        },
        {
          // Used custom form validator name
          validator: ComparePassword("Password", "ConfirmPassword")
        }
      );
    }
  
    // Getter function in order to get form controls value
    get f() {
      return this.registerForm.controls;
    }
  
    Register() {
      debugger
      this.submitted = true;
  
  
      if (this.RegistrationForm.PhoneNumber.length == 17) {
        this.RegistrationForm.PhoneNumber = this.RegistrationForm.PhoneNumber.substring(0, 16)
      }
  
      // Returns false if form is invalid
      if (this.registerForm.invalid) {
        return;
      }
      var objRegister = {
        "FirstName": this.RegistrationForm.FirstName,
        "LastName": this.RegistrationForm.LastName,
        //"UserName": this.RegistrationForm.UserName,
        "Email": this.RegistrationForm.Email,        
        "Password": this.RegistrationForm.Password,
        "ConfirmPassword": this.RegistrationForm.ConfirmPassword,
        "PhoneNumber": this.RegistrationForm.PhoneNumber,
        "Role": 1          
  
      }
      this.appService.PostNoToken("Account", "Register", objRegister)
        .subscribe(
          (res: any) => {
            this.notifyService.showSuccess("User register successfully", "")
            var that = this;
            setTimeout(() => {
              that.router.navigate(['Login']);
            }, 1000);
          },
          error => {
            this.errorMessage = <any>error
            //var jsonObject = JSON.stringify(this.errorMessage);
            this.notifyService.showError(this.errorMessage.statusText, "An error occured while registering user.")
          });
  
    }
  
    Login() {
      this.router.navigate(['Login']);
    }
  
    
    eventHandler(event) {
      var keycode = event.which;
      if (!(event.shiftKey == false && (keycode == 46 || keycode == 8 || keycode == 37 || keycode == 39 || (keycode >= 48 && keycode <= 57)))) {
        event.preventDefault();
      }
    }

}
