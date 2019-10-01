import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from "@angular/router";
import {AuthService} from "./auth.service";
import {EventEmitter} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  showDetail: boolean = false;
  clickedDate: Date = null;
  changeDetectionEmitter: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
  ) {
  }

  getCategories() {
    return this.http.get('/api/categories')
      .toPromise()
      .then((res: any) => {
        return res;
      })
      .catch((err) => {
        if (err.status == 401) {
          this.authService.logout();
          this.router.navigate(["/"]);
        }
      });
  }

  getUserExpenses() {
    return this.http.get('/api/user_expenses')
      .toPromise()
      .then((res: any) => {
        return res;
      })
      .catch((err) => {
        if (err.status == 401) {
          this.authService.logout();
          this.router.navigate(["/"]);
        }
      });
  }

  postDetail(category: string, paymentType: number, price: number, date: string) {
    let requestBody = {
      "category":     category,
      "payment_type": paymentType,
      "price":        price,
      "date":         date,
    };

    return this.http.post('/api/save_detail', JSON.stringify(requestBody))
      .toPromise()
      .then((res)=>{
        if (res['status_code'] == 200) {
          this.setShowDetail(false);
          this.changeDetectionEmitter.emit();
        }
      });
  }

  getShowDetail () {
    return this.showDetail;
  }

  setShowDetail (val: boolean) {
    this.showDetail = val;
  }

  getClickedDate () {
    return this.clickedDate;
  }

  setClickedDate (val: Date) {
    this.clickedDate = val;
  }

  getChangeDetectionEmitter() {
    return this.changeDetectionEmitter;
  }
}
