import { Component, OnInit } from '@angular/core';
import {CalendarService} from "../../../../services/calendar.service";
import {element} from "protractor";

class InputDetail {
  date:     string;
  price:    number;
  category: string;
}

@Component({
  selector: 'app-calendar-detail',
  templateUrl: './calendar-detail.component.html',
  styleUrls: ['./calendar-detail.component.css']
})
export class CalendarDetailComponent implements OnInit {

  categories: string[] = new Array();
  inputDetail: InputDetail = new InputDetail();

  constructor(
    private calendarService: CalendarService,
  ) {
    // this.categories = new Array();
  }

  ngOnInit() {
    // httpリクエストでカテゴリーマスターをサーバーから取りに行く。
    this.calendarService.getCategories()
      .then((res) => {
        res.forEach(res=>{
          this.categories.push(res['CategoryName'])
        });
      });
  }

  bgClick() {
    this.calendarService.setShowDetail(false);
  }

  inputExpenses(){
    this.calendarService.postDetail(this.inputDetail.date, this.inputDetail.price, this.inputDetail.category)
      .then((res)=>{

      });
  }
}
