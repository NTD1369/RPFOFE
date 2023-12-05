/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { StoreareaService } from './storearea.service';

describe('Service: Storearea', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StoreareaService]
    });
  });

  it('should ...', inject([StoreareaService], (service: StoreareaService) => {
    expect(service).toBeTruthy();
  }));
});
