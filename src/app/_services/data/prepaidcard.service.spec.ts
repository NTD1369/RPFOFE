/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { PrepaidcardService } from './prepaidcard.service';

describe('Service: Prepaidcard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrepaidcardService]
    });
  });

  it('should ...', inject([PrepaidcardService], (service: PrepaidcardService) => {
    expect(service).toBeTruthy();
  }));
});
