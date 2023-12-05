/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DeliveryServiceService } from './deliveryService.service';

describe('Service: DeliveryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeliveryServiceService]
    });
  });

  it('should ...', inject([DeliveryServiceService], (service: DeliveryServiceService) => {
    expect(service).toBeTruthy();
  }));
});
