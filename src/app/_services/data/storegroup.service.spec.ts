/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { StoregroupService } from './storegroup.service';

describe('Service: Storegroup', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StoregroupService]
    });
  });

  it('should ...', inject([StoregroupService], (service: StoregroupService) => {
    expect(service).toBeTruthy();
  }));
});
