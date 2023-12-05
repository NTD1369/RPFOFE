/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { CustomergroupService } from './customergroup.service';

describe('Service: Customergroup', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomergroupService]
    });
  });

  it('should ...', inject([CustomergroupService], (service: CustomergroupService) => {
    expect(service).toBeTruthy();
  }));
});
