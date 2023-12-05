/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { InventorypostingService } from './inventoryposting.service';

describe('Service: Inventoryposting', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InventorypostingService]
    });
  });

  it('should ...', inject([InventorypostingService], (service: InventorypostingService) => {
    expect(service).toBeTruthy();
  }));
});
