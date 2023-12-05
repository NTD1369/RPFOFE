/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ShopDeliveryOrderPrintComponent } from './shop-delivery-order-print.component';

describe('ShopDeliveryOrderPrintComponent', () => {
  let component: ShopDeliveryOrderPrintComponent;
  let fixture: ComponentFixture<ShopDeliveryOrderPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopDeliveryOrderPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopDeliveryOrderPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
