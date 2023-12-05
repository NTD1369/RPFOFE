/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BankinService } from './bankin.service';

describe('Service: Bankin', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BankinService]
    });
  });

  it('should ...', inject([BankinService], (service: BankinService) => {
    expect(service).toBeTruthy();
  }));
});
