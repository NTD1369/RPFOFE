/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ItemVariantService } from './item-variant.service';

describe('Service: ItemVariant', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItemVariantService]
    });
  });

  it('should ...', inject([ItemVariantService], (service: ItemVariantService) => {
    expect(service).toBeTruthy();
  }));
});
