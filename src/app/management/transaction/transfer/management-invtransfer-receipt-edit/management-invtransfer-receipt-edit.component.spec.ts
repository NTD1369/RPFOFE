/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ManagementInvtransferReceiptEditComponent } from './management-invtransfer-receipt-edit.component';

describe('ManagementInvtransferReceiptEditComponent', () => {
  let component: ManagementInvtransferReceiptEditComponent;
  let fixture: ComponentFixture<ManagementInvtransferReceiptEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementInvtransferReceiptEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementInvtransferReceiptEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
