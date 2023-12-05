/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { PricelistService } from './pricelist.service';

describe('Service: Pricelist', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PricelistService]
    });
  });

  it('should ...', inject([PricelistService], (service: PricelistService) => {
    expect(service).toBeTruthy();
  }));
});
