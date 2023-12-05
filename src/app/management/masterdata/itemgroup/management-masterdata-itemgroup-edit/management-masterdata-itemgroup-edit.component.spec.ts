/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ManagementMasterdataItemgroupEditComponent } from './management-masterdata-itemgroup-edit.component';

describe('ManagementMasterdataItemgroupEditComponent', () => {
  let component: ManagementMasterdataItemgroupEditComponent;
  let fixture: ComponentFixture<ManagementMasterdataItemgroupEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementMasterdataItemgroupEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementMasterdataItemgroupEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
