/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { PaymentmethodService } from './paymentmethod.service';

describe('Service: Paymentmethod', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaymentmethodService]
    });
  });

  it('should ...', inject([PaymentmethodService], (service: PaymentmethodService) => {
    expect(service).toBeTruthy();
  }));
});
