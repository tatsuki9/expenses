import {ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {CalendarEvent, CalendarEventTitleFormatter, CalendarMonthViewDay} from "angular-calendar";
import {CustomEventTitleFormatter} from "./custom-event-title-formatter.provider";
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
  total = new Map();
  clickedColumn: number;
  events: CalendarEvent[] = [];

  constructor(
    private calendarService: CalendarService,
    public cd: ChangeDetectorRef
  ) { }

  /**
   * @brief カレンダーの日にちクリック時のイベント処理
   * @param day Object
   */
  eventClicked(day): void {
    if (day.inMonth) {
      this.calendarService.setShowDetail(true);
      this.calendarService.setClickedDate(day.date);
    }
  };

  /**
   * @brief コンポーネント初期化、他、ユーザー家計簿一覧取得
   */
  ngOnInit() {
    // ユーザー家計簿一覧取得
    this.getUserExpenses();

    this.calendarService.getChangeDetectionEmitter().subscribe(()=>{
      this.getUserExpenses();
    })
  }

  /**
   * @brief ユーザー家計簿一覧取得
   */
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
        this.calcTotal();

        for (let key of this.expensesDetail.keys()) {
          this.expensesDate.push(key);
        }
        // 再描画してもらう
        this.redraw();
      }
    });
  }

  /**
   * @brief 当月の支出、収入の合計を算出
   */
  calcTotal() {

    this.total.clear();

    for (const [key, value] of this.expensesDetail) {
      // console.log(value);
      let ym = key.substr(0, 7);
      let data = this.total.get(ym);
      if (data != undefined) {
        let inPrice  = data.get('in');
        let outPrice = data.get('out');
        let addInPrice  = value.get('in') != undefined ? value.get('in') : 0;
        let addOutPrice = value.get('out') != undefined ? value.get('out') : 0;
        inPrice  += addInPrice;
        outPrice += addOutPrice;
        data.set('in', inPrice);
        data.set('out', outPrice);
      } else {
        let detail = new Map();
        let inPrice  = value.get('in') != undefined ? value.get('in') : 0;
        let outPrice = value.get('out') != undefined ? value.get('out') : 0;
        detail.set('in', inPrice);
        detail.set('out', outPrice);
        this.total.set(ym, detail);
      }
    }

    for (const [key, value] of this.total) {
      let totalPrice = value.get('in') - value.get('out');
      value.set('total', totalPrice);
    }
  }

  /**
   * @brief 強制的に再描画させる
   */
  redraw() {
    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }
}
