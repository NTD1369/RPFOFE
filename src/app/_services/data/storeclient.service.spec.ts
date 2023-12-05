/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StoreclientService } from './storeclient.service';

describe('Service: Storeclient', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StoreclientService]
    });
  });

  it('should ...', inject([StoreclientService], (service: StoreclientService) => {
    expect(service).toBeTruthy();
  }));
});
