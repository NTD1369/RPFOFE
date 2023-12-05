/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ShopReturnBillComponent } from './shop-return-bill.component';

describe('ShopReturnBillComponent', () => {
  let component: ShopReturnBillComponent;
  let fixture: ComponentFixture<ShopReturnBillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopReturnBillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopReturnBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
