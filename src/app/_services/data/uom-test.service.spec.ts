/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UomTestService } from './uom-test.service';

describe('Service: UomTest', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UomTestService]
    });
  });

  it('should ...', inject([UomTestService], (service: UomTestService) => {
    expect(service).toBeTruthy();
  }));
});
