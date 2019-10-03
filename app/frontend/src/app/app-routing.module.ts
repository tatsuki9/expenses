import { NgModule } from '@angular/core';
import { Routes, RouterModule, UrlMatcher, UrlSegment } from '@angular/router';
import { HomeComponent } from "./components/home/home.component";
import { ExpensesComponent } from "./components/home/expenses/expenses.component";
import { AuthGuard } from "./auth.guard";

// ルーティングがうまく行かなくなったので、一旦コメントアウト
// export function baseRouteMatcher(url: UrlSegment[]) {
//   if (url.length > 0 && url[0].path.startsWith('home')) {
//     return url[0].path.startsWith('home') ? ({consumed: url}) : null;
//   }
//   return null;
// }

const routes: Routes = [
  // {
  //   matcher: baseRouteMatcher,
  //   canActivate: [AuthGuard],
  //   component: HomeComponent
  // },
  {
    path: 'home',
    canActivate: [AuthGuard],
    component: HomeComponent
  },
  {
    path: 'home/expenses',
    canActivate: [AuthGuard],
    component: HomeComponent
  },
  {
    path: 'home/setting',
    canActivate: [AuthGuard],
    component: HomeComponent
  },
  {
    path: 'expenses',
    canActivate: [AuthGuard],
    component: ExpensesComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
