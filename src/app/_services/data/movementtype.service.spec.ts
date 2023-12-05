/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MovementtypeService } from './movementtype.service';

describe('Service: Movementtype', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MovementtypeService]
    });
  });

  it('should ...', inject([MovementtypeService], (service: MovementtypeService) => {
    expect(service).toBeTruthy();
  }));
});
