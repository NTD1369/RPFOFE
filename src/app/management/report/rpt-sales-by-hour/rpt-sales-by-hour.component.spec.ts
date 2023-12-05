/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RptSalesByHourComponent } from './rpt-sales-by-hour.component';

describe('RptSalesByHourComponent', () => {
  let component: RptSalesByHourComponent;
  let fixture: ComponentFixture<RptSalesByHourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RptSalesByHourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RptSalesByHourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
