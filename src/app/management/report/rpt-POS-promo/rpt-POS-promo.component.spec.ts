/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RptPOSPromoComponent } from './rpt-POS-promo.component';
 

describe('RptSalesByYearComponent', () => {
  let component: RptPOSPromoComponent;
  let fixture: ComponentFixture<RptPOSPromoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RptPOSPromoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RptPOSPromoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
