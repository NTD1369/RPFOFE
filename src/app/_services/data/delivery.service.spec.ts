/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DeliveryService } from './delivery.service';

describe('Service: Delivery', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeliveryService]
    });
  });

  it('should ...', inject([DeliveryService], (service: DeliveryService) => {
    expect(service).toBeTruthy();
  }));
});
