/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { CapacityService } from './capacity.service';

describe('Service: Capacity', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CapacityService]
    });
  });

  it('should ...', inject([CapacityService], (service: CapacityService) => {
    expect(service).toBeTruthy();
  }));
});
