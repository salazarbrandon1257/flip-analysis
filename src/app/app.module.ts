import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DealInputComponent } from './components/deal-input/deal-input.component';
import { DealListComponent } from './components/deal-list/deal-list.component';
import { DealComparisonComponent } from './components/deal-comparison/deal-comparison.component';
import { MyDealsComponent } from './components/my-deals/my-deals.component';
import { CompareDealsPageComponent } from './components/compare-deals-page/compare-deals-page.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { DealsDetailComponent } from './components/deals-detail/deals-detail.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RehabDashboardComponent } from './components/rehab-dashboard/rehab-dashboard.component';
import { CurrencyInputDirective } from './directives/currency-input/currency-input.directive';
import { ClickOutsideDirective } from './directives/click-outside/click-outside.directive';

const firebaseConfig = {
  apiKey: "AIzaSyCUlTwADMw3fNNSc76yBgJRyRa2pdyNUd4",
  authDomain: "flip-analysis-a500e.firebaseapp.com",
  projectId: "flip-analysis-a500e",
  storageBucket: "flip-analysis-a500e.firebasestorage.app",
  messagingSenderId: "359500662912",
  appId: "1:359500662912:web:e656287ce032371c7bfe65",
  measurementId: "G-0MH714ZVRE"
};

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
    LoginPageComponent,
    RehabDashboardComponent,
    CurrencyInputDirective,
    ClickOutsideDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule
  ],
  providers: [
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
