/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { MwiService } from './mwi.service';

describe('Service: Mwi', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MwiService]
    });
  });

  it('should ...', inject([MwiService], (service: MwiService) => {
    expect(service).toBeTruthy();
  }));
});
