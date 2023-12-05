/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RptSalesByYearComponent } from './rpt-sales-by-year.component';

describe('RptSalesByYearComponent', () => {
  let component: RptSalesByYearComponent;
  let fixture: ComponentFixture<RptSalesByYearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RptSalesByYearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RptSalesByYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
