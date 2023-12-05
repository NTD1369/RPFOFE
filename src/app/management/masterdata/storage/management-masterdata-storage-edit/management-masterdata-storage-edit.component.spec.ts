/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ManagementMasterdataStorageEditComponent } from './management-masterdata-storage-edit.component';

describe('ManagementMasterdataStorageEditComponent', () => {
  let component: ManagementMasterdataStorageEditComponent;
  let fixture: ComponentFixture<ManagementMasterdataStorageEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementMasterdataStorageEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementMasterdataStorageEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
