/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { ItemserialstockService } from './itemserialstock.service';

describe('Service: Itemserialstock', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItemserialstockService]
    });
  });

  it('should ...', inject([ItemserialstockService], (service: ItemserialstockService) => {
    expect(service).toBeTruthy();
  }));
});
