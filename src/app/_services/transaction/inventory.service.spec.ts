/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { InventoryService } from './inventory.service';

describe('Service: Inventory', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InventoryService]
    });
  });

  it('should ...', inject([InventoryService], (service: InventoryService) => {
    expect(service).toBeTruthy();
  }));
});
