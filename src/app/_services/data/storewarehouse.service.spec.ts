/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StorewarehouseService } from './storewarehouse.service';

describe('Service: Storewarehouse', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StorewarehouseService]
    });
  });

  it('should ...', inject([StorewarehouseService], (service: StorewarehouseService) => {
    expect(service).toBeTruthy();
  }));
});
