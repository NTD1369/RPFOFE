/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TerminalPeripheralsService } from './terminal-peripherals.service';

describe('Service: TerminalPeripherals', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TerminalPeripheralsService]
    });
  });

  it('should ...', inject([TerminalPeripheralsService], (service: TerminalPeripheralsService) => {
    expect(service).toBeTruthy();
  }));
});
