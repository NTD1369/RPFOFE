/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { ShiftService } from './shift.service';

describe('Service: Shift', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShiftService]
    });
  });

  it('should ...', inject([ShiftService], (service: ShiftService) => {
    expect(service).toBeTruthy();
  }));
});
