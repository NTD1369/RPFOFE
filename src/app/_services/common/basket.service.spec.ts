/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { BasketService } from './basket.service'; 

describe('Service: Basket', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BasketService]
    });
  });

  it('should ...', inject([BasketService], (service: BasketService) => {
    expect(service).toBeTruthy();
  }));
});
