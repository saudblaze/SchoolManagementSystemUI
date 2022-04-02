declare var $: any;
import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '../../../../node_modules/@angular/router';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css']
})
export class AsideComponent implements OnInit {

  Username;
  Showlogolg = true;
  activeRoute;
  Role;
  SystemSettings;
  
  constructor(public route: ActivatedRoute,private router: Router,) { }

  ngOnInit(): void {
    this.Username = localStorage.getItem("FullUserName");
    this.Role = localStorage.getItem("Role").replace("_"," ");
    this.SystemSettings = JSON.parse(localStorage.getItem("systemsettings"));
    this.activeRoute = this.route.routeConfig.component.name;
    
    // remove active classs from all other 
    $("#Dashboard").removeClass("active");
    $("#Teacher").removeClass("active");
    $("#ChangePassword").removeClass("active");
    $("#ContactUs").removeClass("active");
    $("#RolePermissions").removeClass("active");
    $("#Student").removeClass("active");

    $("#Subject").removeClass("active");
    $("#Batch").removeClass("active");
    


    $("#SystemSettingsli").removeClass("menu-open");
    $("#AccountSettingsli").removeClass("menu-open");


    setTimeout(() => {
      if (this.activeRoute == "DashboardComponent") {
        $("#Dashboard").addClass("active");
        return;
      }
      
      if (this.activeRoute == "TeacherComponent" || this.activeRoute == "TeacherAddEditComponent") {
        $("#Teacher").addClass("active");
        $("#SystemSettingsli").addClass("menu-open");
        return;
      }
      if (this.activeRoute == "ChangePasswordComponent" ) {
        $("#ChangePassword").addClass("active");
        $("#AccountSettingsli").addClass("menu-open");
        return;
      }
      if (this.activeRoute == "ContactUsComponent" ) {
        $("#ContactUs").addClass("active");
        $("#AccountSettingsli").addClass("menu-open");
        return;
      }
      if (this.activeRoute == "StudentComponent" || this.activeRoute == "StudentAddEditComponent") {
        $("#Student").addClass("active");
        $("#SystemSettingsli").addClass("menu-open");
        return;
      }  
      if (this.activeRoute == "SubjectComponent" || this.activeRoute == "SubjectAddEditComponent") {
        $("#Subject").addClass("active");
        $("#SystemSettingsli").addClass("menu-open");
        return;
      }  
      if (this.activeRoute == "BatchComponent" || this.activeRoute == "BatchAddEditComponent") {
        $("#Batch").addClass("active");
        $("#SystemSettingsli").addClass("menu-open");
        return;
      }       
    }, 100);

  }

  ngAfterViewInit() {
    $("#Logout").click(function(){
      localStorage.clear();
      this.router.navigate(['Login']);
    })
  }

  LogOut(){
    localStorage.clear();
    this.router.navigate(['Login']);
  }
  pushmenu() {
    if (this.Showlogolg == true) {
      this.Showlogolg = false;
    } else {
      this.Showlogolg = true;
    }
  }

}
