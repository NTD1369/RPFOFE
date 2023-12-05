/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { Puchaserequest } from './puchaserequest.service';

describe('Service: Puchaserequest.service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Puchaserequest]
    });
  });

  it('should ...', inject([Puchaserequest], (service: Puchaserequest) => {
    expect(service).toBeTruthy();
  }));
});
