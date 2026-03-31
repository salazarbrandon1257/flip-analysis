import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { MyDealsComponent } from './components/my-deals/my-deals.component';
import { CompareDealsPageComponent } from './components/compare-deals-page/compare-deals-page.component';
import { DealsDetailComponent } from './components/deals-detail/deals-detail.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'my-deals', component: MyDealsComponent },
  { path: 'deals', component: DealsDetailComponent },
  { path: 'compare', component: CompareDealsPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
