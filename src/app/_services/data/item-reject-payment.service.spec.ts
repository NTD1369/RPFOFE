/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ItemRejectPaymentService } from './item-reject-payment.service';

describe('Service: ItemRejectPayment', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItemRejectPaymentService]
    });
  });

  it('should ...', inject([ItemRejectPaymentService], (service: ItemRejectPaymentService) => {
    expect(service).toBeTruthy();
  }));
});
