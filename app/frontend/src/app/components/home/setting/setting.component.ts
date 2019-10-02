import {ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {SettingService} from "../../../services/setting.service";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {

  constructor(
    private settingService: SettingService,
    private authService: AuthService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.settingService.init();
  }

  leave() {
    let result = window.confirm("退会しますがよろしいですか?");

    if (result) {
      this.settingService.leave()
        .then(res=>{
          if (res['status_code'] == 200) {
            this.authService.logoutOrLeave();
            /**
             * change detectionをトップコンポーネント付近で停止させているので(セッション削除したら、有無を言わさず速攻でナビゲーションバーなどをログイン前状態に描画してしまうため。)、本コンポーネントだけは強制的に描画させる。
             */
            this.redraw();
          }
        });
    }
  }

  redraw() {
    // 強制的に再描画させる
    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }
}
