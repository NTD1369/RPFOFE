/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { ControlService } from './control.service';

describe('Service: Control', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ControlService]
    });
  });

  it('should ...', inject([ControlService], (service: ControlService) => {
    expect(service).toBeTruthy();
  }));
});
