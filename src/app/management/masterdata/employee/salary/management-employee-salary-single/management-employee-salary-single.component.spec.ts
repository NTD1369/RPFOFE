/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ManagementEmployeeSalarySingleComponent } from './management-employee-salary-single.component';

describe('ManagementEmployeeSalarySingleComponent', () => {
  let component: ManagementEmployeeSalarySingleComponent;
  let fixture: ComponentFixture<ManagementEmployeeSalarySingleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementEmployeeSalarySingleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementEmployeeSalarySingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
