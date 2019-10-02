import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// ngx-cookie-serviceだと特定の場合でcookieが削除されない場合があるので、以下採用
import Cookies from "../../../node_modules/js-cookie/src/js.cookie.js"

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public registerCompleteNow: boolean = false;

  constructor(
    private http: HttpClient,
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
          Cookies.set('session', res['token'], { expires: res['remain_at'] / 86164 });
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
        return res;
      })
      .catch(this.errorHandler);
  }

  logoutOrLeave () {
    Cookies.remove('session');
  }

  isLoggedIn() {
    return this.getCookie() != undefined;
  }

  getCookie() {
    return Cookies.get('session');
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
