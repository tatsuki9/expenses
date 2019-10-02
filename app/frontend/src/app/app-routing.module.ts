import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from "./components/home/home.component";
import { ExpensesComponent } from "./components/home/expenses/expenses.component";
import { AuthGuard } from "./auth.guard";


const routes: Routes = [
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
