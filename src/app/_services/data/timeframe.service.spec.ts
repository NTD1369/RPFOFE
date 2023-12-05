/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { TimeframeService } from './timeframe.service';

describe('Service: Timeframe', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimeframeService]
    });
  });

  it('should ...', inject([TimeframeService], (service: TimeframeService) => {
    expect(service).toBeTruthy();
  }));
});
