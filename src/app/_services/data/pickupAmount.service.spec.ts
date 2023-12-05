/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PickupAmountService } from './pickupAmount.service';

describe('Service: PickupAmount', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PickupAmountService]
    });
  });

  it('should ...', inject([PickupAmountService], (service: PickupAmountService) => {
    expect(service).toBeTruthy();
  }));
});
