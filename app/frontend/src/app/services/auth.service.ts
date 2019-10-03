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

  /**
   * @brief ログイン処理
   * @param email string
   * @param password string
   */
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

  /**
   * @brief サインアップ処理
   * @param username
   * @param email
   * @param password
   */
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

  /**
   * @brief ログアウト、退会時の後処理
   */
  logoutOrLeave () {
    Cookies.remove('session');
  }

  /**
   * @brief セッションチェック
   */
  isLoggedIn() {
    return this.getCookie() != undefined;
  }

  /**
   * @brief クッキー取得
   */
  getCookie() {
    return Cookies.get('session');
  }

  /**
   * @brief 新規登録フラグ取得
   */
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
