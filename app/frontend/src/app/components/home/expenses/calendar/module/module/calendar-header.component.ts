import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'mwl-demo-utils-calendar-header',
  template: `
    <div style="position: relative; width: 100%; height: 50px; text-align: center; white-space: nowrap; border-radius: 10px; border: thin solid; margin: 10px; auto;">
      <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
        <label>今月の収入: ¥</label>
        <span style="color: aqua; font-size: 20px;" *ngIf="total.get(viewDate | date: 'yyyy-MM') != undefined; else elseBlock"> +{{total.get(viewDate | date: "yyyy-MM").get('in') | number}} </span>
        <label>今月の支出: ¥</label> 
        <span style="color: red; font-size: 20px;" *ngIf="total.get(viewDate | date: 'yyyy-MM') != undefined; else elseBlock"> -{{total.get(viewDate | date: "yyyy-MM").get('out') | number}} </span>
        <label>合計: ¥</label>
        <span style="font-size: 20px;" *ngIf="total.get(viewDate | date: 'yyyy-MM') != undefined; else elseBlock"> {{total.get(viewDate | date: "yyyy-MM").get('total') | number}}  </span>
        <ng-template #elseBlock><span>0</span></ng-template>
      </div>
    </div>
    
    <div class="row text-center">
      <div class="col-md-4">
        <div class="btn-group">
          <div
            class="btn btn-primary"
            mwlCalendarPreviousView
            [view]="view"
            [(viewDate)]="viewDate"
            (viewDateChange)="viewDateChange.next(viewDate)"
          >
            Previous
          </div>
          <div
            class="btn btn-outline-secondary"
            mwlCalendarToday
            [(viewDate)]="viewDate"
            (viewDateChange)="viewDateChange.next(viewDate)"
          >
            Today
          </div>
          <div
            class="btn btn-primary"
            mwlCalendarNextView
            [view]="view"
            [(viewDate)]="viewDate"
            (viewDateChange)="viewDateChange.next(viewDate)"
          >
            Next
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <h3>{{ viewDate | calendarDate: view + 'ViewTitle':locale }}</h3>
      </div>
    </div>
    <br />
  `
})
export class CalendarHeaderComponent {
  @Input() view: string;

  @Input() viewDate: Date;

  @Input() locale: string = 'en';

  @Input() total = new Map();

  @Output() viewChange: EventEmitter<string> = new EventEmitter();

  @Output() viewDateChange: EventEmitter<Date> = new EventEmitter();
}
