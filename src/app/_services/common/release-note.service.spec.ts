/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ReleaseNoteService } from './release-note.service';

describe('Service: ReleaseNote', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReleaseNoteService]
    });
  });

  it('should ...', inject([ReleaseNoteService], (service: ReleaseNoteService) => {
    expect(service).toBeTruthy();
  }));
});
