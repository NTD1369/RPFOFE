/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ManagementInvtransferShipmentEditComponent } from './management-invtransfer-shipment-edit.component';

describe('ManagementInvtransferShipmentEditComponent', () => {
  let component: ManagementInvtransferShipmentEditComponent;
  let fixture: ComponentFixture<ManagementInvtransferShipmentEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementInvtransferShipmentEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementInvtransferShipmentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
