import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LenderQuotesService, HardMoneyQuote } from '../../services/lender-quotes.service';

@Component({
  selector: 'app-hard-money-lender',
  templateUrl: './hard-money-lender.component.html',
  styleUrls: ['./hard-money-lender.component.scss'],
  standalone: false,
})
export class HardMoneyLenderComponent implements OnInit {
  loanForm: FormGroup;
  lenderName = '';
  notes = '';
  results: { downPayment: number; loanAmount: number; monthlyInterest: number; totalInterest: number; totalCost: number } | null = null;
  savedQuotes: HardMoneyQuote[] = [];
  viewingQuotes = false;

  constructor(
    private fb: FormBuilder,
    private quotesService: LenderQuotesService
  ) {
    this.loanForm = this.fb.group({
      purchasePrice: [0, [Validators.required, Validators.min(0)]],
      downPaymentPercent: [20, [Validators.required, Validators.min(0), Validators.max(100)]],
      rehabCosts: [0, [Validators.required, Validators.min(0)]],
      interestRate: [12, [Validators.required, Validators.min(0)]],
      holdPeriodMonths: [6, [Validators.required, Validators.min(1)]],
      originationFeePercent: [2, [Validators.required, Validators.min(0)]],
      documentationFee: [0, [Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.quotesService.hardMoneyQuotes$.subscribe(quotes => {
      this.savedQuotes = quotes;
    });
  }

  calculate(): void {
    if (this.loanForm.invalid) return;
    const v = this.loanForm.value;
    const downPayment = Math.round(v.purchasePrice * (v.downPaymentPercent / 100));
    const loanAmount = Math.round(v.purchasePrice - downPayment);
    const monthlyRate = v.interestRate / 100 / 12;
    const monthlyInterest = Math.round(loanAmount * monthlyRate);
    const totalInterest = monthlyInterest * v.holdPeriodMonths;
    const originationFee = Math.round(loanAmount * (v.originationFeePercent / 100));
    const documentationFee = v.documentationFee || 0;
    const totalCost = downPayment + loanAmount + totalInterest + originationFee + v.rehabCosts + documentationFee;

    this.results = {
      downPayment,
      loanAmount,
      monthlyInterest,
      totalInterest,
      totalCost,
    };
  }

  async saveQuote(): Promise<void> {
    if (!this.results || !this.lenderName.trim()) return;
    const v = this.loanForm.value;
    await this.quotesService.addHardMoneyQuote({
      lenderName: this.lenderName.trim(),
      purchasePrice: v.purchasePrice,
      downPaymentPercent: v.downPaymentPercent,
      rehabCosts: v.rehabCosts,
      interestRate: v.interestRate,
      holdPeriodMonths: v.holdPeriodMonths,
      originationFeePercent: v.originationFeePercent,
      documentationFee: v.documentationFee || 0,
      downPayment: this.results.downPayment,
      loanAmount: this.results.loanAmount,
      monthlyInterest: this.results.monthlyInterest,
      totalInterest: this.results.totalInterest,
      totalCost: this.results.totalCost,
      notes: this.notes.trim() || undefined,
    });
    this.lenderName = '';
    this.notes = '';
  }

  async deleteQuote(id: string): Promise<void> {
    await this.quotesService.deleteHardMoneyQuote(id);
  }

  currency(n: number): string {
    return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }
}
