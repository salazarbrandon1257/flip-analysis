import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LenderQuotesService, PersonalLoanQuote } from '../../services/lender-quotes.service';

@Component({
  selector: 'app-personal-loan-rehab',
  templateUrl: './personal-loan-rehab.component.html',
  styleUrls: ['./personal-loan-rehab.component.scss'],
  standalone: false,
})
export class PersonalLoanRehabComponent implements OnInit {
  loanForm: FormGroup;
  lenderName = '';
  notes = '';
  results: { monthlyPayment: number; totalInterest: number; totalRepayment: number } | null = null;
  savedQuotes: PersonalLoanQuote[] = [];
  viewingQuotes = false;
  saveMessage = '';

  constructor(
    private fb: FormBuilder,
    private quotesService: LenderQuotesService
  ) {
    this.loanForm = this.fb.group({
      loanAmount: [0, [Validators.required, Validators.min(0)]],
      apr: [17, [Validators.required, Validators.min(0)]],
      termMonths: [84, [Validators.required, Validators.min(1)]],
      holdPeriodMonths: [6, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.quotesService.personalQuotes$.subscribe(quotes => {
      this.savedQuotes = quotes;
    });
  }

  calculate(): void {
    if (this.loanForm.invalid) return;
    const v = this.loanForm.value;
    const rate = v.apr / 100 / 12;
    const monthlyPayment = v.loanAmount * (rate * Math.pow(1 + rate, v.termMonths)) / (Math.pow(1 + rate, v.termMonths) - 1);
    const totalRepayment = monthlyPayment * v.termMonths;
    const totalInterest = totalRepayment - v.loanAmount;

    this.results = {
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      totalRepayment: Math.round(totalRepayment * 100) / 100,
    };
  }

  async saveQuote(): Promise<void> {
    if (!this.results || !this.lenderName.trim()) return;
    const v = this.loanForm.value;
    try {
      await this.quotesService.addPersonalLoanQuote({
        lenderName: this.lenderName.trim(),
        loanAmount: v.loanAmount,
        apr: v.apr,
        termMonths: v.termMonths,
        holdPeriodMonths: v.holdPeriodMonths,
        monthlyPayment: this.results.monthlyPayment,
        totalInterest: this.results.totalInterest,
        totalRepayment: this.results.totalRepayment,
        notes: this.notes.trim() || undefined,
      });
      this.saveMessage = `Quote from "${this.lenderName}" saved!`;
      setTimeout(() => (this.saveMessage = ''), 3000);
      this.lenderName = '';
      this.notes = '';
    } catch (err) {
      console.error('Error saving quote:', err);
      this.saveMessage = 'Error saving quote. Check console.';
      setTimeout(() => (this.saveMessage = ''), 5000);
    }
  }

  async deleteQuote(id: string): Promise<void> {
    await this.quotesService.deletePersonalLoanQuote(id);
  }

  currency(n: number): string {
    return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }
}
