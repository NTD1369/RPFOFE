/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StorecurrencyService } from './storecurrency.service';

describe('Service: Storecurrency', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StorecurrencyService]
    });
  });

  it('should ...', inject([StorecurrencyService], (service: StorecurrencyService) => {
    expect(service).toBeTruthy();
  }));
});
