import { Component, OnInit } from '@angular/core';
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private sub: Subscription;
  public activeComponent: string = "expenses";

  constructor(
    private activeRoute: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.sub = this.activeRoute.queryParams.subscribe(params => {

      console.log("---------------[ngOnInit] home ---------------");

      if (params['home'] == 'expenses') {
        this.activeComponent = "expenses"
      } else if (params['home'] == 'setting') {
        this.activeComponent = "setting"
      }
    })
  }

}
