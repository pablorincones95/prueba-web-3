import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RechargeComponent } from './recharge/recharge.component';

const routes: Routes = [
  {
    path: 'home',
    component: RechargeComponent
  },
  {
    path: "**",
    pathMatch: "full",
    redirectTo: "/pages/home"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
