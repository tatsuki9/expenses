import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {CalendarEvent, CalendarEventTitleFormatter} from "angular-calendar";
import {CustomEventTitleFormatter} from "./custom-event-title-formatter.provider";
import {colors} from "../../../../const";
import {CalendarService} from "../../../../services/calendar.service";


@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  providers: [
    {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter
    }
  ]
})
export class CalendarComponent implements OnInit {
  view: string = 'month';
  viewDate: Date = new Date();

  events: CalendarEvent[] = [];

  eventClicked(date: Date): void {
    // サービスに流してhttpリクエストを送る。
    this.calendarService.setShowDetail(true);
  };
  clickedDate: Date;
  clickedColumn: number;

  constructor(
    private calendarService: CalendarService
  ) { }

  ngOnInit() {
  }

}
