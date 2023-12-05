/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LoyaltyService } from './loyalty.service';

describe('Service: Loyalty', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoyaltyService]
    });
  });

  it('should ...', inject([LoyaltyService], (service: LoyaltyService) => {
    expect(service).toBeTruthy();
  }));
});
