import { Injectable } from '@angular/core';
import { Http ,Response, Headers, } from '../../../node_modules/@angular/http';
import { HttpParams ,HttpClient, HttpHeaders  } from "@angular/common/http";
import { CookieService } from 'ngx-cookie-service';
import { environment } from "../../environments/environment";

import "rxjs/add/operator/map";
import { Observable, observable } from "rxjs";
import 'rxjs/Rx';


import 'rxjs/add/operator/map'

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient,private cookieService: CookieService,) { }
  login(email: string, password: string) {
    let clientId = location.hostname;
    //let headers = new Headers();
    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/x-www-form-urlencoded");
    let params = new HttpParams();
    params = params.append("username", email);
    params = params.append("password", password);
    //params = params.append("OTP", OTP);
    // params = params.append("IsWebLogin", "false");

    //params = params.append("clientId", clientId)
    params = params.append("grant_type", 'password');

    return this.http.post(environment.apiUrl + 'Token', params.toString(), { headers })
        .map((response: any) => {
            // login successful if there's a jwt token in the response
            let user = response;//.json();
            if (user && user.access_token) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                debugger
                localStorage.setItem('TokenData', JSON.stringify(user));
                localStorage.setItem('UserId', user.UserId);
                localStorage.setItem('FirstName', user.FirstName);
                localStorage.setItem('LastName', user.LastName);
                localStorage.setItem('FullUserName', user.FullUserName);
                localStorage.setItem('UserName', user.UserName);
                localStorage.setItem('access_token', user.access_token);
                localStorage.setItem("Email", user.Email);
                localStorage.setItem("Role", user.Role);
                
                localStorage.setItem("isLogin", "true");
                localStorage.setItem("systemsettings", user.systemsettings);                
            }
        }).catch((err: Response) => {
            let details = err.json();
            return Observable.throw(details.error_description);
        });
  }
}
