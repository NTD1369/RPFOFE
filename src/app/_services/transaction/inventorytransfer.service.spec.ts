/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { InventoryTransferService } from './inventorytransfer.service';

describe('Service: Inventorycouting', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InventoryTransferService]
    });
  });

  it('should ...', inject([InventoryTransferService], (service: InventoryTransferService) => {
    expect(service).toBeTruthy();
  }));
});
