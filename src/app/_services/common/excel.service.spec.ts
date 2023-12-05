/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { ExcelService } from './excel.service';

describe('Service: Excel', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExcelService]
    });
  });

  it('should ...', inject([ExcelService], (service: ExcelService) => {
    expect(service).toBeTruthy();
  }));
});
