/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SalesplanService } from './salesplan.service';

describe('Service: Salesplan', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SalesplanService]
    });
  });

  it('should ...', inject([SalesplanService], (service: SalesplanService) => {
    expect(service).toBeTruthy();
  }));
});
