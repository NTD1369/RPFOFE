/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { GoodreceiptService } from './goodreceipt.service';

describe('Service: Goodreceipt', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoodreceiptService]
    });
  });

  it('should ...', inject([GoodreceiptService], (service: GoodreceiptService) => {
    expect(service).toBeTruthy();
  }));
});
