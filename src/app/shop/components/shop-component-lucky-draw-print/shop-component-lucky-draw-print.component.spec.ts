/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ShopComponentLuckyDrawPrintComponent } from './shop-component-lucky-draw-print.component';

describe('ShopComponentLuckyDrawPrintComponent', () => {
  let component: ShopComponentLuckyDrawPrintComponent;
  let fixture: ComponentFixture<ShopComponentLuckyDrawPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopComponentLuckyDrawPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopComponentLuckyDrawPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
