/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { UserstoreService } from './userstore.service';

describe('Service: Userstore', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserstoreService]
    });
  });

  it('should ...', inject([UserstoreService], (service: UserstoreService) => {
    expect(service).toBeTruthy();
  }));
});
