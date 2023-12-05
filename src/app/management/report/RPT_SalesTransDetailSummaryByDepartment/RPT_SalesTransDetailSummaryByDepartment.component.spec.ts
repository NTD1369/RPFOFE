/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RPT_SalesTransDetailSummaryByDepartmentComponent } from './RPT_SalesTransDetailSummaryByDepartment.component';

describe('RPT_SalesTransDetailSummaryByDepartmentComponent', () => {
  let component: RPT_SalesTransDetailSummaryByDepartmentComponent;
  let fixture: ComponentFixture<RPT_SalesTransDetailSummaryByDepartmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RPT_SalesTransDetailSummaryByDepartmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RPT_SalesTransDetailSummaryByDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
