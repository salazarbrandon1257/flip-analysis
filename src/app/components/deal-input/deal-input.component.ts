import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DealService } from '../../services/deal.service';

// Custom currency formatter that adds commas
function formatWithCommas(value: number): string {
  if (value === null || value === undefined) return '';
  return Math.round(value).toLocaleString('en-US');
}

// Parse comma-formatted string to number
function parseValue(val: any): number {
  if (typeof val === 'string') {
    return Number(val.replace(/,/g, '')) || 0;
  }
  return val || 0;
}

@Component({
    selector: 'app-deal-input',
    templateUrl: './deal-input.component.html',
    styleUrls: ['./deal-input.component.scss'],
    standalone: false
})
export class DealInputComponent {
  @Output() dealAdded = new EventEmitter<void>();

  dealForm: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private dealService: DealService
  ) {
    this.dealForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      address: ['', [Validators.required]],
      purchasePrice: ['0', [Validators.required]],
      askingPrice: ['0', [Validators.required]],
      afterRepairValue: ['0', [Validators.required]],
      rehabCosts: ['0', [Validators.required]],
      downPaymentPercent: [12, [Validators.required, Validators.min(0), Validators.max(100)]],
      interestRatePercent: [12, [Validators.required, Validators.min(0)]],
      holdPeriodMonths: [6, [Validators.required, Validators.min(1)]],
      agentCommissionPercent: [6, [Validators.required, Validators.min(0), Validators.max(100)]],
      personalLoanAmount: ['0'],
      notes: [''],
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.dealForm.invalid) {
      return;
    }

    const rawValue = this.dealForm.getRawValue();

    // Parse comma-formatted strings to numbers
    const purchasePrice = parseValue(rawValue.purchasePrice);
    const askingPrice = parseValue(rawValue.askingPrice);
    const afterRepairValue = parseValue(rawValue.afterRepairValue);
    const rehabCosts = parseValue(rawValue.rehabCosts);
    const personalLoanAmount = parseValue(rawValue.personalLoanAmount);
    const downPaymentPercent = rawValue.downPaymentPercent;
    const interestRatePercent = rawValue.interestRatePercent;
    const holdPeriodMonths = rawValue.holdPeriodMonths;
    const agentCommissionPercent = rawValue.agentCommissionPercent;

    // Personal loan calculations (17% APR, 84 months)
    const personalLoanApr = 17;
    const personalLoanTermMonths = 84;
    const personalLoanMonthlyRate = personalLoanApr / 100 / 12;
    const personalLoanMonthlyPayment = personalLoanAmount > 0
      ? personalLoanAmount * (personalLoanMonthlyRate * Math.pow(1 + personalLoanMonthlyRate, personalLoanTermMonths)) / (Math.pow(1 + personalLoanMonthlyRate, personalLoanTermMonths) - 1)
      : 0;
    const personalLoanTotalInterest = personalLoanAmount > 0
      ? (personalLoanMonthlyPayment * personalLoanTermMonths) - personalLoanAmount
      : 0;
    // Interest portion for the hold period (simplified: monthly interest * hold period)
    const personalLoanInterestForHold = personalLoanAmount > 0
      ? personalLoanAmount * (personalLoanApr / 100) / 12 * holdPeriodMonths
      : 0;

    // Calculate all derived values
    const buyerClosingCosts = Math.round(purchasePrice * 0.01) + 999; // 1% + $999 fee
    const titleClosingCosts = Math.round(purchasePrice * 0.02); // 2%
    const loanAmount = Math.round(purchasePrice * 0.88); // 88%
    const loanMonthlyInterest = Math.round(loanAmount * (interestRatePercent / 100) / 12);
    const annualPropertyTax = purchasePrice * 0.04; // 4%
    const holdPeriodPropertyTax = annualPropertyTax * (holdPeriodMonths / 12);
    const utilitiesCost = 400 * holdPeriodMonths; // $400/mo
    const taxesInsuranceUtilities = Math.round(holdPeriodPropertyTax + utilitiesCost);
    const sellerClosingCosts = Math.round(afterRepairValue * 0.04); // 4%

    const deal = {
      address: rawValue.address,
      purchasePrice,
      askingPrice,
      buyerClosingCosts,
      titleClosingCosts,
      rehabCosts,
      loanAmount,
      downPaymentPercent,
      interestRatePercent,
      holdPeriodMonths,
      loanMonthlyInterest,
      taxesInsuranceUtilities,
      afterRepairValue,
      agentCommissionPercent,
      sellerClosingCosts,
      personalLoanAmount,
      personalLoanApr,
      personalLoanTermMonths,
      personalLoanMonthlyPayment: Math.round(personalLoanMonthlyPayment * 100) / 100,
      personalLoanTotalInterest: Math.round(personalLoanTotalInterest * 100) / 100,
      notes: rawValue.notes,
    };

    this.dealService.addDeal(deal);

    this.dealForm.reset({
      purchasePrice: '0',
      askingPrice: '0',
      afterRepairValue: '0',
      rehabCosts: '0',
      downPaymentPercent: 12,
      interestRatePercent: 12,
      holdPeriodMonths: 6,
      agentCommissionPercent: 6,
      personalLoanAmount: '0',
      notes: '',
    }, { emitEvent: false });

    this.submitted = false;
    this.dealAdded.emit();
  }

  get f() {
    return this.dealForm.controls;
  }
}
