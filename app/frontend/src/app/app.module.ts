import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { AuthComponent } from './components/auth/auth.component';
import { ExpensesComponent } from './components/home/expenses/expenses.component';
import { HomenavbarComponent } from './components/home/homenavbar/homenavbar.component';
import { SettingComponent } from './components/home/setting/setting.component';

// import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
// import { CalendarModule, DateAdapter } from "angular-calendar";
// import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
// import { CalendarComponent } from './components/home/expenses/calendar/calendar.component';
//
import { DemoModule } from "./components/home/expenses/calendar/module/module.module";
import { CalendarDetailComponent } from './components/home/expenses/calendar-detail/calendar-detail.component';
import {RequestInterceptor} from "./request-interceptor";
// import {JWT_OPTIONS, JwtModule} from "@auth0/angular-jwt";

// export function jwtOptionsFactory(cookieService) {
//   return {
//     tokenGetter: () => {
//       return cookieService.get('session');
//     }
//   }
// }

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    AuthComponent,
    ExpensesComponent,
    HomenavbarComponent,
    SettingComponent,
    CalendarDetailComponent,
    // CalendarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    DemoModule,
    // JwtModule.forRoot({
    //   jwtOptionsProvider: {
    //     provide: JWT_OPTIONS,
    //     useFactory: jwtOptionsFactory,
    //     deps: [CookieService]
    //   }
    // })
    // BrowserAnimationsModule,
    // CalendarModule.forRoot({
    //   provide: DateAdapter,
    //   useFactory: adapterFactory
    // })
  ],
  providers: [
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
