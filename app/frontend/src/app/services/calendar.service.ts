import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from "@angular/router";
import {AuthService} from "./auth.service";

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
      .then((res) => {
      })
      .catch((err) => {
        if (err.status == 401) {
          this.authService.logout();
          this.router.navigate(["/"]);
        }
      });
  }

  getShowDetail () {
    return this.showDetail;
  }

  setShowDetail (val: boolean) {
    this.showDetail = val;
  }
}
