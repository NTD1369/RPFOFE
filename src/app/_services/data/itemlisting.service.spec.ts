/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ItemlistingService } from './itemlisting.service';

describe('Service: Itemlisting', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItemlistingService]
    });
  });

  it('should ...', inject([ItemlistingService], (service: ItemlistingService) => {
    expect(service).toBeTruthy();
  }));
});
