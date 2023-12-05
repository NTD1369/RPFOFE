/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ProductOrderService } from './product-order.service';

describe('Service: ProductOrder', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductOrderService]
    });
  });

  it('should ...', inject([ProductOrderService], (service: ProductOrderService) => {
    expect(service).toBeTruthy();
  }));
});
