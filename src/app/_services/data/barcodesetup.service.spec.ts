/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BarcodesetupService } from './barcodesetup.service';

describe('Service: Barcodesetup', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BarcodesetupService]
    });
  });

  it('should ...', inject([BarcodesetupService], (service: BarcodesetupService) => {
    expect(service).toBeTruthy();
  }));
});
