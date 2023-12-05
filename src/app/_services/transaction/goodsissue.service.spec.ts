/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { GoodsissueService } from './goodsissue.service';

describe('Service: Goodsissue', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoodsissueService]
    });
  });

  it('should ...', inject([GoodsissueService], (service: GoodsissueService) => {
    expect(service).toBeTruthy();
  }));
});
