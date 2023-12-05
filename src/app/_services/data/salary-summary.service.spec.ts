/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SalarySummaryService } from './salary-summary.service';

describe('Service: SalarySummary', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SalarySummaryService]
    });
  });

  it('should ...', inject([SalarySummaryService], (service: SalarySummaryService) => {
    expect(service).toBeTruthy();
  }));
});
