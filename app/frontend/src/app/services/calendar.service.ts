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

  /**
   * @brief カテゴリー一覧取得
   */
  getCategories() {
    return this.http.get('/api/categories')
      .toPromise()
      .then((res: any) => {
        return res;
      })
      .catch((err) => {
        if (err.status == 401) {
          this.authService.logoutOrLeave();
          this.router.navigate(["/"]);
        }
      });
  }

  /**
   * @brief ユーザー家計簿一覧取得
   */
  getUserExpenses() {
    return this.http.get('/api/user_expenses')
      .toPromise()
      .then((res: any) => {
        return res;
      })
      .catch((err) => {
        if (err.status == 401) {
          this.authService.logoutOrLeave();
          this.router.navigate(["/"]);
        }
      });
  }

  /**
   * @brief 家計簿詳細保存
   * @param category
   * @param paymentType
   * @param price
   * @param date
   */
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
        return res;
      });
  }

  /**
   * @brief 家計簿詳細入力ダイアログ表示有無取得
   */
  getShowDetail () {
    return this.showDetail;
  }

  setShowDetail (val: boolean) {
    this.showDetail = val;
  }

  /**
   * @brief カレンダーでクリックした日付取得
   */
  getClickedDate () {
    return this.clickedDate;
  }

  setClickedDate (val: Date) {
    this.clickedDate = val;
  }

  /**
   * @brief イベント発火取得
   */
  getChangeDetectionEmitter() {
    return this.changeDetectionEmitter;
  }
}
