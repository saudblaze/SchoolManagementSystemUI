import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LoginComponent } from './Pages/login/login.component';

import { CookieService } from 'ngx-cookie-service';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';


// import { AsideComponent } from './Components/aside/aside.component';
// import { NavbarComponent } from './Components/navbar/navbar.component';
// import { FooterComponent } from './Components/footer/footer.component';

// import { LoaderComponent } from './Components/loader/loader.component';
import { LoaderService } from './Services/loader.service';
import { LoaderInterceptorService } from './interceptors/loader-interceptor.service';
import { AsideComponent } from './Components/aside/aside.component';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { FooterComponent } from './Components/footer/footer.component';
import { LoaderComponent } from './Components/loader/loader.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RegistrationComponent } from './Pages/registration/registration.component';
import { HttpModule } from '@angular/http';
import { ToastrModule } from 'ngx-toastr';
import { ForgotPasswordComponent } from './Pages/forgot-password/forgot-password.component';
import { ContactUsComponent } from './Pages/contact-us/contact-us.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';
import { StudentComponent } from './Pages/student/student.component';
import { StudentAddEditComponent } from './Pages/student-add-edit/student-add-edit.component';
import { TeacherComponent } from './Pages/teacher/teacher.component';
import { TeacherAddEditComponent } from './Pages/teacher-add-edit/teacher-add-edit.component';
import { ChangePasswordComponent } from './Pages/change-password/change-password.component';
import { SubjectComponent } from './Pages/subject/subject.component';
import { BatchComponent } from './Pages/batch/batch.component';
import { SubjectAddEditComponent } from './Pages/subject-add-edit/subject-add-edit.component';
import { BatchAddEditComponent } from './Pages/batch-add-edit/batch-add-edit.component';
import { RolePermissionsComponent } from './Pages/role-permissions/role-permissions.component';
import { RolePermissionsAddEditComponent } from './Pages/role-permissions-add-edit/role-permissions-add-edit.component';
import { PhoneMaskDirective } from './Directives/phone-mask-directive';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { RoleComponent } from './Pages/role/role.component';
import { RoleAddEditComponent } from './Pages/role-add-edit/role-add-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AsideComponent,
    NavbarComponent,
    FooterComponent,
    LoaderComponent,
    RegistrationComponent,
    ForgotPasswordComponent,
    ContactUsComponent,
    DashboardComponent,
    StudentComponent,
    StudentAddEditComponent,
    TeacherComponent,
    TeacherAddEditComponent,
    ChangePasswordComponent,
    SubjectComponent,
    BatchComponent,
    SubjectAddEditComponent,
    BatchAddEditComponent,
    RolePermissionsComponent,
    RolePermissionsAddEditComponent ,
    PhoneMaskDirective,
    RoleComponent,
    RoleAddEditComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpModule    ,
    NgMultiSelectDropDownModule.forRoot(),
    BsDatepickerModule.forRoot()
   
  ],
  providers: [
    LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptorService, multi: true },
    CookieService,
  ],
  exports: [
    PhoneMaskDirective
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
