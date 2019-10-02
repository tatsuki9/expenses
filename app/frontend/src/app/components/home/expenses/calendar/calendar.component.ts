import {ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {CalendarEvent, CalendarEventTitleFormatter, CalendarMonthViewDay} from "angular-calendar";
import {CustomEventTitleFormatter} from "./custom-event-title-formatter.provider";
import {colors} from "../../../../const";
import {CalendarService} from "../../../../services/calendar.service";
import {SystemConst} from "../../../../const";

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

  expensesDate: string[] =  new Array();
  expensesDetail = new Map();

  clickedDate: Date;
  clickedColumn: number;
  events: CalendarEvent[] = [
    {
      title: 'Click',
      color: colors.red,
      start: new Date()
    }
  ];

  constructor(
    private calendarService: CalendarService,
    public cd: ChangeDetectorRef
  ) { }

  eventClicked(day): void {
    if (day.inMonth) {
      this.calendarService.setShowDetail(true);
      this.calendarService.setClickedDate(day.date);
    }
  };

  ngOnInit() {
    this.getUserExpenses();

    this.calendarService.getChangeDetectionEmitter().subscribe(()=>{
      this.getUserExpenses();
    })
  }

  getUserExpenses() {
    this.expensesDetail.clear();
    this.expensesDate = [];
    this.calendarService.getUserExpenses().then(res=>{
      if (res != null) {
        res.forEach(res=>{
          let data = this.expensesDetail.get(res['RegisterDate']);
          if (data != undefined) {
            let outPrice = data.get('out') != undefined ? data.get('out') : 0;
            let inPrice  = data.get('in') != undefined ? data.get('in') : 0;

            switch (res['PaymentType']) {
              case SystemConst.PaymentType.SPEND:
                outPrice += res['Price'];
                data.set('out', outPrice);
                break;
              case SystemConst.PaymentType.INCOME:
                inPrice += res['Price'];
                data.set('in', inPrice);
                break;
              default:
                break;
            }
          } else {
            let detail = new Map();
            switch (res['PaymentType']) {
              case SystemConst.PaymentType.SPEND:
                detail.set('out', res['Price']);
                break;
              case SystemConst.PaymentType.INCOME:
                detail.set('in', res['Price']);
                break;
              default:
                break;
            }
            this.expensesDetail.set(res['RegisterDate'], detail);
          }
        });
        for (let key of this.expensesDetail.keys()) {
          this.expensesDate.push(key);
        }
        // 再描画してもらう
        this.redraw();
      }
    });
  }

  redraw() {
    // 強制的に再描画させる
    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }
}
