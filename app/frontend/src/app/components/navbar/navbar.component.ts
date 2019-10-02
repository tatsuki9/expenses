import {ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { SettingService } from "../../services/setting.service";

@Component({
  selector: 'app-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private settingService: SettingService,
    private cd: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
  }

  ngDoCheck() {
    /**
     * 退会直後のみ、change detectionによる変更検知拒否して描画させない。
     * 理由: 退会処理にてセッション削除したら、有無を言わさず速攻でナビゲーションバーなどをログイン前状態に描画してしまうため。
     */
    if ( !this.settingService.getLeaveCompleteNow()
    ) {
      this.redraw();
    }

    if (!this.authService.isLoggedIn()) {
      this.settingService.init();
    }
  }

  redraw() {
    // 強制的に再描画させる
    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }
}
