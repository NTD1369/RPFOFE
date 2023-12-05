/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ManagementMasterdataTaxEditComponent } from './management-masterdata-tax-edit.component';

describe('ManagementMasterdataTaxEditComponent', () => {
  let component: ManagementMasterdataTaxEditComponent;
  let fixture: ComponentFixture<ManagementMasterdataTaxEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementMasterdataTaxEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementMasterdataTaxEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
