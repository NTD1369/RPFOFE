/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { PrintService } from './print.service';

describe('Service: Product', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrintService]
    });
  });

  it('should ...', inject([PrintService], (service: PrintService) => {
    expect(service).toBeTruthy();
  }));
});
