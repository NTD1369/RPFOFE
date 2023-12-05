/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Rpt_salesBySalesPersonComponent } from './rpt_sales-by-sales-person.component';

describe('Rpt_salesBySalesPersonComponent', () => {
  let component: Rpt_salesBySalesPersonComponent;
  let fixture: ComponentFixture<Rpt_salesBySalesPersonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Rpt_salesBySalesPersonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Rpt_salesBySalesPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
