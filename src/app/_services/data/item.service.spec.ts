/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { ItemService } from './item.service';

describe('Service: Item', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItemService]
    });
  });

  it('should ...', inject([ItemService], (service: ItemService) => {
    expect(service).toBeTruthy();
  }));
});
