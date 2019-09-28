import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { CookieService } from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public registerCompleteNow: boolean = false;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

  login (email: string, password: string) {
    let requestBody = {
      "email": email,
      "password": password
    };

    return this.http.post('/login', JSON.stringify(requestBody))
      .toPromise()
      .then((res) => {
        if (res['status_code'] == 200) {
          this.cookieService.set('session', res['token']);
        }
        return res;
      })
      .catch(this.errorHandler);
  }

  signup (username: string, email: string, password: string) {
    let requestBody = {
      "username": username,
      "email": email,
      "password": password
    };

    return this.http.post('/signup', JSON.stringify(requestBody))
      .toPromise()
      .then((res) => {
        if (res['status_code'] == 200) {
          this.registerCompleteNow = true;
        }
      })
      .catch(this.errorHandler);
  }

  logout () {
    this.cookieService.delete('session');
  }

  isLoggedIn() {
    return this.cookieService.get('session') != "";
  }

  getRegisterCompleteNow () {
    return this.registerCompleteNow;
  }

  setRegisterCompleteNow (val: boolean) {
    this.registerCompleteNow = val;
  }

  private errorHandler(err) {
    console.log("Error occured. ", err);
  }
}
