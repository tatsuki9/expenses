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

  init() {
    this.leaveCompleteNow = false;
  }

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

  getLeaveCompleteNow () {
    return this.leaveCompleteNow;
  }

  private errorHandler(err) {
    console.log("Error occured. ", err);
  }
}
