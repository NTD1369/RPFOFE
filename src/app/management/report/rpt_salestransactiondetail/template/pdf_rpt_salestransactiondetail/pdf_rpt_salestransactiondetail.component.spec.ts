/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Pdf_rpt_salestransactiondetailComponent } from './pdf_rpt_salestransactiondetail.component';

describe('Pdf_rpt_salestransactiondetailComponent', () => {
  let component: Pdf_rpt_salestransactiondetailComponent;
  let fixture: ComponentFixture<Pdf_rpt_salestransactiondetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Pdf_rpt_salestransactiondetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Pdf_rpt_salestransactiondetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
