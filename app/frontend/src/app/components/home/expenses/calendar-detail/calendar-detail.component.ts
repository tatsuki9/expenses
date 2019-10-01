import { Component, OnInit } from '@angular/core';
import {CalendarService} from "../../../../services/calendar.service";
import {SystemConst} from "../../../../const";

class InputDetail {
  category:    string;
  price:       number;
}

@Component({
  selector: 'app-calendar-detail',
  templateUrl: './calendar-detail.component.html',
  styleUrls: ['./calendar-detail.component.css']
})
export class CalendarDetailComponent implements OnInit {

  categories: string[] = new Array();
  inputDetail: InputDetail = new InputDetail();
  readonly SystemConst = SystemConst;

  constructor(
    private calendarService: CalendarService,
  ) {
  }

  ngOnInit() {
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

  inputExpenses(paymentType: number){
    let clickedDate = this.calendarService.getClickedDate();
    let year  = clickedDate.getFullYear();
    let month = ("0"+(clickedDate.getMonth() + 1)).slice(-2);
    let day   = ("0"+clickedDate.getDate()).slice(-2);
    let registDate = year + "-" + month + "-" + day;

    this.calendarService.postDetail(this.inputDetail.category, paymentType, this.inputDetail.price, registDate)
      .then((res)=>{
      });
  }
}
