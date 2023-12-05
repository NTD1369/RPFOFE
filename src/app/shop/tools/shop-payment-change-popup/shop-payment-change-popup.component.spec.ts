/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ShopPaymentChangePopupComponent } from './shop-payment-change-popup.component';

describe('ShopPaymentChangePopupComponent', () => {
  let component: ShopPaymentChangePopupComponent;
  let fixture: ComponentFixture<ShopPaymentChangePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopPaymentChangePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopPaymentChangePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
