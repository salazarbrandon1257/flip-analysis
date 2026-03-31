import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DealInputComponent } from './components/deal-input/deal-input.component';
import { DealListComponent } from './components/deal-list/deal-list.component';
import { DealComparisonComponent } from './components/deal-comparison/deal-comparison.component';
import { MyDealsComponent } from './components/my-deals/my-deals.component';
import { CompareDealsPageComponent } from './components/compare-deals-page/compare-deals-page.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { DealsDetailComponent } from './components/deals-detail/deals-detail.component';
import { CurrencyInputDirective } from './directives/currency-input/currency-input.directive';

@NgModule({
  declarations: [
    AppComponent,
    DealInputComponent,
    DealListComponent,
    DealComparisonComponent,
    MyDealsComponent,
    CompareDealsPageComponent,
    LandingPageComponent,
    DealsDetailComponent,
    CurrencyInputDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
