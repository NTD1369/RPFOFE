/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ReceiptFromProductionService } from './receiptFromProduction.service';

describe('Service: ReceiptFromProduction', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReceiptFromProductionService]
    });
  });

  it('should ...', inject([ReceiptFromProductionService], (service: ReceiptFromProductionService) => {
    expect(service).toBeTruthy();
  }));
});
