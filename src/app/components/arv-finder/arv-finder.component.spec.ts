import { ArvFinderComponent, Comp } from './arv-finder.component';

describe('ArvFinderComponent', () => {
  let component: ArvFinderComponent;

  beforeEach(() => {
    component = new ArvFinderComponent(
      { deals: [] } as any,
      {} as any,
      {} as any,
      {} as any,
    );
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('emptyComp', () => {
    it('should return a comp with default values', () => {
      const comp = component.emptyComp();
      expect(comp.address).toBe('');
      expect(comp.soldPrice).toBe(0);
      expect(comp.sqft).toBe(0);
      expect(comp.beds).toBe(3);
      expect(comp.baths).toBe(2);
      expect(comp.yearBuilt).toBe(2000);
      expect(comp.distanceMiles).toBe(0.5);
      expect(comp.soldDate).toBe('');
    });
  });

  describe('resetForm', () => {
    it('should create exactly 3 empty comps', () => {
      component.comps = [{ address: 'old' } as Comp];
      component.resetForm();
      expect(component.comps.length).toBe(3);
    });

    it('should zero out calculations', () => {
      component.avgCompPrice = 100000;
      component.avgPricePerSqft = 150;
      component.suggestedArv = 100000;
      component.resetForm();
      expect(component.avgCompPrice).toBe(0);
      expect(component.avgPricePerSqft).toBe(0);
      expect(component.suggestedArv).toBe(0);
    });

    it('should clear the saved message', () => {
      component.savedMessage = 'Saved!';
      component.resetForm();
      expect(component.savedMessage).toBe('');
    });
  });

  describe('addComp', () => {
    it('should add one comp to the list', () => {
      component.resetForm();
      const count = component.comps.length;
      component.addComp();
      expect(component.comps.length).toBe(count + 1);
    });
  });

  describe('removeComp', () => {
    it('should remove a comp at the given index', () => {
      component.addComp();
      component.addComp();
      const before = component.comps.length; // 5 (3 from reset + 2 adds)
      component.comps[0].soldPrice = 100000;
      component.comps[1].soldPrice = 200000;
      component.calculateArv();

      component.removeComp(0);
      expect(component.comps.length).toBe(before - 1);
      expect(component.comps[0].soldPrice).toBe(200000);
    });
  });

  describe('calculateArv', () => {
    it('should return zeros when no valid comps exist', () => {
      component.comps = [component.emptyComp()];
      component.calculateArv();
      expect(component.avgCompPrice).toBe(0);
      expect(component.avgPricePerSqft).toBe(0);
      expect(component.suggestedArv).toBe(0);
    });

    it('should correctly average sold prices of valid comps', () => {
      component.comps = [
        { ...component.emptyComp(), soldPrice: 250000 },
        { ...component.emptyComp(), soldPrice: 300000 },
        { ...component.emptyComp(), soldPrice: 275000 },
      ];
      component.calculateArv();
      // (250000 + 300000 + 275000) / 3 = 275000
      expect(component.avgCompPrice).toBe(275000);
      expect(component.suggestedArv).toBe(275000);
    });

    it('should ignore comps with zero soldPrice', () => {
      component.comps = [
        { ...component.emptyComp(), soldPrice: 250000 },
        { ...component.emptyComp(), soldPrice: 0 },
        { ...component.emptyComp(), soldPrice: 350000 },
      ];
      component.calculateArv();
      expect(component.avgCompPrice).toBe(300000);
    });

    it('should calculate average price per sqft', () => {
      component.comps = [
        { ...component.emptyComp(), soldPrice: 250000, sqft: 1500 },
        { ...component.emptyComp(), soldPrice: 300000, sqft: 2000 },
      ];
      component.calculateArv();
      // Comp 1: 250000/1500 = 166.67, Comp 2: 300000/2000 = 150
      // Avg: (166.67 + 150) / 2 ≈ 158.33 → round to 158
      expect(component.avgPricePerSqft).toBe(158);
    });

    it('should set avgPricePerSqft to 0 when no comps have sqft', () => {
      component.comps = [
        { ...component.emptyComp(), soldPrice: 250000, sqft: 0 },
        { ...component.emptyComp(), soldPrice: 300000, sqft: 0 },
      ];
      component.calculateArv();
      expect(component.avgPricePerSqft).toBe(0);
    });

    it('should handle a single valid comp', () => {
      component.comps = [
        { ...component.emptyComp(), soldPrice: 500000, sqft: 3000 },
      ];
      component.calculateArv();
      expect(component.avgCompPrice).toBe(500000);
      expect(component.avgPricePerSqft).toBe(167);
      expect(component.suggestedArv).toBe(500000);
    });
  });
});
