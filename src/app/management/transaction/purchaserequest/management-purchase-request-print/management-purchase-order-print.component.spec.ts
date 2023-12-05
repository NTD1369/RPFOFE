/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementPurchaseRequestPrintComponent } from './management-purchase-request-print.component';

describe('ManagementPurchaseRequestPrintComponent', () => {
  let component: ManagementPurchaseRequestPrintComponent;
  let fixture: ComponentFixture<ManagementPurchaseRequestPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManagementPurchaseRequestPrintComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementPurchaseRequestPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
