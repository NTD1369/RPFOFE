/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Pdf_rpt_salestransactiondetail_returnComponent } from './pdf_rpt_salestransactiondetail_return.component';

describe('Pdf_rpt_salestransactiondetail_returnComponent', () => {
  let component: Pdf_rpt_salestransactiondetail_returnComponent;
  let fixture: ComponentFixture<Pdf_rpt_salestransactiondetail_returnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Pdf_rpt_salestransactiondetail_returnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Pdf_rpt_salestransactiondetail_returnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
