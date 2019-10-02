import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import { ActivatedRoute,Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public activeComponent: string = "expenses";

  constructor(
    private activeRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    let page = this.router.url.substr(this.router.url.lastIndexOf('/') + 1);

    if (page == 'expenses') {
      this.activeComponent = "expenses"
    } else if (page == 'setting') {
      this.activeComponent = "setting"
    }
  }
}
