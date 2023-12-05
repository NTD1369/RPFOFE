/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ManagementMasterdataStoreareaEditComponent } from './management-masterdata-storearea-edit.component';

describe('ManagementMasterdataStoreareaEditComponent', () => {
  let component: ManagementMasterdataStoreareaEditComponent;
  let fixture: ComponentFixture<ManagementMasterdataStoreareaEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementMasterdataStoreareaEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementMasterdataStoreareaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
