/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { InvoiceinforService } from './invoiceinfor.service';

describe('Service: Invoiceinfor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InvoiceinforService]
    });
  });

  it('should ...', inject([InvoiceinforService], (service: InvoiceinforService) => {
    expect(service).toBeTruthy();
  }));
});
