/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SalestargetService } from './salestarget.service';

describe('Service: Salestarget', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SalestargetService]
    });
  });

  it('should ...', inject([SalestargetService], (service: SalestargetService) => {
    expect(service).toBeTruthy();
  }));
});
