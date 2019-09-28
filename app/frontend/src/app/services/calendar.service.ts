import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from "@angular/router";
import {AuthService} from "./auth.service";
import {Observable} from "rxjs";
import {catchError, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  showDetail: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) { }

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

  postDetail(date: string, price: number, category: string) {
    let requestBody = {
      "date":     date,
      "price":   price,
      "category": category
    };

    return this.http.post('/api/save_detail', JSON.stringify(requestBody))
      .toPromise()
      .then((res)=>{

      });
  }

  getShowDetail () {
    return this.showDetail;
  }

  setShowDetail (val: boolean) {
    this.showDetail = val;
  }
}
