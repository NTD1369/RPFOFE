/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ManagementInventoryTransferEditComponent } from './management-inventory-transfer-edit.component';

describe('ManagementInventoryPostingEditComponent', () => {
  let component: ManagementInventoryTransferEditComponent;
  let fixture: ComponentFixture<ManagementInventoryTransferEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementInventoryTransferEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementInventoryTransferEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
