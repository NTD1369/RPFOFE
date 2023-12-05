/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ManagementEmployeeSalaryEditComponent } from './management-employee-salary-edit.component';

describe('ManagementEmployeeSalaryEditComponent', () => {
  let component: ManagementEmployeeSalaryEditComponent;
  let fixture: ComponentFixture<ManagementEmployeeSalaryEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementEmployeeSalaryEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementEmployeeSalaryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
