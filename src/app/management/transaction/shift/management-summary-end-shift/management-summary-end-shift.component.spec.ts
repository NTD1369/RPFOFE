/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ManagementSummaryEndShiftComponent } from './management-summary-end-shift.component';

describe('ManagementSummaryEndShiftComponent', () => {
  let component: ManagementSummaryEndShiftComponent;
  let fixture: ComponentFixture<ManagementSummaryEndShiftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementSummaryEndShiftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementSummaryEndShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
