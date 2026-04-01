import { Directive, ElementRef, HostListener, OnInit, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[appCurrencyInput]',
    standalone: false
})
export class CurrencyInputDirective implements OnInit {
  private _el: HTMLInputElement;

  constructor(
    private elRef: ElementRef,
    @Optional() @Self() private ngControl?: NgControl
  ) {
    this._el = this.elRef.nativeElement;
  }

  ngOnInit(): void {
    // Set initial value if present
    if (this._el.value) {
      this.formatValue(this._el.value);
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const value = this._el.value.replace(/,/g, '');
    if (value && !isNaN(Number(value))) {
      this.formatValue(value);
    }
  }

  @HostListener('blur', ['$event'])
  onBlur(event: Event): void {
    const value = this._el.value.replace(/,/g, '');
    if (value && !isNaN(Number(value))) {
      this.formatValue(value);
    }
  }

  @HostListener('focus', ['$event'])
  onFocus(event: Event): void {
    // Remove commas on focus for easier editing
    const value = this._el.value.replace(/,/g, '');
    this._el.value = value;
  }

  private formatValue(value: string): void {
    const num = Number(value);
    if (!isNaN(num)) {
      this._el.value = num.toLocaleString('en-US');
    }
  }
}
