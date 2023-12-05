/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { ItemuomService } from './itemuom.service';

describe('Service: Itemuom', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItemuomService]
    });
  });

  it('should ...', inject([ItemuomService], (service: ItemuomService) => {
    expect(service).toBeTruthy();
  }));
});
