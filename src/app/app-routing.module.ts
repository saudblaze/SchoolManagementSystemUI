import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BatchAddEditComponent } from './Pages/batch-add-edit/batch-add-edit.component';
import { BatchComponent } from './Pages/batch/batch.component';
import { ChangePasswordComponent } from './Pages/change-password/change-password.component';
import { ContactUsComponent } from './Pages/contact-us/contact-us.component';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';
import { ForgotPasswordComponent } from './Pages/forgot-password/forgot-password.component';
import { LoginComponent } from './Pages/login/login.component';
import { RegistrationComponent } from './Pages/registration/registration.component';
import { RolePermissionsAddEditComponent } from './Pages/role-permissions-add-edit/role-permissions-add-edit.component';
import { RolePermissionsComponent } from './Pages/role-permissions/role-permissions.component';
import { StudentAddEditComponent } from './Pages/student-add-edit/student-add-edit.component';
import { StudentComponent } from './Pages/student/student.component';
import { SubjectAddEditComponent } from './Pages/subject-add-edit/subject-add-edit.component';
import { SubjectComponent } from './Pages/subject/subject.component';
import { TeacherAddEditComponent } from './Pages/teacher-add-edit/teacher-add-edit.component';
import { TeacherComponent } from './Pages/teacher/teacher.component';



const routes: Routes = [  {
    path:'', 
    redirectTo:'Login',
    pathMatch:'full'
  },
  {
    path:'Login',
    component:LoginComponent
  },
  {
    path:'Registration',
    component:RegistrationComponent
  },
  {
    path:'ForgotPassword',
    component:ForgotPasswordComponent
  },
  {
    path:'ContactUs',
    component:ContactUsComponent 
  },
  {
    path:'ChangePassword',
    //canActivate: [AuthGuard],
    component:ChangePasswordComponent
  },
  {
    path:'Dashboard',
    //canActivate: [AuthGuard],
    component:DashboardComponent
  },
  {
    path:'Subject',
    //canActivate: [AuthGuard],
    component:SubjectComponent
  },
  {
    path:'SubjectAddEdit',
    //canActivate: [AuthGuard],
    component:SubjectAddEditComponent
  },
  {
    path:'SubjectAddEdit/:id',
    //canActivate: [AuthGuard],
    component:SubjectAddEditComponent
  },
  {
    path:'Batch',
    //canActivate: [AuthGuard],
    component:BatchComponent
  },
  {
    path:'BatchAddEdit',
    //canActivate: [AuthGuard],
    component:BatchAddEditComponent
  },
  {
    path:'BatchAddEdit/:id',
    //canActivate: [AuthGuard],
    component:BatchAddEditComponent
  },
  {
    path:'Student',
    //canActivate: [AuthGuard],
    component:StudentComponent
  },
  {
    path:'StudentAddEdit/:id',
    //canActivate: [AuthGuard],
    component:StudentAddEditComponent
  },
  {
    path:'StudentAddEdit',
    //canActivate: [AuthGuard],
    component:StudentAddEditComponent
  },
  {
    path:'Teacher',
    //canActivate: [AuthGuard],
    component:TeacherComponent
  },
  {
    path:'TeacherAddEdit/:id',
    //canActivate: [AuthGuard],
    component:TeacherAddEditComponent
  },
  {
    path:'TeacherAddEdit',
    //canActivate: [AuthGuard],
    component:TeacherAddEditComponent
  },
  {
    path:'RolePermissions',
    //canActivate: [AuthGuard],
    component:RolePermissionsComponent
  },
  {
    path:'RolePermissionsAddEdit',
    //canActivate: [AuthGuard],
    component:RolePermissionsAddEditComponent
  },
  {
    path:'RolePermissionsAddEdit/:id',
    //canActivate: [AuthGuard],
    component:RolePermissionsAddEditComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
