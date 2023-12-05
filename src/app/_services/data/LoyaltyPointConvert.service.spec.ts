/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LoyaltyPointConvertService } from './LoyaltyPointConvert.service';

describe('Service: LoyaltyPointConvert', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoyaltyPointConvertService]
    });
  });

  it('should ...', inject([LoyaltyPointConvertService], (service: LoyaltyPointConvertService) => {
    expect(service).toBeTruthy();
  }));
});
