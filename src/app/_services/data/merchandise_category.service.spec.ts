/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { Merchandise_categoryService } from './merchandise_category.service';

describe('Service: Merchandise_category', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Merchandise_categoryService]
    });
  });

  it('should ...', inject([Merchandise_categoryService], (service: Merchandise_categoryService) => {
    expect(service).toBeTruthy();
  }));
});
