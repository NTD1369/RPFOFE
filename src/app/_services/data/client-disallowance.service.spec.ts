/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ClientDisallowanceService } from './client-disallowance.service';

describe('Service: ClientDisallowance', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClientDisallowanceService]
    });
  });

  it('should ...', inject([ClientDisallowanceService], (service: ClientDisallowanceService) => {
    expect(service).toBeTruthy();
  }));
});
