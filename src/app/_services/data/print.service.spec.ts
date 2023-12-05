/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { PrintService } from './print.service';

describe('Service: Bill', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrintService]
    });
  });

  it('should ...', inject([PrintService], (service: PrintService) => {
    expect(service).toBeTruthy();
  }));
});
