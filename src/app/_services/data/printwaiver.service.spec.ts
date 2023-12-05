/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { PrintwaiverService } from './printwaiver.service';

describe('Service: Bill', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrintwaiverService]
    });
  });

  it('should ...', inject([PrintwaiverService], (service: PrintwaiverService) => {
    expect(service).toBeTruthy();
  }));
});
