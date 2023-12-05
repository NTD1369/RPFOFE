/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { KeycapService } from './keycap.service';

describe('Service: Keycap', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KeycapService]
    });
  });

  it('should ...', inject([KeycapService], (service: KeycapService) => {
    expect(service).toBeTruthy();
  }));
});
