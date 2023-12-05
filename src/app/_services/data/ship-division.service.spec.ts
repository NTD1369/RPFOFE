/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ShipDivisionService } from './ship-division.service';

describe('Service: ShipDivision', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShipDivisionService]
    });
  });

  it('should ...', inject([ShipDivisionService], (service: ShipDivisionService) => {
    expect(service).toBeTruthy();
  }));
});
