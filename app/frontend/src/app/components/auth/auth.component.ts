import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from 'rxjs';
import { FormControl } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { SystemConst } from "../../const";

class User {
  username: string;
  password: string;
  email: string;
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})

export class AuthComponent implements OnInit {
  private sub: Subscription;
  public showSignup: boolean = false;
  public showLogin:  boolean  = false;
  public errorMes:   string = "";

  emailCtrl: FormControl = new FormControl('', AuthComponent.emailValidator)
  user: User = new User();

  constructor(
    private activedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  static emailValidator(control: FormControl) {
    return /^([a-zA-Z0-9])+([a-zA-Z0-9\._-])*@([a-zA-Z0-9_-])+([a-zA-Z0-9\._-]+)+$/g.test(control.value) ? null : {notAllowed: true}
  }

  // ログイン処理
  login() {
    this.authService.login(this.user.email, this.user.password)
      .then((res) => {
        if (res['status_code'] == SystemConst.Error.USER_NOT_FOUND) {
          this.errorMes = "登録されていないユーザーです。";
        } else if (res['status_code'] == SystemConst.Error.AUTHNETICATION_FAILED) {
          this.errorMes = "メールアドレスかパスワードが間違っています。";
        } else {
          this.router.navigate(["/home/expenses"]);
        }
      });
  }

  // ユーザー新規作成
  signup() {
    this.authService.signup(this.user.username, this.user.email, this.user.password)
      .then((res) => {
      });
  }

  ngOnInit() {
    this.sub = this.activedRoute.queryParams.subscribe(params => {
      this.authService.setRegisterCompleteNow(false);

      if (params['auth'] == 'login') {
        this.showLogin  = true;
        this.showSignup = false;
      } else if (params['auth'] == 'signup') {
        this.showLogin  = false;
        this.showSignup = true;
      } else if (params['auth'] == 'logout') {
        this.authService.logout();
        this.router.navigate(["/"]);
      } else {
        this.showLogin  = false;
        this.showSignup = false;
      }
    });
  }

}
