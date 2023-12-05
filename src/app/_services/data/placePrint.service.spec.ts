/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PlacePrintService } from './PlacePrint.service';


describe('Service: PlacePrint', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlacePrintService]
    });
  });

  it('should ...', inject([PlacePrintService], (service: PlacePrintService) => {
    expect(service).toBeTruthy();
  }));
});
