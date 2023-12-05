/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { CompanyService } from './company.service';

describe('Service: Company', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompanyService]
    });
  });

  it('should ...', inject([CompanyService], (service: CompanyService) => {
    expect(service).toBeTruthy();
  }));
});
