import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from "ngx-cookie-service";

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  private baseUrl = 'http://localhost:3000';

  constructor(
    private cookieService: CookieService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // '/api'から始まるリクエスト
    if (request.url.match(/^\/api\//)) {
      let token  = this.cookieService.get('session');
      const req = request.clone({
        url: `${this.baseUrl}${request.url}`,  // 接続先URL付加
        withCredentials: true,                  // Cookie有効
        setHeaders: {                           // ヘッダー書き換え
          'Authorization': `Bearer ${token}`,
        },
      });
      return next.handle(req);
    } else {
      const req = request.clone({
        url: `${this.baseUrl}${request.url}`,  // 接続先URL付加
      });
      return next.handle(req);
    }
  }
}
