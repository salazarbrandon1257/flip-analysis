import { RehabExpensesComponent } from './rehab-expenses.component';

describe('RehabExpensesComponent', () => {
  describe('rowVariance', () => {
    let component: RehabExpensesComponent;

    beforeEach(() => {
      component = new RehabExpensesComponent(
        { analyzedDeals: [] } as any,
        {} as any,
      );
    });

    it('should return actual - estimated when actual > estimated', () => {
      const row = { id: '', category: '', description: '', estimatedCost: '1000', actualCost: '1500', isNew: true };
      expect(component.rowVariance(row)).toBe(500);
    });

    it('should return negative when actual < estimated', () => {
      const row = { id: '', category: '', description: '', estimatedCost: '5000', actualCost: '3000', isNew: true };
      expect(component.rowVariance(row)).toBe(-2000);
    });

    it('should return 0 when equal', () => {
      const row = { id: '', category: '', description: '', estimatedCost: '2000', actualCost: '2000', isNew: true };
      expect(component.rowVariance(row)).toBe(0);
    });

    it('should handle currency formatted strings', () => {
      const row = { id: '', category: '', description: '', estimatedCost: '$12,500', actualCost: '13,000', isNew: true };
      expect(component.rowVariance(row)).toBe(500);
    });
  });

  describe('addRow / removeRow', () => {
    let component: RehabExpensesComponent;

    beforeEach(() => {
      component = new RehabExpensesComponent(
        { analyzedDeals: [] } as any,
        {} as any,
      );
      component.categories = ['Flooring', 'Painting'];
    });

    it('should add a new empty row', () => {
      component.addRow();
      expect(component.rows.length).toBe(1);
      expect(component.rows[0].isNew).toBeTrue();
      expect(component.rows[0].category).toBe('Flooring');
    });

    it('should remove a row by index', () => {
      component.addRow();
      component.addRow();
      expect(component.rows.length).toBe(2);
      component.removeRow(0);
      expect(component.rows.length).toBe(1);
    });

    it('should handle removing all rows', () => {
      component.addRow();
      component.removeRow(0);
      expect(component.rows.length).toBe(0);
    });
  });
});
