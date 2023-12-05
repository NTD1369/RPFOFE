/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DeliveryinforService } from './deliveryinfor.service';

describe('Service: Deliveryinfor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeliveryinforService]
    });
  });

  it('should ...', inject([DeliveryinforService], (service: DeliveryinforService) => {
    expect(service).toBeTruthy();
  }));
});
