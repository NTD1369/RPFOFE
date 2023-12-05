/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { GoodrecieptService } from './goodreciept.service';

describe('Service: Goodreciept', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoodrecieptService]
    });
  });

  it('should ...', inject([GoodrecieptService], (service: GoodrecieptService) => {
    expect(service).toBeTruthy();
  }));
});
