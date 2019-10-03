import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  public leaveCompleteNow: boolean = false;

  constructor(
    private http: HttpClient,
  ) { }

  /**
   * プロパティ初期化
   */
  init() {
    this.leaveCompleteNow = false;
  }

  /**
   * 退会処理
   */
  leave () {
    let requestBody = {};

    return this.http.post('/api/leave', JSON.stringify(requestBody))
      .toPromise()
      .then((res) => {
        if (res['status_code'] == 200) {
          this.leaveCompleteNow = true;
        }
        return res;
      })
      .catch(this.errorHandler);
  }

  /**
   * 退会完了フラグ取得
   */
  getLeaveCompleteNow () {
    return this.leaveCompleteNow;
  }

  private errorHandler(err) {
    console.log("Error occured. ", err);
  }
}
