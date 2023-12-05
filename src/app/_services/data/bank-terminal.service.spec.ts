/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BankTerminalService } from './bank-terminal.service';

describe('Service: BankTerminal', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BankTerminalService]
    });
  });

  it('should ...', inject([BankTerminalService], (service: BankTerminalService) => {
    expect(service).toBeTruthy();
  }));
});
