/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Rpt_invoicetransactionsummaryComponent } from './rpt_invoicetransactionsummary.component';

describe('Rpt_invoicetransactionsummaryComponent', () => {
  let component: Rpt_invoicetransactionsummaryComponent;
  let fixture: ComponentFixture<Rpt_invoicetransactionsummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Rpt_invoicetransactionsummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Rpt_invoicetransactionsummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
