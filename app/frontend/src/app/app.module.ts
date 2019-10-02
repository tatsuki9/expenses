import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { AuthComponent } from './components/auth/auth.component';
import { ExpensesComponent } from './components/home/expenses/expenses.component';
import { HomenavbarComponent } from './components/home/homenavbar/homenavbar.component';
import { SettingComponent } from './components/home/setting/setting.component';

import { DemoModule } from "./components/home/expenses/calendar/module/module.module";
import { CalendarDetailComponent } from './components/home/expenses/calendar-detail/calendar-detail.component';
import {RequestInterceptor} from "./request-interceptor";

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
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    DemoModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
