/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Rpt_invoicetransactiondetailComponent } from './rpt_invoicetransactiondetail.component';

describe('Rpt_invoicetransactiondetailComponent', () => {
  let component: Rpt_invoicetransactiondetailComponent;
  let fixture: ComponentFixture<Rpt_invoicetransactiondetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Rpt_invoicetransactiondetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Rpt_invoicetransactiondetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
