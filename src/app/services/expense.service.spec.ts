import { TestBed } from '@angular/core/testing';
import { ExpenseService } from './expense.service';
import { Firestore } from '@angular/fire/firestore';

describe('ExpenseService - helper methods', () => {
  let service: ExpenseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: Firestore, useValue: {} }],
    });
    service = TestBed.inject(ExpenseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('totalEstimated', () => {
    it('should return total of all estimated costs', () => {
      const expenses = [
        { id: '1', dealId: 'd1', estimatedCost: 5000, actualCost: 0, category: 'Flooring', description: '', createdAt: new Date() },
        { id: '2', dealId: 'd1', estimatedCost: 3000, actualCost: 0, category: 'Painting', description: '', createdAt: new Date() },
      ];
      expect(service.totalEstimated(expenses)).toBe(8000);
    });

    it('should return 0 for empty array', () => {
      expect(service.totalEstimated([])).toBe(0);
    });
  });

  describe('totalActual', () => {
    it('should return total of all actual costs', () => {
      const expenses = [
        { id: '1', dealId: 'd1', estimatedCost: 5000, actualCost: 5200, category: 'Flooring', description: '', createdAt: new Date() },
        { id: '2', dealId: 'd1', estimatedCost: 3000, actualCost: 2800, category: 'Painting', description: '', createdAt: new Date() },
      ];
      expect(service.totalActual(expenses)).toBe(8000);
    });

    it('should return 0 for empty array', () => {
      expect(service.totalActual([])).toBe(0);
    });
  });
});
