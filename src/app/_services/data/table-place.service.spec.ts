/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TablePlaceService } from './table-place.service';

describe('Service: TablePlace', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TablePlaceService]
    });
  });

  it('should ...', inject([TablePlaceService], (service: TablePlaceService) => {
    expect(service).toBeTruthy();
  }));
});
