/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PeripheralsService } from './peripherals.service';

describe('Service: Peripherals', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PeripheralsService]
    });
  });

  it('should ...', inject([PeripheralsService], (service: PeripheralsService) => {
    expect(service).toBeTruthy();
  }));
});
