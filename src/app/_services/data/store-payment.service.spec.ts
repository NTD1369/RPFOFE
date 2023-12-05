/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { StorePaymentService } from './store-payment.service';

describe('Service: StorePayment', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StorePaymentService]
    });
  });

  it('should ...', inject([StorePaymentService], (service: StorePaymentService) => {
    expect(service).toBeTruthy();
  }));
});
