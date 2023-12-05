/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EnddateService } from './enddate.service';

describe('Service: Enddate', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EnddateService]
    });
  });

  it('should ...', inject([EnddateService], (service: EnddateService) => {
    expect(service).toBeTruthy();
  }));
});
