/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementPurchaseOrderPrintComponent } from './management-purchase-order-print.component';

describe('ManagementPurchaseOrderPrintComponent', () => {
  let component: ManagementPurchaseOrderPrintComponent;
  let fixture: ComponentFixture<ManagementPurchaseOrderPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManagementPurchaseOrderPrintComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementPurchaseOrderPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
