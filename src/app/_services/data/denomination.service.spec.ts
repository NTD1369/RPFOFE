/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DenominationService } from './denomination.service';

describe('Service: Denomination', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DenominationService]
    });
  });

  it('should ...', inject([DenominationService], (service: DenominationService) => {
    expect(service).toBeTruthy();
  }));
});
