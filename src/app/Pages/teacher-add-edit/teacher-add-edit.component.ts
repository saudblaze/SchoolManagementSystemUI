declare var $: any;
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IDropdownSettings } from '../../../../node_modules/ng-multiselect-dropdown';
import { AppService } from 'src/app/Services/app.service';
import { NotificationService } from 'src/app/Services/notification.service';

@Component({
  selector: 'app-teacher-add-edit',
  templateUrl: './teacher-add-edit.component.html',
  styleUrls: ['./teacher-add-edit.component.css'],
})
export class TeacherAddEditComponent implements OnInit {
  TeacherForm: FormGroup;
  errorMessage;
  TeacherRegistrationForm = {
    TeacherID: 0,
    TeacherName: '',
    PhoneNumber: '',
    WhatsAppNumber: '',
    Subjects: '',
    Email: '',
    //Subjects: "",
  };
  submitted = false;
  Leadid: any;

  SubjectList = [];
  selectedItems = [];
  selectedItemsQ = [];
  dropdownSettings: IDropdownSettings;
  multiselecttest;

  constructor(
    public route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private appService: AppService,
    private router: Router,
    private notifyService: NotificationService
  ) {}

  ngOnInit(): void {
    this.GetSubjectList();
    this.selectedItems = [];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'SubjectId',
      textField: 'SubjectName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };

    this.Leadid = this.route.snapshot.paramMap.get('id');
    if (this.Leadid) {
      this.GetTeacherById(this.Leadid);
    } else {
      setTimeout(() => {
        //this.isVisible = true
      }, 1000);
    }

    this.TeacherForm = this.formBuilder.group(
      {
        TeacherName: ['', [Validators.required]],
        PhoneNumber: ['', [Validators.required]],
        WhatsAppNumber: ['', [Validators.required]],
        //Subjects: ["", [Validators.required]] ,
        Email: ['', [Validators.required, Validators.email]],
      },
      {
        // Used custom form validator name
        //validator: ComparePassword("Password", "ConfirmPassword")
      }
    );
  }
  // Getter function in order to get form controls value
  get f() {
    return this.TeacherForm.controls;
  }

  onItemSelect(item: any) {}
  onSelectAll(items: any) {}
  GetSubjectList() {
    this.appService
      .GetNoToken('Batch', 'GetRegistrationDropdown')

      .subscribe(
        (res: any) => {
          debugger;
          var objResult = res; //.json()
          if (objResult && objResult.ErrorNumber == '0') {
            this.SubjectList = objResult.Data.objSubject;
          }
        },
        (error) => (this.errorMessage = <any>error)
      );
  }

  BackToList() {
    this.router.navigate(['Teacher']);
  }

  ClearForm() {
    this.TeacherRegistrationForm.TeacherName = '';
    this.TeacherRegistrationForm.PhoneNumber = '';
  }

  GetTeacherById(Id) {
    this.appService
      .GetWithToken('Teacher', 'GetTeacherById?Id=' + Id)

      .subscribe(
        (res: any) => {
          debugger;
          var objResult = res; //.json()
          if (objResult && objResult.ErrorNumber == '0') {
            this.TeacherRegistrationForm.TeacherID = objResult.Data.TeacherID;
            this.TeacherRegistrationForm.TeacherName =
              objResult.Data.TeacherName;
            this.TeacherRegistrationForm.PhoneNumber =
              objResult.Data.PhoneNumber;
            this.TeacherRegistrationForm.WhatsAppNumber =
              objResult.Data.WhatsAppNumber;
            this.TeacherRegistrationForm.Email = objResult.Data.Email;
            this.TeacherRegistrationForm.Subjects = objResult.Data.Subjects;
            //logic for pipe split here
            debugger;
            this.selectedItems = [];
            this.selectedItemsQ = [];
            if (this.TeacherRegistrationForm.Subjects.indexOf('|') != 0) {
              var allstateArr =
                this.TeacherRegistrationForm.Subjects.split('|');
              if (allstateArr.length > 0) {
                allstateArr.forEach((element) => {
                  this.SubjectList.forEach((state) => {
                    if (state.SubjectId == element) {
                      var objToBeInserted = {
                        SubjectId: state.SubjectId,
                        SubjectName: state.SubjectName,
                      };
                      this.selectedItemsQ.push(objToBeInserted);
                    }
                  });
                });
                debugger;
                this.selectedItems = this.selectedItemsQ;
              }
            }
          }
        },
        (error) => (this.errorMessage = <any>error)
      );
  }

  Submit() {
    debugger;
    this.submitted = true;
    // Returns false if form is invalid
    if (this.TeacherForm.invalid) {
      return;
    }

    if (this.selectedItems.length > 0) {
      var jsonString = '';
      this.selectedItems.forEach((element) => {
        jsonString = jsonString + element.SubjectId + '|';
      });
      this.TeacherRegistrationForm.Subjects = jsonString.slice(0, -1);
    }

    var objHotel = {
      TeacherID: this.TeacherRegistrationForm.TeacherID,
      TeacherName: this.TeacherRegistrationForm.TeacherName,
      PhoneNumber: this.TeacherRegistrationForm.PhoneNumber,
      WhatsAppNumber: this.TeacherRegistrationForm.WhatsAppNumber,
      Subjects: this.TeacherRegistrationForm.Subjects,
      Email: this.TeacherRegistrationForm.Email,
      CreatedBy: localStorage.getItem('UserId'),
      UpdatedBy: localStorage.getItem('UserId'),
    };

    this.appService.PostToken('Teacher', 'SaveTeacher ', objHotel).subscribe(
      (res: any) => {
        if (res) {
          var resultbody = res; //.json()
          if (resultbody.ErrorNumber == 0) {
            this.notifyService.showSuccess('Teacher successfully added.', '');
            this.router.navigate(['Teacher']);
          } else if (resultbody.ErrorNumber == 1) {
            this.notifyService.showSuccess('Teacher successfully updated.', '');
            this.router.navigate(['Teacher']);
          } else {
            this.notifyService.showError(resultbody.ErrorMessage, 'Error');
          }
        } else {
          this.notifyService.showError(
            this.errorMessage.statusText,
            'An error occured while registering Teacher.'
          );
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        //var jsonObject = JSON.stringify(this.errorMessage);
        this.notifyService.showError(
          this.errorMessage.statusText,
          'An error occured while registering Teacher.'
        );
      }
    );
  }
}
