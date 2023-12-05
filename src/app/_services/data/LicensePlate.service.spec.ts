/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LicensePlateService } from './LicensePlate.service';

describe('Service: LicensePlate', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LicensePlateService]
    });
  });

  it('should ...', inject([LicensePlateService], (service: LicensePlateService) => {
    expect(service).toBeTruthy();
  }));
});
