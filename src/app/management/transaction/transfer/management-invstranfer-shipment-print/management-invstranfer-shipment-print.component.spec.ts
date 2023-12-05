/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementInvtranfeShipmentPrintComponent } from './management-invstranfer-shipment-print.component';

describe('ManagementInventoryPostingPrintComponent', () => {
  let component: ManagementInvtranfeShipmentPrintComponent;
  let fixture: ComponentFixture<ManagementInvtranfeShipmentPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManagementInvtranfeShipmentPrintComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementInvtranfeShipmentPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
