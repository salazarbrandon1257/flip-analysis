import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { MyDealsComponent } from './components/my-deals/my-deals.component';
import { CompareDealsPageComponent } from './components/compare-deals-page/compare-deals-page.component';
import { DealsDetailComponent } from './components/deals-detail/deals-detail.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RehabDashboardComponent } from './components/rehab-dashboard/rehab-dashboard.component';
import { RehabExpensesComponent } from './components/rehab-expenses/rehab-expenses.component';
import { ArvFinderComponent } from './components/arv-finder/arv-finder.component';
import { PersonalLoanRehabComponent } from './components/personal-loan-rehab/personal-loan-rehab.component';
import { HardMoneyLenderComponent } from './components/hard-money-lender/hard-money-lender.component';
import { authGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', component: LandingPageComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginPageComponent },
  { path: 'home', component: LandingPageComponent, canActivate: [authGuard] },
  { path: 'rehab', component: RehabDashboardComponent, canActivate: [authGuard] },
  { path: 'rehab/expenses', component: RehabExpensesComponent, canActivate: [authGuard] },
  { path: 'my-deals', component: MyDealsComponent, canActivate: [authGuard] },
  { path: 'deals', component: DealsDetailComponent, canActivate: [authGuard] },
  { path: 'deals/:id', component: DealsDetailComponent, canActivate: [authGuard] },
  { path: 'compare', component: CompareDealsPageComponent, canActivate: [authGuard] },
  { path: 'arv-finder', component: ArvFinderComponent, canActivate: [authGuard] },
  { path: 'lender/personal-loan', component: PersonalLoanRehabComponent, canActivate: [authGuard] },
  { path: 'lender/hard-money', component: HardMoneyLenderComponent, canActivate: [authGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
