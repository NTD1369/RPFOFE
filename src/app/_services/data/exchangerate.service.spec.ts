/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ExchangerateService } from './exchangerate.service';

describe('Service: Exchangerate', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExchangerateService]
    });
  });

  it('should ...', inject([ExchangerateService], (service: ExchangerateService) => {
    expect(service).toBeTruthy();
  }));
});
