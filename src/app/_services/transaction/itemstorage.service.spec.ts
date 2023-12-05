/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { ItemstorageService } from './itemstorage.service';

describe('Service: Itemstorage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItemstorageService]
    });
  });

  it('should ...', inject([ItemstorageService], (service: ItemstorageService) => {
    expect(service).toBeTruthy();
  }));
});
