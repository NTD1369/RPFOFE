/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CurrencyRoundingOffService } from './currencyRoundingOff.service';

describe('Service: CurrencyRoundingOff', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CurrencyRoundingOffService]
    });
  });

  it('should ...', inject([CurrencyRoundingOffService], (service: CurrencyRoundingOffService) => {
    expect(service).toBeTruthy();
  }));
});
