import { Injectable } from '@angular/core';
import { HttpParams, HttpClient, HttpHeaders } from "@angular/common/http";
import { Http, Response, Headers, Jsonp } from "@angular/http";
import { environment } from "../../environments/environment";
//import { HttpClientService } from './http-client.service';

//import { Http, Headers } from '@angular/http';
// import 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  constructor(
    private http: HttpClient ,
    private objhttp: Http
  ) {
  }


  async getasync(url) {
    //const headers = new Headers();
    const headers = this.createAuthorizationHeader();
    return await this.http.get(url, {
      headers
    }).toPromise();
  }

  //createAuthorizationHeader(headers: Headers, notoken: boolean = false, ContentType: boolean = true) {
    createAuthorizationHeader(notoken: boolean = false, ContentType: boolean = true) {
    //let headers = new HttpHeaders();
    //let headers: HttpHeaders = new HttpHeaders();
    let headers = new HttpHeaders();
    if (localStorage.getItem("access_token") && notoken == false) {
      let tokenval = localStorage.getItem("access_token");
      const token: string = 'Bearer ' + tokenval;
      //headers.append('Authorization', token);
      headers = headers.set('Authorization', token);
    }
    if (ContentType) {
      //headers.set('Content-Type', 'application/json; charset=utf-8');
      headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    }
    return headers;
    // headers.append("Access-Control-Allow-Origin", "*");
    // headers.append("Access-Control-Allow-Credentials", "true");
    // headers.append("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    // headers.append("TEST", "123");
    // headers.append("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    // headers.append("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

  }

  PostToken(ControllerName: any, ActionName: any, Data: any) {
    const headers = this.createAuthorizationHeader();
    return this.http.post(environment.apiUrl + 'api/' + ControllerName + '/' + ActionName, Data, {
      headers
    });
  }

  PostNoToken(ControllerName: any, ActionName: any, Data: any) {
    return this.http.post(environment.apiUrl + 'api/' + ControllerName + '/' + ActionName, Data)
  }

  GetNoToken(ControllerName: any, ActionName: any) {
    const headers = new HttpHeaders();
    //this.createAuthorizationHeader(headers);
    return this.http.get(environment.apiUrl + 'api/' + ControllerName + '/' + ActionName, {
      headers: headers,
    });
  }

  async GetAsync(ControllerName: any, ActionName: any) {
    let url = environment.apiUrl + 'api/' + ControllerName + '/' + ActionName;
    return await this.getasync(url);
  }

  GetWithToken(ControllerName: any, ActionName: any) {
    const headers = this.createAuthorizationHeader();
    return this.http.get(environment.apiUrl + 'api/' + ControllerName + '/' + ActionName, {
      headers
    });
  }

  FileUpload(ControllerName: any, ActionName: any, Data: FormData) {
    return this.objhttp.post(environment.apiUrl + 'api/' + ControllerName + '/' + ActionName, Data, null)
      ;
  }

  
  // append(name: string, value: string|string[]): 
  // HttpHeaders { 
  //   return this.clone({name, value, op: 'a'}); 
  // } 

}
