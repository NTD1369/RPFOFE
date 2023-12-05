/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PricelistnameService } from './pricelistname.service';

describe('Service: Pricelistname', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PricelistnameService]
    });
  });

  it('should ...', inject([PricelistnameService], (service: PricelistnameService) => {
    expect(service).toBeTruthy();
  }));
});
