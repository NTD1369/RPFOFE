/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { ItemserialService } from './itemserial.service';

describe('Service: Itemserial', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItemserialService]
    });
  });

  it('should ...', inject([ItemserialService], (service: ItemserialService) => {
    expect(service).toBeTruthy();
  }));
});
