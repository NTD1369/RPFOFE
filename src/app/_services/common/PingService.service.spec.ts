/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PingServiceService } from './PingService.service';

describe('Service: PingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PingServiceService]
    });
  });

  it('should ...', inject([PingServiceService], (service: PingServiceService) => {
    expect(service).toBeTruthy();
  }));
});
