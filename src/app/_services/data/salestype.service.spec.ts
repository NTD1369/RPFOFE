/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { SalestypeService } from './salestype.service';

describe('Service: Salestype', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SalestypeService]
    });
  });

  it('should ...', inject([SalestypeService], (service: SalestypeService) => {
    expect(service).toBeTruthy();
  }));
});
