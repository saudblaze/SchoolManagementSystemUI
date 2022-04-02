import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import * as Chart from 'chart.js';
import { AppService } from 'src/app/Services/app.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  errorMessage;
  Username;
  SystemSettings;
  DashboardCount = {
    "Teachers": "0",
    "Batches": "0",
    "Complains": "0",
    "TotalStudents": "0",
    "GENERALMANAGER": "0",
    "MANAGER": "0",
    "FRONTDESK": "0",
    "HOUSEKEEPING": "0",
    "MAINTENANCE": "0"
  }

  //barchartlables = [0, 0, 0, 0, 0];
  barchartlablesHotelData = [2, 5, 17, 3, 11];
  barchartlablesUserData = [2, 5, 17, 3, 11];
  barchartlablesReviewlevelwise = [2, 5, 17, 3, 11];
  barchartlablesCustomerRatingwise = [2, 5, 17, 3, 11];
  barchartlablesReviewlevelwiseOwned = [2, 5, 17, 3, 11];
  barchartlablesCustomerRatingwiseOwned = [2, 5, 17, 3, 11];

  barchartlablesMaintenanceDataA = [17, 3, 11];
  barchartlablesMaintenanceDataB = [7, 8, 5];

  barchartlablesHotelDataChart = [0, 0, 0];

  barchartlablesUserDataOwned = [2, 5, 17, 3, 11];
  constructor(private router: Router,public http: HttpClient, private appService: AppService) { }

  canvasHotelData: any;
  ctxHotelData: any;

  canvasUserData:any;
  ctxUserData:any;

  canvasReviewlevelwise:any;
  ctxReviewlevelwise:any;

  canvasCustomerRatingwise:any;
  ctxCustomerRatingwise:any;

  canvasReviewlevelwiseOwned:any;
  ctxReviewlevelwiseOwned:any;

  canvasCustomerRatingwiseOwned:any;
  ctxCustomerRatingwiseOwned:any;

  canvasMaintenanceData:any;
  ctxMaintenanceData:any;

  canvasHotelDataChart:any;
  ctxHotelDataChart:any;



  ngOnInit(): void {
    this.Username = localStorage.getItem("FullUserName");
    this.SystemSettings = JSON.parse(localStorage.getItem("systemsettings"));
    //this.makeHttpCall();
    //this.GetAllDashboardCount();
  }
  GetAllDashboardCount() {
    var  objSendData = {
      "Role" : localStorage.getItem("Role"),
      "SeesionHotelID" : localStorage.getItem("HotelID")
    }
    

    this.appService.PostNoToken("Dashboard", "GetAllDashboardCount",objSendData)

      .subscribe(
        (res: any) => {
          var objResult = res//.json()
          if (objResult && objResult.ErrorNumber == "0") {
            this.DashboardCount = objResult.Data;
            //this.barchartlables = objResult.Data.UserData;
            this.barchartlablesHotelData = objResult.Data.HotelCategory;

            this.barchartlablesReviewlevelwise = objResult.Data.Reviewlevelwise;
            this.barchartlablesCustomerRatingwise = objResult.Data.CustomerRatingwise;                       
            this.barchartlablesReviewlevelwiseOwned = objResult.Data.ReviewlevelwiseOwned;
            this.barchartlablesCustomerRatingwiseOwned = objResult.Data.CustomerRatingwiseOwned; 
            this.barchartlablesMaintenanceDataA = objResult.Data.AllMaintenanceData;
            this.barchartlablesMaintenanceDataB = objResult.Data.MaintenanceData;
            this.barchartlablesUserDataOwned = objResult.Data.UserDataOwned;

            var TotalHotels = 0;
            var TotalHotelsOwned = 0;

            if(objResult.Data.TotalHotels)
            {
              TotalHotels = objResult.Data.TotalHotels;
            }
            if(objResult.Data.TotalHotelsOwned)
            {
              TotalHotelsOwned = objResult.Data.TotalHotelsOwned
            }


            this.barchartlablesHotelDataChart = [TotalHotelsOwned,TotalHotels]
            
            
            setTimeout(() => {
              // this.chart.chart.data.datasets[0].data = objResult.Data.UserData;
              // this.chart.chart.update();


              //HOTEL DATA CHART
              this.canvasHotelData = document.getElementById('HotelCategory');
              this.ctxHotelData = this.canvasHotelData.getContext('2d');

              let myHotelData = new Chart(this.ctxHotelData, {
                type: 'pie',
                data: {
                  labels: ["Economy/Budget", "Value", "Quality", "Superior", "Exceptional/Luxury"],
                  datasets: [{
                    label: 'Hotels category wise',
                    data: this.barchartlablesHotelData,
                    backgroundColor: [
                      'yellow',
                      'blue',
                      'orange',
                      'green',
                      'red'
                    ],
                    borderWidth: 1
                  }]
                },
                options: {
                  responsive: true                  
                }
              });

              //UserData
              this.canvasUserData = document.getElementById('UserData');
              this.ctxUserData = this.canvasUserData.getContext('2d');

              let myUserData = new Chart(this.ctxUserData, {
                type: 'bar',
                data: {
                  labels: ["General Manager", "Manager", "Front Desk", "Housekeeping", "Maintenance"],
                  datasets: [{
                    label: 'User Data',
                    data: this.barchartlablesUserData,
                    backgroundColor: [
                      '#0000FF',
                      '#0000FF',
                      '#0000FF',
                      '#0000FF',
                      '#0000FF'
                    ],
                    borderWidth: 1
                  },
                  {
                    label: 'User Data Owned',
                    data: this.barchartlablesUserDataOwned,
                    backgroundColor: [
                      '#9999ff',
                      '#9999ff',
                      '#9999ff',
                      '#9999ff',
                      '#9999ff'
                    ],
                    borderWidth: 1
                  }
                ]
                },
                options: {
                  responsive: true,
                  // display:true
                  scales: {
                    yAxes: [{
                      ticks: {
                        beginAtZero: true
                      }
                    }
                    ]
                  }
                }
              });

              //Reviewlevelwise
              this.canvasReviewlevelwise = document.getElementById('Reviewlevelwise');
              this.ctxReviewlevelwise = this.canvasReviewlevelwise.getContext('2d');

              let myReviewlevelwise = new Chart(this.ctxReviewlevelwise, {
                type: 'doughnut',
                data: {
                  labels: ["Severe", "High", "Elavated", "Guarded", "No Issue"],
                  datasets: [{
                    label: 'Review level wise',
                    data: this.barchartlablesReviewlevelwise,
                    backgroundColor: [
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'green',
                      'red'
                    ],
                    borderWidth: 1
                  }]
                },
                options: {
                  responsive: true,                  
                }
              });

              //CustomerRatingwise
              this.canvasCustomerRatingwise = document.getElementById('CustomerRatingwise');
              this.ctxCustomerRatingwise = this.canvasCustomerRatingwise.getContext('2d');

              let myCustomerRatingwise = new Chart(this.ctxCustomerRatingwise, {
                type: 'doughnut',
                data: {
                  labels: ["1 star", "2 star", "3 star", "4 star", "5 star"],
                  datasets: [{
                    label: 'Review level wise',
                    data: this.barchartlablesCustomerRatingwise,
                    backgroundColor: [
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'green',
                      'red'
                    ],
                    borderWidth: 1
                  }]
                },
                options: {
                  responsive: true,                  
                }
              });

              //ReviewlevelwiseOwned
              this.canvasReviewlevelwiseOwned = document.getElementById('ReviewlevelwiseOwned');
              this.ctxReviewlevelwiseOwned = this.canvasReviewlevelwiseOwned.getContext('2d');

              let myReviewlevelwiseOwned = new Chart(this.ctxReviewlevelwiseOwned, {
                type: 'doughnut',
                data: {
                  labels: ["Severe", "High", "Elavated", "Guarded", "No Issue"],
                  datasets: [{
                    label: 'Review level wise',
                    data: this.barchartlablesReviewlevelwiseOwned,
                    backgroundColor: [
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'green',
                      'red'
                    ],
                    borderWidth: 1
                  }]
                },
                options: {
                  responsive: true,                  
                }
              });

              //CustomerRatingwiseOwned
              this.canvasCustomerRatingwiseOwned = document.getElementById('CustomerRatingwiseOwned');
              this.ctxCustomerRatingwiseOwned = this.canvasCustomerRatingwiseOwned.getContext('2d');

              let myCustomerRatingwiseOwned = new Chart(this.ctxCustomerRatingwiseOwned, {
                type: 'doughnut',
                data: {
                  labels: ["1 star", "2 star", "3 star", "4 star", "5 star"],
                  datasets: [{
                    //label: 'Review level wise',
                    data: this.barchartlablesCustomerRatingwiseOwned,
                    backgroundColor: [
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'green',
                      'red'
                    ],
                    borderWidth: 1
                  }]
                },
                options: {
                  responsive: true,                  
                }
              });

              //MaintenanceData
              this.canvasMaintenanceData = document.getElementById('MaintenanceData');
              this.ctxMaintenanceData = this.canvasMaintenanceData.getContext('2d');

              let myMaintenanceData = new Chart(this.ctxMaintenanceData, {
                type: 'bar',
                data: {
                  labels: ["Request", "In-Progress", "Finished"],
                  datasets: [{
                    label: 'Maintenance Data',
                    data: this.barchartlablesMaintenanceDataA,
                    backgroundColor: [
                      '#008000',
                      '#FF0000',
                      '#FFFF00'
                    ],
                    borderWidth: 1
                  },
                  {
                    label: 'Maintenance Data Owned',
                    data: this.barchartlablesMaintenanceDataB,
                    backgroundColor: [
                      '#99CC99',
                      '#ff9999',
                      '#ffffb2'
                    ],
                    borderWidth: 1
                  }
                ]
                },
                options: {
                  responsive: true,     
                  scales: {
                    yAxes: [{
                      ticks: {
                        beginAtZero: true
                      }
                    }
                    ]
                  }             
                }
              });

              //HotelDataChart
              this.canvasHotelDataChart = document.getElementById('HotelDataChart');
              this.ctxHotelDataChart = this.canvasHotelDataChart.getContext('2d');

              let myHotelDataChart = new Chart(this.ctxHotelDataChart, {
                type: 'bar',
                data: {
                  labels: ["Owned Properties", "Total Properties"],
                  datasets: [{
                    label: 'Hotel Data',
                    data: this.barchartlablesHotelDataChart,
                    backgroundColor: [
                      'green',
                      'red'
                    ],
                    borderWidth: 1
                  }                  
                ]
                },
                options: {
                  responsive: true,
                  scales: {
                    yAxes: [{
                      ticks: {
                        beginAtZero: true
                      }
                    }
                    ]
                  }                  
                }
              });


            }, 500);

          }
        },
        error =>
          this.errorMessage = <any>error

      );
  }

  chartHovered() {

  }
  chartClicked() {

  }

  makeHttpCall() {
    this.http.get('http://192.168.0.2:8073/api/Login/TestingGet')
      .subscribe((r) => {
        console.log(r);
      });
  }

  SearchYourCustomer(){
    this.router.navigate(['CustomerSearch']);
  }

}
