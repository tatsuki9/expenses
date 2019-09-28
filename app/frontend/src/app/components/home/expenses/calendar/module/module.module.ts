import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule, DateAdapter} from "angular-calendar";
import { DemoUtilsModule } from "./module/module.module";
import { CalendarComponent } from "../calendar.component";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";

@NgModule({
  declarations: [CalendarComponent],
  imports: [
    CommonModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    DemoUtilsModule
  ],
  exports: [CalendarComponent]
})
export class DemoModule { }
