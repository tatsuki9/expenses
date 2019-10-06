import {ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { SettingService } from "../../services/setting.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    public authService: AuthService,
    private settingService: SettingService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    /**
     * 退会フラグが立っていて、ログアウト状態の時にURL変更が掛かれば、トップページへの遷移になるので
     * トップページのコンテンツ表示するため予めここで退会フラグを落としておく。
     * 理由: 退会フラグが立っていると、この後ngDoCheckが呼ばれる際に再描画処理が走らなくなってしまうため。
     * (退会フラグが立ったままだとif ( !this.settingService.getLeaveCompleteNow()の条件に入らないので。)
     */
    this.router.events.subscribe((val)=>{
      if (this.settingService.getLeaveCompleteNow() && !this.authService.isLoggedIn()) {
        if (!this.authService.isLoggedIn()) {
          this.settingService.init();
        }
      }
    });
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
  }

  /**
   * @brief 強制的に再描画
   */
  redraw() {
    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }
}
