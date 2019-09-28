import { Component, OnInit } from '@angular/core';
import {CalendarService} from "../../../../services/calendar.service";

@Component({
  selector: 'app-calendar-detail',
  templateUrl: './calendar-detail.component.html',
  styleUrls: ['./calendar-detail.component.css']
})
export class CalendarDetailComponent implements OnInit {

  constructor(
    private calendarService: CalendarService,
  ) { }

  ngOnInit() {
    console.log("----------------[ngOnInit] calendar----------------");
    // httpリクエストでカテゴリーマスターをサーバーから取りに行く。
    this.calendarService.getCategories();
  }

  bgClick() {
    this.calendarService.setShowDetail(false);
  }

  inputExpenses(){

  }
}
