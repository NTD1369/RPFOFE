/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { InventorycoutingService } from './inventorycouting.service';

describe('Service: Inventorycouting', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InventorycoutingService]
    });
  });

  it('should ...', inject([InventorycoutingService], (service: InventorycoutingService) => {
    expect(service).toBeTruthy();
  }));
});
