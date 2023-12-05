/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { UomService } from './uom.service';

describe('Service: Uom', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UomService]
    });
  });

  it('should ...', inject([UomService], (service: UomService) => {
    expect(service).toBeTruthy();
  }));
});
