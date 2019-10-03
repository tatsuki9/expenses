import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
    private cd: ChangeDetectorRef
  ) {
  }

  /**
   * @brief コンポーネント初期化、他、カテゴリー一覧取得
   */
  ngOnInit() {
    this.calendarService.getCategories()
      .then((res) => {
        if (res != null) {
          res.forEach(res=>{
            this.categories.push(res['CategoryName'])
          });
        }
        this.init();
      });
  }

  /**
   * @brief 家計簿入力ダイアログを表示した際の背景クリック時の処理
   */
  bgClick() {
    this.calendarService.setShowDetail(false);
    this.init();
  }

  /**
   * @brief 家計簿入力時の処理
   * @param paymentType number
   */
  inputExpenses(paymentType: number){
    let clickedDate = this.calendarService.getClickedDate();
    let year  = clickedDate.getFullYear();
    let month = ("0"+(clickedDate.getMonth() + 1)).slice(-2);
    let day   = ("0"+clickedDate.getDate()).slice(-2);
    let registDate = year + "-" + month + "-" + day;

    this.calendarService.postDetail(this.inputDetail.category, paymentType, this.inputDetail.price, registDate)
      .then((res)=>{
        if (res['status_code'] == 200) {
          this.redraw();
        }
      });
    this.init();
  }

  /**
   * @brief 強制的に再描画させる
   */
  redraw() {
    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  /**
   * @brief 諸々のプロパティ初期化
   */
  init() {
    this.inputDetail.category = this.categories.length > 0 ? this.categories[0] : '';
    this.inputDetail.price = 0;
  }
}
