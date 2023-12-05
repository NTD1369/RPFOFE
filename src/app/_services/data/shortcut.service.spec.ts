/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ShortcutService } from './shortcut.service';

describe('Service: Shortcut', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShortcutService]
    });
  });

  it('should ...', inject([ShortcutService], (service: ShortcutService) => {
    expect(service).toBeTruthy();
  }));
});
