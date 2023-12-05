/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LoyaltyrankService } from './loyaltyrank.service';

describe('Service: Loyaltyrank', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoyaltyrankService]
    });
  });

  it('should ...', inject([LoyaltyrankService], (service: LoyaltyrankService) => {
    expect(service).toBeTruthy();
  }));
});
