import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from "./components/home/home.component";
import { ExpensesComponent } from "./components/home/expenses/expenses.component";
import { AuthGuard } from "./auth.guard";


const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'home/expenses',
    component: HomeComponent
  },
  {
    path: 'home/setting',
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
