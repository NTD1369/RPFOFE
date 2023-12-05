/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DiscountNumberPadService } from './discount-number-pad.service';

describe('Service: DiscountNumberPad', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DiscountNumberPadService]
    });
  });

  it('should ...', inject([DiscountNumberPadService], (service: DiscountNumberPadService) => {
    expect(service).toBeTruthy();
  }));
});
