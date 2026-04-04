import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { MyDealsComponent } from './components/my-deals/my-deals.component';
import { CompareDealsPageComponent } from './components/compare-deals-page/compare-deals-page.component';
import { DealsDetailComponent } from './components/deals-detail/deals-detail.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RehabDashboardComponent } from './components/rehab-dashboard/rehab-dashboard.component';
import { authGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'rehab', component: RehabDashboardComponent, canActivate: [authGuard] },
  { path: 'my-deals', component: MyDealsComponent, canActivate: [authGuard] },
  { path: 'deals', component: DealsDetailComponent, canActivate: [authGuard] },
  { path: 'deals/:id', component: DealsDetailComponent, canActivate: [authGuard] },
  { path: 'compare', component: CompareDealsPageComponent, canActivate: [authGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
