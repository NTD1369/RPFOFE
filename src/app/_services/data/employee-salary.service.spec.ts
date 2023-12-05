/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EmployeeSalaryService } from './employee-salary.service';

describe('Service: EmployeeSalary', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmployeeSalaryService]
    });
  });

  it('should ...', inject([EmployeeSalaryService], (service: EmployeeSalaryService) => {
    expect(service).toBeTruthy();
  }));
});
