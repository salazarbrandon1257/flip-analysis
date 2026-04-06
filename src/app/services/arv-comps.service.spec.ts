import { TestBed } from '@angular/core/testing';
import { ArvCompsService } from './arv-comps.service';
import { Firestore } from '@angular/fire/firestore';

describe('ArvCompsService', () => {
  let service: ArvCompsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Firestore, useValue: {} },
      ],
    });
    service = TestBed.inject(ArvCompsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
