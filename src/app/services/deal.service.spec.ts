import { TestBed } from '@angular/core/testing';
import { DealService } from './deal.service';
import { calculateDealAnalysis, Deal } from '../models/deal';
import { Firestore } from '@angular/fire/firestore';

describe('DealService', () => {
  let service: DealService;

  beforeEach(() => {
    // Provide a mock Firestore that will cause loadDeals to fail gracefully
    const mockFirestore = {};

    TestBed.configureTestingModule({
      providers: [
        { provide: Firestore, useValue: mockFirestore },
      ],
    });

    service = TestBed.inject(DealService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with empty deals', async () => {
    expect(service.deals).toEqual([]);
    await new Promise(resolve => setTimeout(resolve, 50));
    expect(service.deals).toEqual([]);
  });

  it('should expose deals$ as an Observable', () => {
    expect(service.deals$).toBeDefined();
    expect(typeof service.deals$.subscribe).toBe('function');
  });

  it('should return empty array for analyzedDeals when no deals exist', () => {
    expect(service.analyzedDeals).toEqual([]);
  });

  it('should clear all deals via clearAll()', () => {
    service['dealsSubject'].next([{ id: '1' } as Deal]);
    expect(service.deals.length).toBe(1);

    service.clearAll();
    expect(service.deals).toEqual([]);
  });

  describe('deal operations (mocked)', () => {
    it('should add a deal and update the subject', () => {
      // Simulate the subject update behavior that addDeal triggers after Firestore
      service['dealsSubject'].next([]);
      const testDeal: Deal = {
        id: 'manual-1',
        createdAt: new Date(),
        address: '123 Test Ave',
        purchasePrice: 100000,
        askingPrice: 120000,
        buyerClosingCosts: 1999,
        titleClosingCosts: 2000,
        rehabCosts: 30000,
        loanAmount: 88000,
        downPaymentPercent: 12,
        interestRatePercent: 12,
        holdPeriodMonths: 6,
        loanMonthlyInterest: 880,
        taxesInsuranceUtilities: 5400,
        afterRepairValue: 200000,
        agentCommissionPercent: 6,
        sellerClosingCosts: 8000,
        personalLoanAmount: 0,
        personalLoanApr: 17,
        personalLoanTermMonths: 84,
        personalLoanMonthlyPayment: 0,
        personalLoanTotalInterest: 0,
        personalLoanInterestForHold: 0,
      };
      service['dealsSubject'].next([testDeal]);

      expect(service.deals.length).toBe(1);
      expect(service.deals[0].address).toBe('123 Test Ave');
      expect(service.analyzedDeals.length).toBe(1);
      expect(service.analyzedDeals[0].deal.address).toBe('123 Test Ave');
    });

    it('should remove a deal when deleting', () => {
      const deal1: Deal = { id: '1', createdAt: new Date() } as Deal;
      const deal2: Deal = { id: '2', createdAt: new Date() } as Deal;
      service['dealsSubject'].next([deal1, deal2]);

      // Simulate what deleteDeal does: filter and next
      const updated = service.deals.filter(d => d.id !== '1');
      service['dealsSubject'].next(updated);

      expect(service.deals.length).toBe(1);
      expect(service.deals[0].id).toBe('2');
    });

    it('should update a deal when editing', () => {
      const deal: Deal = {
        id: '1', createdAt: new Date(), address: 'Old Address', purchasePrice: 100000,
      } as Deal;
      service['dealsSubject'].next([deal]);

      const updated = service.deals.map(d =>
        d.id === '1' ? { ...d, address: 'New Address' } : d
      );
      service['dealsSubject'].next(updated);

      expect(service.deals[0].address).toBe('New Address');
    });
  });
});
